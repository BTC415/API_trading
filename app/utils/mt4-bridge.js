const zmq = require('zeromq');
const sock = new zmq.Reply();

async function run() {
  await sock.bind("tcp://*:5555");
  console.log("Server bound to port 5555");

  for await (const [msg] of sock) {
    console.log("Received request:", msg.toString());
    await sock.send("World");
  }
}

run();