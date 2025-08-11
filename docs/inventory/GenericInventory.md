# `GenericInventory.jsx`

This component is the **main entry point for the inventory views** in CICATA Nexus. It dynamically renders the full inventory management interface based on the `type` provided in the URL, allowing the system to handle:

- Equipment Inventory (`/inventario/equipos`)
- Reagent Inventory (`/inventario/reactivos`)
- Material Inventory (`/inventario/materiales`)

---

## Purpose

To abstract the logic of managing **multiple inventory types** (equipment, reagents, materials) into a single, flexible, and scalable page component.

---

## Structure & logic

### 1. **Dynamic imports**

```js
const { type } = useParams();
```

- Grabs the `type` from the route (e.g., `equipos`, `materiales`, or `reactivos`).
- This `type` determines everything: API endpoint, table columns, form components.

---

### 2. **Mapping constants**

```js
const columnsMap = { ... };
const addPanelMap = { ... };
const apiEndpoints = { ... };
```

- These maps link the type to the right components and endpoints.

---

### 3. **Data Fetching**

```js
useEffect(() => {
    const fetchData = async () => {
        ...
        const response = await fetch(apiEndpoints[type]);
        ...
    };
    fetchData();
}, [type]);
```

- Fetches data from the backend based on the inventory type.
- Automatically re-runs if `type` changes (e.g. navigating from `/equipos` to `/reactivos`).

---

### 4. **UI rendering**

```jsx
<InventoryTable 
    data={data} 
    columns={columns}
    selectedProduct={selectedProduct}
    type={type}
    onCloseEdit={() => setSelectedProduct(null)}
/>
```

- Dynamically renders the table using the correct column definition.
- Supports row selection and inline editing.

---

### 5. **Add Product Panel**

```jsx
{isAddingMode && (
    <AddProductPanel
        type={type}
        onClose={() => setIsAddingMode(false)}
    />
)}
```

- Renders the `AddProductPanel` overlay based on type.
- The `AddProductPanel` will then decide whether to show the form for equipment, reagents, or materials.

---

## How to replicate this pattern

To apply this same architecture for **Requests Management** or **Users**:

1. Create a similar component (e.g. `GenericRequests.jsx`)
2. Replace the `columnsMap`, `addPanelMap`, and `apiEndpoints` with values for requests.
3. Use `useParams()` to determine type.
4. Build individual forms and column files per type.
5. Hook it up to the backend using `fetch`.

---

## Dependencies

- React Router: for `useParams()`
- TanStack Table: for table rendering
- Local component dependencies:
  - `InventoryTable`
  - `AddProductPanel`
  - `TableToolbar`
  - `*Columns.jsx` and `Add*Panel.jsx`

---

## Summary

`GenericInventory.jsx` is a smart, reusable, and scalable solution for managing various inventory types through a single route-based dynamic component. It connects all pieces of the inventory module and enables full CRUD interaction.
