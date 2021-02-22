const router = require('express').Router();
const exec = require('child_process').exec;
const execSync = require('child_process').execSync;

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

router.get('/', (req, res) => {
	res.render("settings", {
        title: "Settings",
        service_name: "IoTプロトタイピングシステム",
        ssid_list: getSSIDList()
	});
});
module.exports = router;