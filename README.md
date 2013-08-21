cta-otp
============

## Basics

### What Is OpenTripPlanner?

OpenTripPlanner is an open source trip planning software package, developed by OpenPlans. The package consists of a core routing engine, plus two clients for different use cases:

1. opentripplanner-webapp: Basic trip planning, similar to the Google Maps interface. Route from one origin to one destination at a time, and display the route to the user.

2. opentripplanner-analyst-client: From a single origin point, route to a grid of points, then generate a map overlay which is color-coded by travel time. There are several modes which allow for addition of a second set of routing parameters for comparison.

Additionally, there is an offline "Batch Analyst" application, which allows for a wider range of routing use cases. You can route from a set of origin points to a set of destination points, outputting travel times (and possibly other information), either in CSV form or as a TIFF raster that can then be used with other applications (such as QGIS).

The base OTP repository can be found at:

https://github.com/OpenPlans/OpenTripPlanner

Also be sure to check out the very informative wiki at https://github.com/OpenPlans/OpenTripPlanner/wiki

### What Is This?

This is a version of OpenTripPlanner configured for use in the dssg CTA project. The repository was cloned from the main repository, then four kinds of changes were made:

1. Minor fixes and aesthetic changes to the webapps (fixed broken map options, added new options, changed color scheme)
 
2. Created new webapp "opentripplanner-ga-client." Instead of routing from a single point to a grid of points, routes from a specified set of points (the user can upload a file of latlong coordinates) to a grid of points. The coloration changes based on the mode selected - currently, it can be colored by the average travel time to the origin points, or by the travel time to the closest origin point.

3. Modified several java files to allow for the extension of analyst features required for the opentripplanner-ga-client and related future functionality.

4. Optimized the JavaScript in the clients for use in the city of Chicago (auto-centered camera on Chicago, removed references to the D.C. Purple Line.

For a more thorough list of changes, see https://github.com/dssg/cta-otp/wiki/Index-of-Modified-Files

## How Do I Install OpenTripPlanner?

Well, that depends on what exactly you want to do with OpenTripPlanner. 

https://github.com/openplans/OpenTripPlanner/wiki/Install will get you started with OpenTripPlanner in general.

https://github.com/dssg/cta-otp/wiki/Using-Eclipse contains brief instructions about how to set up a development environment in Eclipse. At the bottom is a link to a guide to set up a local test server using Tomcat.

https://github.com/dssg/cta-otp/wiki/AWS-EC2-Setup contains information on how to get this build of OpenTripPlanner up and running on an Amazon EC2 instance.

## What Needs to be Done?

https://github.com/dssg/cta-otp/wiki/To-Do-List

## Contact Info

So far, all of the work in this repository that differs from the main OTP build has been carried out by David Sekora. He can be reached at DJSekora@gmail.com

### Google Groups

For general OTP use: https://groups.google.com/forum/#!forum/opentripplanner-users

For more technical OTP development questions: https://groups.google.com/forum/#!forum/opentripplanner-developers

## Hosted Demos

Current Analyst demo hosted at: http://ec2-50-112-86-42.us-west-2.compute.amazonaws.com:8080/opentripplanner-analyst-client/

General Accessibility demo (unstable) at: http://ec2-50-112-86-42.us-west-2.compute.amazonaws.com:8080/opentripplanner-ga-client/

Regular Trip Planning webapp at: http://ec2-50-112-86-42.us-west-2.compute.amazonaws.com:8080/opentripplanner-webapp/

Note: These demos are hosted on the DSSG OTP development AWS instance. They are frequently taken down and changed as part of the development process - if you can't access them, this is probably why!

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
