# All Environment Variables for Vercel Deployment

This document contains **ALL 12 environment variables** needed for your Activerse booking system deployment on Vercel.

---

## Complete List of Environment Variables

### 1. NODE_ENV
**Key:** `NODE_ENV`  
**Value:** `production`  
**Environments:** ✅ Production, ✅ Preview, ✅ Development  
**Description:** Sets Node.js environment to production mode

---

### 2. SESSION_SECRET
**Key:** `SESSION_SECRET`  
**Value:** Generate a secure secret using PowerShell:
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```
**Example Generated Value:** `42kbTgNE6ufGdor0bU/ty6jNrdWEUVPh9PMkd1DxdKc=`  
**Environments:** ✅ Production, ✅ Preview, ✅ Development  
**Description:** Secret key for encrypting session cookies

---

### 3. MONGODB_URI
**Key:** `MONGODB_URI`  
**Value:** `mongodb+srv://username:password@cluster.mongodb.net/activerse?retryWrites=true&w=majority&appName=Cluster0`  
**Environments:** ✅ Production, ✅ Preview, ✅ Development  
**Description:** MongoDB Atlas connection string  
**⚠️ Note:** Ensure MongoDB Atlas Network Access allows all IPs (`0.0.0.0/0`) for testing

---

### 4. ADMIN_USERNAME
**Key:** `ADMIN_USERNAME`  
**Value:** `admin` (or change to something else for security)  
**Environments:** ✅ Production, ✅ Preview, ✅ Development  
**Description:** Username for admin login  
**⚠️ Security:** Change from default value

---

### 5. ADMIN_EMAIL
**Key:** `ADMIN_EMAIL`  
**Value:** `admin@example.com` (change to your actual email)  
**Environments:** ✅ Production, ✅ Preview, ✅ Development  
**Description:** Email address for admin user  
**⚠️ Change:** Replace with your actual email address

---

### 6. ADMIN_PASSWORD
**Key:** `ADMIN_PASSWORD`  
**Value:** `your-strong-password-here` (use a STRONG password!)  
**Environments:** ✅ Production, ✅ Preview, ✅ Development  
**Description:** Password for admin login  
**⚠️ Security:** Use a STRONG password! Must be different from default

---

### 7. STRIPE_SECRET_KEY
**Key:** `STRIPE_SECRET_KEY`  
**Value:** `sk_test_your_stripe_secret_key_here`  
**Environments:** ✅ Production only  
**Description:** Stripe secret key for processing payments  
**⚠️ Get from:** https://dashboard.stripe.com/test/apikeys

---

### 8. STRIPE_PUBLISHABLE_KEY
**Key:** `STRIPE_PUBLISHABLE_KEY`  
**Value:** `pk_test_your_stripe_publishable_key_here`  
**Environments:** ✅ Production, ✅ Preview, ✅ Development  
**Description:** Stripe publishable key (used in frontend)  
**⚠️ Get from:** https://dashboard.stripe.com/test/apikeys

---

### 9. STRIPE_WEBHOOK_SECRET
**Key:** `STRIPE_WEBHOOK_SECRET`  
**Value:** `whsec_your_webhook_secret_here`  
**Environments:** ✅ Production only  
**Description:** Stripe webhook signing secret  
**⚠️ IMPORTANT:** Set this **AFTER** deployment (after you get your deployment URL)  
**⚠️ Setup:** 
1. Deploy your site first
2. Go to Stripe Dashboard → Developers → Webhooks
3. Add endpoint: `https://your-app.vercel.app/api/webhook/stripe`
4. Copy the signing secret (starts with `whsec_...`)
5. Add it here as the value

---

### 10. EMAIL_USER
**Key:** `EMAIL_USER`  
**Value:** `Activersepvtltd@gmail.com`  
**Environments:** ✅ Production, ✅ Preview, ✅ Development  
**Description:** Gmail address for sending emails (contact form, password reset, etc.)

---

### 11. EMAIL_PASSWORD
**Key:** `EMAIL_PASSWORD`  
**Value:** `[your-gmail-app-password]`  
**Environments:** ✅ Production only  
**Description:** Gmail App Password for authentication  
**⚠️ IMPORTANT:** Use Gmail **App Password**, NOT your regular password!  
**⚠️ Get from:** https://myaccount.google.com/apppasswords  
**⚠️ Steps:**
1. Go to https://myaccount.google.com/apppasswords
2. Sign in with your Gmail account
3. Select "Mail" and "Other (Custom name)"
4. Enter "Activerse Booking System"
5. Click "Generate"
6. Copy the 16-character password (no spaces)
7. Use it as the value here

