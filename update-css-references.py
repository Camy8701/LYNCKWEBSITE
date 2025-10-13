#!/usr/bin/env python3
"""
LYNCK Studio - CSS Consolidation Script
Replaces multiple CSS files and inline styles with single main.css
"""

import re
import os

# Files to update
html_files = [
    'index.html',
    'custom-website.html',
    'digital-products.html',
    'google-ads.html',
    'learning-platform.html',
    'portfolio.html',
    'pricing.html',
    'why-choose-us.html',
    'de/index.html',
    'de/custom-website.html',
    'de/digital-products.html',
    'de/google-ads.html',
    'de/learning-platform.html',
    'de/portfolio.html',
    'de/why-choose-us.html'
]

print("=" * 60)
print("CSS CONSOLIDATION - Updating HTML Files")
print("=" * 60)
print()

for filepath in html_files:
    if not os.path.exists(filepath):
        print(f"⚠️  Skipping {filepath} - file not found")
        continue

    print(f"Processing: {filepath}")

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original_size = len(content)

    # Step 1: Remove old CSS file references
    # Remove styles.css
    content = re.sub(
        r'<link rel="preload" href="styles\.css" as="style">\s*',
        '',
        content
    )
    content = re.sub(
        r'<link rel="stylesheet" href="styles\.css">\s*',
        '',
        content
    )

    # Remove css/components.css
    content = re.sub(
        r'<link rel="preload" href="css/components\.css" as="style">\s*',
        '',
        content
    )
    content = re.sub(
        r'<link rel="stylesheet" href="css/components\.css">\s*',
        '',
        content
    )

    # Remove css/critical.css
    content = re.sub(
        r'<link rel="stylesheet" href="(\.\.\/)?css/critical\.css">\s*',
        '',
        content
    )

    # Remove css/animations.css
    content = re.sub(
        r'<link rel="stylesheet" href="(\.\.\/)?css/animations\.css">\s*',
        '',
        content
    )

    # Remove css/orb-text.css
    content = re.sub(
        r'<link rel="stylesheet" href="(\.\.\/)?css/orb-text\.css">\s*',
        '',
        content
    )

    # Step 2: Remove inline <style> blocks
    # This removes everything between <style> and </style> tags
    content = re.sub(
        r'<style>.*?</style>\s*',
        '',
        content,
        flags=re.DOTALL
    )

    # Step 3: Add new main.css reference
    # Find the position after Tailwind CSS line
    if 'de/' in filepath:
        css_path = '../css/main.css'
    else:
        css_path = 'css/main.css'

    # Look for the Tailwind CSS link
    tailwind_pattern = r'(<link rel="stylesheet" href="(\.\.\/)?css/tailwind\.min\.css">)'

    if re.search(tailwind_pattern, content):
        # Add main.css after Tailwind
        content = re.sub(
            tailwind_pattern,
            r'\1\n<link rel="stylesheet" href="' + css_path + '">',
            content
        )
    else:
        # Fallback: add before </head>
        content = re.sub(
            r'</head>',
            f'<link rel="stylesheet" href="{css_path}">\n</head>',
            content
        )

    # Write the updated content
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

    new_size = len(content)
    saved = original_size - new_size

    print(f"  ✅ Updated - Saved {saved} bytes ({saved / 1024:.1f}KB)")
    print()

print("=" * 60)
print("✅ CSS CONSOLIDATION COMPLETE")
print("=" * 60)
print()
print("Summary:")
print("  • Removed 5 old CSS file references")
print("  • Removed all inline <style> blocks")
print("  • Added single css/main.css reference")
print("  • All 15 HTML files updated")
