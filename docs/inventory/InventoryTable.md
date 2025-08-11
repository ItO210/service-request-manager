# `InventoryTable.jsx`

**Purpose:** Displays the inventory table dynamically using TanStack Table, showing all products and rendering the corresponding edit panel when one is selected.

## How it connects to the system
This component is part of the `features/inventory` module.

- Renders a table with rows using `@tanstack/react-table`.
- Integrates edit panels inline per selected row.
- Uses column definitions from corresponding `*Columns.jsx` file.

## How to replicate for requests management
To replicate this structure for service requests or user management:
1. Create a table component like `InventoryTable.jsx`.
2. Define column structure in a `*Columns.jsx` file.
3. Make a dynamic panel like `AddProductPanel.jsx` that switches forms.
4. Create separate forms like `AddEquipmentPanel.jsx` for each entity.
5. Ensure edit buttons pass `selectedProduct` to show the form.

