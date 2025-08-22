# Cozy Design System - Relateful Arts GBG

## Overview

Our cozy design system transforms the website into a warm, welcoming gathering place that evokes intimacy and connection. It features warm earthy tones, friendly rounded fonts, soft shadows, and inviting visual elements that make users feel at home.

## Design Philosophy

- **Warm & Welcoming**: Earthy browns and ochre tones create a sense of comfort
- **Intimate & Connected**: Soft shadows and rounded elements evoke closeness
- **Friendly & Approachable**: Rounded fonts and gentle transitions make interactions feel natural
- **Community-Focused**: Design elements emphasize human connection and gathering
- **Readable & Accessible**: High contrast text for better readability

## Color Palette

### Primary Colors
- **Primary**: Warm Red-Brown (HSL: 20 50% 45%) - Warm, earthy, inviting with a touch of red
- **Primary Glow**: Brighter warm red-brown (HSL: 20 55% 55%) - For highlights and emphasis
- **Primary Foreground**: Off-white (HSL: 35 25% 98%) - Warm, readable text

### Secondary Colors
- **Secondary**: Warm wood tones (HSL: 30 20% 90%) - Natural, grounding
- **Accent**: Soft earth tones (HSL: 25 15% 88%) - Gentle, supportive
- **Muted**: Gentle backgrounds (HSL: 35 15% 92%) - Subtle, non-intrusive

### UI Colors
- **Border**: Warm borders (HSL: 30 15% 85%) - Soft, welcoming
- **Background**: Warm off-white (HSL: 35 25% 98%) - Easy on the eyes
- **Foreground**: Deep dark brown (HSL: 15 8% 15%) - High contrast, very readable
- **Muted Foreground**: Medium dark brown (HSL: 15 8% 35%) - Good secondary text contrast

## Typography

- **Font Family**: Inter with Segoe UI fallback for warmth and readability
- **Line Height**: 1.6 for body text, 1.7 for paragraphs
- **Letter Spacing**: Slightly tighter for warmth (-0.02em for headings, +0.01em for body)
- **Font Weights**: Medium to semibold for friendly, approachable feel
- **Text Colors**: High contrast foreground colors for optimal readability
- **Paragraph Spacing**: Generous margins for comfortable reading

## Component Classes

### Page Layout
```css
.page-header          /* Cozy page headers with warm gradients */
.page-section         /* Generous spacing for breathing room */
.page-title           /* Large, warm typography */
.page-description     /* Welcoming, readable descriptions */
```

### Cards
```css
.card-elegant         /* Warm cards with soft shadows and rounded corners */
.card-image-container /* Rounded image containers */
.card-badge-overlay   /* Floating badges with soft shadows */
.card-price-overlay   /* Price displays with backdrop blur */
```

### Buttons
```css
.inviting-button      /* Primary action buttons with warm gradients */
.btn-primary-gradient /* Gradient buttons with glow effects */
.btn-outline-primary  /* Outline buttons with warm borders */
```

### Info Elements
```css
.info-item            /* Information displays with warm backgrounds */
.info-icon            /* Icon containers with primary color accents */
.info-label           /* Clear, readable labels */
.info-value           /* Supporting information text */
```

### Containers
```css
.cozy-container       /* Highlighted content areas with warm styling */
.warm-divider         /* Subtle dividers with primary color accents */
```

## Shadows & Effects

- **shadow-cozy**: Soft, warm shadows for depth
- **shadow-elegant**: Refined shadows for premium feel
- **shadow-glow**: Glowing effects for emphasis
- **shadow-soft**: Gentle shadows for subtle depth

## Gradients

- **gradient-cozy**: Warm, inviting background gradients
- **gradient-hero**: Primary color gradients for emphasis
- **gradient-warm**: Subtle warm background transitions
- **gradient-gentle**: Soft, gentle background changes

## Transitions

- **transition-smooth**: 400ms cubic-bezier for smooth interactions
- **transition-gentle**: 300ms ease-out for gentle movements

## Usage Examples

### Basic Card
```tsx
<Card className="card-elegant group">
  <CardHeader className="card-content-wrapper">
    <CardTitle>Warm & Welcoming</CardTitle>
  </CardHeader>
  <CardContent className="card-content-wrapper">
    <p>Content with cozy styling</p>
  </CardContent>
</Card>
```

### Info Display
```tsx
<div className="info-item">
  <div className="info-icon">
    <Heart className="w-5 h-5" />
  </div>
  <div className="info-content">
    <div className="info-label">Community</div>
    <div className="info-value">500+ members</div>
  </div>
</div>
```

### Primary Button
```tsx
<Button className="inviting-button">
  Join Our Community
</Button>
```

### Cozy Container
```tsx
<div className="cozy-container">
  <h3>Welcome Message</h3>
  <p>Content in a warm, inviting container</p>
</div>
```

## Responsive Design

The design system includes responsive utilities:
- **responsive-grid**: Adaptive grid layouts
- **responsive-grid-wide**: Wide grid layouts for larger screens
- Mobile-first approach with warm, touch-friendly interactions

## Accessibility

- High contrast ratios for readability
- Warm colors that are easy on the eyes
- Generous spacing for comfortable reading
- Smooth transitions that aren't jarring
- Clear text hierarchy with readable colors

## Browser Support

- Modern browsers with CSS custom properties support
- Graceful fallbacks for older browsers
- Progressive enhancement approach

## Getting Started

1. Use the predefined component classes for consistent styling
2. Apply warm color combinations using the CSS custom properties
3. Utilize the cozy shadows and gradients for depth
4. Implement smooth transitions for interactive elements
5. Test the warm, welcoming feel across different screen sizes
6. Ensure text readability with high contrast colors

## Demo

Visit `/cozy-demo` to see all the design system components in action and experience the warm, inviting aesthetic firsthand.

## Recent Updates

- **Softer Color Palette**: Reduced red intensity for a more balanced, warm aesthetic
- **Improved Readability**: Navigation and text now use high-contrast colors for better accessibility
- **Warm Browns**: Primary colors shifted from terracotta red to warm, earthy browns
