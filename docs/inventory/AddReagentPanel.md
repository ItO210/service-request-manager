# `AddReagentPanel.jsx`

**Purpose:** Form for adding or editing reagents. Includes extensive fields covering general info, NFPA classification, risks, traceability, and storage. Supports stickers and file uploads.

## How it connects to the system
This component is part of the `features/inventory` module.

- Called from `AddProductPanel` or `InventoryTable`.
- Sends data to the backend using `fetch()`.
- Populates form fields with `initialData` when editing.

## How to replicate for requests management
To replicate this structure for service requests or user management:
1. Create a table component like `InventoryTable.jsx`.
2. Define column structure in a `*Columns.jsx` file.
3. Make a dynamic panel like `AddProductPanel.jsx` that switches forms.
4. Create separate forms like `AddEquipmentPanel.jsx` for each entity.
5. Ensure edit buttons pass `selectedProduct` to show the form.

