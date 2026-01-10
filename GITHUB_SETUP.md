# GitHub Publishing Guide

This guide will help you safely publish your Activerse booking system to GitHub while keeping all sensitive data secure.

## ✅ Pre-Publication Checklist

Before pushing to GitHub, verify the following:

### 1. **Verify `.gitignore` is correct**
   - Run `git status` and ensure `.env` is NOT listed
   - Verify `node_modules/` is ignored
   - Check that database files (`*.db`, `*.sqlite`) are ignored

### 2. **Remove hardcoded sensitive data**
   - ✅ All API keys removed from code
   - ✅ All passwords removed from code
   - ✅ All database connection strings removed
   - ✅ All email credentials removed
   - ✅ All admin credentials use environment variables

### 3. **Verify sensitive files are not tracked**
   ```bash
   # Check what files are staged
   git status
   
   # If .env is listed, remove it:
   git rm --cached .env
   
   # Check for any other sensitive files
   git ls-files | grep -E '\.(env|key|pem|p12|db|sqlite)$'
   ```

### 4. **Review all files before committing**
   ```bash
   # See what will be committed
   git diff --cached
   
   # Search for any remaining hardcoded credentials
   grep -r "password\|secret\|key\|token" --include="*.js" --include="*.json" . | grep -v node_modules | grep -v ".git"
   ```

## 🚀 Publishing to GitHub

### Step 1: Initialize Git Repository (if not already done)

```bash
cd activerse-landing
git init
```

### Step 2: Add All Files (`.gitignore` will exclude sensitive files)

```bash
git add .
```

### Step 3: Verify What's Being Added

```bash
# Check staged files
git status

# IMPORTANT: Verify .env is NOT in the list!
# If .env appears, stop and remove it:
# git reset HEAD .env
# git rm --cached .env
```

### Step 4: Create Initial Commit

```bash
git commit -m "Initial commit: Activerse booking system

- Added booking system with Stripe payment integration
- Admin authentication and dashboard
- MongoDB database integration
- Contact form functionality
- All sensitive data moved to environment variables"
```

### Step 5: Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository (e.g., `activerse-landing`)
3. **DO NOT** initialize with README, .gitignore, or license (we already have these)
4. Copy the repository URL (e.g., `https://github.com/yourusername/activerse-landing.git`)

### Step 6: Connect Local Repository to GitHub

```bash
git remote add origin https://github.com/yourusername/activerse-landing.git
git branch -M main
git push -u origin main
```

## 🔒 Security Best Practices

### After Publishing

1. **Double-check your repository:**
   - Visit your GitHub repository
   - Verify `.env` file is NOT visible
   - Check commit history doesn't contain sensitive data

2. **If you accidentally committed sensitive data:**
   
   **If you haven't pushed yet:**
   ```bash
   # Remove from last commit
   git reset HEAD~1
   # Fix the issue, then recommit
   ```
   
   **If you already pushed:**
   - The sensitive data is in Git history
   - You need to:
     1. Change all exposed credentials immediately (API keys, passwords, etc.)
     2. Use `git filter-branch` or BFG Repo-Cleaner to remove from history
     3. Force push (warning: this rewrites history)
   
   **Better solution:** Create a new repository and start fresh

3. **Add GitHub Secrets (for CI/CD later):**
   - Go to repository Settings → Secrets and variables → Actions
   - Add secrets for deployment environments
   - Never hardcode secrets in workflow files

4. **Consider adding a Security Policy:**
   - Create `SECURITY.md` file
   - Document how to report security vulnerabilities

## 📝 What Should Be Public

✅ **Safe to commit:**
- Source code (`.js`, `.html`, `.css` files)
- `package.json` and `package-lock.json`
- `.env.example` (template without real values)
- `.gitignore`
- `README.md`
- `GITHUB_SETUP.md`
- Documentation files
- Images and static assets

❌ **NEVER commit:**
- `.env` file (contains real credentials)
- `node_modules/` (install via `npm install`)
- Database files (`.db`, `.sqlite`, etc.)
- Log files (`*.log`)
- IDE configuration (`.vscode/`, `.idea/`)
- OS files (`.DS_Store`, `Thumbs.db`)
- Any file containing:
  - API keys
  - Passwords
  - Secret tokens
  - Database connection strings
  - Private keys

## 🛡️ Additional Security Measures

### 1. Use GitHub's Secret Scanning

GitHub automatically scans repositories for exposed secrets. If you see alerts:
- Rotate the exposed credentials immediately
- Remove them from commit history if possible

### 2. Enable Branch Protection

For production repositories:
- Go to Settings → Branches
- Add branch protection rules for `main` branch
- Require pull request reviews
- Require status checks

### 3. Use Environment-Specific Configurations

- Development: Use `.env.local` (already in `.gitignore`)
- Staging: Use environment variables in hosting platform
- Production: Use secure secret management (AWS Secrets Manager, Azure Key Vault, etc.)

### 4. Regular Security Audits

```bash
# Check for exposed secrets in current codebase
npm audit

# Use tools like:
# - git-secrets
# - truffleHog
# - detect-secrets
```

## 📚 Environment Setup for New Contributors

When someone clones your repository, they should:

1. Clone the repository
2. Copy `.env.example` to `.env`
3. Fill in their own values (they'll need their own API keys, database, etc.)
4. Run `npm install`
5. Start the server

This ensures no one accidentally uses your credentials.

## 🆘 Troubleshooting

### Issue: `.env` is showing in `git status`

**Solution:**
```bash
# Remove from Git tracking (but keep local file)
git rm --cached .env

# Verify it's in .gitignore
cat .gitignore | grep .env

# If not, add it:
echo ".env" >> .gitignore

# Commit the .gitignore update
git add .gitignore
git commit -m "Add .env to .gitignore"
```

### Issue: Accidentally committed sensitive data

**Solution:**
1. **If not pushed yet:**
   ```bash
   git reset HEAD~1
   # Fix the file, then recommit
   ```

2. **If already pushed:**
   - Immediately rotate all exposed credentials
   - Use `git filter-branch` or BFG Repo-Cleaner
   - Consider starting fresh if early in development

### Issue: Need to update `.env.example`

**Solution:**
```bash
# Update .env.example with new variables (using placeholders)
# Then commit:
git add .env.example
git commit -m "Update .env.example with new environment variables"
```

## ✅ Final Checklist Before First Push

- [ ] `.gitignore` includes `.env`, `node_modules/`, database files
- [ ] `.env` file exists locally but is NOT in Git
- [ ] All hardcoded credentials removed from code
- [ ] `.env.example` exists with placeholder values
- [ ] `README.md` doesn't contain sensitive information
- [ ] `git status` shows only safe files
- [ ] Tested that app works with environment variables
- [ ] All API keys use placeholder values in code
- [ ] Database connection uses environment variable
- [ ] Admin credentials use environment variables

## 🎉 You're Ready!

Once all checks pass, you can safely publish to GitHub. Your sensitive data will remain secure, and others can contribute without accessing your credentials.

**Remember:** Security is an ongoing process. Regularly review your repository for any accidentally committed secrets.
