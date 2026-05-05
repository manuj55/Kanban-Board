---
name: Efficient Flow
colors:
  surface: '#f5faf8'
  surface-dim: '#d6dbd9'
  surface-bright: '#f5faf8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f5f2'
  surface-container: '#eaefed'
  surface-container-high: '#e4e9e7'
  surface-container-highest: '#dee4e1'
  on-surface: '#171d1c'
  on-surface-variant: '#3d4947'
  inverse-surface: '#2c3130'
  inverse-on-surface: '#edf2f0'
  outline: '#6d7a77'
  outline-variant: '#bcc9c6'
  surface-tint: '#006a61'
  primary: '#00685f'
  on-primary: '#ffffff'
  primary-container: '#008378'
  on-primary-container: '#f4fffc'
  inverse-primary: '#6bd8cb'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#595c5e'
  on-tertiary: '#ffffff'
  tertiary-container: '#727577'
  on-tertiary-container: '#fbfdff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#89f5e7'
  primary-fixed-dim: '#6bd8cb'
  on-primary-fixed: '#00201d'
  on-primary-fixed-variant: '#005049'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#e0e3e5'
  tertiary-fixed-dim: '#c4c7c9'
  on-tertiary-fixed: '#191c1e'
  on-tertiary-fixed-variant: '#444749'
  background: '#f5faf8'
  on-background: '#171d1c'
  surface-variant: '#dee4e1'
typography:
  h1:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h2:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  h3:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: 0em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: 0em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin: 24px
---

## Brand & Style

This design system is built on the principles of **Minimalism**, **Clarity**, and **Clean Efficiency**. It prioritizes cognitive clarity and task efficiency for professional project management. The aesthetic is characterized by light, breathable whitespace, a restrained teal-and-gray color palette, and a focus on utilitarian elegance that lets tasks take center stage.

The target audience consists of project managers and developers who require a tool that recedes into the background, allowing their work to take center stage. The emotional response is one of calm, clarity, reliability, and structured order—facilitated by a light, airy interface.

## Colors

The color strategy uses **Teal as primary action** with light neutral backgrounds for maximum clarity.
- **Primary:** Teal (#00685F) is used exclusively for primary actions, interactive elements, and active states to draw immediate focus without overwhelming the eye.
- **Surface & Background:** Light Slate (#F5FAF8) serves as the base canvas. Cards and interactive elements use white (#FFFFFF) for maximum contrast and readability. Text contrasts are optimized for the light background.
- **Text:** Hierarchy is established through Slate Grays. Use darker tones (#171D1C) for headings and mid-tones (#3D4947) for secondary meta-data to reduce visual noise and maintain readability.

## Typography

This design system utilizes **Inter** for all text elements to ensure a systematic, utilitarian feel. The scale follows a tight modern hierarchy. Headlines use slightly tighter letter-spacing and semi-bold weights to appear authoritative, while body copy maintains generous line-heights to ensure readability during long periods of work. Labels use a medium weight for clarity at small sizes.

## Layout & Spacing

The layout philosophy follows a **Fluid Grid** model for the Kanban board, allowing columns to scale based on the viewport width, while keeping a **Fixed Sidebar** at 260px. 

A strict 4px baseline grid ensures vertical rhythm. Spacing between cards in a column should be 12px, while the gutters between columns are fixed at 16px to maintain a dense but breathable information flow.

## Elevation & Depth

This design system uses **Tonal Layers** and **Subtle Outlines** to create depth without heavy shadows (which cloud a light interface).

- **Level 0 (Background):** Light Slate (#F5FAF8) — the base canvas.
- **Level 1 (Cards/Inputs):** White (#FFFFFF) with a 1px border in outline-variant (#BCC9C6). No shadow is used for static states, keeping the interface light and clean.
- **Level 2 (Hover/Active):** A very soft, diffused shadow (0px 4px 6px rgba(0, 0, 0, 0.05)) to subtly indicate interactivity and hover states.
- **Level 3 (Modals/Popovers):** A crisp 1px border with a light ambient shadow to separate the element from the board without visual heaviness.

## Shapes

The shape language is **Subtly Rounded**, creating a modern, clean feel while maintaining professional structure.

- **Small elements (checkboxes):** 4px radius
- **Cards & Inputs:** 8px radius (balanced and structured)
- **Buttons:** 10px radius (distinct and clickable)

## Components

- **Buttons:** 
  - **Primary:** Solid Teal (#00685F) background, white text, 10px radius, 150ms transition on hover
  - **Secondary/Ghost:** Transparent with 1px outline-variant border, text in on-surface, 10px radius
  - **States:** Hover (scale 1.02, bg tint), Active (scale 0.98), Focus (2px outline), Disabled (0.5 opacity)

- **Input Fields:** 
  - 8px radius, 1px outline-variant border (#BCC9C6)
  - **Focus:** Border transitions to Teal (#00685F), 2px outline, soft 2px glow (rgba(0, 106, 95, 0.2))
  - **Error:** Border becomes error red (#BA1A1A), red text for error message
  - All transitions 150ms ease-out

- **Task Cards (Kanban):** 
  - White background (#FFFFFF), 8px radius, 1px outline-variant border
  - 4px left accent bar in Teal for visual hierarchy
  - **Hover:** Subtle shadow lift (0 4px 6px rgba(0,0,0,0.05)), bg tint (rgba(0, 106, 95, 0.02))
  - **Dragging:** Opacity 0.5, scale 1.05, 150ms transition
  - **Error shake:** ±5px horizontal animation, 200ms duration

- **Drop Zone (Columns):** 
  - **On drag over:** 2px dashed border in Teal, light background tint (rgba(0, 106, 95, 0.05))
  - **Drop indicator line:** 2px solid Teal, animated pulse (2s)

- **Form Elements:**
  - **Labels:** Inter 12px, weight 500, letter-spacing 0.02em, color on-surface-variant
  - **Placeholders:** Lighter text (on-surface-variant), fade on focus
  - **Validation messages:** Error (12px, red), Success (12px, teal)

- **Toast Notifications:**
  - 320px width, 16px padding, 8px radius, 1px outline-variant border
  - Slide in from bottom-right (200ms ease-out)
  - **Success:** Green checkmark + 2s auto-dismiss
  - **Error:** Red warning icon + 5s dismissible + [Retry] button
  - **Info:** Blue info icon + 3s auto-dismiss
