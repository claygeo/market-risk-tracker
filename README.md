# Market Risk Tracker
(Hyper-Rekt)

> Witness Hyperliquid's Most Painful Trading Positions

A dark-themed, mobile-first React application that showcases catastrophic trading positions from Hyperliquid in an entertaining roulette-style interface.

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

![Hyper Rekt Screenshot](#) ![image](https://github.com/user-attachments/assets/ad715fc4-30af-47ac-95f6-5d698123b6c5)

![image](https://github.com/user-attachments/assets/928d3a2b-a7a3-4266-bf92-99dc71cfb86b)


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
