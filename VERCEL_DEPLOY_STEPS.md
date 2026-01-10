# Quick Vercel Deployment Steps

## Step 1: Go to Vercel Dashboard
1. Open your browser and go to: **https://vercel.com**
2. Click **Sign Up** or **Log In**
3. **Recommended:** Sign in with your GitHub account (same account where you pushed your code)
4. Authorize Vercel to access your GitHub repositories

---

## Step 2: Import Your Project
1. Once logged in, click **Add New...** → **Project**
2. You'll see a list of your GitHub repositories
3. Find **`activerse-landing`** (or `raunaq10/activerse-landing`)
4. Click **Import** next to it

---

## Step 3: Configure Project Settings
Leave these as defaults (Vercel auto-detects everything):

**Project Name:**
- Default: `activerse-landing` (you can change this)

**Framework Preset:**
- Select: **Other** (Vercel will auto-detect Node.js)

**Root Directory:**
- Leave as `./` (default)

**Build Command:**
- Leave empty (Vercel auto-detects `npm install`)

**Output Directory:**
- Leave empty (not needed for Express apps)

**Install Command:**
- Default: `npm install` (this is correct)

---

## Step 4: Add Environment Variables (CRITICAL!)

⚠️ **BEFORE clicking Deploy, click "Environment Variables" section below!**

Click the **Environment Variables** section and add each variable:

### 1. NODE_ENV
- **Key:** `NODE_ENV`
- **Value:** `production`
- **Environments:** ✅ Production ✅ Preview ✅ Development

---

### 2. SESSION_SECRET
- **Key:** `SESSION_SECRET`
- **Value:** Generate using PowerShell:
  ```powershell
  [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
  ```
- **Environments:** ✅ Production ✅ Preview ✅ Development

---

### 3. MONGODB_URI
- **Key:** `MONGODB_URI`
- **Value:** `mongodb+srv://username:password@cluster.mongodb.net/activerse?retryWrites=true&w=majority`
- **Environments:** ✅ Production ✅ Preview ✅ Development
- **⚠️ Replace with your actual MongoDB Atlas connection string from https://cloud.mongodb.com/**

---

### 4. ADMIN_USERNAME
- **Key:** `ADMIN_USERNAME`
- **Value:** `admin` (or change to something else for security)
- **Environments:** ✅ Production ✅ Preview ✅ Development

---

### 5. ADMIN_EMAIL
- **Key:** `ADMIN_EMAIL`
- **Value:** `admin@example.com` (change to your email)
- **Environments:** ✅ Production ✅ Preview ✅ Development

---

### 6. ADMIN_PASSWORD
- **Key:** `ADMIN_PASSWORD`
- **Value:** `your-strong-password-here` (use a STRONG password!)
- **Environments:** ✅ Production ✅ Preview ✅ Development

---

### 7. STRIPE_SECRET_KEY
- **Key:** `STRIPE_SECRET_KEY`
- **Value:** `sk_test_your_stripe_secret_key_here`
- **Environments:** ✅ Production only
- **⚠️ Get your key from: https://dashboard.stripe.com/test/apikeys**

---

### 8. STRIPE_PUBLISHABLE_KEY
- **Key:** `STRIPE_PUBLISHABLE_KEY`
- **Value:** `pk_test_your_stripe_publishable_key_here`
- **Environments:** ✅ Production ✅ Preview ✅ Development
- **⚠️ Get your key from: https://dashboard.stripe.com/test/apikeys**

---

### 9. STRIPE_WEBHOOK_SECRET
- **Key:** `STRIPE_WEBHOOK_SECRET`
- **Value:** `whsec_your_webhook_secret_here` (set AFTER deployment - see Step 7)
- **Environments:** ✅ Production only
- ⚠️ **Note:** Set this AFTER deployment (after you get your deployment URL)

---

### 10. EMAIL_USER
- **Key:** `EMAIL_USER`
- **Value:** `your_email@gmail.com`
- **Environments:** ✅ Production ✅ Preview ✅ Development
- **⚠️ Use your Gmail address**

---

### 11. EMAIL_PASSWORD
- **Key:** `EMAIL_PASSWORD`
- **Value:** `[your-gmail-app-password]` (Gmail App Password, NOT regular password!)
- **Environments:** ✅ Production only
- ⚠️ **Get App Password from:** https://myaccount.google.com/apppasswords
- **⚠️ Create an App Password specifically for this application**

---

### 12. CONTACT_EMAIL
- **Key:** `CONTACT_EMAIL`
- **Value:** `your_contact_email@gmail.com`
- **Environments:** ✅ Production ✅ Preview ✅ Development
- **⚠️ Use the email where you want to receive contact form messages**

---

## Step 5: Deploy
1. Scroll down to review all environment variables (make sure all 12 are added)
2. Click **Deploy** button
3. Wait 2-5 minutes for deployment to complete
4. Watch the build logs for any errors

---

## Step 6: Get Your Deployment URL
After deployment completes:
1. You'll see: **"Your deployment is ready"**
2. You'll get a URL like: `https://activerse-landing-xxxxx.vercel.app`
3. Click the URL to visit your site
4. You'll also get a production URL: `https://activerse-landing.vercel.app` (if available)

---

## Step 7: Configure Stripe Webhook (After Deployment)

**After your site is deployed:**

1. Get your deployment URL: `https://your-app.vercel.app`
2. Go to Stripe Dashboard → **Developers** → **Webhooks**
3. Click **Add endpoint**
4. **Endpoint URL:** `https://your-app.vercel.app/api/webhook/stripe`
5. **Select events to listen to:**
   - ✅ `payment_intent.succeeded`
6. Click **Add endpoint**
7. **Copy the Signing Secret** (starts with `whsec_...`)
8. Go back to Vercel → Your Project → **Settings** → **Environment Variables**
9. **Update** `STRIPE_WEBHOOK_SECRET` with the real secret
10. Vercel will auto-redeploy when you save

---

## Troubleshooting

### Issue: Build fails
- Check build logs in Vercel dashboard
- Verify all environment variables are set
- Make sure `package.json` has all dependencies

### Issue: CSS/JS not loading
- Check browser console (F12) for 404 errors
- Verify files are in `public/` directory
- Check Vercel Function Logs

### Issue: MongoDB connection fails
- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas Network Access allows all IPs (`0.0.0.0/0`)

### Issue: Environment variables not working
- Make sure variables are set for **Production** environment
- Redeploy after adding variables
- Check variable names match exactly (case-sensitive)

---

**Good luck with your deployment!** 🚀
