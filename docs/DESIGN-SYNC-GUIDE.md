# Design Synchronization Guide

## Problem Statement

The website supports **English** and **German** languages with separate HTML files:
- English: `index.html`, `google-ads.html`, etc.
- German: `de/index.html`, `de/google-ads.html`, etc.

### Current Issues:

1. **Design Drift**: When updating English pages with new layouts/features, German pages stay outdated
2. **Incomplete Translation**: New content added without `data-translate` attributes stays in English even on German pages

## Solution: Hybrid Approach

Instead of a full static site generator (Eleventy was removed as incomplete), we use a **component-based + validation** approach.

---

## Part 1: Keeping Designs in Sync

### Current Setup

✅ **Shared Components** (Already Implemented):
- `js/navigation-loader.js` (`NAVIGATION_TEMPLATE`) - Site navigation injected onto every page
- `js/contact-modal-loader.js` (`CONTACT_MODAL_TEMPLATE`) - Contact form modal shared site-wide

Both EN and DE pages include these loaders, so updating the inline templates updates every page without duplicate markup or runtime fetches.

### When Updating Page Designs

**Best Practice: Update Both Languages Together**

When you modify a page (e.g., `google-ads.html`):

1. **Make structural changes to both files:**
   ```bash
   # Edit English version
   vim google-ads.html

   # IMMEDIATELY edit German version with same structure
   vim de/google-ads.html
   ```

2. **Keep layout/HTML identical, only change text content**

3. **Use `data-translate` for all user-visible text:**
   ```html
   <!-- English -->
   <h2 data-translate="Our Services">Our Services</h2>

   <!-- German -->
   <h2 data-translate="Our Services">Unsere Dienstleistungen</h2>
   ```

### Design Sync Checklist

Before committing changes:

- [ ] Both EN and DE files have identical HTML structure
- [ ] All text uses `data-translate` attributes
- [ ] Run `node scripts/audit-translations-simple.js` to verify translations exist
- [ ] Test both languages in browser

---

## Part 2: Translation Coverage

### Translation System

**How it works:**
1. HTML elements have `data-translate="Key"` attributes
2. `js/translations.js` contains key-value pairs for EN and DE
3. JavaScript swaps text when language changes

⚠️ `/de` pages now include their German copy directly and no longer load `js/translations.js`. Keep the `data-translate` attributes in those files for reference with the EN keys, but always update the visible German text manually.

### Adding New Content

**Step 1: Add HTML with `data-translate`**

```html
<!-- ❌ BAD: Will not translate -->
<p>This is new content</p>

<!-- ✅ GOOD: Will translate -->
<p data-translate="This is new content">This is new content</p>
```

**Step 2: Add translations to `js/translations.js`**

```javascript
const translations = {
  en: {
    "This is new content": "This is new content"
  },
  de: {
    "This is new content": "Dies ist neuer Inhalt"
  }
};
```

### Audit Tools

**Check for missing translations:**
```bash
node scripts/audit-translations-simple.js
```

Output:
```
✅ All keys have English translations
✅ All keys have German translations
Translation keys in use: 27
```

**Find untranslated text:**
```bash
node scripts/find-untranslated-text.js google-ads.html
```

Output shows elements without `data-translate`:
```
📄 google-ads.html
   Found 15 untranslated text elements
   Line 105  <h2> "Google Ads Management"
   Line 223  <p> "Real Ads Inside Real Videos"
```

---

## Part 3: Component Extraction (Future)

### When to Extract Components

Extract repeated sections into reusable components when:
- Content appears in 3+ pages
- Layout is identical across languages
- Updates need to be synchronized

### How to Extract

**Example: Hero Section**

1. **Create component:**
   ```bash
   # Create file
   touch components/hero.html
   ```

2. **Add parameterized HTML:**
   ```html
   <!-- components/hero.html -->
   <section id="heroSection" class="...">
     <h1 data-translate="{{titleKey}}">{{defaultTitle}}</h1>
     <p data-translate="{{descKey}}">{{defaultDesc}}</p>
   </section>
   ```

3. **Load in pages:**
   ```javascript
   // Load hero with parameters
   loadComponent('hero', {
     titleKey: 'Hero Title',
     descKey: 'Hero Description',
     defaultTitle: 'Welcome',
     defaultDesc: 'Get started'
   });
   ```

**Note:** This is a future enhancement. Current setup works well with manual sync.

---

## Part 4: Pre-Commit Validation (Recommended)

### Git Hook Setup

Add this to `.git/hooks/pre-commit`:

```bash
#!/bin/bash

echo "Running translation audit..."
node scripts/audit-translations-simple.js

if [ $? -ne 0 ]; then
  echo "❌ Translation audit failed!"
  echo "Run: node scripts/audit-translations-simple.js for details"
  exit 1
fi

echo "✅ All translations valid"
```

Make executable:
```bash
chmod +x .git/hooks/pre-commit
```

This prevents commits with missing translations.

---

## Quick Reference

### Commands

| Task | Command |
|------|---------|
| Check translations | `node scripts/audit-translations-simple.js` |
| Find untranslated text | `node scripts/find-untranslated-text.js [file]` |
| Test EN/DE switching | Open `http://localhost:8080` and toggle language |

### File Structure

```
lynckwebsite/
├── index.html              # English homepage
├── google-ads.html         # English service page
├── de/
│   ├── index.html         # German homepage (same structure as EN)
│   └── google-ads.html    # German service page (same structure as EN)
├── js/
│   ├── translations.js    # EN/DE translation key-value pairs
│   ├── navigation-loader.js  # Inline nav template + routing logic
│   └── contact-modal-loader.js # Inline modal template + form logic
└── scripts/
    ├── audit-translations-simple.js
    └── find-untranslated-text.js
```

### Best Practices

1. ✅ **Always update EN and DE together**
2. ✅ **Use `data-translate` for all user-visible text**
3. ✅ **Run audit tools before committing**
4. ✅ **Test both languages in browser**
5. ✅ **Keep HTML structure identical between languages**

---

## Troubleshooting

### German Page Shows English Text

**Cause:** Missing `data-translate` attribute or missing translation in `js/translations.js`

**Fix:**
1. Run: `node scripts/find-untranslated-text.js de/yourpage.html`
2. Add `data-translate` to elements
3. Add translations to `js/translations.js`

### Design Looks Different in DE Version

**Cause:** HTML structure differs between EN and DE files

**Fix:**
1. Compare files: `diff index.html de/index.html`
2. Sync HTML structure
3. Keep only text content different

### Translation Key Not Found

**Cause:** Key used in HTML but not defined in `js/translations.js`

**Fix:**
1. Run: `node scripts/audit-translations-simple.js`
2. Add missing keys to both `en` and `de` sections

---

## Summary

✅ **No Eleventy needed** - Simple HTML with JavaScript translations
✅ **Audit tools** - Catch missing translations before they go live
✅ **Component system** - Navigation and modal already extracted
✅ **Manual sync** - Update EN and DE together (faster than full build system)

This approach solves both problems:
1. **Design drift** - Manual sync with audit tools ensures consistency
2. **Translation coverage** - Tools find and report untranslated content
