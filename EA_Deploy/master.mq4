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
//---

  }
//+------------------------------------------------------------------+
//| Timer function                                                   |
//+------------------------------------------------------------------+
void OnTimer()
  {
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
         pNewClient.Send("Hello\r\n");
      }
      
   } while (pNewClient != NULL);
}

//+------------------------------------------------------------------+
//|                                                                  |
//+------------------------------------------------------------------+
