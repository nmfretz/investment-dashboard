# Investment Dashboard

An investment dashboard for tracking a user's portfolio of assets, charting price history for stocks and crypto assets, and charting company financials.

Front end currently deployed on netlify at https://investment-dashboard.netlify.app/

<kbd> 
<img src="https://user-images.githubusercontent.com/85373263/144309007-239ea645-0539-4e8c-80bc-0dddc2012424.png"/>
</kbd>
<br />
<br />
<kbd> 
<img src="https://user-images.githubusercontent.com/85373263/144309020-173b424c-b20e-4b2e-a0e5-b696e73679c0.png"/>
</kbd>

### Features & Design

#### Frontend

- React Framework for frontend build
- :bar_chart: [Chart.js](https://www.chartjs.org/) library used for graphing portfolio breakdown, company financials, and asset price history
  - Doughnut chart of portfolio holdings
  - View all company financial charts available through HyperCharts (e.g., revenue segments, cash flow, etc...)
  - View historical stock and crypto prices by time range
- :currency_exchange: [money.js](https://openexchangerates.github.io/money.js/) library used for currency conversion (see backend below for exchange rate API)
- :telescope: Search functionality for stocks and crypto assets
- :brain: Financial and price data cached to limit API calls
- :cow: [Bulma.io](https://bulma.io/) CSS framework
- :clipboard: Asset portfolio persists in local storage. Database ( MongoDB) currently in development to make this application full stack 🥞.

#### Backend

- :dog2: Fetches data from the following APIs:
  - [HyperCharts API](https://hypercharts.co/api-docs) for company financials
  - [Alpha Vantage API](https://www.alphavantage.co/) for stock and crypto price history
  - [Yahoo Finance](https://www.yahoofinanceapi.com/) for stock ticker search, current stock price, and exchange rates
  - [Coin Cap API](https://docs.coincap.io/) for crypto symbol search
  - [Nomics API](https://nomics.com/docs/) for current crypto price
- [express](https://www.npmjs.com/package/express) library for server/routing
- [express-slow-down](https://www.npmjs.com/package/express-slow-down) library (middleware for express) to slow down requests to Nomics API, which has a 1 request per second rate limit
- [cors](https://www.npmjs.com/package/cors) library (middleware for express) for adding CORS headers to responses

### TODOS

#### Frontend

- [ ] Remove cache items that no longer exist in portfolio
- [ ] Add summary to AssetInfo.js that includes: uncompacted stock price, amount, value, portfolio percent
- [x] CSS:
  - [x] Size and padding of doughnut chart
  - [x] White space
- [x] Add proper error handling for all get requests.
- [x] Doughnut chart:
  - [x] Colour scheme for graph
  - [x] Make doughnut chart tooltips more readable
  - [x] Don't show tootlip when there is no data
- [ ] Properly handle scenario where user quickly clicks on multiple assets which issues multiple requests to backend
- [ ] Consider auto-refreshing prices every 5 min instead of on button-click
- [x] Consider organizing components into subfolders
- [x] Resolve react warnings in console
- [ ] Add database instead of persisting assets in local storage

#### Backend

- [ ] Add proper error handling for all get requests.
- [ ] Add functionality for multiple users requesting data.

# Setup

Run `npm install` in the following directories:

- `backend server`
- `frontend-react`

Rename `.env.sample` to `.env` and update with your API keys:

- [HyperCharts API](https://hypercharts.co/api-docs) for company financials
- [Alpha Vantage API](https://www.alphavantage.co/) for stock and crypto price history
- [Coin Cap API](https://docs.coincap.io/) for crypto symbol search
- [Nomics API](https://nomics.com/docs/) for current crypto price

No API key required for [Yahoo Finance](https://www.yahoofinanceapi.com/) (stock ticker search, current stock price, and exchange rates)

# Development

### Bakend Server

Start server with nodemon.

```
cd backend-server
npm run dev
```

### Frontend React App

Start frontend with react-app

```
cd frontend-react
npm run dev
```

# Deployment

### Backend Server

Back end server currently deployed on heroku at https://financial-investment-dashboard.herokuapp.com/

- Deployed from github subdirectory server using https://github.com/timanovsky/subdir-heroku-buildpack.git

  - add above github url as first heroku buildpack
  - add heroku nodejs as section buildpack

### Frontend

Front end currently deployed on netlify at https://investment-dashboard.netlify.app/

Build the frontend for production with `npm run build`. Deploy the `build` folder.

Change `const SERVER_URL` in `frontend-react/build/src/fetch-requests/end-points.js` to url of your server

# Screenshots

<kbd> 
<img src="https://user-images.githubusercontent.com/85373263/144309007-239ea645-0539-4e8c-80bc-0dddc2012424.png"/>
</kbd>
<br />
<br />
<kbd> 
<img src="https://user-images.githubusercontent.com/85373263/144320453-bfc27a5f-2f1c-4f5e-8838-35999c48474e.png"/>
</kbd>
<br />
<br />
<kbd> 
<img src="https://user-images.githubusercontent.com/85373263/144309020-173b424c-b20e-4b2e-a0e5-b696e73679c0.png"/>
</kbd>
<br />
<br />
<kbd> 
<img src="https://user-images.githubusercontent.com/85373263/144320484-03bc58df-c47f-4565-850f-0929ff820a7d.png"/>
</kbd>
