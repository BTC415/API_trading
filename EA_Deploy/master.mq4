//+------------------------------------------------------------------+
//|                                                       master.mq4 |
//|                                  Copyright 2024, MetaQuotes Ltd. |
//|                                             https://www.mql5.com |
//+------------------------------------------------------------------+
#property copyright "Copyright 2024, MetaQuotes Ltd."
#property link      "https://www.mql5.com"
#property version   "1.00"
#property strict

//+------------------------------------------------------------------+
//|Include socket library, asking for event handling                 |
//+------------------------------------------------------------------+

#define SOCKET_LIBRARY_USE_EVENTS
#include <socket-library-mt4-mt5.mqh>

//+------------------------------------------------------------------+
//|EA user inputs                                                    |
//+------------------------------------------------------------------+

input ushort ServerPort = 5555; //Server port

#define TIMER_FREQUENCY_MS    1000

// Server socket
ServerSocket * glbServerSocket = NULL;

// Array of current clients
ClientSocket * glbClients[];

// Watch for need to create timer;
bool glbCreatedTimer = false;

int ordersTotal = 0, marketorderTotal = 0, pendingorderTotal = 0, orderCnt = 0, pendingCnt = 0;
string Orderlist[1000], PendingOrderlist[1000], order_type, orderText, symbol, price, lots, takeprofit, stoploss, type;
double previousStopLoss[1000], previousTakeProfit[1000], previousLots[1000], previousPrice[1000];
//+------------------------------------------------------------------+
//| Expert initialization function                                   |
//+------------------------------------------------------------------+
int OnInit()
  {
      // If the EA is being reloaded, e.g. because of change of timeframe,
      // then we may already have done all the setup. See the 
      // termination code in OnDeinit.
      if (glbServerSocket) {
         Print("Reloading EA with existing server socket");
      } else {
      // Create the server socket
      glbServerSocket = new ServerSocket(ServerPort, false);
      if (glbServerSocket.Created()) {
         Print("Server socket created");
   
         // Note: this can fail if MT4/5 starts up
         // with the EA already attached to a chart. Therefore,
         // we repeat in OnTick()
         glbCreatedTimer = EventSetMillisecondTimer(TIMER_FREQUENCY_MS);
      } else {
         Print("Server socket FAILED - is the port already in use?");
      }
      
      ordersTotal = MarketOrder();
      marketorderTotal = MarketOrder();
      Sleep(1000);
      pendingorderTotal = PendingOrder();
      Sleep(1000);
      ordersTotal += pendingorderTotal;
   }

   return(INIT_SUCCEEDED);
  }
//+------------------------------------------------------------------+
//| Expert deinitialization function                                 |
//+------------------------------------------------------------------+
void OnDeinit(const int reason)
  {
      switch (reason) {
         case REASON_CHARTCHANGE:
            // Keep the server socket and all its clients if
            // the EA is going to be reloaded because of a 
            //change to chart symbol or timeframe
            break;
          
          default:
            //For any other unload of the EA, delete the 
            //server socket and all the clients
            glbCreatedTimer = false;
            
            //Delete all clients currently connected
            for(int i = 0; i < ArraySize(glbClients); i++) {
               delete glbClients[i];
            }
            ArrayResize(glbClients, 0);
            
            //Free the server socket. *VERY* important, or else
            //the port number remains in use and un-reusable until
            //MT4/5 is shut down
            delete glbServerSocket;
            glbServerSocket = NULL;
            Print("Server socket terminated");
            break;
      }

  }
//+------------------------------------------------------------------+
//| Expert tick function                                             |
//+------------------------------------------------------------------+
void OnTick()
  {
   
  }
