#!/usr/bin/env bash

echo "set up burner calendar"


cd "$(dirname "$0")"

sudo timedatectl set-timezone Europe/Vienna
sudo timedatectl set-ntp 1
chmod +x setup.sh
sudo cp _setup/burner-display.service /etc/systemd/system/.
sudo cp _setup/burner-gateway.service /etc/systemd/system/.
crontab _setup/crontab.txt

chmod +x start_browser.sh
sudo systemctl daemon-reload
sudo systemctl enable burner-display
sudo systemctl restart burner-display

# only needed if local node server is used as proxy:
#sudo systemctl enable burner-gateway
#sudo systemctl restart burner-gateway
