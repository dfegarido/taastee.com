#!/bin/bash
# Build script for Cloudflare Pages
# Generates config.js from environment variables

echo "Generating blog/config.js from environment variables..."

cat > blog/config.js << EOF
// Airtable Configuration
// Generated from environment variables during build

const BLOG_CONFIG = {
    AIRTABLE_API_KEY: '${AIRTABLE_API_KEY}',
    AIRTABLE_BASE_ID: '${AIRTABLE_BASE_ID}',
    AIRTABLE_TABLE_NAME: '${AIRTABLE_TABLE_NAME}'
};
EOF

echo "✅ blog/config.js generated successfully"

