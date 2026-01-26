# Deployment Guide - LYNCK Website

## Environment Variables Setup

### Required Environment Variables

The contact form requires a Web3Forms API key to be set as an environment variable:

```
WEB3FORMS_ACCESS_KEY=your_web3forms_api_key_here
```

### Setting Up Environment Variables

#### For Vercel Deployment:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** > **Environment Variables**
3. Add the following variable:
   - **Name**: `WEB3FORMS_ACCESS_KEY`
   - **Value**: `6163bfe5-5cc2-4c37-b6c0-af5239e19415` (your current key)
   - **Environment**: Production, Preview, Development (select all)
4. Click **Save**
5. Redeploy your site for changes to take effect

#### For Netlify Deployment:

1. Go to your Netlify site dashboard
2. Navigate to **Site settings** > **Build & deploy** > **Environment**
3. Click **Edit variables**
4. Add:
   - **Key**: `WEB3FORMS_ACCESS_KEY`
   - **Value**: `6163bfe5-5cc2-4c37-b6c0-af5239e19415`
5. Click **Save**
6. Trigger a new deployment

#### For Local Development:

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your API key:
   ```
   WEB3FORMS_ACCESS_KEY=6163bfe5-5cc2-4c37-b6c0-af5239e19415
   ```

3. **Important**: Never commit the `.env` file to git (it's already in `.gitignore`)

## API Endpoint

The contact form now uses a serverless function located at `/api/contact.js`:

- **Endpoint**: `/api/contact`
- **Method**: POST
- **Content-Type**: application/json
- **Body**: Form data as JSON object

### Testing the API

To test the contact form locally:

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Run the development server:
   ```bash
   vercel dev
   ```

3. Open your browser to `http://localhost:3000`
4. Test the contact form

## Security Benefits

✅ **Before**: API key exposed in client-side JavaScript
✅ **After**: API key securely stored on server-side

This prevents:
- Unauthorized use of your Web3Forms account
- Rate limit abuse
- API key theft from browser inspection

## Troubleshooting

### Form Submission Fails

1. Check that the environment variable is set correctly in your deployment platform
2. Check browser console for errors
3. Verify the serverless function is deployed correctly
4. Check Vercel/Netlify function logs for backend errors

### Local Development Issues

1. Ensure `.env` file exists with the correct API key
2. Use `vercel dev` instead of a simple HTTP server
3. Check that the API route is accessible at `/api/contact`

## Migration Checklist

- [x] Create serverless API endpoint (`/api/contact.js`)
- [x] Remove exposed API key from client code
- [x] Update form submission to use backend endpoint
- [x] Add environment variable configuration
- [ ] Set environment variable in production (Vercel/Netlify)
- [ ] Test contact form in production
- [ ] Monitor function logs for errors
