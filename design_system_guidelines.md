# Design System: Fit Kickers

## 1. Visual Vibe & Aesthetic
- **Theme:** Dark, aggressive, athletic, modern combat arena.
- **Core Aesthetic:** Jet black canvas, charcoal dark cards, crisp white typography, and vibrant crimson red / gold accents.
- **Lighting Effect:** Ambient red glows (`shadow-[0_0_25px_rgba(239,68,68,0.35)]`) on primary buttons and key elements.

## 2. Color Palette Tokens (Tailwind CSS)

### Backgrounds
- `bg-main`: `#09090b` (`bg-zinc-950`) - Main page background
- `bg-card`: `#18181b` (`bg-zinc-900`) - Card containers
- `bg-card-hover`: `#27272a` (`bg-zinc-800`) - Hover state for interactive cards
- `bg-input`: `#121215` - Form input backgrounds

### Accents & Borders
- `accent-red`: `#ef4444` (`text-red-500` / `bg-red-500`) - Primary action color
- `accent-red-hover`: `#dc2626` (`bg-red-600`) - Button hover state
- `accent-gold`: `#f59e0b` (`text-amber-500`) - Badges and secondary highlights
- `border-card`: `#27272a` (`border-zinc-800`) - Subdued card borders
- `border-active`: `#ef4444` (`border-red-500`) - Active state border

### Typography
- `text-heading`: `#ffffff` (`text-white`) - Headings & titles
- `text-body`: `#d4d4d8` (`text-zinc-300`) - Paragraph text
- `text-muted`: `#a1a1aa` (`text-zinc-400`) - Captions & labels

## 3. Typography Rules
- **Headings (H1, H2, H3):** Heavy, uppercase, high contrast (`font-black tracking-wider uppercase`).
- **Subheadings / Badges:** Uppercase, tracking wide (`tracking-widest font-bold text-xs`).
- **Body Text:** Clean, sans-serif (`font-sans leading-relaxed`).

## 4. Component Styling Specifications

### Ambient Video Background
```html
<div class="relative min-h-screen overflow-hidden bg-zinc-950">
  <video autoPlay loop muted playsInline class="absolute inset-0 w-full h-full object-cover opacity-20 filter grayscale contrast-125">
    <source src="/hero-bg.mp4" type="video/mp4" />
  </video>
  <div class="absolute inset-0 bg-gradient-to-b from-black/80 via-zinc-950/70 to-zinc-950"></div>
  <!-- Hero Content Here -->
</div>
```

### Primary Button
- Red background (`bg-red-600 hover:bg-red-700`)
- Bold, uppercase text (`text-white font-bold uppercase text-xs sm:text-sm tracking-wider`)
- Red ambient glow (`shadow-[0_0_20px_rgba(239,68,68,0.4)]`)
- Subtle hover animation (`transition-all duration-200 hover:-translate-y-0.5`)

### Secondary Outlined Button
- Translucent card background (`bg-zinc-900/80 hover:bg-zinc-800`)
- Border (`border border-zinc-700 hover:border-zinc-500`)
- Text (`text-white font-bold uppercase text-xs tracking-wider`)