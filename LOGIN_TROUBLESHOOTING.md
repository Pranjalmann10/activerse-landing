# Login Page Troubleshooting Guide

## Common Issues and Fixes

### Issue 1: Login Page Not Loading (404 Error)

**Symptoms:**
- Getting 404 when visiting `/login`
- Page doesn't exist

**Check:**
1. Verify the route exists in `server.js`:
   ```javascript
   app.get('/login', (req, res) => {
       // Should serve login.html
   });
   ```

2. Verify `login.html` exists in project root

3. Check Vercel deployment logs for errors

**Fix:** The route should already be configured. If not, redeploy.

---

### Issue 2: CSS/JavaScript Not Loading

**Symptoms:**
- Login page loads but looks unstyled
- Console shows 404 for `styles.css` or script files

**Check:**
1. Open browser DevTools (F12)
2. Go to Network tab
3. Reload page
4. Look for failed requests (red) for CSS/JS files

**Fix:**
- Verify files exist in `public/` directory:
  - `public/styles.css`
  - `public/script.js` (if used)
- Check that static file serving is working in `server.js`
- Verify files were deployed to Vercel

---

### Issue 3: Login Form Doesn't Submit

**Symptoms:**
- Clicking "Login" button does nothing
- No network request appears in DevTools

**Check:**
1. Open browser DevTools (F12) → Console tab
2. Look for JavaScript errors
3. Verify `API_URL` is set correctly:
   ```javascript
   const API_URL = window.location.origin + '/api';
   ```

**Fix:**
- Check browser console for errors
- Verify JavaScript is loading correctly
- Make sure form has `id="login-form"`

---

### Issue 4: Login Fails with Error

**Symptoms:**
- Error message appears: "Invalid credentials" or "Login failed"
- Network request shows 401 or 400 status

**Check:**
1. Verify admin user exists in database
2. Check environment variables are set correctly:
   - `ADMIN_USERNAME`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
3. Check Vercel Function Logs for errors

**Fix:**
1. Go to Vercel Dashboard → Your Project → Deployments → Latest
2. Click "View Function Logs"
3. Look for errors related to login/MongoDB
4. Verify MongoDB connection is working

---

### Issue 5: CORS Errors

**Symptoms:**
- Console shows CORS error
- Network request fails with CORS error

**Check:**
1. Browser console for CORS error message
2. Verify `credentials: 'include'` is in fetch calls
3. Check CORS configuration in `server.js`

**Fix:**
- CORS should already be configured with `credentials: true`
- Make sure API calls include `credentials: 'include'`

---

### Issue 6: Session/Cookie Issues

**Symptoms:**
- Login appears to work but redirects back to login
- Session not persisting

**Check:**
1. Verify `SESSION_SECRET` is set in Vercel environment variables
2. Check cookie settings in `server.js`:
   ```javascript
   cookie: {
       secure: process.env.NODE_ENV === 'production',
       httpOnly: true
   }
   ```

**Fix:**
- In production (Vercel), cookies should use `secure: true` (HTTPS only)
- Verify `NODE_ENV=production` is set
- Make sure you're accessing the site via HTTPS (not HTTP)

---

### Issue 7: Redirect to Bookings Fails

**Symptoms:**
- Login succeeds but redirect doesn't work
- Stays on login page or shows 404

**Check:**
1. Verify `/bookings` route exists in `server.js`
2. Verify `bookings.html` exists
3. Check redirect URL in login.html:
   ```javascript
   window.location.href = '/bookings'; // Should use absolute path
   ```

**Fix:**
- Updated to use `/bookings` instead of `bookings.html`
- Verify the route is configured correctly

---

## Debugging Steps

### Step 1: Check Browser Console
1. Open DevTools (F12)
2. Go to Console tab
3. Look for any red error messages
4. Copy errors and check them

### Step 2: Check Network Tab
1. Open DevTools (F12)
2. Go to Network tab
3. Try to login
4. Look for the `/api/auth/login` request
5. Check:
   - Status code (200 = success, 401 = wrong credentials, 500 = server error)
   - Response body (click on request → Response tab)
   - Request headers (verify `Content-Type: application/json`)

### Step 3: Check Vercel Logs
1. Go to Vercel Dashboard
2. Select your project
3. Go to Deployments → Latest deployment
4. Click "View Function Logs"
5. Look for errors when you try to login

### Step 4: Test API Endpoint Directly
1. Use a tool like Postman or curl
2. Test: `POST https://your-app.vercel.app/api/auth/login`
3. Body:
   ```json
   {
     "username": "admin",
     "password": "your-password"
   }
   ```
4. Check response

---

## Quick Fixes to Try

### Fix 1: Verify Environment Variables
Make sure these are set in Vercel:
- ✅ `NODE_ENV=production`
- ✅ `SESSION_SECRET` (generated secret)
- ✅ `MONGODB_URI` (correct connection string)
- ✅ `ADMIN_USERNAME`
- ✅ `ADMIN_EMAIL`
- ✅ `ADMIN_PASSWORD`

### Fix 2: Redeploy After Changes
After fixing code or environment variables:
1. Push changes to GitHub
2. Vercel will auto-redeploy
3. Or manually redeploy from Vercel dashboard

### Fix 3: Clear Browser Cache
1. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. Or clear browser cache and cookies for the site
3. Try logging in again

### Fix 4: Check MongoDB Connection
1. Verify MongoDB Atlas Network Access allows all IPs (`0.0.0.0/0`)
2. Check connection string is correct
3. Verify database exists and has data

---

## Test Credentials

Default admin credentials (if using defaults):
- **Username:** `admin`
- **Email:** `admin@example.com` (or whatever you set in `ADMIN_EMAIL`)
- **Password:** Whatever you set in `ADMIN_PASSWORD` env variable

⚠️ **Important:** Change these from defaults in production!

---

## What to Report

If login still doesn't work, provide:
1. Browser console errors (screenshot or copy text)
2. Network tab - status code of `/api/auth/login` request
3. Vercel Function Logs (any errors)
4. What happens when you try to login:
   - Does form submit?
   - Any error message?
   - Does it redirect?
   - Does it stay on login page?

---

## Expected Behavior

When login works correctly:
1. Enter username and password
2. Click "Login" button
3. Button shows "Logging in..."
4. Network request to `/api/auth/login` returns 200
5. Redirects to `/bookings` page
6. Bookings page shows admin dashboard

---

**Still having issues?** Check Vercel Function Logs and browser console for specific error messages! 🔍
