const http = require('http');
const fetch = require('node-fetch');
require('dotenv').config();

const INT16_MAX = 0x7FFF;
const serverPath = '/solax-api';

const checkConfig = () => {
	if (!process.env.SOLAX_URL || !process.env.SOLAX_PASSWORD) {
		throw new Error('Params URL and PASSWORD are not set in .env config file.');
	}
}

const fetchSolaxData = async () => {
	const myHeaders = new fetch.Headers();
	myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

	const urlencoded = new URLSearchParams();
	urlencoded.append('optType', 'ReadRealTimeData');
	urlencoded.append('pwd', process.env.SOLAX_PASSWORD);

	const requestOptions = {
		method: 'POST',
		headers: myHeaders,
		body: urlencoded,
		redirect: 'follow',
	};

	return (await fetch(process.env.SOLAX_URL, requestOptions)).json();
};

const u16Packer = (values) => {
    let acc = 0.0;
    let stride = 1;
    for (const value of values) {
        acc += value * stride;
        stride *= 2**16;
	}

    return acc;
};

const toSigned = (value) => {
	if (value > INT16_MAX) {
		value -= 2**16;
	}

	return value;
};

const mapSolaxResponse = (rawData) => {
	const dataArr = rawData.Data;

	return {
		pvPower: dataArr[14] + dataArr[15],
		acPower: toSigned(dataArr[9]),
		string1Voltage: dataArr[10] / 10,
		string2Voltage: dataArr[11] / 10,
		string1Current: dataArr[12] / 10,
		string2Current: dataArr[13] / 10,
		string1Power: dataArr[14],
		string2Power: dataArr[15],
		batterySoc: dataArr[103],
		gridPower: toSigned(dataArr[34]),
		batteryVoltage: dataArr[39] / 100,
		batteryCurrent: dataArr[40] / 100,
		batteryPower: toSigned(dataArr[41]),
		batteryRemainingEnergy: dataArr[106] / 10,
		loadPower: toSigned(dataArr[47]),
		todayFeedInEnergy: dataArr[90] / 100,
		totalFeedInEnergy: u16Packer([dataArr[86], dataArr[87]]) / 100,
		todayBatteryDischargeEnergy: dataArr[78] / 10,
		todayBatteryChargeEnergy: dataArr[79] / 10,
		totalBatteryDischargeEnergy: u16Packer([dataArr[74], dataArr[75]]) / 10,
		totalBatteryChargeEnergy: u16Packer([dataArr[76], dataArr[77]]) / 10,
		todayConsumption: dataArr[92] / 100,
		totalConsumption: u16Packer([dataArr[88], dataArr[89]]) / 100,
		batteryTemperature: dataArr[105],
		totalEnergy: u16Packer([dataArr[68], dataArr[69]]) / 10,
		totalPvEnergy: u16Packer([dataArr[80], dataArr[81]]) / 10,
		todayEnergy: dataArr[82] / 10,
		todayEnergyInclBatteryUsage: dataArr[70] / 10,
		outputCurrentPhase1: dataArr[3] / 10,
		outputCurrentPhase2: dataArr[4] / 10,
		outputCurrentPhase3: dataArr[5] / 10,
		powerPhase1: toSigned(dataArr[6]),
		powerPhase2: toSigned(dataArr[7]),
		powerPhase3: toSigned(dataArr[8]),
	};
};

const clearServerPath = serverPath
	.replace(/^\//, '')
	.replace(/\/$/, '')
	.replace('/', '\/');

const pathRegex = new RegExp(`^\/${clearServerPath}\/?(\\?.*)?$`);

const requestListener = (req, res) => {
	if (!req.url || !req.url.match(pathRegex)) {
		res.writeHead(404);
		res.end();
		return;
	}

	fetchSolaxData()
		.then(data => {
			res.writeHead(200, { 'Content-Type': 'application/json' });
			res.end(JSON.stringify(mapSolaxResponse(data)));
		})
		.catch((err) => {
			console.error(err);
			res.writeHead(500);
			res.end(`Error: ${err.message}`);
		});
}

checkConfig();
const server = http.createServer(requestListener);
server.listen(process.env.SERVER_PORT || 8080);
