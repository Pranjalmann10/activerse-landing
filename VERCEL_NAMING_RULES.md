# Vercel Naming Rules - Fix Invalid Character Error

## Error Message:
**"name contains invalid characters. Only letters, digits, and underscores are allowed. Furthermore, the name should not start with a digit"**

---

## Vercel Naming Rules:

### ✅ Valid Characters:
- **Letters** (A-Z, a-z)
- **Digits** (0-9) - but NOT at the start
- **Underscores** (_)

### ❌ Invalid Characters:
- Dashes/hyphens (-)
- Dots/periods (.)
- Special characters (!@#$%^&*() etc.)
- Spaces
- Starting with a digit

---

## Common Issues & Fixes:

### Issue 1: Project Name
**If your project name is:** `activerse-landing` (has a dash)

**Fix:** Change to one of these:
- ✅ `activerse_landing` (use underscore)
- ✅ `activerselanding` (remove dash)
- ✅ `activerseLanding` (camelCase - but might auto-convert)

**How to fix:**
1. In Vercel Dashboard → Your Project → Settings → General
2. Change Project Name to use underscore instead of dash
3. Save

---

### Issue 2: Environment Variable Name

**All environment variable names are CORRECT:**
- ✅ `NODE_ENV`
- ✅ `SESSION_SECRET`
- ✅ `MONGODB_URI`
- ✅ `ADMIN_USERNAME`
- ✅ `ADMIN_EMAIL`
- ✅ `ADMIN_PASSWORD`
- ✅ `STRIPE_SECRET_KEY`
- ✅ `STRIPE_PUBLISHABLE_KEY`
- ✅ `STRIPE_WEBHOOK_SECRET`
- ✅ `EMAIL_USER`
- ✅ `EMAIL_PASSWORD`
- ✅ `CONTACT_EMAIL`

**If you accidentally typed one wrong:**
- ❌ `NODE-ENV` (wrong - has dash)
- ✅ `NODE_ENV` (correct - has underscore)

**If you see any variable name with a dash, change it to use underscore!**

---

### Issue 3: Custom Domain Name

**If you're trying to add a custom domain:**
- Domain names can have dots and dashes (that's normal)
- The error might be from something else

---

## Correct Environment Variable Names (Copy Exactly):

| Variable Name | Status |
|--------------|--------|
| `NODE_ENV` | ✅ Correct |
| `SESSION_SECRET` | ✅ Correct |
| `MONGODB_URI` | ✅ Correct |
| `ADMIN_USERNAME` | ✅ Correct |
| `ADMIN_EMAIL` | ✅ Correct |
| `ADMIN_PASSWORD` | ✅ Correct |
| `STRIPE_SECRET_KEY` | ✅ Correct |
| `STRIPE_PUBLISHABLE_KEY` | ✅ Correct |
| `STRIPE_WEBHOOK_SECRET` | ✅ Correct |
| `EMAIL_USER` | ✅ Correct |
| `EMAIL_PASSWORD` | ✅ Correct |
| `CONTACT_EMAIL` | ✅ Correct |

**⚠️ Important:** When adding these in Vercel, make sure:
- No spaces before/after the name
- No dashes (-) - use underscores (_) instead
- Starts with a letter (not a digit)
- No special characters

---

## Quick Fix Guide:

1. **Check Project Name:**
   - Go to Vercel Dashboard → Settings → General
   - If name has dashes, change to underscores
   - Example: `activerse-landing` → `activerse_landing`

2. **Check Environment Variable Names:**
   - Go to Settings → Environment Variables
   - Check each variable name
   - Make sure no dashes, only underscores
   - Make sure no spaces
   - Make sure starts with a letter

3. **If Adding New Variable:**
   - ✅ Use: `MY_VARIABLE_NAME`
   - ❌ Don't use: `MY-VARIABLE-NAME` (dashes not allowed)
   - ❌ Don't use: `123VARIABLE` (can't start with digit)
   - ❌ Don't use: `MY.VARIABLE` (dots not allowed)

---

## Example of Common Mistakes:

| ❌ Wrong | ✅ Correct | Why Wrong |
|---------|-----------|-----------|
| `NODE-ENV` | `NODE_ENV` | Dashes not allowed |
| `MongoDB-URI` | `MONGODB_URI` | Dashes not allowed |
| `1ST_VARIABLE` | `FIRST_VARIABLE` | Can't start with digit |
| `MY.VARIABLE` | `MY_VARIABLE` | Dots not allowed |
| `MY VARIABLE` | `MY_VARIABLE` | Spaces not allowed |
| `MY@VARIABLE` | `MY_VARIABLE` | Special chars not allowed |

---

**If you're still getting the error, tell me:**
1. What were you trying to create/name?
2. What exact name did you enter?
3. Where in Vercel did you see this error?

I can help you fix it! 🚀
