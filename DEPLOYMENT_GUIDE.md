# Complete Deployment Guide: GitHub + Vercel

This guide will walk you through deploying your Activerse booking system to GitHub and then to Vercel.

---

## Prerequisites

Before starting, ensure you have:
- ✅ Your code is working locally
- ✅ Git installed on your computer
- ✅ A GitHub account
- ✅ A Vercel account (free at vercel.com)

---

## Part 1: Deploy to GitHub

### Step 1: Install Git (if not already installed)

**For Windows:**

1. Download Git: https://git-scm.com/download/win
2. Run the installer
3. **Important:** On "Adjusting your PATH environment" screen, select:
   - "Git from the command line and also from 3rd-party software"
4. Complete the installation
5. Restart PowerShell after installation

**Verify Git installation:**
```powershell
git --version
```
You should see something like: `git version 2.xx.x`

---

### Step 2: Configure Git (First Time Only)

Open PowerShell and run:

```powershell
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

Replace with your actual name and email.

---

### Step 3: Initialize Git Repository (if not already done)

Open PowerShell in your project folder:

```powershell
cd C:\Users\singh\activerse-landing

# Check if Git is already initialized
git status
```

**If you see "not a git repository":**
```powershell
git init
```

**If Git is already initialized:** Skip to Step 4.

---

### Step 4: Check Current Status

```powershell
git status
```

This shows which files are:
- ✅ **Untracked** (new files, not in Git yet)
- ✅ **Modified** (changed files)
- ✅ **Staged** (ready to commit)

---

### Step 5: Create GitHub Repository

1. Go to https://github.com
2. Click the **+** icon (top right) → **New repository**
3. **Repository name:** `activerse-landing` (or your choice)
4. **Description:** "Activerse booking system - Arcade & Entertainment"
5. **Visibility:** Public (or Private if you prefer)
6. ⚠️ **DO NOT** check "Initialize with README" (you already have code)
7. Click **Create repository**

---

### Step 6: Connect Local Repository to GitHub

After creating the repository, GitHub will show you commands. Use these:

```powershell
cd C:\Users\singh\activerse-landing

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/activerse-landing.git

# Or if using SSH (if you have SSH keys set up):
# git remote add origin git@github.com:YOUR_USERNAME/activerse-landing.git
```

**To find your repository URL:**
- Go to your GitHub repository page
- Click the green **Code** button
- Copy the HTTPS URL (looks like: `https://github.com/YOUR_USERNAME/activerse-landing.git`)

---

### Step 7: Stage All Files

```powershell
# Add all files to staging area
git add .
```

**Verify what's being added:**
```powershell
git status
```

