#!/usr/bin/env node

/**
 * Translation Audit Tool
 *
 * Scans HTML files to find:
 * 1. Text content without data-translate attributes
 * 2. Missing German translations in js/translations.js
 * 3. Untranslated elements in German pages
 *
 * Usage: node scripts/audit-translations.js
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// Configuration
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

const GERMAN_FILES = HTML_FILES.map(file => `de/${file}`);
const TRANSLATIONS_FILE = 'js/translations.js';

// Elements to ignore
const IGNORE_TAGS = ['script', 'style', 'noscript', 'svg', 'path', 'meta', 'link'];
const IGNORE_SELECTORS = [
  '[data-translate]', // Already has translation
  'code',
  'pre',
  '.hljs', // Code highlighting
  '[class*="icon"]',
  '[aria-hidden="true"]'
];

console.log('🔍 Translation Audit Tool\n');
console.log('━'.repeat(60));

// Step 1: Load translations from js/translations.js
function loadTranslations() {
  const translationsContent = fs.readFileSync(TRANSLATIONS_FILE, 'utf8');
  const translationsMatch = translationsContent.match(/const translations = ({[\s\S]*?});/);

  if (!translationsMatch) {
    console.error('❌ Could not parse translations.js');
    process.exit(1);
  }

  // Simple parsing (not using eval for security)
  const translations = {
    en: {},
    de: {}
  };

  // Extract EN translations
  const enMatch = translationsContent.match(/en:\s*{([\s\S]*?)},\s*de:/);
  if (enMatch) {
    const enContent = enMatch[1];
    const keyValueRegex = /"([^"]+)":\s*"([^"]+)"/g;
    let match;
    while ((match = keyValueRegex.exec(enContent)) !== null) {
      translations.en[match[1]] = match[2];
    }
  }

  // Extract DE translations
  const deMatch = translationsContent.match(/de:\s*{([\s\S]*?)}\s*};/);
  if (deMatch) {
    const deContent = deMatch[1];
    const keyValueRegex = /"([^"]+)":\s*"([^"]+)"/g;
    let match;
    while ((match = keyValueRegex.exec(deContent)) !== null) {
      translations.de[match[1]] = match[2];
    }
  }

  return translations;
}

// Step 2: Find text nodes without data-translate
function findUntranslatedText(htmlFile) {
  const htmlContent = fs.readFileSync(htmlFile, 'utf8');
  const dom = new JSDOM(htmlContent);
  const document = dom.window.document;

  const untranslated = [];

  // Helper to check if element should be ignored
  function shouldIgnore(element) {
    if (IGNORE_TAGS.includes(element.tagName.toLowerCase())) return true;

    for (const selector of IGNORE_SELECTORS) {
      if (element.matches && element.matches(selector)) return true;
    }

    return false;
  }

  // Recursive text node finder
  function findTextNodes(node) {
    if (node.nodeType === 3) { // TEXT_NODE
      const text = node.textContent.trim();
      const parent = node.parentElement;

      if (text.length > 0 &&
          parent &&
          !shouldIgnore(parent) &&
          !parent.hasAttribute('data-translate')) {

        // Skip if text is just whitespace, numbers, or symbols
        if (/^[\s\d\W]+$/.test(text)) return;

        // Skip very short text (likely labels/icons)
        if (text.length < 3) return;

        untranslated.push({
          text,
          tag: parent.tagName.toLowerCase(),
          class: parent.className || '(no class)',
          line: findLineNumber(htmlContent, text)
        });
      }
    }

    // Recurse for element nodes
    if (node.nodeType === 1 && !shouldIgnore(node)) {
      Array.from(node.childNodes).forEach(findTextNodes);
    }
  }

  findTextNodes(document.body);
  return untranslated;
}

// Helper to find approximate line number
function findLineNumber(content, text) {
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(text)) {
      return i + 1;
    }
  }
  return '?';
}

// Step 3: Check for missing German translations
function checkMissingTranslations(translations) {
  const missing = [];

  for (const key in translations.en) {
    if (!translations.de[key]) {
      missing.push({
        key,
        enText: translations.en[key]
      });
    }
  }

  return missing;
}

// Main execution
function main() {
  const translations = loadTranslations();

  console.log(`📊 Loaded ${Object.keys(translations.en).length} EN translations`);
  console.log(`📊 Loaded ${Object.keys(translations.de).length} DE translations\n`);

  // Check for missing DE translations
  const missingTranslations = checkMissingTranslations(translations);

  if (missingTranslations.length > 0) {
    console.log(`⚠️  Missing German Translations: ${missingTranslations.length}`);
    console.log('━'.repeat(60));
    missingTranslations.slice(0, 10).forEach(({ key, enText }) => {
      console.log(`  "${key}": "${enText}"`);
    });
    if (missingTranslations.length > 10) {
      console.log(`  ... and ${missingTranslations.length - 10} more`);
    }
    console.log('');
  } else {
    console.log('✅ All keys have German translations\n');
  }

  // Audit English pages
  console.log('🔍 Auditing English Pages');
  console.log('━'.repeat(60));

  let totalUntranslated = 0;

  HTML_FILES.forEach(file => {
    if (!fs.existsSync(file)) {
      console.log(`⚠️  ${file} not found`);
      return;
    }

    const untranslated = findUntranslatedText(file);
    totalUntranslated += untranslated.length;

    if (untranslated.length > 0) {
      console.log(`\n❌ ${file}: ${untranslated.length} untranslated elements`);
      untranslated.slice(0, 5).forEach(({ text, tag, line }) => {
        const preview = text.length > 60 ? text.substring(0, 60) + '...' : text;
        console.log(`   Line ${line}: <${tag}> "${preview}"`);
      });
      if (untranslated.length > 5) {
        console.log(`   ... and ${untranslated.length - 5} more`);
      }
    } else {
      console.log(`✅ ${file}: All elements have data-translate`);
    }
  });

  // Summary
  console.log('\n' + '━'.repeat(60));
  console.log('📋 SUMMARY');
  console.log('━'.repeat(60));
  console.log(`Total EN translations: ${Object.keys(translations.en).length}`);
  console.log(`Total DE translations: ${Object.keys(translations.de).length}`);
  console.log(`Missing DE translations: ${missingTranslations.length}`);
  console.log(`Untranslated elements in EN pages: ${totalUntranslated}`);

  if (missingTranslations.length === 0 && totalUntranslated === 0) {
    console.log('\n✅ All pages are fully translatable!');
  } else {
    console.log('\n⚠️  Action needed: Add data-translate attributes and German translations');
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { loadTranslations, findUntranslatedText, checkMissingTranslations };
