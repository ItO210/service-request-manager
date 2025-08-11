import { apiFetch } from "@/utils/apiFetch";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import TableToolbar from "../components/ui/TableToolbar";
import InventoryTable from "../features/admin/inventory-mgmt/InventoryTable";
import { EquipmentColumns } from "../features/admin/inventory-mgmt/columns/EquipmentColumns.jsx";
import { MaterialColumns } from "../features/admin/inventory-mgmt/columns/MaterialColumns.jsx";
import { ReagentColumns } from "../features/admin/inventory-mgmt/columns/ReagentColumns.jsx";
import AddProductPanel from "../features/admin/inventory-mgmt/AddProductPanel";
import PaginationControls from "@/components/PaginationControls";

const columnsMap = {
    // For the table columns
    equipos: EquipmentColumns,
    materiales: MaterialColumns,
    reactivos: ReagentColumns,
};

const apiEndpoints = {
    // For the API endpoints
    equipos: `/equipment`,
    reactivos: `/reagent`,
    materiales: `/materials`,
};

const dataKeyMap = {
    // Backend key mapping to frontend
    equipos: "equipments",
    materiales: "materials",
    reactivos: "reagents",
};

export default function GenericInventory() {
    const { type } = useParams();
    const [search, setSearch] = useState("");
    const [activeFilters, setActiveFilters] = useState({});
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [reload, setReload] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isAddingMode, setIsAddingMode] = useState(false);

    // Pagination
    const [page, setPage] = useState(1); // Current page
    const [pageSize, setPageSize] = useState(5); // Number of items per page
    const [totalItems, setTotalItems] = useState(0); // Total number of items

    useEffect(() => {
        setSearch("");
        setActiveFilters({});
        setPage(1);
        setSelectedProduct(null);
        setIsAddingMode(false);
    }, [type]);

    const getProductId = (product, type) => {
        // Function to get the product ID based on the type
        if (!product) return null;
        if (type === "equipos") return product.barcode;
        if (type === "reactivos") return product.barcode;
        if (type === "materiales") return product.barcode;
        return null;
    };

    const handleEdit = (product) => {
        // If the product is already selected, deselect it
        if (
            selectedProduct &&
            getProductId(selectedProduct, type) === getProductId(product, type)
        ) {
            setSelectedProduct(null); // Deselect the product
        } else {
            // Otherwise, select the product
            setSelectedProduct(product);
            setIsAddingMode(false); // Close the add panel if it's open
        }
    };

    const columns =
        typeof columnsMap[type] === "function"
            ? columnsMap[type](handleEdit, selectedProduct)
            : null;

    const hasSearchOrFilters = !!search.trim() || Object.values(activeFilters).some(arr => Array.isArray(arr) && arr.length > 0);

    useEffect(() => {
        if (hasSearchOrFilters) {
            setPage(1);
        }
    }, [search, activeFilters]);

    useEffect(() => {
        const effectivePage = hasSearchOrFilters ? 1 : page;
        const effectiveLimit = hasSearchOrFilters ? 9999999999 : pageSize;

        const fetchData = async () => {
            try {
                const data = await apiFetch(
                    `${apiEndpoints[type]}?page=${effectivePage}&limit=${effectiveLimit}`
                );
                const dataKey = dataKeyMap[type];
                setData(data[dataKey]);
                setTotalItems(data.total);
            } catch (err) {
                setError(err);
            }
        };

        if (!isAddingMode && !selectedProduct) {
            fetchData();
        }
    }, [type, page, pageSize, reload, isAddingMode, selectedProduct, hasSearchOrFilters]);

    if (!columns || !data) {
        return (
            <p className="p-4 text-red-600 font-poppins">
                Tipo de inventario no válido: {type}
            </p>
        );
    }

    const normalizeText = (text) =>
        (text ?? "")
            .normalize("NFD")
            .replace(/[\u0301\u0300\u0302\u0308\u0304\u0307]/g, "")
            .toLowerCase();

    const searchedItem = normalizeText(search);

    const filteredData = data.filter((item) => {
        const matchesSearch = (() => {
            if (!searchedItem) return true;
            if (type === "equipos") {
                return (
                    normalizeText(item.inventoryNumber).includes(
                        searchedItem
                    ) ||
                    normalizeText(item.equipmentName).includes(searchedItem) ||
                    normalizeText(item.equipmentBrand).includes(searchedItem) ||
                    normalizeText(item.equipmentModel).includes(searchedItem) ||
                    normalizeText(item.location).includes(searchedItem) ||
                    item.barcode === search
                );
            }

            if (type === "reactivos") {
                return (
                    normalizeText(item.reagentCode).includes(searchedItem) ||
                    normalizeText(item.reagentName).includes(searchedItem) ||
                    normalizeText(item.reagentBrand).includes(searchedItem) ||
                    normalizeText(item.location).includes(searchedItem) ||
                    item.barcode === search
                );
            }

            if (type === "materiales") {
                return (
                    normalizeText(item.materialDescription).includes(
                        searchedItem
                    ) ||
                    normalizeText(item.materialCatalog).includes(
                        searchedItem
                    ) ||
                    normalizeText(item.materialBrand).includes(searchedItem) ||
                    normalizeText(item.location).includes(searchedItem) ||
                    item.barcode === search
                );
            }

            return true;
        })();

        const matchesFilters = Object.entries(activeFilters).every(
            ([key, values]) => {
                if (!values || values.length === 0) return true;
                const field = item[key];
                if (Array.isArray(field)) {
                    return values.some((val) => field.includes(val));
                }
                return values.includes(field);
            }
        );

        return matchesSearch && matchesFilters;
    });

    const paginatedFilteredData = hasSearchOrFilters
        ? filteredData.slice((page - 1) * pageSize, page * pageSize)
        : filteredData;

    return (
        <section className="p-4 -mt-1 w-full max-w-full overflow-x-hidden">
            <h2 className="font-poppins text-2xl font-semibold mb-2">
                {type ? `Inventario de ${type}` : "Inventario"}
            </h2>
            <h3 className="font-montserrat text-base font-normal mb-4">
                {type
                    ? `Gestione el inventario: agregue, edite o elimine ${type}, y visualice sus detalles.`
                    : "Gestione el inventario"}
            </h3>

            {!columns || !data ? (
                <p className="p-4 text-red-600 font-poppins">
                    Cargando datos del inventario
                </p>
            ) : (
                <>
                    <TableToolbar
                        type={type}
                        searchTerm={search}
                        onSearchChange={setSearch}
                        onAddClick={() => {
                            setIsAddingMode(true);
                            setSelectedProduct(null);
                        }}
                        data={data}
                        onFiltersChange={setActiveFilters}
                    />
                    {Array.isArray(data) && data.length === 0 ? (
                        <div className="flex items-center justify-center h-[60vh] text-gray-500 font-montserrat text-4xl font-semibold text-center">
                            No hay {type} disponibles en el inventario
                        </div>
                    ) : filteredData.length === 0 ? (
                        <div className="flex items-center justify-center h-[60vh] text-gray-500 font-montserrat text-4xl font-semibold text-center">
                            {search
                                ? `No se encontraron ${type} para "${search}"`
                                : Object.values(activeFilters).some(
                                      (arr) =>
                                          Array.isArray(arr) && arr.length > 0
                                  )
                                ? `No se encontraron ${type} con los filtros aplicados`
                                : "No hay resultados disponibles"}
                        </div>
                    ) : (
                        <>
                            <div className="min-h-[400px] flex flex-col justify-between">
                                <InventoryTable
                                    data={paginatedFilteredData}
                                    columns={columns}
                                    selectedProduct={selectedProduct}
                                    type={type}
                                    onCloseEdit={() => setSelectedProduct(null)}
                                    page={page}
                                    setPage={setPage}
                                    pageSize={pageSize}
                                    setPageSize={setPageSize}
                                    totalItems={totalItems}
                                />
                            </div>
                            <div className="mt-15">
                                <PaginationControls
                                    page={page}
                                    setPage={setPage}
                                    pageSize={pageSize}
                                    setPageSize={setPageSize}
                                    totalItems={hasSearchOrFilters ? filteredData.length : totalItems}
                                    type={type}
                                />
                            </div>
                        </>
                    )}
                </>
            )}
            {isAddingMode && (
                <AddProductPanel
                    type={type}
                    onClose={() => setIsAddingMode(false)}
                    selectedProduct={selectedProduct}
                    setReload={setReload}
                />
            )}
        </section>
    );
}
