#!/usr/bin/env node

/**
 * Simple Translation Audit Tool (No Dependencies)
 *
 * Scans HTML files to find missing translations by:
 * 1. Finding all data-translate keys in use
 * 2. Checking if they exist in translations.js for both EN and DE
 * 3. Reporting missing translations
 */

const fs = require('fs');
const path = require('path');

const HTML_FILES = [
  'index.html',
  'google-ads.html',
  'custom-website.html',
  'digital-products.html',
  'learning-platform.html',
  'portfolio.html',
  'pricing.html',
  'why-choose-us.html',
  'de/index.html',
  'de/google-ads.html',
  'de/custom-website.html',
  'de/digital-products.html',
  'de/learning-platform.html',
  'de/portfolio.html',
  'de/why-choose-us.html'
];

console.log('🔍 Translation Audit Tool (Simple)\n');
console.log('━'.repeat(70));

// Extract all data-translate keys from HTML files
function extractTranslationKeys() {
  const keys = new Set();
  const keysByFile = {};

  HTML_FILES.forEach(file => {
    if (!fs.existsSync(file)) {
      console.log(`⚠️  ${file} not found, skipping...`);
      return;
    }

    const content = fs.readFileSync(file, 'utf8');
    const regex = /data-translate="([^"]+)"/g;
    let match;
    const fileKeys = [];

    while ((match = regex.exec(content)) !== null) {
      keys.add(match[1]);
      fileKeys.push(match[1]);
    }

    keysByFile[file] = fileKeys;
  });

  return { allKeys: Array.from(keys), keysByFile };
}

// Load translations from js/translations.js
function loadTranslations() {
  const translationsFile = 'js/translations.js';

  if (!fs.existsSync(translationsFile)) {
    console.error('❌ translations.js not found!');
    process.exit(1);
  }

  const content = fs.readFileSync(translationsFile, 'utf8');

  const translations = {
    en: new Set(),
    de: new Set()
  };

  // Extract EN keys
  const enMatch = content.match(/en:\s*\{([^}]+(?:\}[^}]+)*)\}/s);
  if (enMatch) {
    const enContent = enMatch[1];
    const keyRegex = /"([^"]+)":/g;
    let match;
    while ((match = keyRegex.exec(enContent)) !== null) {
      translations.en.add(match[1]);
    }
  }

  // Extract DE keys
  const deMatch = content.match(/de:\s*\{([^}]+(?:\}[^}]+)*)\}/s);
  if (deMatch) {
    const deContent = deMatch[1];
    const keyRegex = /"([^"]+)":/g;
    let match;
    while ((match = keyRegex.exec(deContent)) !== null) {
      translations.de.add(match[1]);
    }
  }

  return translations;
}

// Main execution
function main() {
  console.log('📊 Step 1: Extracting translation keys from HTML files...\n');

  const { allKeys, keysByFile } = extractTranslationKeys();

  console.log(`✅ Found ${allKeys.length} unique translation keys in use\n`);

  console.log('📊 Step 2: Loading translations from js/translations.js...\n');

  const translations = loadTranslations();

  console.log(`✅ EN translations defined: ${translations.en.size}`);
  console.log(`✅ DE translations defined: ${translations.de.size}\n`);

  // Find missing translations
  console.log('━'.repeat(70));
  console.log('🔍 Step 3: Checking for missing translations...\n');

  const missingEN = allKeys.filter(key => !translations.en.has(key));
  const missingDE = allKeys.filter(key => !translations.de.has(key));

  if (missingEN.length > 0) {
    console.log(`❌ Missing English Translations: ${missingEN.length}`);
    console.log('━'.repeat(70));
    missingEN.forEach(key => {
      console.log(`  - "${key}"`);
      // Show which files use this key
      const filesUsingKey = Object.keys(keysByFile).filter(file =>
        keysByFile[file].includes(key)
      );
      console.log(`    Used in: ${filesUsingKey.join(', ')}`);
    });
    console.log('');
  } else {
    console.log('✅ All keys have English translations\n');
  }

  if (missingDE.length > 0) {
    console.log(`❌ Missing German Translations: ${missingDE.length}`);
    console.log('━'.repeat(70));
    missingDE.forEach(key => {
      console.log(`  - "${key}"`);
    });
    console.log('');
  } else {
    console.log('✅ All keys have German translations\n');
  }

  // Check for unused translations
  const usedKeys = new Set(allKeys);
  const unusedEN = Array.from(translations.en).filter(key => !usedKeys.has(key));
  const unusedDE = Array.from(translations.de).filter(key => !usedKeys.has(key));

  if (unusedEN.length > 0) {
    console.log(`⚠️  Unused English Translations: ${unusedEN.length}`);
    console.log('━'.repeat(70));
    unusedEN.slice(0, 10).forEach(key => {
      console.log(`  - "${key}" (not used in any HTML file)`);
    });
    if (unusedEN.length > 10) {
      console.log(`  ... and ${unusedEN.length - 10} more`);
    }
    console.log('');
  }

  // Summary
  console.log('━'.repeat(70));
  console.log('📋 SUMMARY');
  console.log('━'.repeat(70));
  console.log(`Translation keys in use:        ${allKeys.length}`);
  console.log(`EN translations defined:        ${translations.en.size}`);
  console.log(`DE translations defined:        ${translations.de.size}`);
  console.log(`Missing EN translations:        ${missingEN.length}`);
  console.log(`Missing DE translations:        ${missingDE.length}`);
  console.log(`Unused EN translations:         ${unusedEN.length}`);
  console.log('━'.repeat(70));

  if (missingEN.length === 0 && missingDE.length === 0) {
    console.log('\n✅ SUCCESS: All translation keys are properly defined!');
  } else {
    console.log('\n⚠️  ACTION NEEDED: Add missing translations to js/translations.js');
  }
}

// Run
if (require.main === module) {
  main();
}
