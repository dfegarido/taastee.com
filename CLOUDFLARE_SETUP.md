# Cloudflare Pages Setup Guide

## 🚀 Setting Up Your Blog with Cloudflare Pages

Your blog uses Airtable for content management. Follow these steps to configure it securely on Cloudflare Pages.

---

## Step 1: Configure Environment Variables in Cloudflare

1. **Go to your Cloudflare Dashboard**
   - Visit: https://dash.cloudflare.com/
   - Select your account
   - Go to **Pages** → Select your **taastee.com** project

2. **Add Environment Variables**
   - Click on **Settings** tab
   - Scroll down to **Environment Variables**
   - Click **Add variable** and add these three variables:
   
   **Get the values from your local `blog/config.js` file:**

   | Variable Name | Where to find the value |
   |---------------|-------------------------|
   | `AIRTABLE_API_KEY` | Copy from `BLOG_CONFIG.AIRTABLE_API_KEY` in your local `blog/config.js` |
   | `AIRTABLE_BASE_ID` | Copy from `BLOG_CONFIG.AIRTABLE_BASE_ID` in your local `blog/config.js` |
   | `AIRTABLE_TABLE_NAME` | Copy from `BLOG_CONFIG.AIRTABLE_TABLE_NAME` in your local `blog/config.js` (usually `Posts`) |

3. **Apply to Production**
   - Make sure to select **Production** environment for each variable
   - Click **Save**

---

## Step 2: Configure Build Settings

1. **In Cloudflare Pages Settings**
   - Go to **Settings** → **Builds & deployments**

2. **Set Build Configuration**
   - **Build command:** `./build.sh`
   - **Build output directory:** `/` (or leave as root)
   - **Root directory:** `/` (leave empty)

3. **Save the settings**

---

## Step 3: Deploy

After saving your environment variables and build settings:

1. **Trigger a new deployment**
   - Go to **Deployments** tab
   - Click **Retry deployment** on the latest deployment
   - OR push a new commit to trigger auto-deployment

2. **Verify the blog works**
   - Visit: https://taastee.com/blog/blog.html
   - Your blog posts should load from Airtable!

---

## 🔒 Security Note

- The `config.js` file is **NOT** committed to git (it's in `.gitignore`)
- It's generated during build time from environment variables
- This keeps your API key secure

---

## 🧪 Testing Locally

To test locally, the `config.js` file already exists in your local `/blog` folder, so it will work without the build script.

---

## ❓ Troubleshooting

**Problem:** Blog shows "No posts found"
- Check browser console (F12) for errors
- Verify environment variables are set correctly in Cloudflare
- Trigger a new deployment after setting variables

**Problem:** "BLOG_CONFIG is not defined"
- The build script didn't run
- Check build logs in Cloudflare Pages
- Ensure build command is set to `./build.sh`

