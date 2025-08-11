# CICATA Nexus - Inventory Module Documentation

This document provides a complete overview of the **Inventory Module** used in the CICATA Nexus system. It is designed to help understand the architecture, flow, and logic behind managing laboratory **equipment**, **materials**, and **reagents**.

---

## Overview

The Inventory Module allows users to:
- View and filter inventory by type (equipment, materials, reagents)
- Edit products inline directly from the table
- Add new items through dynamically rendered forms
- Visualize product status (e.g., with stickers or badges)

---

## Folder structure

```
features/
└── inventory/
    ├── AddProductPanel.jsx
    ├── InventoryTable.jsx
    ├── columns/
    │   ├── EquipmentColumns.jsx
    │   ├── MaterialColumns.jsx
    │   └── ReagentColumns.jsx
    └── forms/
        ├── AddEquipmentPanel.jsx
        ├── AddMaterialPanel.jsx
        └── AddReagentPanel.jsx
```

---

## Component relationships

### 1. `InventoryTable.jsx`
- Renders the dynamic inventory table using `@tanstack/react-table`.
- Loads the correct columns based on the product type.
- Displays the edit panel **inline** when a product is selected.

### 2. `AddProductPanel.jsx`
- A wrapper component that conditionally renders:
  - `AddEquipmentPanel`
  - `AddMaterialPanel`
  - `AddReagentPanel`
- It’s triggered when a new product is added **or** when one is being edited.

### 3. `*Columns.jsx` Files
- Each of these files (`EquipmentColumns`, `MaterialColumns`, `ReagentColumns`) defines:
  - The table headers (`accessorKey`)
  - How the data should be rendered (e.g., icons, colors)
  - A button to trigger editing a specific product.

### 4. `Add*Panel.jsx` Forms
- These are the actual forms users use to create or edit inventory items.
- Each form has:
  - Multiple columns for different sections (general info, traceability, safety, etc.)
  - Logic to send data to the backend (`fetch`)
  - Confirmation modals for deletion or successful submission

---

## How it works

1. `InventoryTable` loads data + columns based on the type passed as prop (`type="equipos"`).
2. When clicking the ✏️ icon in any row, the selected product is passed to `AddProductPanel`.
3. `AddProductPanel` picks the right form to render based on `type` and fills in `initialData`.
4. Inside the form:
   - `handleChange` manages form state.
   - `handleSubmit` sends the data to the backend.
   - Modals provide feedback or delete confirmation.

---

## How to replicate for other modules

To apply the same pattern for `Requests`, `Users`, or other modules:

### Table
- Create a `RequestsTable.jsx` using `InventoryTable.jsx` as reference.
- Use `tanstack/react-table` for row rendering.
- Import `RequestsColumns.jsx` for column config.

### Columns
- Create `RequestsColumns.jsx` to define:
  - Field headers
  - How each status or action is rendered
  - Add info buttons

### Panel and Forms
- Make a `AddRequestPanel.jsx` that switches between different request types (if needed).
- Create forms like `AddServiceRequestForm.jsx` to handle the actual data entry.

---

## Best practices

- Keep each product type form isolated and modular.
- Use `initialData` for editing mode and conditionally switch between *add* and *edit* buttons.
- Style consistently using Tailwind and reusable input components (`<Input>`, `<DateInput>`, `<FileInput>`).
- Use centralized color/status logic for stickers or badges.