#!/bin/bash

# Update the Tomcat Server with otp changes
# Must be run as root

# Stop the server
service tomcat6 stop

# Remove old wars/folders
rm /usr/share/tomcat6/webapps/opentripplanner-analyst-client.war
rm /usr/share/tomcat6/webapps/opentripplanner-api-webapp.war
rm /usr/share/tomcat6/webapps/opentripplanner-webapp.war
rm -r -f /usr/share/tomcat6/webapps/opentripplanner-analyst-client
rm -r -f /usr/share/tomcat6/webapps/opentripplanner-api-webapp
rm -r -f /usr/share/tomcat6/webapps/opentripplanner-webapp

#Add new wars/folders
cp opentripplanner-analyst-client/target/opentripplanner-analyst-client.war /usr/share/tomcat6/webapps
cp opentripplanner-api-webapp/target/opentripplanner-api-webapp.war /usr/share/tomcat6/webapps
cp opentripplanner-webapp/target/opentripplanner-webapp.war /usr/share/tomcat6/webapps 

# Start the server again
service tomcat6 start

# Exit
exit
