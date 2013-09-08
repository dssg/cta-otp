/* This program is free software: you can redistribute it and/or
   modify it under the terms of the GNU Lesser General Public License
   as published by the Free Software Foundation, either version 3 of
   the License, or (at your option) any later version.
   
   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.
   
   You should have received a copy of the GNU General Public License
   along with this program.  If not, see <http://www.gnu.org/licenses/>. 
*/

var INIT_LOCATION = new L.LatLng(41.8538, -87.6551); // Chicago
var AUTO_CENTER_MAP = false;
var ROUTER_ID = "";
var MSEC_PER_HOUR = 60 * 60 * 1000;
var MSEC_PER_DAY = MSEC_PER_HOUR * 24;
// Note: time zone does not matter since we are turning this back into text before sending it
var BASE_DATE_MSEC = new Date().getTime() - new Date().getTime() % MSEC_PER_DAY; 
// var BASE_DATE_MSEC = Date.parse('2012-11-15');


var map = new L.Map('map', {
	minZoom : 10,
	maxZoom : 17,
	// what we really need is a fade transition between old and new tiles without removing the old ones
});

var mapboxURL = "https://{s}.tiles.mapbox.com/v3/examples.map-vyofok3q/{z}/{x}/{y}.png";
var OSMURL    = "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
var MQURL     = "http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png";
var transURL  = "http://{s}.tile2.opencyclemap.org/transport/{z}/{x}/{y}.png";
var aerialURL = "https://{s}.tiles.mapbox.com/v3/openstreetmap.map-4wvf9l0l/{z}/{x}/{y}.png";

var mapboxAttrib = "Tiles from <a href='http://mapbox.com/about/maps' target='_blank'> Streets</a>";
var mapboxLayer = new L.TileLayer(mapboxURL, {maxZoom: 17, attribution: mapboxAttrib});

var osmAttrib = 'Map data &copy; 2011 OpenStreetMap contributors';
var osmLayer = new L.TileLayer(OSMURL, 
		{subdomains: ["a","b","c"], maxZoom: 18, attribution: osmAttrib});

var mqLayer = new L.TileLayer(MQURL,
                {subdomains: ["otile1","otile2","otile3","otile4"], maxZoom: 18, attribution: osmAttrib});

var transLayer = new L.TileLayer(transURL,
                {subdomains: ["a","b","c"], maxZoom: 18, attribution: osmAttrib});


var aerialLayer = new L.TileLayer(aerialURL, 
		{maxZoom: 18, attribution: mapboxAttrib});

var flags = {

};

var ori = ['41.8894,-87.6197','41.9977,-87.7105','41.8994,-87.7597'];


// convert a map of query parameters into a query string, 
// expanding Array values into multiple query parameters
var buildQuery = function(params) {
	ret = [];
	for (key in params) {
		vals = params[key];
		// wrap scalars in array
		if ( ! (vals instanceof Array)) vals = new Array(vals);
		for (i in vals) { 
			val = vals[i]; // js iterates over indices not values!
			// skip params that are empty or stated to be the same as previous
			// if (val == '' || val == 'same')
			if (val == 'same') // empty string needed for non-banning
				continue;
			param = [encodeURIComponent(key), encodeURIComponent(val)].join('=');
			ret.push(param);
		}
	}
	return "?" + ret.join('&');
};

var analystUrl = "/opentripplanner-api-webapp/ws/tile/{z}/{x}/{y}.png"; 
var analystLayer = new L.TileLayer(analystUrl, {attribution: osmAttrib});

var baseMaps = {
    "OSM": osmLayer,
    "MapQuest": mqLayer,
    "MapBox Streets": mapboxLayer,
    "Transport": transLayer,
    "MapBox Satellite": aerialLayer
};
	        
var overlayMaps = {
    "Analyst Tiles": analystLayer
};

var initLocation = INIT_LOCATION;
if (AUTO_CENTER_MAP) {
	// attempt to get map metadata (bounds) from server
	var request = new XMLHttpRequest();
	request.open("GET", "/opentripplanner-api-webapp/ws/metadata", false); // synchronous request
	request.setRequestHeader("Accept", "application/xml");
	request.send(null);
	if (request.status == 200 && request.responseXML != null) {
		var x = request.responseXML;
		var minLat = parseFloat(x.getElementsByTagName('minLatitude')[0].textContent);
		var maxLat = parseFloat(x.getElementsByTagName('maxLatitude')[0].textContent);
		var minLon = parseFloat(x.getElementsByTagName('minLongitude')[0].textContent);
		var maxLon = parseFloat(x.getElementsByTagName('maxLongitude')[0].textContent);
		var lon = (minLon + maxLon) / 2;
		var lat = (minLat + maxLat) / 2;
		initLocation = new L.LatLng(lat, lon);
	}
}
map.setView(initLocation, 11);
var initLocation2 = new L.LatLng(initLocation.lat + 0.05, initLocation.lng + 0.05);

// add layers to map 
// do not add analyst layer yet -- it will be added in refresh() once params are pulled in

map.addLayer(mapboxLayer);
map.addControl(new L.Control.Layers(baseMaps, overlayMaps));

var params;