//+------------------------------------------------------------------+
//| Timer function                                                   |
//+------------------------------------------------------------------+
void OnTimer()
  {
   
   if(MarketOrder() + PendingOrder() == OrdersTotal())
      {
         MonitorModifiedOrders();
         MonitorPendingOrders();
         //MonitorCloseOrders();
      }
   if(marketorderTotal < MarketOrder())
   {
      long max = 0;
      marketorderTotal = MarketOrder();
      if(OrderSelect(marketorderTotal-1, SELECT_BY_POS, MODE_TRADES))
      {
         if(OrderType() == ORDER_TYPE_BUY)
            order_type = "buy";
         if(OrderType() == ORDER_TYPE_SELL)
            order_type = "sell";
         if(OrderType() == ORDER_TYPE_BUY || OrderType() == ORDER_TYPE_SELL)
         {
            symbol = OrderSymbol();
            price = OrderOpenPrice();
            takeprofit = OrderTakeProfit();
            stoploss = OrderStopLoss();
            lots = OrderLots();
            orderText = StringFormat("{\"ordertype\": \"%s\", \"symbol\": \"%s\", \"lots\": \"%s\", \"price\": \"%s\", \"takeprofit\": \"%s\", \"stoploss\": \"%s\"}", order_type, symbol, lots, price, takeprofit, stoploss);
            Alert("Market order sent");
         }
      }
   }
   
   if(pendingorderTotal < PendingOrder())
   {
      ordersTotal = MarketOrder() + PendingOrder();
      pendingorderTotal = PendingOrder();
      Print("OK");
      if(OrderSelect(marketorderTotal + pendingorderTotal - 1, SELECT_BY_POS, MODE_TRADES))
      {
         if(OrderType() == ORDER_TYPE_BUY_LIMIT || OrderType() == ORDER_TYPE_BUY_STOP)
            order_type = "buy";
         if(OrderType() == ORDER_TYPE_SELL_LIMIT || OrderType() == ORDER_TYPE_SELL_STOP)
            order_type = "sell";
         
         if(OrderType() == ORDER_TYPE_BUY_STOP)
         {
            
            symbol = OrderSymbol();
            price = OrderOpenPrice();
            lots = OrderLots();
            takeprofit = OrderTakeProfit();
            stoploss = OrderStopLoss();
            type = "stop";
            orderText = StringFormat("{\"ordertype\": \"%s\", \"symbol\": \"%s\", \"lots\": \"%s\", \"price\": \"%s\", \"takeprofit\": \"%s\", \"stoploss\": \"%s\", \"type\": \"%s\"}", order_type, symbol, lots, price, takeprofit, stoploss, type);
            Alert("Pending Order Sent");
         }
         
         if(OrderType() == ORDER_TYPE_BUY_LIMIT)
         {
            
            symbol = OrderSymbol();
            price = OrderOpenPrice();
            lots = OrderLots();
            takeprofit = OrderTakeProfit();
            stoploss = OrderStopLoss();
            type = "limit";
            orderText = StringFormat("{\"ordertype\": \"%s\", \"symbol\": \"%s\", \"lots\": \"%s\", \"price\": \"%s\", \"takeprofit\": \"%s\", \"stoploss\": \"%s\", \"type\": \"%s\"}", order_type, symbol, lots, price, takeprofit, stoploss, type);
            Alert("Pending Order Sent");
         }
         
         if(OrderType() == ORDER_TYPE_SELL_STOP)
         {
            
            symbol = OrderSymbol();
            price = OrderOpenPrice();
            lots = OrderLots();
            takeprofit = OrderTakeProfit();
            stoploss = OrderStopLoss();
            type = "stop";
            orderText = StringFormat("{\"ordertype\": \"%s\", \"symbol\": \"%s\", \"lots\": \"%s\", \"price\": \"%s\", \"takeprofit\": \"%s\", \"stoploss\": \"%s\", \"type\": \"%s\"}", order_type, symbol, lots, price, takeprofit, stoploss, type);
            Alert("Pending Order Sent");
         }
         
         if(OrderType() == ORDER_TYPE_SELL_LIMIT)
         {
            
            symbol = OrderSymbol();
            price = OrderOpenPrice();
            lots = OrderLots();
            takeprofit = OrderTakeProfit();
            stoploss = OrderStopLoss();
            type = "limit";
            orderText = StringFormat("{\"ordertype\": \"%s\", \"symbol\": \"%s\", \"lots\": \"%s\", \"price\": \"%s\", \"takeprofit\": \"%s\", \"stoploss\": \"%s\", \"type\": \"%s\"}", order_type, symbol, lots, price, takeprofit, stoploss, type);
            Alert("Pending Order Sent");
         }
         
      }
   }
   //Accept any new pending connections
   AcceptNewConnections();
   // Process any incoming data on each client socket,
   // bearing in mind that HandleSocketIncomingData()
   // can delete sockets and reduce the size of the array
   // if a socket has been closed

   //for (int i = ArraySize(glbClients) - 1; i >= 0; i--) {
   //   HandleSocketIncomingData(i);
   //}
  }
