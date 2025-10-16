#!/usr/bin/env node

/**
 * Find Untranslated Text Tool
 *
 * Scans HTML files to find text content that doesn't have data-translate attributes.
 * This helps identify text that won't be translated when switching languages.
 *
 * Usage: node scripts/find-untranslated-text.js [filename]
 */

const fs = require('fs');

const HTML_FILES = [
  'index.html',
  'google-ads.html',
  'custom-website.html',
  'digital-products.html',
  'learning-platform.html',
  'portfolio.html',
  'pricing.html',
  'why-choose-us.html'
];

// Tags that typically contain user-visible text
const TEXT_TAGS = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'a', 'button', 'li', 'td', 'th', 'label', 'div'];

// Patterns to ignore
const IGNORE_PATTERNS = [
  /^\s*$/,                    // Empty or whitespace only
  /^[\d\s\W]+$/,              // Only numbers, spaces, and symbols
  /^[<>{}[\]()]+$/,           // Only brackets/symbols
  /^\$\{.*\}$/,               // Template literals
  /^https?:\/\//,             // URLs
  /^\/[a-z]/,                 // Paths
  /^\d{1,2}:\d{2}/,          // Times
  /^#[a-zA-Z]/,              // IDs/Anchors
];

function extractTextFromTag(tag, content) {
  const texts = [];
  const tagRegex = new RegExp(`<${tag}([^>]*)>(.*?)<\/${tag}>`, 'gis');
  let match;

  while ((match = tagRegex.exec(content)) !== null) {
    const attributes = match[1];
    const innerContent = match[2];

    // Skip if has data-translate
    if (attributes.includes('data-translate')) continue;

    // Skip if contains only HTML tags (no actual text)
    const textOnly = innerContent.replace(/<[^>]+>/g, ' ').trim();

    // Skip if matches ignore patterns
    if (IGNORE_PATTERNS.some(pattern => pattern.test(textOnly))) continue;

    // Skip very short text
    if (textOnly.length < 3) continue;

    texts.push({
      tag,
      text: textOnly.substring(0, 100), // Limit preview length
      hasDataTranslate: false
    });
  }

  return texts;
}

function findLineNumber(content, text) {
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(text.substring(0, 30))) {
      return i + 1;
    }
  }
  return '?';
}

function analyzeFile(filename) {
  if (!fs.existsSync(filename)) {
    console.log(`❌ File not found: ${filename}`);
    return [];
  }

  const content = fs.readFileSync(filename, 'utf8');
  const untranslatedTexts = [];

  TEXT_TAGS.forEach(tag => {
    const texts = extractTextFromTag(tag, content);
    texts.forEach(item => {
      untranslatedTexts.push({
        ...item,
        file: filename,
        line: findLineNumber(content, item.text)
      });
    });
  });

  return untranslatedTexts;
}

function main() {
  const targetFile = process.argv[2];

  console.log('🔍 Finding Untranslated Text\n');
  console.log('━'.repeat(70));

  const filesToCheck = targetFile ? [targetFile] : HTML_FILES;

  let totalUntranslated = 0;
  const reportByFile = {};

  filesToCheck.forEach(file => {
    const untranslated = analyzeFile(file);
    totalUntranslated += untranslated.length;
    reportByFile[file] = untranslated;

    if (untranslated.length > 0) {
      console.log(`\n📄 ${file}`);
      console.log(`   Found ${untranslated.length} untranslated text elements`);
      console.log('   ' + '─'.repeat(66));

      untranslated.slice(0, 10).forEach(({ tag, text, line }) => {
        const preview = text.length > 60 ? text.substring(0, 60) + '...' : text;
        console.log(`   Line ${String(line).padEnd(4)} <${tag.padEnd(6)}> "${preview}"`);
      });

      if (untranslated.length > 10) {
        console.log(`   ... and ${untranslated.length - 10} more elements`);
      }
    } else {
      console.log(`\n✅ ${file}: All text elements have data-translate`);
    }
  });

  // Summary
  console.log('\n' + '━'.repeat(70));
  console.log('📊 SUMMARY');
  console.log('━'.repeat(70));
  console.log(`Files analyzed:              ${filesToCheck.length}`);
  console.log(`Total untranslated elements: ${totalUntranslated}`);
  console.log('━'.repeat(70));

  if (totalUntranslated > 0) {
    console.log('\n⚠️  RECOMMENDATION:');
    console.log('Add data-translate attributes to these elements for full translation support.');
    console.log('\nExample:');
    console.log('  Before: <h2>Our Services</h2>');
    console.log('  After:  <h2 data-translate="Our Services">Our Services</h2>');
  } else {
    console.log('\n✅ SUCCESS: All text elements are translatable!');
  }

  // Return count for CI/CD integration
  return totalUntranslated;
}

// Run
if (require.main === module) {
  const exitCode = main();
  process.exit(exitCode > 0 ? 1 : 0);
}

module.exports = { analyzeFile };
