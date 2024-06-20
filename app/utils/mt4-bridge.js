const mt4zmqBridge = require('mt4-zmq-bridge');

const zmqBridge = mt4zmqBridge.connect('tcp://127.0.0.1:5555', 'tcp://127.0.0.1:5000');

zmqBridge.on('connect', () => {
    console.log('Connected to MT4 via ZeroMQ');
});

zmqBridge.on('error', (err) => {
    console.error('Error:', err);
});

zmqBridge.request(mt4zmqBridge.REQUEST_RATES, 'USDJPY', (err, res) => {
    if (err) {
        console.error('Error fetching rates:', err);
    } else {
        console.log('Received rates:', res);
    }
});