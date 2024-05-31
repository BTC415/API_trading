7.1.6
  - fix broken release

7.1.5
  - fixed broken possibility to configure log4js when custom log4js version is used in an application

7.1.3
 - added the request URL to the error log
 - added a detailed error log in the examples
 - fixed tests for the httpClient

7.1.2
 - refactored file structure for backward compatibility
 - fixed support for Node.js v13.x.x
 - fixed build for Node.js v11.x.x.

7.1.1
 - fix merge conflict

7.1.0
 - refactored build to support ESM, UMD, CJS

7.0.0
  - breaking change: updated `TradingClient` method `resetStopouts` to `resetSubscriptionStopouts`
  - added method `TradingClient.resetSubscriberStopouts`

6.1.2
  - fixed region handling on error
  - fixed TooManyRequestsError processing

6.1.1
  - update package description

6.1.0
  - added retrieve strategy external signals method

6.0.5
  - added rolling over to the first region if requests on all regions failed

6.0.4
  - fix typings in error events

6.0.3
  - add logs on retrieve stream errors

6.0.2
  - fixed typings
  - fixed FAQ URL

6.0.1
  - fixed strategy log stream job

6.0.0
  - breaking change: added strategyId, positionId, level params to subscriber logs search & streaming
  - breaking change: added positionId, level params to strategy logs search & streaming

5.11.4
  - added limit param to subscriber & strategy log streaming
  - fix subscriber & strategy extra log streaming after unsubscription

5.11.3
  - fix typings

5.11.2
  - fixed captureStackTrace error on Safari

5.11.1
  - renamed expirePendingOrders -> expirePendingOrderSignals

5.11.0
  - made it possible to specify open price for market external signals

5.10.1
  - fixed add stream listener methods

5.10.0
  - make it possible to expire pending order signals

5.9.0
  - make it possible to stream user logs and transactions
  - make it possible to delay trading signals by configured amount of time

5.8.0
  - updated trade size scaling expresson variables

5.7.0
  - added equity trade size scaling mode

5.6.0
  - added expression option to strategy trade size scaling

5.5.1
  - updated telegram integration documentation

5.5.0
  - refactored risk limits (please make sure to update your apps to use new enumerations)

5.4.0
  - expanded strategy trade size scaling options

5.3.1
  - added telegram typescript typings

5.3.0
  - added telegram integration

5.2.1
  - added references to MT manager api and risk management api

5.2.0
  - added getStrategyLog method

5.1.1
  - removed stop out risk from models

5.1.0
  - added stopout listener

5.0.1
  - fix typescript types

5.0.0
  - breaking change: signal methods move to a separate class
  - implemented region support

4.0.2
  - fixed esdoc

4.0.1
  - fix broken release

4.0.0
  - breaking change: updated exported typescript types

3.3.1
  - updated typescript types

3.3.0
  - added removePortfolioStrategyMember method
  - added closeOnRemovalMode to strategy, portfolio strategy and portfolio strategy member

3.2.2
  - fixed export declared types in typings

3.2.1
  - added typings for public classes and objects

3.2.0
  - added includeRemoved and pagination to getStrategies, getPortfolioStrategies, getSubscribers

3.1.4
  - added removeAfter field to closeInstructions

3.1.3
  - removed positionLifecycle property

3.1.2
  - updated docs

3.1.1
  - added subscriber profit field to trading signal model

3.1.0
  - fixed remove subscriber
  - added remove subscription method

3.0.2
  - updated remove REST API
  - updated StrategyStopout schema

3.0.1
  - fixed transaction REST API

3.0.0
  - breaking change: migrated to CopyFactory 2

2.2.0
  - added drawdown filter
  - changed reduceCorrelations filter allowed values

2.1.0
  - added settings to disable SL and/or TP copying
  - added settings to specify max and min trade volume
  - added settings to configure trade size scaling

2.0.0
  - breaking change: added option to filter transactions by account id in history API and altered API parameter list as a result
  - handle TooManyRequestsError in HTTP client

1.1.1
  - Added API to retrieve account / strategy / portfolio strategy by id

1.0.0
  - CopyFactory SDK is not a separate repository/module, migrated from metaapi.cloud javascript SDK