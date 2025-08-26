# Chrome Extension Installation Guide

## Quick Installation Steps

### 1. Open Chrome Extensions Page
- Open Google Chrome
- Navigate to `chrome://extensions/`
- Or go to Chrome menu → More tools → Extensions

### 2. Enable Developer Mode
- Toggle the "Developer mode" switch in the top-right corner
- This will show additional options for loading unpacked extensions

### 3. Load the Extension
- Click "Load unpacked" button
- Navigate to this project folder: `/Users/edward/Library/Mobile Documents/com~apple~CloudDocs/Cursor/CliffDive Analytics`
- Select the folder and click "Select Folder"

### 4. Verify Installation
- The extension should appear in your extensions list
- You should see "CliffDive AI Analytics" with version 1.0.0
- The extension icon should appear in your Chrome toolbar

### 5. Test the Extension
- Click the extension icon in the toolbar to open the popup
- Or open `test.html` in Chrome to test AI platform detection

## Troubleshooting

### If the extension doesn't load:

1. **Check for errors in the extensions page**
   - Look for any red error messages
   - Click "Errors" button if available

2. **Verify file structure**
   - Make sure all these files exist in the project folder:
     - `manifest.json`
     - `background.js`
     - `content.js`
     - `popup.html`
     - `popup.css`
     - `popup.js`
     - `dashboard.html`
     - `dashboard.css`
     - `dashboard.js`

3. **Check file permissions**
   - Make sure all files are readable by Chrome

4. **Reload the extension**
   - Click the refresh icon on the extension card
   - Or remove and reload the extension

### Common Issues:

- **"Manifest file is missing or unreadable"**: Check that `manifest.json` exists and is valid JSON
- **"Background script failed to load"**: Check that `background.js` exists and has no syntax errors
- **"Content script failed to load"**: Check that `content.js` exists and has no syntax errors

## Testing the Extension

1. **Open the test page**: Load `test.html` in Chrome
2. **Check extension communication**: Use the "Check Extension" button
3. **Simulate AI interactions**: Use the test controls to simulate various AI platform interactions
4. **View analytics**: Click the extension icon to see the popup dashboard

## File Structure Verification

Run this command in the project directory to verify all required files are present:

```bash
ls -la manifest.json background.js content.js popup.html popup.css popup.js dashboard.html dashboard.css dashboard.js
```

All files should be present and have non-zero file sizes.

## Next Steps

Once the extension is loaded successfully:

1. **Configure privacy settings** in the extension popup
2. **Visit AI platforms** like ChatGPT, Claude, etc. to test detection
3. **Open the dashboard** for comprehensive analytics
4. **Export data** to verify data collection is working

## Support

If you continue to have issues:

1. Check the Chrome DevTools console for any JavaScript errors
2. Verify that all files have the correct content
3. Try loading the extension in a fresh Chrome profile
4. Check that Chrome version is 88 or higher (required for Manifest V3) 