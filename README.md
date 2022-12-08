# Solax Inverter API Proxy Server

Reads realtime data from the Solax inverter (using local API, not cloud).

Works with Solax X3-Hybrid-G4 inverter.

# Install
```
npm i
```

# Configuration
Create `.env` file with following options:
```
SOLAX_URL=
SOLAX_PASSWORD=
SERVER_PORT=
```
E.g.
```
SOLAX_URL=http://192.168.1.123/
SOLAX_PASSWORD=123456
SERVER_PORT=8080
```

# Run
```
npm run start
```
or in the development mode
```
npm run dev
```

Open in browser: http://localhost:8080/solax-api/

# Response example
```json
{
"pvPower": 754,
"acPower": 741,
"string1Voltage": 420.3,
"string2Voltage": 280,
"string1Current": 0.9,
"string2Current": 1.2,
"string1Power": 416,
"string2Power": 338,
"batterySoc": 0,
"gridPower": -5541,
"batteryVoltage": 0,
"batteryCurrent": 0,
"batteryPower": 0,
"batteryRemainingEnergy": 6.9,
"loadPower": 6282,
"todayFeedInEnergy": 0.1,
"totalFeedInEnergy": 15.1,
"todayBatteryDischargeEnergy": 3.1,
"todayBatteryChargeEnergy": 0.1,
"totalBatteryDischargeEnergy": 240.5,
"totalBatteryChargeEnergy": 263.1,
"todayConsumption": 12.9,
"totalConsumption": 1355.12,
"batteryTemperature": 0,
"totalYield": 501.4,
"todayYield": 4.8,
"outputCurrentPhase1": 1.4,
"outputCurrentPhase2": 1.4,
"outputCurrentPhase3": 1.4,
"powerPhase1": 233,
"powerPhase2": 260,
"powerPhase3": 248
}
```

# Create a Linux service

You can create a Linux service to run the proxy server on startup.

1. Create a file `/lib/systemd/system/solax-api-proxy.service` with following content
(just change the path to the run script):
```
[Unit]
Description=Solax Inverter API Proxy
After=network-online.target

[Service]
ExecStart=/bin/bash /home/pi/solax-inverter-api-proxy/run.sh
WorkingDirectory=/home/pi/solax-inverter-api-proxy
StandardOutput=inherit
StandardError=inherit
Restart=always
User=root

[Install]
WantedBy=multi-user.target
```

2. Start the service:
```
sudo systemctl start solax-api-proxy.service
```

3. Check the service status:
```
sudo systemctl status solax-api-proxy.service
```

4. Enable the service (to run on startup):
```
sudo systemctl enable solax-api-proxy.service
```
