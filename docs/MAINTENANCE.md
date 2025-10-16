# Website Maintenance Guide

## Quick Start

### Daily Tasks

**Before making changes:**
```bash
# 1. Check translation status
node scripts/audit-translations-simple.js

# 2. Find any untranslated text
node scripts/find-untranslated-text.js
```

**After making changes:**
```bash
# 1. Run audits again
node scripts/audit-translations-simple.js

# 2. Test locally
python3 -m http.server 8080
# Open: http://localhost:8080

# 3. Test language switching (click DE/EN toggle)
```

---

## Common Tasks

### 1. Adding a New Page

**Steps:**
1. Create English version: `new-page.html`
2. Create German version: `de/new-page.html`
3. Add route to `js/navigation-loader.js`:
   ```javascript
   'new-page': {
     en: 'new-page.html',
     de: 'de/new-page.html'
   }
   ```
4. Add to navigation (if needed)
5. Test both languages

### 2. Updating Existing Content

**Process:**
1. Edit EN file (e.g., `index.html`)
2. Edit DE file with same structure (`de/index.html`)
3. For new text, add `data-translate`:
   ```html
   <p data-translate="New text key">New text content</p>
   ```
4. Add translations to `js/translations.js`:
   ```javascript
   en: { "New text key": "New text content" },
   de: { "New text key": "Neuer Textinhalt" }
   ```
5. Run audits to verify

### 3. Updating Shared Components

**Navigation** (`components/navigation.html`):
- Changes automatically apply to all pages
- Both EN and DE load same component
- Translations handled by `data-translate`

**Contact Modal** (`components/contact-modal.html`):
- Same principle as navigation
- Update once, applies everywhere

### 4. Fixing Translation Issues

**Scenario: German page shows English text**

```bash
# Find the problem
node scripts/find-untranslated-text.js de/problem-page.html

# Shows:
# Line 42  <h2> "Untranslated Heading"
```

**Fix:**
1. Add `data-translate` to element:
   ```html
   <h2 data-translate="Untranslated Heading">Untranslated Heading</h2>
   ```
2. Add German translation to `js/translations.js`:
   ```javascript
   de: {
     "Untranslated Heading": "Unübersetzte Überschrift"
   }
   ```

### 5. Cleaning Up Unused Translations

**Find unused keys:**
```bash
node scripts/audit-translations-simple.js
```

Look for "Unused English Translations" section. These can be safely removed from `js/translations.js`.

---

## File Structure Reference

```
lynckwebsite/
├── *.html                 # English pages
├── de/*.html              # German pages (mirror structure)
├── components/            # Shared components
│   ├── navigation.html
│   └── contact-modal.html
├── js/
│   ├── translations.js    # Translation key-value pairs
│   ├── navigation-loader.js
│   └── contact-modal-loader.js
├── css/
│   ├── main.css          # Main styles
│   └── tailwind.min.css  # Tailwind (built locally)
├── scripts/              # Maintenance tools
│   ├── audit-translations-simple.js
│   └── find-untranslated-text.js
└── docs/
    ├── DESIGN-SYNC-GUIDE.md
    └── MAINTENANCE.md (this file)
```

---

## Git Workflow

### Before Committing

```bash
# 1. Run translation audit
node scripts/audit-translations-simple.js

# 2. Check git status
git status

# 3. Stage changes
git add .

# 4. Commit with clear message
git commit -m "Update: Add new service page with DE translations"

# 5. Push to remote
git push origin main
```

### Commit Message Format

```
<type>: <description>

Types:
- Update: Content or design changes
- Fix: Bug fixes
- Feature: New functionality
- Refactor: Code improvements
- Docs: Documentation updates
```

---

## Troubleshooting

### Issue: Language toggle not working

**Check:**
1. `js/translations.js` loaded correctly?
2. `data-translate` attributes present?
3. Browser console for errors (F12)

**Fix:**
- Ensure all `<script>` tags have `defer` attribute
- Check translation keys match exactly

### Issue: Page layout broken

**Check:**
1. Compare EN and DE HTML structure:
   ```bash
   diff index.html de/index.html
   ```
2. Ensure Tailwind CSS loaded:
   ```html
   <link rel="stylesheet" href="css/tailwind.min.css">
   <!-- DE pages: -->
   <link rel="stylesheet" href="../css/tailwind.min.css">
   ```

### Issue: Component not loading

**Check:**
1. Path correct in DE pages:
   ```html
   <!-- EN: -->
   src="js/navigation-loader.js"
   <!-- DE: -->
   src="../js/navigation-loader.js"
   ```
2. Component file exists in `components/`
3. Browser Network tab for 404 errors

---

## Performance Optimization

### Already Implemented

✅ Lazy loading for images (`loading="lazy"`)
✅ Deferred JavaScript (`defer` attribute)
✅ Local Tailwind CSS (no CDN)
✅ Optimized fonts (6 weights total)
✅ CSS consolidation (main.css)

### Future Improvements

- Image optimization (WebP format)
- Server-side compression (Gzip/Brotli)
- CDN for static assets
- Service worker for offline support

---

## Testing Checklist

### Before Going Live

- [ ] All pages load without errors
- [ ] Language toggle works on all pages
- [ ] Both EN and DE content displays correctly
- [ ] Navigation works
- [ ] Contact modal opens and submits
- [ ] Images load properly (check lazy loading)
- [ ] Mobile responsive (test on phone)
- [ ] No console errors (F12)
- [ ] Translation audit passes:
  ```bash
  node scripts/audit-translations-simple.js
  ```

### Browser Testing

Test in:
- Chrome/Edge (Chromium)
- Firefox
- Safari (macOS/iOS)
- Mobile browsers (Android/iOS)

---

## Quick Commands Reference

```bash
# Development
python3 -m http.server 8080              # Start local server
npm run watch:css                        # Watch Tailwind changes
npm run build:css                        # Build Tailwind CSS

# Auditing
node scripts/audit-translations-simple.js           # Check translations
node scripts/find-untranslated-text.js              # Find untranslated text
node scripts/find-untranslated-text.js [filename]   # Check specific file

# Git
git status                               # Check changes
git add .                                # Stage all
git commit -m "message"                  # Commit
git push                                 # Push to remote
git log --oneline -10                    # Recent commits

# Deployment (if using Vercel/Netlify)
vercel --prod                            # Deploy to Vercel
netlify deploy --prod                    # Deploy to Netlify
```

---

## Support

### Documentation

- Design Sync Guide: `docs/DESIGN-SYNC-GUIDE.md`
- This Maintenance Guide: `docs/MAINTENANCE.md`

### Tools

- Translation Audit: `scripts/audit-translations-simple.js`
- Untranslated Text Finder: `scripts/find-untranslated-text.js`

### Need Help?

1. Check docs first
2. Run audit tools to diagnose
3. Review git history: `git log --oneline`
4. Check browser console for errors

---

**Last Updated:** Option C Implementation (Hybrid Approach)
