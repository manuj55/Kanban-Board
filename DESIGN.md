---
name: Neura Kanban
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#c1c6d5'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#8b919e'
  outline-variant: '#414753'
  surface-tint: '#aac7ff'
  primary: '#aac7ff'
  on-primary: '#002f64'
  primary-container: '#046bd2'
  on-primary-container: '#ebefff'
  inverse-primary: '#005db8'
  secondary: '#bcc7de'
  on-secondary: '#263143'
  secondary-container: '#3e495d'
  on-secondary-container: '#aeb9d0'
  tertiary: '#ffb692'
  on-tertiary: '#562000'
  tertiary-container: '#b64d03'
  on-tertiary-container: '#ffece5'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d6e3ff'
  primary-fixed-dim: '#aac7ff'
  on-primary-fixed: '#001b3e'
  on-primary-fixed-variant: '#00458d'
  secondary-fixed: '#d8e3fb'
  secondary-fixed-dim: '#bcc7de'
  on-secondary-fixed: '#111c2d'
  on-secondary-fixed-variant: '#3c475a'
  tertiary-fixed: '#ffdbcb'
  tertiary-fixed-dim: '#ffb692'
  on-tertiary-fixed: '#341100'
  on-tertiary-fixed-variant: '#793000'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  headline-xl:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 10px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.08em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  gutter: 20px
  container-max: 1440px
---

## Brand & Style

The design system is engineered for precision, drawing inspiration from high-end industrial robotics and cognitive automation. It targets professional teams who require a high-signal, low-noise environment for complex task management.

The visual style is **Industrial Minimalism** blended with **Modern Corporate** precision. It utilizes high-contrast interfaces to maintain focus, with a "dark-first" aesthetic that mirrors technical command centers. The emotional response is one of controlled power, reliability, and cutting-edge intelligence. This is achieved through generous whitespace, razor-sharp alignment, and subtle technical accents like fine-line dividers and glows.

## Colors

The palette is anchored in a deep, tech-centric dark mode. 

- **Primary**: A vibrant, high-fidelity blue (#046BD2) used for interactive states, progress indicators, and primary actions. It represents the "pulse" of the system.
- **Surface & Secondary**: Deep slate (#1E293B) and obsidian (#111111) are used to create structural depth. 
- **Typography & UI**: Pure white (#FFFFFF) is reserved for high-contrast text and critical icons to ensure maximum legibility against the dark backgrounds.
- **Functional Grays**: Low-saturation grays are used for borders and disabled states to keep the focus on active content.

## Typography

This design system utilizes a dual-font strategy to balance technical character with utilitarian readability. 

**Space Grotesk** is used for headlines and prominent metrics, providing a geometric, futuristic feel that aligns with the robotics aesthetic. **Inter** is used for all body copy, task descriptions, and UI labels due to its exceptional clarity at small sizes and its neutral, systematic nature. 

Hierarchy is strictly enforced through weight and letter spacing, with labels often utilizing uppercase styling to mimic technical spec sheets.

## Layout & Spacing

The layout follows a **Fluid Grid** model with a 12-column structure for dashboard views and a specialized horizontal scroll system for Kanban boards. 

A strict 4px baseline grid ensures every element is perfectly aligned. For the KanbanFlow application:
- **Columns**: Have a fixed minimum width of 280px with a 20px gutter.
- **Margins**: Side margins are adaptive, expanding to fill screen width while capping content at 1440px to maintain readability.
- **Density**: Use "Comfortable" padding (24px) for landing pages and "Compact" padding (12px) for the functional task board to maximize information density.

## Elevation & Depth

Hierarchy is established through **Tonal Layering** and **Low-Contrast Outlines** rather than traditional heavy shadows.

- **Base Layer**: Pure #111111 for the application background.
- **Surface Layer**: #1E293B for cards and sidebar containers, creating a subtle lift.
- **Borders**: 1px solid borders using an opacity-reduced white (e.g., `rgba(255, 255, 255, 0.1)`) replace shadows for a cleaner, industrial look.
- **Interaction Glow**: Interactive elements like active cards or primary buttons feature a soft outer glow (0px 0px 12px) in the primary blue color to simulate light-emitting diodes (LEDs) on a machine.

## Shapes

The shape language is "Soft-Technical." Elements use a subtle **0.25rem (4px)** corner radius to maintain a crisp, engineered appearance without the harshness of 0px corners. 

Larger containers or specialized UI elements like "Add Task" buttons may use `rounded-lg` (8px) for a slightly softer touch, but the overall aesthetic avoids rounded or pill-shaped elements to maintain its professional, industrial character.

## Components

### Buttons
- **Primary**: Solid blue (#046BD2) with white text. On hover, apply a soft blue glow.
- **Ghost**: Transparent background with a 1px white border. Used for secondary actions like "Cancel" or "Archive."

### Cards (Task Items)
- Background: #1E293B.
- Border: 1px subtle gray. 
- Technical Detail: A 2px vertical accent bar on the left edge indicates task priority or status.

### Kanban Columns
- Headers: Large uppercase labels in Space Grotesk.
- Background: Transparent with a dashed 1px border at the top and bottom to define the lane.

### Input Fields & Controls
- Focus State: Border transitions from soft gray to the primary blue with a 2px glow.
- Checkboxes: Square with sharp 2px corners; when checked, they fill with the primary blue and a white checkmark.

### Progress Indicators
- Linear bars with a "glowing" leading edge to suggest movement and robotic precision.
