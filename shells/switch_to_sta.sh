#!/bin/bash

echo "Switching to Station..."

sudo systemctl stop dnsmasq
sudo systemctl disable dnsmasq
sudo systemctl stop hostapd
sudo systemctl disable hostapd

sudo cp /etc/dhcpcd.conf.sta /etc/dhcpcd.conf
sudo cp /etc/dnsmasq.conf.sta /etc/dnsmasq.conf

sudo systemctl restart dhcpcd
sudo systemctl restart wpa_supplicant
