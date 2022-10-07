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
