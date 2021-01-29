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

function shutdown(callback){

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
	res.send('shutdown.');
});

router.get('/reboot', (req, res) => {
	console.log("reboot");
	res.send('reboot.');
});

module.exports = router;