const zmq = require('zeromq');
const sock = new zmq.Request();

async function run() {
  await sock.connect("tcp://localhost:5555");
  console.log("Client connected to port 5555");

  await sock.send("Hello");
  const [result] = await sock.receive();
  console.log("Received reply:", result.toString());
}

run();