const router = require('express').Router();
const exec = require('child_process').exec;
const execSync = require('child_process').execSync;
const crypto = require('crypto');
const fs = require('fs');
const ping = require('ping');

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
    '    ssid="' + ssid + '"\n' +
    '    psk="' + key + '"\n' +
    '}';
    fs.writeFileSync('/etc/wpa_supplicant/wpa_supplicant.conf', wpa_data);
}

router.get('/', (req, res) => {
	res.render("settings", {
        title: "Settings",
        service_name: "IoTプロトタイピングシステム",
        ssid_list: getSSIDList()
	});
});

router.post('/submit', (req, res)  => {
    var ssid = req.body['ssid'];
    var passphrase = req.body['passphrase'];
    var host = '8.8.8.8';
    createWpaSupplicant(ssid, passphrase);
    res.send('接続テスト中...');
    execSync('./shells/switch_to_sta.sh');
    ping.sys.probe(host, function(isAlive){
        if(isAlive){

        }
    })

})
module.exports = router;