//+------------------------------------------------------------------+
//+------------------------------------------------------------------+
//|Accepts new connections on the server socket, creating new
// entries in the glbClients[] array                                 |
//+------------------------------------------------------------------+

void AcceptNewConnections()
{
   // Keep accepting any pending connections until Accept() returns NULL
   ClientSocket * pNewClient = NULL;
   do {
      pNewClient = glbServerSocket.Accept();
      
      if (pNewClient != NULL) {
         int sz = ArraySize(glbClients);
         ArrayResize(glbClients, sz + 1);
         glbClients[sz] = pNewClient;
         Print("New client connection");         
         pNewClient.Send(orderText+"\n");
      }
      
   } while (pNewClient != NULL);
}

//+------------------------------------------------------------------+
//|                                                                  |
//+------------------------------------------------------------------+
int MarketOrder(){
   int marketOrderSize = 0;
   for(int i=OrdersTotal()-1; i>=0; i--){
      if(OrderSelect(i, SELECT_BY_POS)){
         if(OrderType() == OP_BUY || OrderType() == OP_SELL){
            marketOrderSize++;
         }
      }
   }
   return marketOrderSize;
}
//+------------------------------------------------------------------+
int PendingOrder()
  {
   int pendingOrderSize = 0;
   for(int mi = OrdersTotal(); mi >= 0; mi--)
     {
      if(OrderSelect(mi, SELECT_BY_POS))
        {
         if(OrderType() == OP_BUYLIMIT || OrderType() == OP_BUYSTOP || OrderType() == OP_SELLLIMIT || OrderType() == OP_SELLSTOP)
           {
            pendingOrderSize++;            
           }
        }
     }
   return pendingOrderSize;
  }
//+------------------------------------------------------------------+
//+------------------------------------------------------------------+
void MonitorModifiedOrders()
{
   for(int i = MarketOrder()-1; i>=0; i--)
   {
      if(OrderSelect(i, SELECT_BY_POS, MODE_TRADES))
      {
         if(previousStopLoss[i] != OrderStopLoss() || previousTakeProfit[i] != OrderTakeProfit())
         {
            previousStopLoss[i] = OrderStopLoss(); //send to server
            previousTakeProfit[i] = OrderTakeProfit(); // send to server
            string modifypositionID = FindOrderID(OrderTicket());
            Print("Order Ticket", OrderTicket(), "tp", previousTakeProfit[i], "sl", previousStopLoss[i]);
            
         }
      }
      
   }
}                                                                  
//+------------------------------------------------------------------+
long FindOrderID(string ticket_number)
{
   string results;
   for(int j = 0; j < orderCnt; j++)
   {
      if(Orderlist[j] == ticket_number)
         results = Orderlist[j+1];
   }
   return results;
   
}
//+------------------------------------------------------------------+
                                                                  
//+------------------------------------------------------------------+
void MonitorPendingOrders()
{
   for(int j = PendingOrder() + MarketOrder() -1; j >= MarketOrder(); j--)
   {
      if(OrderSelect(j, SELECT_BY_POS, MODE_TRADES))
      {
         if(previousStopLoss[j] != OrderStopLoss() || previousTakeProfit[j] != OrderTakeProfit() || previousLots[j] != OrderLots() || previousPrice[j] != OrderOpenPrice())
         {
            previousLots[j] = OrderLots();
            previousPrice[j] = OrderOpenPrice();
            previousStopLoss[j] = OrderStopLoss();
            previousTakeProfit[j] = OrderTakeProfit();
            string modifyorderID = FindPendingID(OrderTicket());
         }
      }
   }
}
//+------------------------------------------------------------------+
                                                               
//+------------------------------------------------------------------+
long FindPendingID(string ticket_number)
{
   string results;
   for(int k = 0; k < pendingCnt; k++)
   {
      if(PendingOrderlist[k] == ticket_number)
         results = PendingOrderlist[k];
   }
   
   return results;
}