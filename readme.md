This is a web-app that will display the agenda of today and the next days in a browser from one or more google calendars.

It is meant to run on a raspberry pi zero.

Run node install to get all dependencies.
Run node run build to create the dist folder.

Rename src/config-DEMO.js to config.js and put your calendar IDs there.

Make sure to run node server/get-authorization.js once to get a token. This data will then be stored into the data folder and will be used for all following requests.

Unfortunately I had no time to get the google api code to work in the browser. So there is a little gateway server in the server folder.

UPDATE:

I decided for a php proxy running on our server. That takes care of all authentication shenannigans.

