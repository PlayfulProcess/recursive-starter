# Shared UI Pattern: Header & Footer with Spiral Animation

## Overview

This document describes the copy-paste pattern for sharing the Header and Footer components (with animated spiral logos) across all Recursive.eco React projects.

## Why This Approach?

1. **Maintains Creative Freedom**: Uses vanilla JavaScript for spiral animation (no React dependencies)
2. **Works Across Projects**: Same spiral.js file works in both React and vanilla HTML projects
3. **Easy to Update**: Change once in one project, copy to others
4. **No Breaking Changes**: recursive-landing keeps using web components, React projects wrap the same HTML

## Files to Copy

### 1. Spiral Animation Script

**Source**: `recursive-creator/public/spiral/spiral.js`
**Destination**: Copy to `public/spiral/spiral.js` in target project

This is the vanilla JavaScript file that creates the animated spiral logo. It exposes a global `window.createSpiral()` function.

### 2. Header Component

**Source**: `recursive-creator/src/components/layout/Header.tsx`
**Destination**: Copy to `src/components/layout/Header.tsx` in target project

Key features:
- Loads spiral.js using Next.js Script component with `strategy="afterInteractive"`
- useEffect initializes spiral after React hydration
- Includes navigation, dropdown menu, mobile menu
- Sticky header with backdrop blur

**Import path**: `@/components/layout/Header`

### 3. Footer Component

**Source**: `recursive-creator/src/components/layout/Footer.tsx`
**Destination**: Copy to `src/components/layout/Footer.tsx` in target project

Key features:
- useEffect initializes white spiral for footer
- Beta notice banner
- Social links (Substack, Goodreads, GitHub, Contact)
- Copyright and license info

**Import path**: `@/components/layout/Footer`

## Integration Steps

### Step 1: Copy Files

```bash
# Copy spiral.js
cp recursive-creator/public/spiral/spiral.js target-project/public/spiral/

# Copy components
cp recursive-creator/src/components/layout/Header.tsx target-project/src/components/layout/
cp recursive-creator/src/components/layout/Footer.tsx target-project/src/components/layout/
```

### Step 2: Update Layout

Add to your root layout file (`app/layout.tsx`):

```typescript
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
```

### Step 3: Test

Start your dev server and verify:
- Purple spiral animates in header
- White spiral animates in footer
- No React hydration errors
- Navigation works correctly
- Mobile menu works on small screens

## Technical Details

### How Spiral Animation Works

1. **Script Loading**: Next.js Script component loads spiral.js after React hydration
2. **Initialization**: useEffect calls `window.createSpiral()` after component mounts
3. **Container**: Each component has a div with an ID (`header-logo-container`, `footer-logo-container`)
4. **Retry Logic**: Includes 100ms timeout retry to ensure spiral initializes even if script loads slowly

### Spiral Configuration

**Header Spiral**:
```typescript
createSpiral(container, {
  size: 100,
  turns: 6,
  color: '#9333ea',  // Purple
  strokeWidth: 0.8,
  opacity: 0.8,
  animated: true
});
```

**Footer Spiral**:
```typescript
createSpiral(container, {
  size: 100,
  turns: 6,
  color: '#ffffff',  // White
  strokeWidth: 0.8,
  opacity: 0.6,
  animated: true
});
```

### Type Assertions

Since spiral.js is vanilla JavaScript, we use type assertions in TypeScript:

```typescript
if (typeof window !== 'undefined' && (window as any).createSpiral) {
  (window as any).createSpiral(container, options);
}
```

## Customization

### Changing Navigation Links

Edit the `<nav>` section in Header.tsx:

```typescript
<a href="https://channels.recursive.eco/" className="...">
  Channels
</a>
```

### Changing Footer Links

Edit the social links section in Footer.tsx:

```typescript
<a href="https://lifeisprocess.substack.com/" target="_blank" rel="noopener noreferrer">
  Substack
</a>
```

### Changing Colors

Adjust the Tailwind classes:
- Header background: `bg-white/90 backdrop-blur-sm`
- Footer background: `bg-gray-900`
- Spiral colors: In `createSpiral()` options

## Projects Using This Pattern

- ✅ recursive-creator (reference implementation)
- ⏳ recursive-channels-fresh (to be copied)
- ⏳ jongu-tool-best-possible-self (to be copied)

## Testing Checklist

When copying to a new project, verify:

- [ ] spiral.js file exists in `public/spiral/`
- [ ] Header component renders without errors
- [ ] Footer component renders without errors
- [ ] Purple spiral animates in header (visible on page load)
- [ ] White spiral animates in footer (visible on page load)
- [ ] No console errors related to spiral initialization
- [ ] Navigation links work correctly
- [ ] Dropdown menu works (desktop)
- [ ] Mobile menu works (mobile/small screens)
- [ ] Responsive design works across breakpoints

## Troubleshooting

### Spiral Not Appearing

1. Check browser console for errors
2. Verify spiral.js exists at `/public/spiral/spiral.js`
3. Check that Script component has correct `src` path
4. Verify container div has correct ID

### Hydration Errors

- Ensure Script uses `strategy="afterInteractive"`
- Check that useEffect only runs on client side (`typeof window !== 'undefined'`)

### Script Loading Issues

- useEffect includes retry logic with 100ms timeout
- Script component also has `onLoad` callback for re-initialization

## Maintenance

When updating the spiral animation or layout:

1. Make changes in `recursive-creator` (reference implementation)
2. Test thoroughly
3. Copy updated files to other projects
4. Test each project individually

## Future Enhancements

Potential improvements:
- Convert to shared NPM package (if scaling to many projects)
- Add accessibility improvements (ARIA labels, keyboard navigation)
- Add theme switching support (dark mode for header)
- Add animation preferences detection (respect prefers-reduced-motion)
