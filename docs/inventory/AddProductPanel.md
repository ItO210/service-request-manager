# `AddProductPanel.jsx`

**Purpose:** Wrapper panel that conditionally renders the right form (equipment, reagent, material) based on the type selected.

## How it connects to the system
This component is part of the `features/inventory` module.

- Dynamically shows the right form (equipment, reagent, material) when adding/editing a product.
- Handles closing logic when clicking outside or pressing Escape.

## How to replicate for requests management
To replicate this structure for service requests or user management:
1. Create a table component like `InventoryTable.jsx`.
2. Define column structure in a `*Columns.jsx` file.
3. Make a dynamic panel like `AddProductPanel.jsx` that switches forms.
4. Create separate forms like `AddEquipmentPanel.jsx` for each entity.
5. Ensure edit buttons pass `selectedProduct` to show the form.

