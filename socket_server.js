// Node.js TCP Server Code
// This code receives data from an MQL4 client

const net = require('net');
const mongoose = require('mongoose');
const port = 3100;
const host = '127.0.0.1';

const server = net.createServer();

// const db = mongoose.connection;
const db = require("./app/models");
const { json } = require('express');
const { send } = require('process');
const TradingSignal = db.tradingSignals;
const ExternalTradingSignal = db.externalSignals;
const Strategy = db.strategies;

server.listen(port, host, () => {
    console.log('TCP Server is running on port ' + port + '.');
});

// Array to store all connected clients
let sockets = [];

// Handle incoming data from clients
server.on('connection', function(sock) {
    console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);
    
    // Add the new client socket to the array
    sockets.push(sock);

    // Receive data from the client
    sock.on('data', async function(data) {
        console.log('DATA ' + sock.remoteAddress + ': ' + data);
        const {accountId, time, symbol, type, side, openPrice, positionId, stopLoss, takeProfit, signalVolume, server, timeFrame, leverage, lotSize} = JSON.parse(data);
        console.log('accountId', accountId)
        const followers = await Strategy.find({accountId: accountId, server: server})
        console.log(followers)
        let sendingData  = [];
        await followers.forEach(async item => {
            const tradingSignal = new TradingSignal({accountId: accountId});
            const isTradigSignal = true;
            tradingSignal.subscriberId = item.slaveaccountId;
            console.log('subscriberId', item)
            tradingSignal.positionId = positionId;
            tradingSignal.subscriberPositionId = positionId;
            tradingSignal.timeFrame = timeFrame;
            if (item.symbolFilter.include) {
                if (item.symbolFilter.include.includes(symbol)) tradingSignal.symbol = symbol;
                else isTradigSignal= false;
            }
            if (item.symbolFilter.exclude) {
                if (!item.symbolFilter.exclude.includes(symbol)) tradingSignal.symbol = symbol;
                else isTradigSignal= false;
            }
            // if (item.symbolMapping.from === symbol) tradingSignal.symbol = item.symbolMapping.to;
            // else tradingSignal.symbol = symbol;
            tradingSignal.time = Date(time);
            tradingSignal.type = type;
            if (item.reverse) {
                if (side === "buy") tradingSignal.side = 'sell';
                else if(side ==="sell") tradingSignal.side = 'buy';
            }
            else {
                if (side === "buy") tradingSignal.side = 'buy';
                else tradingSignal.side = 'sell';
            }
            tradingSignal.openPrice = openPrice;
            if (item.copyStopLoss){
                if ((openPrice + item.maxStopLoss)>stopLoss) tradingSignal.stopLoss = openPrice + item.maxStopLoss;
                else tradingSignal.stopLoss = stopLoss
            }
            else tradingSignal.stopLoss = openPrice + item.maxStopLoss;
            if (item.copyTakeProfit) {
                if ((openPrice + item.maxTakeProfit)<takeProfit) tradingSignal.takeProfit = openPrice + item.maxTakeProfit;
                else tradingSignal.takeProfit = takeProfit
            }
            else tradingSignal.takeProfit = openPrice + item.maxTakeProfit;
            // if (!item.skipPendingOrders) tradingSignal.pendingOrder = pendingOrder;
            if (leverage>item.maxLeverage) tradingSignal.leverage = item.maxLeverage;
            else tradingSignal.leverage = leverage;
            // if (item.minTradeVolume>signalVolume) tradingSignal.signalVolume = item.minTradeVolume;
            // else if (item.maxTradeVolume<signalVolume) tradingSignal.signalVolume = item.maxTradeVolume;
            // else tradingSignal.signalVolume = item.maxTradeVolume;
            tradingSignal.signalVolume =signalVolume;
            tradingSignal.lotSize = lotSize;
            let lotUnit = 100000;
            if (lotSize === "mini") lotUnit = 10000;
            if (lotSize === "micro") lotUnit = 1000;
            if (lotSize === "nano") lotUnit = 100;
            else lotUnit = 100000;
            console.log("lotUnit", lotUnit, item.balance, item.maxTradeRisk)
            //calculatae subscriber volume
            let subVolume = (item.balance * item.maxTradeRisk)/(signalVolume*leverage*lotUnit);
            console.log("subvolume----------------------->", subVolume); 
            // Adjusting subscriber volume based on riskLimit
            if (item.riskLimits.maxAbsoluteRisk > item.riskLimits.maxRelativeRisk) {
                // If maxAbsoluteRisk is higher than maxRelativeRisk
                if (subVolume > item.riskLimits.maxAbsoluteRisk) {
                    // Decrease subscriber volume if it exceeds maxAbsoluteRisk
                    subVolume = item.riskLimits.maxAbsoluteRisk;
                    console.log("Adjusted subscriber volume to maxAbsoluteRisk");
                }
            } else if (item.riskLimits.maxAbsoluteRisk < item.riskLimits.maxRelativeRisk) {
                // If maxRelativeRisk is higher than maxAbsoluteRisk
                if (subVolume > item.riskLimits.maxRelativeRisk) {
                    // Decrease subscriber volume if it exceeds maxRelativeRisk
                    subVolume = item.riskLimits.maxRelativeRisk;
                    console.log("Adjusted subscriber volume to maxRelativeRisk");
                }
            }
            tradingSignal.subscriberVolume = subVolume; 
            sendingData.push(tradingSignal)
            // console.log("tradingSignal----------------------->", sendingData);
            await tradingSignal.save();
            // res.write(tradingSignalString);
        })
        console.log(sendingData)
        // Broadcast the received data to all connected clients
        const sendingJsonData = JSON.stringify({'out': sendingData})
        sockets.forEach(function(client) {
            if (client !== sock) {
                client.write(sendingJsonData);
            }
        });
    });

    // Handle client disconnection
    sock.on('close', function(data) {
        let index = sockets.findIndex(function(o) {
            return o.remoteAddress === sock.remoteAddress && o.remotePort === sock.remotePort;
        });
        if (index !== -1) sockets.splice(index, 1);
        console.log('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort);
    });
});