// use function statement rather than expression to allow hoisting -- is there a better way?
function mapSetupTool() {

	params = { 
		batch: true,
	};

	// pull search parameters from form
	switch($('#searchTypeSelect').val()) {
        case 'access':
                params.layers = 'avgtraveltime';
                params.styles = 'colorchi';
                break;
        case 'closest':
                params.layers = 'closesttraveltime';
                params.styles = 'colorchi';
                break;
        case 'closecomp1':
                params.layers = 'closecompsingle';
                params.styles = 'compchi'
                break;
        case 'closecompn':
                params.layers = 'closecompmultiple';
                params.styles = 'compchi'
                break;
	}
	// store one-element arrays so we can append as needed for additional searches
	params.time = [$('#setupTime').val()];
	params.mode = [$('#setupMode').val()];
	params.maxWalkDistance = [$('#setupMaxDistance').val()];
	params.arriveBy = [$('#arriveByA').val()];
	switch($('#compressWaits').val()) {
		case 'optimize':
			params.reverseOptimizeOnTheFly = ['true'];
			break;
		case 'initial':
		default:
			params.clampInitialWait = [$('#timeLenience').val() * 60];
	}
   
        params.fromPlace = [];
        for(oll in ori){
            params.fromPlace.push(ori[oll]);
        }

	// set from and to places to the same string(s) so they work for both arriveBy and departAfter
	params.toPlace = params.fromPlace;
    	
    var URL = analystUrl + buildQuery(params);
    console.log(params);
    console.log(URL);
    
    // is there a better way to trigger a refresh than removing and re-adding?
	if (analystLayer != null)
		map.removeLayer(analystLayer);
	analystLayer._url = URL;
        map.addLayer(analystLayer);
	legend.src = "/opentripplanner-api-webapp/ws/legend.png?width=300&height=40&styles=" 
		+ params.styles;

	return false;
};     

var downloadTool = function () { 
    var dlParams = {
        format: document.getElementById('downloadFormat').value,
        srs: document.getElementById('downloadProj').value,
        resolution: document.getElementById('downloadResolution').value
    };

    // TODO: this bounding box needs to be reprojected!
    var bounds = map.getBounds();
    var bbox;

    // reproject
    var src = new Proj4js.Proj('EPSG:4326');
    // TODO: undefined srs?
    var dest = new Proj4js.Proj(dlParams.srs);

    // wait until ready then execute
    var interval;
    interval = setInterval(function () {
        // if not ready, wait for next iteration
        if (!(src.readyToUse && dest.readyToUse))
            return;

        // clear the interval so this function is not called back.
        clearInterval(interval);

        var swll = bounds.getSouthWest();
        var nell = bounds.getNorthEast();
        
        var sw = new Proj4js.Point(swll.lng, swll.lat);
        var ne = new Proj4js.Point(nell.lng, nell.lat);

        Proj4js.transform(src, dest, sw);
        Proj4js.transform(src, dest, ne);

        // left, bot, right, top
        bbox = [sw.x, sw.y, ne.x, ne.y].join(',');

        var url = '/opentripplanner-api-webapp/ws/wms' +
            buildQuery(params) +
            '&format=' + dlParams.format + 
            '&srs=' + dlParams.srs +
            '&resolution=' + dlParams.resolution +
            '&bbox=' + bbox;
            // all of the from, to, time, &c. is taken care of by buildQuery.
        
        window.open(url);
    }, 1000); // this is the end of setInterval, run every 1s

    // prevent form submission
    return false;
};

var displayTimes = function(fractionalHours) {
	console.log("fhour", fractionalHours);
	var msec = BASE_DATE_MSEC + fractionalHours * MSEC_PER_HOUR; 
	document.getElementById('setupTime').value = new Date(msec).toISOString().substring(0,19);
};

function fileProcess(evt) {
    var ofile = evt.target.files[0];

    var fReader = new FileReader();

    fReader.onload = function(e) {
        console.log("File " + ofile.name + " read.");
        ori = e.target.result.split("\n");
        console.log("New origin set contains " + ori.length + " points.");
    };
    fReader.readAsText(ofile);
}

function setFormDisabled(formName, disabled) {
	var form = document.forms[formName];
    var limit = form.elements.length;
    var i;
    for (i=0;i<limit;i++) {
    	console.log('   ', form.elements[i], disabled);
        form.elements[i].disabled = disabled;
    }
}


/* Bind JS functions to events (handle almost everything at the form level) */

// anytime a form element changes, refresh the map
$('#searchTypeForm').change( mapSetupTool );

// intercept slider change event bubbling to avoid frequent map rendering
(function(slider) {
    slider.bind('change', function() {
    	displayTimes(slider.val()); 
        return false; // block event propagation
    }).change();
    slider.bind('mouseup', function() {
    	slider.parent().trigger('change');
    });
}) ($("#timeSlider"));

// process file upload
document.getElementById('originset').addEventListener('change', fileProcess, false);


//On changing the search type
$('#searchTypeSelect').change( function() { 
	var type = this.value;
	console.log('search type changed to', type);
		$('#arriveByA').prop('disabled', false);
		$('#headerA').text('Search Setup');
}).change(); // trigger this event (and implicitly a form change event) immediately upon binding
