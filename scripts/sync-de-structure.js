#!/usr/bin/env node

/**
 * Quick Structure Sync Tool
 * Copies EN HTML structure to DE, adjusting paths for German pages
 */

const fs = require('fs');

function syncStructure(enFile, deFile) {
  console.log(`\n=== Syncing ${enFile} → ${deFile} ===\n`);

  let content = fs.readFileSync(enFile, 'utf8');

  // Adjust paths for DE folder structure
  const adjustments = [
    // CSS paths
    { from: 'href="css/', to: 'href="../css/' },
    { from: 'href="assets/', to: 'href="../assets/' },

    // JS paths
    { from: 'src="js/', to: 'src="../js/' },

    // Image paths (if not absolute URLs)
    { from: 'src="assets/', to: 'src="../assets/' },
    { from: 'src="images/', to: 'src="../images/' },

    // Internal links
    { from: 'href="index.html"', to: 'href="index.html"' }, // Keep same
    { from: 'href="google-ads.html"', to: 'href="google-ads.html"' },
    { from: 'href="portfolio.html"', to: 'href="portfolio.html"' },
    { from: 'href="pricing.html"', to: 'href="pricing.html"' },
    { from: 'href="why-choose-us.html"', to: 'href="why-choose-us.html"' },
    { from: 'href="custom-website.html"', to: 'href="custom-website.html"' },
    { from: 'href="digital-products.html"', to: 'href="digital-products.html"' },
    { from: 'href="learning-platform.html"', to: 'href="learning-platform.html"' },

    // Lang attribute
    { from: 'lang="en"', to: 'lang="de"' },

    // Canonical URLs (keep DE structure)
    { from: 'https://lynckstudio.com/"', to: 'https://lynckstudio.com/de/"' },
    { from: 'https://lynckstudio.com/>', to: 'https://lynckstudio.com/de/>' }
  ];

  // Apply all adjustments
  adjustments.forEach(({ from, to }) => {
    content = content.split(from).join(to);
  });

  // Write to DE file
  fs.writeFileSync(deFile, content, 'utf8');

  console.log(`✅ Structure copied successfully`);
  console.log(`📝 File size: ${(content.length / 1024).toFixed(2)} KB`);
  console.log(`⚠️  Remember to translate text content to German!`);

  return true;
}

// Main execution
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.log('Usage: node sync-de-structure.js <en-file> <de-file>');
    console.log('Example: node sync-de-structure.js index.html de/index.html');
    process.exit(1);
  }

  const [enFile, deFile] = args;

  if (!fs.existsSync(enFile)) {
    console.error(`❌ Source file not found: ${enFile}`);
    process.exit(1);
  }

  syncStructure(enFile, deFile);
}

module.exports = { syncStructure };
