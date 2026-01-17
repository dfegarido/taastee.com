# GitHub Pages Setup Guide

## 🚀 Setting Up Your Blog with GitHub Pages

Your blog uses Airtable for content management. Follow these steps to configure it securely on GitHub Pages.

---

## Step 1: Add Secrets to GitHub Repository

1. **Go to your GitHub repository**
   - Visit: https://github.com/dfegarido/taastee.com
   - Click on **Settings** tab

2. **Navigate to Secrets**
   - In the left sidebar, click **Secrets and variables** → **Actions**

3. **Add Repository Secrets**
   - Click **New repository secret** button
   - Add these 3 secrets one by one:

   ### Secret 1: AIRTABLE_API_KEY
   - Name: `AIRTABLE_API_KEY`
   - Value: Copy from your local `blog/config.js` → `BLOG_CONFIG.AIRTABLE_API_KEY`
   - Click **Add secret**

   ### Secret 2: AIRTABLE_BASE_ID
   - Name: `AIRTABLE_BASE_ID`
   - Value: Copy from your local `blog/config.js` → `BLOG_CONFIG.AIRTABLE_BASE_ID`
   - Click **Add secret**

   ### Secret 3: AIRTABLE_TABLE_NAME
   - Name: `AIRTABLE_TABLE_NAME`
   - Value: Copy from your local `blog/config.js` → `BLOG_CONFIG.AIRTABLE_TABLE_NAME` (usually `Posts`)
   - Click **Add secret**

---

## Step 2: Trigger a New Deployment

After adding all three secrets:

1. **Option A: Automatic (Recommended)**
   - Just push this commit to GitHub
   - GitHub Actions will automatically run and deploy

2. **Option B: Manual**
   - Go to **Actions** tab in your repository
   - Click on "Deploy static content to Pages" workflow
   - Click **Run workflow** button
   - Click the green **Run workflow** button

---

## Step 3: Verify It's Working

1. **Check the deployment**
   - Go to **Actions** tab
   - Watch the workflow run (should take 1-2 minutes)
   - Make sure it completes successfully (green checkmark ✅)

2. **Test your blog**
   - Visit: https://taastee.com/blog/blog.html
   - Your blog post from Airtable should now appear!
   - Open browser console (F12) - you should see: "Loaded 1 posts from Airtable"

---

## 🔒 Security

- Your API keys are stored as **GitHub Secrets** (encrypted)
- They're never committed to the repository
- The `config.js` file is generated during the GitHub Actions workflow
- It's only created during deployment, never stored in git

---

## 📝 How It Works

1. When you push to GitHub, the workflow runs
2. It generates `blog/config.js` from your secrets
3. It deploys the site to GitHub Pages with the config file included
4. Your blog loads posts from Airtable using these credentials

---

## ❓ Troubleshooting

**Problem:** Blog shows "No posts found" or "BLOG_CONFIG is not defined"
- Check that all 3 secrets are added correctly in GitHub
- Make sure secret names are EXACT (case-sensitive)
- Re-run the workflow after adding secrets

**Problem:** Workflow fails
- Check the workflow logs in the Actions tab
- Make sure you added all 3 secrets
- Verify the secret values are correct

**Problem:** DNS Check in Progress
- This is normal for custom domains
- Give it 24-48 hours for DNS to propagate
- Your blog should still work

---

## 🎉 Success!

Once the workflow completes successfully, your blog will be live at:
- https://taastee.com/blog/blog.html

And you can manage all your blog posts directly in Airtable!

