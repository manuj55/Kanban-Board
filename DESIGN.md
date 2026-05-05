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

This design system is built on the principles of **Minimalism** and **Corporate Modernism**. It prioritizes cognitive clarity and task efficiency for professional project management. The aesthetic is characterized by high-quality whitespace, a restrained color palette, and a focus on utilitarian elegance.

The target audience consists of project managers and developers who require a tool that recedes into the background, allowing their work to take center stage. The emotional response is one of calm, reliability, and structured order.

## Colors

The color strategy uses a triad of Slate tones to define the structural hierarchy.
- **Primary:** Teal (#0D9488) is used exclusively for primary actions and active states to draw immediate focus without overwhelming the eye.
- **Surface & Background:** Light Slate (#F8FAFC) serves as the base canvas, while Dark Slate (#0F172A) is reserved for high-contrast sidebars or navigation panels to provide a grounded, professional frame.
- **Text:** Hierarchy is established through Slate Grays. Use darker tones for headings and mid-tones for secondary meta-data to reduce visual noise.

## Typography

This design system utilizes **Inter** for all text elements to ensure a systematic, utilitarian feel. The scale follows a tight modern hierarchy. Headlines use slightly tighter letter-spacing and semi-bold weights to appear authoritative, while body copy maintains generous line-heights to ensure readability during long periods of work. Labels use a medium weight for clarity at small sizes.

## Layout & Spacing

The layout philosophy follows a **Fluid Grid** model for the Kanban board, allowing columns to scale based on the viewport width, while keeping a **Fixed Sidebar** at 260px. 

A strict 4px baseline grid ensures vertical rhythm. Spacing between cards in a column should be 12px, while the gutters between columns are fixed at 16px to maintain a dense but breathable information flow.

## Elevation & Depth

This design system uses **Tonal Layers** and **Low-Contrast Outlines** rather than heavy shadows. 

- **Level 0 (Background):** Light Slate (#F8FAFC).
- **Level 1 (Cards/Inputs):** White (#FFFFFF) with a 1px border in Slate-200. No shadow is used for static states.
- **Level 2 (Hover/Active):** A very soft, diffused shadow (0px 4px 6px rgba(15, 23, 42, 0.05)) to indicate interactivity.
- **Level 3 (Modals/Popovers):** A crisp 1px border with a medium ambient shadow to separate the element from the board.

## Shapes

The shape language is primarily **Rounded**, striking a balance between the friendliness of consumer apps and the rigidity of enterprise software. 

Specific radius overrides are applied to optimize the feel of different interactions: 10px for buttons to make them feel distinct and "clickable," and 8px for inputs and cards to maintain a structured, professional alignment within the grid.

## Components

- **Buttons:** Primary buttons are solid Teal (#0D9488) with white text, using a 10px radius. Secondary buttons should be ghost-style with a Slate-200 border.
- **Input Fields:** Use an 8px radius with a Slate-200 border. On focus, the border transitions to Teal with a soft 3px Teal glow (20% opacity).
- **Kanban Cards:** White background, 12px radius, and a 1px Slate-200 border. Use a Teal accent bar (4px wide) on the left side to denote high-priority tasks.
- **Chips/Tags:** Small, pill-shaped elements with a light tint of the category color and dark text for maximum legibility.
- **Sidebar:** Dark Slate (#0F172A) background with Slate-400 text. Active links should use a Teal vertical indicator on the far left and white text.
- **Checkboxes:** Square with a 4px radius, filling with Teal when checked.
