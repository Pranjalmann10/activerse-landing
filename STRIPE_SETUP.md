# Stripe Payment Gateway Setup Guide

## Quick Setup (5 minutes)

### Step 1: Get Your Stripe Test Keys

1. Go to https://dashboard.stripe.com/test/apikeys
2. Sign up or log in to your Stripe account
3. Copy your **Publishable key** (starts with `pk_test_...`)
4. Copy your **Secret key** (starts with `sk_test_...`)

### Step 2: Configure the Frontend (script.js)

1. Open `script.js` in your code editor
2. Find line 73 (look for `STRIPE_PUBLISHABLE_KEY`)
3. Replace `'pk_test_51QKexample'` with your actual publishable key:

```javascript
const STRIPE_PUBLISHABLE_KEY = 'pk_test_YOUR_ACTUAL_KEY_HERE';
```

### Step 3: Configure the Backend (server.js)

**Option A: Using .env file (Recommended)**

1. Create a file named `.env` in the project root (same folder as server.js)
2. Add this content:
```
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
```

**Option B: Direct in server.js**

1. Open `server.js` in your code editor
2. Find line 9 (look for `stripe = require('stripe')`)
3. Replace `'sk_test_51QKexample'` with your actual secret key:

```javascript
const stripe = require('stripe')('sk_test_YOUR_SECRET_KEY_HERE');
```

### Step 4: Restart the Server

1. Stop the current server (Ctrl+C in terminal)
2. Run `npm start` again
3. Refresh your browser

## Testing Payments

Once configured, you can test with these Stripe test cards:

- **Success:** `4242 4242 4242 4242`
- **Decline:** `4000 0000 0000 0002`
- Use any future expiry date (e.g., 12/25)
- Use any 3-digit CVC (e.g., 123)
- Use any ZIP code (e.g., 12345)

## Troubleshooting

### Error: "Invalid Stripe Secret Key"
- Make sure your secret key starts with `sk_test_` (for test mode)
- Check for extra spaces when copying the key
- Make sure the key is in quotes: `'sk_test_...'`

### Error: "Payment system not configured"
- Verify both keys are updated (not using placeholder values)
- Restart the server after changing keys
- Clear browser cache and refresh

### Payment form not loading
- Open browser console (F12) to see detailed errors
- Check that Stripe.js library is loaded (should see "Stripe initialized" in console)
- Verify your publishable key is correct

## Need Help?

- Stripe Documentation: https://stripe.com/docs
- Stripe Test Cards: https://stripe.com/docs/testing
- Get Support: https://support.stripe.com
