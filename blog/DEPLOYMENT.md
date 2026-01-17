# Blog Deployment Instructions

## Important: config.js File

The `config.js` file contains your Airtable API credentials and is **NOT** tracked in git for security reasons.

### For Production Deployment:

After pushing your code to production, you need to manually upload the `config.js` file to your server:

1. **Copy the config.js file** from your local `blog/` directory
2. **Upload it** to your production server at: `blog/config.js`
3. **Verify** the file is accessible at: `https://taastee.com/blog/config.js`

### Config.js Content:

The config.js file should contain your Airtable credentials. Copy it from your local `blog/config.js` file.

### Alternative: Use FTP/SFTP

If you're using FTP or SFTP to deploy:
1. After git push, connect via FTP/SFTP
2. Upload `blog/config.js` manually
3. Ensure file permissions are correct (644)

### Verifying Deployment:

1. Visit https://taastee.com/blog/blog.html
2. Open browser console (F12)
3. You should see: "Loaded X posts from Airtable"
4. If you see "BLOG_CONFIG is not defined", the config.js file is missing

## Security Note:

Never commit `config.js` to git as it contains sensitive API keys. The file is listed in `.gitignore` to prevent accidental commits.

