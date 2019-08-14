#!/usr/bin/env bash

killall chromium-browse

# for kiosk mode
DISPLAY=:0  chromium-browser --kiosk --noerrdialogs --disable-web-security --user-data-dir -disable-session-crashed-bubble --disable-features=InfiniteSessionRestore --disable-infobars YOUR-PROXY-SERVER


# for debugging
#DISPLAY=:0  chromium-browser --noerrdialogs --disable-web-security --user-data-dir -disable-session-crashed-bubble --disable-infobars /home/pi/Documents/burner_calendar/dist/index.html