You should see all your files listed as ready to commit. Make sure **`.env` is NOT listed** (it's in `.gitignore`).

---

### Step 8: Commit Changes

```powershell
git commit -m "Initial commit: Activerse booking system with Vercel deployment configuration"
```

**Commit message explained:**
- First part: Short description
- Second part: More details (optional)

---

### Step 9: Push to GitHub

```powershell
# Push to GitHub (first time)
git push -u origin main
```

**If your branch is named `master` instead of `main`:**
```powershell
git push -u origin master
```

**If you get an error about branch name:**
```powershell
# Rename branch to main
git branch -M main
git push -u origin main
```

---

### Step 10: Verify on GitHub

1. Go to your GitHub repository page
2. You should see all your files
3. Verify:
   - ✅ `server.js` is there
   - ✅ `vercel.json` is there
   - ✅ HTML files are there
   - ✅ `.env` is **NOT** there (hidden by .gitignore)
   - ✅ `node_modules/` is **NOT** there (hidden by .gitignore)

---

## Part 2: Deploy to Vercel

### Step 1: Create Vercel Account

1. Go to https://vercel.com
2. Click **Sign Up**
3. **Recommended:** Sign up with GitHub (easiest integration)
4. Authorize Vercel to access your GitHub account

---

### Step 2: Import Your Project

1. In Vercel Dashboard, click **Add New...** → **Project**
2. You'll see a list of your GitHub repositories
3. Find and click **Import** on `activerse-landing` (or your repository name)

---

### Step 3: Configure Project Settings

**Project Name:**
- Default: `activerse-landing` (you can change this)
- This will be part of your URL: `https://activerse-landing.vercel.app`

**Framework Preset:**
- Select: **Other** (or leave default)
- Vercel will auto-detect Node.js

**Root Directory:**
- Leave as `./` (default)

**Build Command:**
- Leave empty (Vercel auto-detects `npm install`)

**Output Directory:**
- Leave empty (not needed for Express apps)

**Install Command:**
- Default: `npm install` (this is correct)

---

### Step 4: Add Environment Variables (CRITICAL!)

**⚠️ IMPORTANT:** Add these **BEFORE** clicking Deploy!

Click **Environment Variables** section, then add each variable:

#### 1. Server Configuration

**Variable:** `NODE_ENV`
- **Value:** `production`
- **Environment:** Production, Preview, Development (select all)

---

#### 2. Session Secret

**Variable:** `SESSION_SECRET`

**Generate a secure secret:**
- Open PowerShell and run:
  ```powershell
  [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
  ```
- Copy the generated string
- **Value:** [paste the generated secret]
- **Environment:** Production, Preview, Development

**Or use this example (but generate your own for production):**
```
U3oKIhtofmUbvV6vIN+AK7NHwUoTY+JnvLNp7vPkwbc=
```

---

#### 3. MongoDB Connection

**Variable:** `MONGODB_URI`
- **Value:** `mongodb+srv://username:password@cluster.mongodb.net/activerse?retryWrites=true&w=majority`
- **Environment:** Production, Preview, Development
- **⚠️ Replace with your actual MongoDB Atlas connection string from https://cloud.mongodb.com/**

**⚠️ Important:** Ensure MongoDB Atlas Network Access allows:
- `0.0.0.0/0` (all IPs) - for testing
- Or add Vercel's IP ranges later

---

#### 4. Admin User Configuration

**Variable:** `ADMIN_USERNAME`
- **Value:** `admin` (change from default for security)
- **Environment:** Production, Preview, Development

**Variable:** `ADMIN_EMAIL`
- **Value:** `admin@example.com` (change to your email)
- **Environment:** Production, Preview, Development

**Variable:** `ADMIN_PASSWORD`
- **Value:** `your-strong-password-here` (use a strong password!)
- **Environment:** Production, Preview, Development

**⚠️ Security:** Change these from default values!

---

#### 5. Stripe Configuration

**Variable:** `STRIPE_SECRET_KEY`
- **Value:** `sk_test_your_stripe_secret_key_here`
- **Environment:** Production only (for security)
- **⚠️ Get your key from: https://dashboard.stripe.com/test/apikeys**

**Variable:** `STRIPE_PUBLISHABLE_KEY`
- **Value:** `pk_test_your_stripe_publishable_key_here`
- **Environment:** Production, Preview, Development
- **⚠️ Get your key from: https://dashboard.stripe.com/test/apikeys**

**Variable:** `STRIPE_WEBHOOK_SECRET`
- **Value:** `whsec_your_webhook_secret_here`
- **Environment:** Production only
- **Note:** Set this **AFTER** deployment (see Step 7)

---

#### 6. Email Configuration (Gmail)

**Variable:** `EMAIL_USER`
- **Value:** `your_email@gmail.com`
- **Environment:** Production, Preview, Development
- **⚠️ Use your Gmail address**

**Variable:** `EMAIL_PASSWORD`
- **Value:** `[your-gmail-app-password]`
- **Environment:** Production only (for security)
- **⚠️ Important:** Use Gmail **App Password**, not regular password
  - Get from: https://myaccount.google.com/apppasswords
  - Create an App Password specifically for this application

**Variable:** `CONTACT_EMAIL`
- **Value:** `your_contact_email@gmail.com`
- **Environment:** Production, Preview, Development
- **⚠️ Use the email where you want to receive contact form messages**

---

### Step 5: Deploy

1. Scroll down to the bottom of the page
2. Review all environment variables (make sure they're all added)
3. Click **Deploy**
4. Wait 2-5 minutes for the deployment to complete
5. Watch the build logs for any errors

---

### Step 6: Get Your Deployment URL

After deployment completes:

1. You'll see: **"Your deployment is ready"**
2. You'll get a URL like: `https://activerse-landing-xxxxx.vercel.app`
3. Click the URL to visit your site

**Note:** You'll also get a production URL: `https://activerse-landing.vercel.app` (if no conflicts)

---

### Step 7: Configure Stripe Webhook (After Deployment)

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

## Part 3: Troubleshooting

### Issue: "git is not recognized"

**Solution:**
- Install Git (see Step 1 above)
- Restart PowerShell after installation
- Or add Git to PATH manually

---

### Issue: "Failed to push - remote contains work"

**Solution:**
```powershell
# Pull and merge remote changes first
git pull origin main --no-rebase

# If conflicts occur, resolve them, then:
git add .
git commit -m "Merge remote changes"
git push origin main
```

---

### Issue: CSS/JS not loading on Vercel

**Possible causes:**
1. Files not included in deployment
2. Path resolution issues in serverless environment
3. Routes not configured correctly

**Check:**
1. Vercel Function Logs (Dashboard → Deployments → View Function Logs)
2. Browser Console (F12) for 404 errors
3. Network tab to see actual file requests

**Current fix implemented:**
- Explicit routes for `/styles.css` and `/script.js` in `server.js`
- Files in both root and `public/` directory
- Path resolution for Vercel environment

---

### Issue: MongoDB connection fails

**Solution:**
1. Check MongoDB Atlas Network Access:
   - Go to MongoDB Atlas Dashboard
   - Network Access → Add IP Address
   - Add `0.0.0.0/0` (all IPs) for testing
2. Verify `MONGODB_URI` is correct in Vercel
3. Check connection string format

---

### Issue: Environment variables not working

**Solution:**
1. Verify variables are set for **Production** environment (not just Preview)
2. After adding variables, **redeploy** the project
3. Check variable names match exactly (case-sensitive)

---

## Quick Reference Commands

### Git Commands

```powershell
# Check status
git status

# Add all changes
git add .

# Commit
git commit -m "Your commit message"

# Push to GitHub
git push origin main

# Pull latest changes
git pull origin main

# View commit history
git log --oneline
```

### Vercel Commands (Optional - if you install Vercel CLI)

```powershell
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

---

## Deployment Checklist

Before deploying, verify:

### Code Preparation
- [ ] All code changes are complete
- [ ] `vercel.json` file exists and is configured correctly
- [ ] `.env` is in `.gitignore` (not committed)
- [ ] `.env.example` exists (template for others)
- [ ] All sensitive data removed from code
- [ ] `server.js` has Vercel deployment code (conditional `app.listen()`)

### GitHub
- [ ] Git repository initialized
- [ ] Remote repository connected
- [ ] All files committed
- [ ] Code pushed to GitHub successfully
- [ ] `.env` is NOT visible on GitHub

### Vercel
- [ ] Vercel account created
- [ ] GitHub repository connected
- [ ] All environment variables added (12 variables)
- [ ] Project settings configured
- [ ] Deployment completed successfully
- [ ] Site URL accessible
- [ ] CSS/JS files loading correctly

---

## After Deployment

### Test Your Deployment

1. **Visit your site:** `https://your-app.vercel.app`
2. **Test pages:**
   - Home page (`/`)
   - Login page (`/login`)
   - Bookings page (`/bookings`) - after login
3. **Test features:**
   - Booking form
   - Payment processing (test mode)
   - Admin login
   - Contact form
4. **Check browser console:**
   - Open DevTools (F12)
   - Console tab - check for errors
   - Network tab - verify CSS/JS load with 200 status

---

## Need Help?

If you encounter issues:

1. **Check Vercel Deployment Logs:**
   - Dashboard → Your Project → Deployments → Latest → View Function Logs

2. **Check Browser Console:**
   - F12 → Console tab
   - Look for errors

3. **Check Network Tab:**
   - F12 → Network tab
   - Reload page
   - Check status codes for CSS/JS files

4. **Common Issues:**
   - 404 errors → Files not found
   - 500 errors → Server errors (check logs)
   - CORS errors → Check API URLs

---

## Next Steps

After successful deployment:

1. ✅ Set up custom domain (optional)
2. ✅ Configure Stripe webhooks (production)
3. ✅ Test all functionality thoroughly
4. ✅ Switch to Stripe live keys (when ready for production)
5. ✅ Update admin credentials from defaults

---

**Good luck with your deployment!** 🚀
