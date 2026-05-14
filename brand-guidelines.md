# ShortHand Brand Guidelines

## Logo Colors (letter-by-letter)

| Letter | Color         | Hex       |
|--------|---------------|-----------|
| S      | Coral Red     | `#FF5A5F` |
| h      | Emerald Green | `#19C37D` |
| o      | Golden Orange | `#F7A600` |
| r      | Bright Blue   | `#3B82F6` |
| t      | Soft Lavender | `#C084FC` |
| H      | Coral Red     | `#FF5A5F` |
| a      | Emerald Green | `#19C37D` |
| n      | Golden Orange | `#F7A600` |
| d      | Bright Blue   | `#3B82F6` |

## Background Colors

| Name         | Hex       | Use             |
|--------------|-----------|-----------------|
| Primary Dark | `#111827` | Dark mode bg    |
| Soft Light   | `#F9FAFB` | Light mode bg   |
| Neutral Gray | `#E5E7EB` | Borders, dividers |

## Design Rules

**Colors are always flat.**
- No gradients
- No glossy effects
- No metallic effects
- No drop shadows on color elements

This keeps the brand scalable, modern, and accessible across UI, print, and merch.

## Tailwind Config

```js
// tailwind.config.js — brand color extensions
colors: {
  brand: {
    coral:   '#FF5A5F',
    green:   '#19C37D',
    orange:  '#F7A600',
    blue:    '#3B82F6',
    lavender:'#C084FC',
  },
  bg: {
    dark:  '#111827',
    light: '#F9FAFB',
    gray:  '#E5E7EB',
  }
}
```

## Canva Brand Kit

Add all hex values above to the Canva brand kit under "ShortHand Brand Colors."
