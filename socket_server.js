// // Node.js TCP Server Code
// // This code receives data from an MQL4 client

// const net = require('net');
// const mongoose = require('mongoose');
// const port = 5555;
// const host = '127.0.0.1';

// const server = net.createServer();

// // const db = mongoose.connection;
// const db = require("./app/models");
// const { json } = require('express');
// const { send } = require('process');
// const TradingSignal = db.tradingSignals;
// const ExternalTradingSignal = db.externalSignals;
// const Strategy = db.strategies;

// server.listen(port, host, () => {
//     console.log('TCP Server is running on port ' + port + '.');
// });

// // Array to store all connected clients
// let sockets = [];

// // Handle incoming data from clients
// server.on('connection', function(sock) {
//     console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);
    
//     // Add the new client socket to the array
//     sockets.push(sock);

//     // Receive data from the client
//     sock.on('data', async function(data) {
//         console.log('DATA ' + sock.remoteAddress + ': ' + data);
//         const {accountId, time, symbol, type, side, openPrice, positionId, stopLoss, takeProfit, signalVolume, server, timeFrame, leverage, lotSize} = JSON.parse(data);
//         console.log('accountId', accountId)
//         const followers = await Strategy.find({accountId: accountId, server: server})
//         console.log(followers)
//         let sendingData  = [];
//         await followers.forEach(async item => {
//             const tradingSignal = new TradingSignal({accountId: accountId});
//             const isTradigSignal = true;
//             tradingSignal.subscriberId = item.slaveaccountId;
//             console.log('subscriberId', item)
//             tradingSignal.positionId = positionId;
//             tradingSignal.subscriberPositionId = positionId;
//             tradingSignal.timeFrame = timeFrame;
//             if (item.symbolFilter.include) {
//                 if (item.symbolFilter.include.includes(symbol)) tradingSignal.symbol = symbol;
//                 else isTradigSignal= false;
//             }
//             if (item.symbolFilter.exclude) {
//                 if (!item.symbolFilter.exclude.includes(symbol)) tradingSignal.symbol = symbol;
//                 else isTradigSignal= false;
//             }
//             // if (item.symbolMapping.from === symbol) tradingSignal.symbol = item.symbolMapping.to;
//             // else tradingSignal.symbol = symbol;
//             tradingSignal.time = Date(time);
//             tradingSignal.type = type;
//             if (item.reverse) {
//                 if (side === "buy") tradingSignal.side = 'sell';
//                 else if(side ==="sell") tradingSignal.side = 'buy';
//             }
//             else {
//                 if (side === "buy") tradingSignal.side = 'buy';
//                 else tradingSignal.side = 'sell';
//             }
//             tradingSignal.openPrice = openPrice;
//             if (item.copyStopLoss){
//                 if ((openPrice + item.maxStopLoss)>stopLoss) tradingSignal.stopLoss = openPrice + item.maxStopLoss;
//                 else tradingSignal.stopLoss = stopLoss
//             }
//             else tradingSignal.stopLoss = openPrice + item.maxStopLoss;
//             if (item.copyTakeProfit) {
//                 if ((openPrice + item.maxTakeProfit)<takeProfit) tradingSignal.takeProfit = openPrice + item.maxTakeProfit;
//                 else tradingSignal.takeProfit = takeProfit
//             }
//             else tradingSignal.takeProfit = openPrice + item.maxTakeProfit;
//             // if (!item.skipPendingOrders) tradingSignal.pendingOrder = pendingOrder;
//             if (leverage>item.maxLeverage) tradingSignal.leverage = item.maxLeverage;
//             else tradingSignal.leverage = leverage;
//             // if (item.minTradeVolume>signalVolume) tradingSignal.signalVolume = item.minTradeVolume;
//             // else if (item.maxTradeVolume<signalVolume) tradingSignal.signalVolume = item.maxTradeVolume;
//             // else tradingSignal.signalVolume = item.maxTradeVolume;
//             tradingSignal.signalVolume =signalVolume;
//             tradingSignal.lotSize = lotSize;
//             let lotUnit = 100000;
//             if (lotSize === "mini") lotUnit = 10000;
//             if (lotSize === "micro") lotUnit = 1000;
//             if (lotSize === "nano") lotUnit = 100;
//             else lotUnit = 100000;
//             console.log("lotUnit", lotUnit, item.balance, item.maxTradeRisk)
//             //calculatae subscriber volume
//             let subVolume = (item.balance * item.maxTradeRisk)/(signalVolume*leverage*lotUnit);
//             console.log("subvolume----------------------->", subVolume); 
//             // Adjusting subscriber volume based on riskLimit
//             if (item.riskLimits.maxAbsoluteRisk > item.riskLimits.maxRelativeRisk) {
//                 // If maxAbsoluteRisk is higher than maxRelativeRisk
//                 if (subVolume > item.riskLimits.maxAbsoluteRisk) {
//                     // Decrease subscriber volume if it exceeds maxAbsoluteRisk
//                     subVolume = item.riskLimits.maxAbsoluteRisk;
//                     console.log("Adjusted subscriber volume to maxAbsoluteRisk");
//                 }
//             } else if (item.riskLimits.maxAbsoluteRisk < item.riskLimits.maxRelativeRisk) {
//                 // If maxRelativeRisk is higher than maxAbsoluteRisk
//                 if (subVolume > item.riskLimits.maxRelativeRisk) {
//                     // Decrease subscriber volume if it exceeds maxRelativeRisk
//                     subVolume = item.riskLimits.maxRelativeRisk;
//                     console.log("Adjusted subscriber volume to maxRelativeRisk");
//                 }
//             }
//             tradingSignal.subscriberVolume = subVolume; 
//             sendingData.push(tradingSignal)
//             // console.log("tradingSignal----------------------->", sendingData);
//             await tradingSignal.save();
//             // res.write(tradingSignalString);
//         })
//         console.log(sendingData)
//         // Broadcast the received data to all connected clients
//         const sendingJsonData = JSON.stringify({'out': sendingData})
//         sockets.forEach(function(client) {
//             if (client !== sock) {
//                 client.write(sendingJsonData);
//             }
//         });
//     });

