# `EquipmentColumns.jsx`

**Purpose:** Defines how equipment data is shown in the table, including edit buttons and custom badges.

## How it connects to the system
This component is part of the `features/inventory` module.

- Used by `InventoryTable` to define how each product type is displayed.
- It adds logic for conditional styling and rendering status badges or edit buttons.

## How to replicate for requests management
To replicate this structure for service requests or user management:
1. Create a table component like `InventoryTable.jsx`.
2. Define column structure in a `*Columns.jsx` file.
3. Make a dynamic panel like `AddProductPanel.jsx` that switches forms.
4. Create separate forms like `AddEquipmentPanel.jsx` for each entity.
5. Ensure edit buttons pass `selectedProduct` to show the form.

