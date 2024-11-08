# API Trading Platform

A robust trading signal management and copy trading system built with Node.js and MongoDB.

## Overview

This platform enables automated trading signal management, strategy configuration, and copy trading functionality across multiple trading accounts. It provides a comprehensive API for managing trading operations, user authentication, and real-time signal processing.

## Core Features

- **Authentication System**
  - JWT-based secure authentication
  - User registration and login
  - Token verification and role-based access control

- **Trading Signal Management**
  - External signal processing
  - Trading signal generation and distribution
  - Real-time signal copying between accounts

- **Strategy Configuration**
  - Master strategy management
  - Slave settings configuration
  - Portfolio strategy handling
  - Risk management settings

- **Transaction Tracking**
  - Detailed transaction history
  - Performance metrics
  - Stop-out management

## Technical Stack

- **Backend**: Node.js/Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **Trading Integration**: MT4 API
- **Security**: Crypto module for randomization

## API Endpoints

### Authentication
- POST `/auth/register` - User registration
- POST `/auth/login` - User login

### Configuration
- POST `/configuration/master-strategies` - Create master strategy
- GET `/configuration/strategies` - Retrieve strategies
- PUT `/configuration/strategies/:strategyId` - Update strategy
- DELETE `/configuration/strategies/:strategyId` - Remove strategy

### Trading
- Multiple endpoints for signal management and trade execution
- Portfolio management endpoints
- Transaction history endpoints

## Data Models

- **Authentication Model**: User credentials and access management
- **Strategy Models**: Master, Slave, and Portfolio configurations
- **Trading Models**: Signals, External signals, Stop-outs
- **Transaction Model**: Trading history and performance tracking

## Security Features

- JWT-based authentication
- Token expiration handling
- Role-based access control
- Secure password handling

## Installation

```bash
npm install
npm start
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:
```
PORT=3000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
MT4_API_KEY=your_mt4_api_key
MT4_API_SECRET=your_mt4_api_secret
```

## Usage

1. Configure trading strategies
2. Set up signal copying rules
3. Monitor transactions and performance
4. Manage portfolio strategies
5. Track trading signals and execution

## Contribution

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
