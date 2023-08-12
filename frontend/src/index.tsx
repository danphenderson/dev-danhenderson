import ReactDOM from 'react-dom/client';
import App from './App';
import ThemeProvider from './ThemeProvider';
import { UserProvider } from './context/UserContext';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51NbGcEIS2NQXWQDmpaidhFCezkSrSTRSNrhOMaN8QpqhjpImSDQ9p2LNLFnL3PHtNa2QmjzSCJ5SWNYmFMyP3dKd00eK2Vrbh6');

const options = {
  // Obtain a token from the backend server to communicate with Stripe. OR read from environment.
  // clientSecret: process.env.STRIPE_CLIENT_SECRET || '',
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
    <ThemeProvider>
      <UserProvider>
        <Elements stripe={stripePromise} options={options}>
          <App />

        </Elements>
      </UserProvider>
    </ThemeProvider>
);