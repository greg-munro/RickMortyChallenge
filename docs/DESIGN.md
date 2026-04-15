## Overview

Modern and approachable with a vibrant, AI-focused personality. The design feels conversational and inviting through its gradient backgrounds and clean interface elements. Medium density with generous whitespace creates a breathable, premium feel that balances visual excitement with usability.

Centered content layout with generous padding and consistent spacing scale. The hero section uses full viewport width while content areas maintain readable max-widths. Grid-based spacing system ensures consistent rhythm throughout the interface.

Uses a 4px base grid with scale: 1, 1.5, 2, 3, 4, 5, 6, 8, 10, 12, 14, 20.

## Colors
- **Warm Canvas** (#eceae4): Main background color for UI elements and cards
- **Charcoal Text** (#1c1c1c): Primary text color for headings and body content
- **Muted Stone** (#5f5f5d): Secondary text color for muted content
- **Cream Surface** (#f7f4ed): Light surface color for elevated elements
- **Surface Lightest** (#fcfbf8): Lightest surface color for highest elevation
- **White** (#ffffff): Pure white for contrast elements

## Typography
- **Headline Font**: Camera Plain Variable
- **Body Font**: Camera Plain Variable
- **Label Font**: Camera Plain Variable

Camera Plain Variable serves as a unified typeface across all text elements, creating consistency while offering variable weight options. Heading sizes follow a clear hierarchy with negative letter-spacing for larger sizes (-1.2px for 48px, -0.9px for 36px) to improve readability. Body text maintains normal letter-spacing with comfortable line-heights (1.5x ratio). Weight conventions use 400 for body text, 480-600 for headings, creating subtle but clear hierarchy without being overly bold.

## Elevation

Subtle depth strategy using soft shadows with multiple layers for elevation. Cards and interactive elements use gentle box-shadows with rgba values for transparency. The gradient background creates natural depth without relying heavily on shadow effects.

## Components
- **Gradient Hero Section**: Full-width hero section with vibrant blue-to-pink gradient background, centered content, and prominent call-to-action
- **Chat Interface Card**: Rounded white card with subtle shadow containing chat input field, action buttons, and interactive elements
- **Navigation Header**: Clean horizontal navigation with logo, menu items, and action buttons using consistent spacing and typography
- **Button System**: Rounded buttons with consistent padding, using either solid fills or transparent backgrounds with borders
- **Input Field**: Large rounded input areas with placeholder text and integrated action buttons

## Do's and Don'ts
- Do use the 4px base spacing unit to maintain consistent rhythm across all interface elements
- Don't mix border radius values outside the established scale - stick to 6px, 8px, 12px, 16px, 24px, or full rounded
- Do maintain the subtle shadow strategy with layered rgba values for depth without overwhelming the clean aesthetic
- Don't use font weights heavier than 600 to preserve the approachable, conversational tone
- Do leverage the warm neutral palette (#eceae4, #f7f4ed) for backgrounds to complement the vibrant gradient accents
- Don't place important text over gradient backgrounds without ensuring sufficient contrast ratios
