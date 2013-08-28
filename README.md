Open Trip Planner: CTA Edition
============


## What Is OpenTripPlanner?

[OpenTripPlanner](opentripplanner.com) (OTP) is an open source trip planning software package, originally developed by [OpenPlans](http://openplans.org/). 

OTP consists of a core transportation routing engine - algorithms that find the shortest/longest/etc. path between location a and b through transit, biking, and other transportation modes - plus two user-facing apps for different use cases:

1. `opentripplanner-webapp`: Basic trip planning, similar to getting trip directions through Google Maps. The intended user is anyone figuring out how to get from here to there. The app finds a route from a single origin to a single destination at a time, and display the route to the user.

2. `opentripplanner-analyst-client`: travel-time maps for transportation planners. From a single origin point, this app calculates routes to a grid of destination points, then generates a map overlay color-coded by travel time. There are several modes which allow for addition of a second set of routing parameters for comparison. The intended users are transportation planners trying to visualize and understand mobility in a given city. For an introduction to OTP Analyst, [click here](http://opentripplanner.com/2012/07/visualizing-urban-accessibility-with-opentripplanner-analyst/#.Uh5F9GRASoU). OTP Analyst is now being developed by [Conveyal](http://www.conveyal.com/).

3. There's also an offline "Batch Analyst" application, which allows for a wider range of routing use cases. You can route from a set of origin points to a set of destination points, outputting travel times (and possibly other information), either in CSV form or as a TIFF raster that can then be used with other applications (such as QGIS).

This project assumes you're already familiar with OTP. To get strated, check out the project's [very informative wiki](https://github.com/OpenPlans/OpenTripPlanner/wiki) and the [main OTP repo](https://github.com/OpenPlans/OpenTripPlanner).


## What Is This Project?

This is a version of OpenTripPlanner customized for use by the CTA. This repository was cloned from the [OTP repository](https://github.com/OpenPlans/OpenTripPlanner), then four changes were made:

1. Minor fixes and aesthetic changes to the webapps (fixed broken map options, added new options, changed color legend for trip times)
 
2. Created new webapp `opentripplanner-ga-client`. Instead of routing from a single point to a grid of points, routes from a specified set of points (the user can upload a file of lat-long coordinates) to a grid of points. The coloration changes based on the mode selected - currently, it can be colored by the average travel time to the origin points, or by the travel time to the closest origin point.

3. Modified several java files to allow for the extension of analyst features required for the opentripplanner-ga-client and related future functionality.

4. Optimized the JavaScript in the client webapps for use in the city of Chicago - auto-centered camera on Chicago, removed references to the D.C. Purple Line.

For a more thorough list of changes, [click here](https://github.com/dssg/cta-otp/wiki/Index-of-Modified-Files).

## Hosted Demos
We've deployed the OTP trip planning, analyst, and general accessbility apps for the Chicago Transit Athority to use.

- Regular Trip Planning webapp: http://ec2-50-112-86-42.us-west-2.compute.amazonaws.com:8080/opentripplanner-webapp/

- Analyst demo: http://ec2-50-112-86-42.us-west-2.compute.amazonaws.com:8080/opentripplanner-analyst-client/

- General accessibility demo (unstable): http://ec2-50-112-86-42.us-west-2.compute.amazonaws.com:8080/opentripplanner-ga-client/

**NOTE: THESE DEMOS ARE CURRENTLY UNAVAILABLE DUE TO SERVER ISSUES.**


## How Do I Install OpenTripPlanner?

Well, that depends on what exactly you want to do with OpenTripPlanner. 

- https://github.com/openplans/OpenTripPlanner/wiki/Install will get you started with OpenTripPlanner in general.

- https://github.com/dssg/cta-otp/wiki/Using-Eclipse contains brief instructions about how to set up a development environment in Eclipse. At the bottom is a link to a guide to set up a local test server using Tomcat.

- https://github.com/dssg/cta-otp/wiki/AWS-EC2-Setup contains information on how to get this build of OpenTripPlanner up and running on an Amazon EC2 instance.

## Contributing

- Please check our [issue tracker](https://github.com/dssg/cta-otp/wiki/To-Do-List) to see what's on our roadmap. Pull requests welcome!


## Getting in touch
- All of the work in this repository that differs from the main OTP build has been carried out by David Sekora. He can be reached at DJSekora@gmail.com

- OTP itself has an active mailing list: https://groups.google.com/forum/#!forum/opentripplanner-users

- For more technical OTP development questions: https://groups.google.com/forum/#!forum/opentripplanner-developers

## Open Source License

As found at the beginning of every source file:

   This program is free software: you can redistribute it and/or
   modify it under the terms of the GNU Lesser General Public License
   as published by the Free Software Foundation, either version 3 of
   the License, or (at your option) any later version.
   
   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.
   
   You should have received a copy of the GNU General Public License
   along with this program.  If not, see <http://www.gnu.org/licenses/>.
