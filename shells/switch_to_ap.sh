#!/bin/bash

echo "Switching to AccessPoint..."

sudo cp /etc/dhcpcd.conf.ap /etc/dhcpcd.conf
sudo cp /etc/dnsmasq.conf.ap /etc/dnsmasq.conf

sudo systemctl restart dhcpcd
# sudo systemctl restart wpa_supplicant

sudo systemctl restart hostapd
sudo systemctl enable hostapd
sudo systemctl restart dnsmasq
sudo systemctl enable dnsmasq