//     // Handle client disconnection
//     sock.on('close', function(data) {
//         let index = sockets.findIndex(function(o) {
//             return o.remoteAddress === sock.remoteAddress && o.remotePort === sock.remotePort;
//         });
//         if (index !== -1) sockets.splice(index, 1);
//         console.log('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort);
//     });
// });


// // const net = require('net');

// // const bufferSize = 326582;
// // const host = '127.0.0.1';
// // const port = 5555;

// // while (true) {
// //   const sock = new net.Socket();
// // //   sock.setTimeout(30000);
// //   sock.connect(port, host, () => {
// //     sock.on('data', (data) => {
// //       const dataString = data.toString('ascii');
// //       const dataArray = dataString.split('\n');
// //       console.log('data', dataArray);
// //     });
// //   });

// //   sock.on('error', (err) => {
// //     console.error('Socket error:', err);
// //     sock.destroy();
// //   });

// //   sock.on('timeout', () => {
// //     console.log('Socket timed out');
// //     sock.end();
// //   });

// //   sock.on('close', () => {
// //     console.log('Socket closed');
// //   });
// // }

// const net = require('net');

// let newOrder = [];
// const host = 'ec2-54-11-191-126.compute-1.amazonaws.com';
// const HOST = '0.0.0.0';



// function compareArrays(arr1, arr2) {
//     if (arr1.length !== arr2.length) return false;
//     return arr1.every((value, index) => value === arr2[index]);
// }
// // Function to connect to the TCP server and handle data
// function connectToServer() {
//     const client = new net.Socket();

//     client.connect(5555, HOST, () => {
//         // console.log('Connected to TCP server');
//     });

//     client.on('data', (data) => {
//         const orderData = data.toString('ascii').split('\n')
//         if (!compareArrays(newOrder, orderData)) {
//           newOrder = orderData;
//           console.log('newOrder', newOrder)
//         }
//         client.end()
//     });
//     client.on('error', (err) => {
//         // console.error('Socket connection error:', err);
//     });

//     client.on('close', () => {
//         console.log('Connection closed');
//         // Remove all event listeners and destroy the client socket
//         client.removeAllListeners();
//         client.destroy();
//     });
// }
// let timers = 0;
// // Set interval to connect to the server every 50 seconds
// const interval = setInterval(() => {
//     connectToServer();
// }, 500);

// // Clear the interval after a specified time (e.g., 10 minutes)
// // setTimeout(() => {
// //     clearInterval(interval);
// //     console.log('Interval cleared after 10 minutes');
// // }, 60000);
 
const net = require('net');

const server = net.createServer((socket) => {
  console.log('Client connected');

  socket.on('data', (data) => {
    console.log('Received data:', data.toString());
    // socket.write('Hello from Node.js server!');
  });

  socket.on('end', () => {
    console.log('Client disconnected');
  });
});

server.listen(5555, '0.0.0.0', () => {
  console.log('TCP server listening on port 5555');
});
