# Menu Item Variants Guide

## Overview
The menu system now supports custom variants/options for items like sizes, portions, etc.

## How to Use

### Adding Variants to Menu Items

1. **Navigate to Admin → Global Menu**
2. **Click "Add Item" or "Edit" an existing item**
3. **Scroll to "Custom Options" section**
4. **Click "+ Add Option Group"**

### Example Configurations

#### Pizza with Sizes
```
Option Group Name: Size
Options:
  - Small (₹0)
  - Medium (₹50)
  - Large (₹100)
  - Extra Large (₹150)
```

#### Rice with Portions
```
Option Group Name: Portion
Options:
  - Half (₹-20)
  - Full (₹0)
```

#### Beverage with Sizes
```
Option Group Name: Size
Options:
  - Regular (₹0)
  - Large (₹30)
```

#### Customizable Burger
You can add multiple option groups:

```
Option Group 1: Size
  - Regular (₹0)
  - Double (₹80)

Option Group 2: Add-ons
  - Extra Cheese (₹30)
  - Bacon (₹50)
  - Avocado (₹40)
```

## Data Structure

### Backend (MongoDB)
```json
{
  "name": "Margherita Pizza",
  "basePrice": 200,
  "variants": [
    {
      "name": "Size",
      "options": [
        { "label": "Small", "priceAdjustment": 0 },
        { "label": "Medium", "priceAdjustment": 50 },
        { "label": "Large", "priceAdjustment": 100 }
      ]
    }
  ]
}
```

## Price Calculation

**Base Price + Selected Option's Price Adjustment = Final Price**

Examples:
- Pizza (Base: ₹200) + Small (₹0) = ₹200
- Pizza (Base: ₹200) + Medium (₹50) = ₹250
- Pizza (Base: ₹200) + Large (₹100) = ₹300
- Rice (Base: ₹100) + Half (₹-20) = ₹80
- Rice (Base: ₹100) + Full (₹0) = ₹100

## Tips

1. **Base Price**: Set this to the default/most common size price
2. **Price Adjustments**: 
   - Use positive values for upgrades (₹50, ₹100)
   - Use negative values for smaller portions (₹-20, ₹-50)
   - Use ₹0 for the default option
3. **Option Groups**: Create separate groups for different types of customizations
4. **Clear Labels**: Use descriptive names like "Size", "Portion", "Temperature", "Add-ons"

## UI Features

- **Add/Remove Groups**: Easily manage option groups
- **Add/Remove Options**: Dynamic option management within each group
- **Price Preview**: See price adjustments for each option
- **Table Display**: View all variants in the menu table
- **Edit Support**: Modify existing variants when editing items

## Future Enhancements (Planned)

- Display variants in customer-facing menu
- Allow customers to select variants during order
- Stock management per variant
- Analytics on popular variant choices
