const router = require('express').Router();
const exec = require('child_process').exec;
const execSync = require('child_process').execSync;
const crypto = require('crypto');
const fs = require('fs');
const ping = require('ping');

const bus = 1;
const i2c = require('i2c-bus');
const i2cBus = i2c.openSync(bus);
const oled = require('oled-i2c-bus');
const font = require('oled-font-5x7');
const SIZE_X = 128, SIZE_Y = 64;
const oledOpts = {
    width: SIZE_X,
    height: SIZE_Y,
    address: 0x3C
};

const display = new oled(i2cBus, oledOpts);
display.clearDisplay();
display.turnOnDisplay();

function getSSIDList(){
    var results = execSync('iwlist wlan0 scan | grep ESSID');
    var list = results.toString().match(/\"(.*?)\"/g);
    list = list
    .map(item => {
        return item.replace(/\"/g, '');
    })
    .filter(Boolean);
    return list;
}

function createWpaSupplicant(ssid, passphrase){
    var key = crypto.pbkdf2Sync(passphrase, ssid, 4096, 32, 'sha1').toString('hex');
    var wpa_data = 'country=JP\n' +
    'ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev\n'  +
    'update_config=1\n' +
    'network={\n' +
    '    ssid="SPWN_H37_71715E"\n' +
    '    psk=691ba8042684ec795b0e03e006e0bb64e3cc4027a91b83336dcb60fa9c6da2ce\n' +
    '}\n'+
    'network={\n' +
    '    ssid="' + ssid + '"\n' +
    '    psk=' + key + '\n' +
    '}';
    fs.writeFileSync('/etc/wpa_supplicant/wpa_supplicant.conf', wpa_data);
}

router.get('/', (req, res) => {
    display.clearDisplay();
    display.turnOnDisplay();
	res.render("settings", {
        title: "Settings",
        service_name: "IoTプロトタイピングシステム",
        ssid_list: getSSIDList()
	});
});

router.post('/submit', (req, res)  => {
    display.clearDisplay();
    display.turnOnDisplay();
    display.setCursor(1, 1);
    display.writeString(font, 2, 'Wi-Fi Connecting...', 1, true);
    var ssid = req.body['ssid'];
    var passphrase = req.body['passphrase'];
    var host = '8.8.8.8';
    createWpaSupplicant(ssid, passphrase);
    res.send('接続テスト中...');

    execSync('./shells/switch_to_sta.sh');

    ping.sys.probe(host, function(isAlive){
        display.clearDisplay();
        display.turnOnDisplay();
        if(isAlive){
            display.setCursor(1, 1);
            display.writeString(font, 1, 'Wi-Fi Connect Successful.', 1, true);
        }else{
            display.setCursor(1, 1);
            display.writeString(font, 1, 'Wi-Fi Connect Failed.', 1, true);
            execSync('./shells/switch_to_ap.sh');
            display.setCursor(1, 1);
            display.writeString(font, 1, 'Please Setting again.', 1, true);
        }
    })

})
module.exports = router;