---

### 12. CONTACT_EMAIL
**Key:** `CONTACT_EMAIL`  
**Value:** `Activersepvtltd@gmail.com`  
**Environments:** ✅ Production, ✅ Preview, ✅ Development  
**Description:** Email address where contact form messages will be sent

---

## Quick Copy-Paste Reference for Vercel

When adding to Vercel, use this format:

| Variable Name | Value | Environments |
|--------------|-------|--------------|
| `NODE_ENV` | `production` | Production, Preview, Development |
| `SESSION_SECRET` | `[generate using PowerShell command above]` | Production, Preview, Development |
| `MONGODB_URI` | `mongodb+srv://username:password@cluster.mongodb.net/activerse?retryWrites=true&w=majority&appName=Cluster0` | Production, Preview, Development |
| `ADMIN_USERNAME` | `admin` | Production, Preview, Development |
| `ADMIN_EMAIL` | `admin@example.com` | Production, Preview, Development |
| `ADMIN_PASSWORD` | `your-strong-password-here` | Production, Preview, Development |
| `STRIPE_SECRET_KEY` | `sk_test_your_stripe_secret_key_here` | Production only |
| `STRIPE_PUBLISHABLE_KEY` | `pk_test_your_stripe_publishable_key_here` | Production, Preview, Development |
| `STRIPE_WEBHOOK_SECRET` | `whsec_your_webhook_secret_here` | Production only (set AFTER deployment) |
| `EMAIL_USER` | `Activersepvtltd@gmail.com` | Production, Preview, Development |
| `EMAIL_PASSWORD` | `[your-gmail-app-password]` | Production only |
| `CONTACT_EMAIL` | `Activersepvtltd@gmail.com` | Production, Preview, Development |

---

## Required vs Optional Variables

### Required for Deployment:
- ✅ NODE_ENV
- ✅ SESSION_SECRET
- ✅ MONGODB_URI
- ✅ ADMIN_USERNAME
- ✅ ADMIN_EMAIL
- ✅ ADMIN_PASSWORD
- ✅ STRIPE_SECRET_KEY
- ✅ STRIPE_PUBLISHABLE_KEY
- ✅ EMAIL_USER
- ✅ EMAIL_PASSWORD
- ✅ CONTACT_EMAIL

### Optional (Set After Deployment):
- ⚠️ STRIPE_WEBHOOK_SECRET (needs deployment URL first)

---

## Variables That Use Your Actual Values:

**You MUST replace these with your actual values:**

1. **SESSION_SECRET** - Generate a new one using PowerShell command
2. **ADMIN_EMAIL** - Replace `admin@example.com` with your email
3. **ADMIN_PASSWORD** - Replace with a strong password
4. **EMAIL_PASSWORD** - Replace with your Gmail App Password (get from Google)
5. **STRIPE_WEBHOOK_SECRET** - Set after deployment

---

## Variables Already Configured (Use As-Is):

These can be used as shown (but verify they're correct):

- ✅ MONGODB_URI (already configured)
- ✅ STRIPE_SECRET_KEY (test key - verify it's active)
- ✅ STRIPE_PUBLISHABLE_KEY (test key - verify it's active)
- ✅ EMAIL_USER (already configured)
- ✅ CONTACT_EMAIL (already configured)

---

## How to Add These to Vercel:

1. Go to https://vercel.com
2. Select your project (`activerse-landing`)
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. For each variable:
   - **Key:** Variable name (e.g., `NODE_ENV`)
   - **Value:** The value (copy from above)
   - **Environment:** Select which environments (Production/Preview/Development)
6. Click **Save**
7. Repeat for all 12 variables
8. **Redeploy** your project after adding variables

---

## Security Checklist:

- [ ] Generated a new SESSION_SECRET (don't use the example)
- [ ] Changed ADMIN_EMAIL from default
- [ ] Set a STRONG ADMIN_PASSWORD
- [ ] Created Gmail App Password for EMAIL_PASSWORD
- [ ] Set STRIPE_WEBHOOK_SECRET after deployment
- [ ] Verified all Stripe keys are correct
- [ ] Verified MongoDB URI is correct

---

**Total Variables Needed: 12**

---

**Good luck with your deployment!** 🚀
