# Market Risk Tracker
(Hyper-Rekt)

> Witness Hyperliquid's Most Painful Trading Positions

Market Risk Tracker (Hyper-Rekt) is a mobile-first web application designed to monitor high-risk lending positions on Hyperliquid, a decentralized finance platform. The app provides real-time visibility into leveraged positions that are experiencing significant losses, presenting them in an engaging, roulette-style interface. Built with React and optimized for mobile devices, it features a dark theme and intuitive touch controls for seamless browsing on smartphones. Users can discover positions with leverage exceeding 10x and unrealized losses greater than 50%, with dynamic visualizations showing liquidation proximity and loss severity. The application leverages Hyperliquid's public API to fetch live position data without requiring authentication. This educational tool helps users understand the risks associated with high-leverage lending positions in decentralized finance markets.

## Table of Contents

- [Features](#features)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Building for Production](#building-for-production)
- [Deployment](#deployment)
  - [Deploy to Vercel](#deploy-to-vercel-recommended)
  - [Deploy to Netlify](#deploy-to-netlify)
  - [Manual Deployment](#manual-deployment)
- [Configuration](#configuration)
- [API Integration](#api-integration)
- [Customization](#customization)
  - [Styling](#styling)
  - [Adding Features](#adding-features)
- [Contributing](#contributing)
- [Disclaimer](#disclaimer)
- [Acknowledgments](#acknowledgments)

## Features

- **Real-time Position Discovery**: Fetches live disaster positions from Hyperliquid API
- **Risk Criteria Filtering**:
  - Leverage > 10x
  - Unrealized PnL < -50%
  - Position size > $1000
- **Dynamic Visualization**:
  - Color-coded loss severity (darker red = bigger losses)
  - Liquidation distance progress bar
  - Real-time P&L calculations
- **Mobile-First Design**: Optimized for all screen sizes
- **Dark Theme**: Easy on the eyes while watching disasters unfold

## Screenshots

Initial State - Ready to Spin
![image](https://github.com/user-attachments/assets/ad715fc4-30af-47ac-95f6-5d698123b6c5)

Result Screen - Rekt Position Display
![image](https://github.com/user-attachments/assets/b1a74046-1aef-4986-9c5a-dfbe6a9a7418)

## Tech Stack

- **React 18** - UI Framework
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Hyperliquid API** - Real-time position data

## Quick Start

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/hyper-rekt.git

# Navigate to project directory
cd hyper-rekt

# Install dependencies
npm install

# Start development server
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

## Building for Production

```bash
# Create production build
npm run build

# The build folder is ready to be deployed
```

## Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/hyper-rekt)

### Deploy to Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/hyper-rekt)

### Manual Deployment

1. Run `npm run build`
2. Deploy the `build` folder to any static hosting service

## Configuration

The app uses the following constants that can be modified in `src/App.js`:

```javascript
const MIN_LEVERAGE = 10;          // Minimum leverage to qualify
const MIN_LOSS_PERCENTAGE = 50;   // Minimum loss percentage
const MIN_POSITION_VALUE = 1000;  // Minimum position size in USD
```

## API Integration

The app connects to Hyperliquid's public API endpoints:

- `clearinghouseState` - Fetches user positions
- `allMids` - Gets current market prices
- `recentTrades` - Discovers active trader addresses

No API key required for public endpoints.

## Customization

### Styling

Modify the Tailwind classes in components or update the color scheme:

```javascript
// Update loss color gradients in PositionCard
const getLossColor = (pnlPercentage) => {
  // Customize color ranges
};
```

### Adding Features

The codebase is modular and easy to extend:
- Add new stats in `PositionCard`
- Create additional filters in `findDisasterPositions`
- Implement WebSocket for real-time updates

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Disclaimer

This application is for entertainment purposes only. It is not financial advice. Trading with high leverage is extremely risky and can result in total loss of funds. Always trade responsibly.

## Acknowledgments

- Hyperliquid for providing the public API
- The degens who provide the entertainment
