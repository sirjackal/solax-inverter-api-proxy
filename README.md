# Solax Inverter API Proxy Server

Reads realtime data from the Solax inverter (using local API, not cloud).

Works with Solax X3-Hybrid-10.0-D inverter.

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