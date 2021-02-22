var router = require('express').Router();
var exec = require('child_process').exec;
var os = require('os');
var address = require('getmac');

function getHardwareInfomation(){
	var ifacesObj = {}
    ifacesObj.ipv4 = [];
	ifacesObj.ipv6 = [];
    var interfaces = os.networkInterfaces();

    for (var dev in interfaces) {
        interfaces[dev].forEach(function(details){
            if (!details.internal){
                switch(details.family){
                    case "IPv4":
                        ifacesObj.ipv4.push({name:dev, ip_addr:details.cidr, mac_addr:details.mac});
                    break;
                    case "IPv6":
                        ifacesObj.ipv6.push({name:dev, ip_addr:details.cidr, mac_addr:details.mac})
                    break;
                }
            }
        });
    }
    return ifacesObj;
}

router.get('/', (req, res) => {
	console.log(getHardwareInfomation().ipv4[0]);
	res.render("index", {
		ip_addr: getHardwareInfomation().ipv4[0].ip_addr,
		host_name: os.hostname,
		mac_addr: getHardwareInfomation().ipv4[0].mac_addr
	});
});

router.get('/shutdown', (req, res) => {
	console.log("shutdown");
    exec('shutdown -h now').toString();
	res.send('システムをシャットダウンしています･･･ 緑ランプの点滅が終わるまで電源コードを抜かないでください。\n');
});

router.get('/reboot', (req, res) => {
	console.log("reboot");
    exec('shutdown -r now').toString();
	res.send('再起動しています･･･ 起動後に画面は自動更新されます(所要時間目安:1分)\n');
});

module.exports = router;