import { apiFetch } from "@/utils/apiFetch";
import { useEffect, useState } from "react";
import TableToolbar from "../components/ui/TableToolbar";
import UsersTable from "@/features/admin/users-mgmt/UsersTable";
import { UsersColumns } from "@/features/admin/users-mgmt/UsersColumns";
import AddUserModalPanel from "@/features/admin/users-mgmt/AddUserModalPanel";
import PaginationControls from "@/components/PaginationControls";

export default function UsersManagement() {
    const [search, setSearch] = useState("");
    const [activeFilters, setActiveFilters] = useState({});
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [reload, setReload] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isAddingMode, setIsAddingMode] = useState(false);

    // Pagination
    const [page, setPage] = useState(1); // Current page
    useEffect(() => {
        setPage(1);
    }, []);
    const [pageSize, setPageSize] = useState(5); // Number of items per page
    const [totalItems, setTotalItems] = useState(0); // Total number of items

    const handleEdit = (user) => {
        if (selectedUser?.registrationNumber === user.registrationNumber) {
            setSelectedUser(null);
        } else {
            setSelectedUser(user);
            setIsAddingMode(false);
        }
    };

    const columns = UsersColumns(handleEdit, selectedUser);

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
                const data = await apiFetch(`/user?page=${effectivePage}&limit=${effectiveLimit}`);

                setData(data.users);
                setTotalItems(data.total);
            } catch (err) {
                setError(err);
            }
        };

        if (!isAddingMode && !selectedUser) {
            fetchData();
        }
    }, [page, pageSize, reload, isAddingMode, selectedUser, hasSearchOrFilters]);

    if (!data) {
        return (
            <p className="p-4 text-red-600 font-poppins">
                Cargando datos de usuarios
            </p>
        );
    }

    const normalizeText = (text) =>
        text
            ?.normalize("NFD")
            .replace(/[\u0301\u0300\u0302\u0308\u0304\u0307]/g, "")
            .toLowerCase();

    const searchedItem = normalizeText(search);

    const filteredData = data.filter((user) => {
        const matchesSearch = (() => {
            if (!searchedItem) return true;
            return (
                normalizeText(user.name).includes(searchedItem) ||
                normalizeText(user.registrationNumber).includes(searchedItem) ||
                normalizeText(user.email).includes(searchedItem)
            );
        })();

        const matchesFilters = Object.entries(activeFilters).every(([key, values]) => {
            if (!values || values.length === 0) return true;
            const field = user[key];
            if (Array.isArray(field)) {
                return values.some((val) => field.includes(val));
            }
            return values.includes(field);
        });

        return matchesSearch && matchesFilters;
    });

    const paginatedFilteredData = hasSearchOrFilters
        ? filteredData.slice((page - 1) * pageSize, page * pageSize)
        : filteredData;

    return (
        <div className="p-4 -mt-1 w-full max-w-full overflow-x-hidden">
            <h2 className="font-poppins text-2xl font-semibold mb-2">
                Gestión de usuarios
            </h2>
            <h3 className="font-montserrat text-base font-normal mb-4">
                Administre los usuarios: cree nuevos, edite información o
                elimínelos según sea necesario.
            </h3>
            <TableToolbar
                type="users"
                searchTerm={search}
                onSearchChange={setSearch}
                onAddClick={() => {
                    setIsAddingMode(true);
                    setSelectedUser(null);
                }}
                data={data}
                onFiltersChange={setActiveFilters}
            />
            {Array.isArray(data) && data.length === 0 ? (
                <div className="flex items-center justify-center h-[60vh] text-gray-500 font-montserrat text-4xl font-semibold text-center">
                    No hay usuarios registrados
                </div>
            ) : filteredData.length === 0 ? (
                <div className="flex items-center justify-center h-[60vh] text-gray-500 font-montserrat text-4xl font-semibold text-center">
                    {search
                        ? `No se encontraron usuarios para "${search}"`
                        : Object.values(activeFilters).some((arr) => Array.isArray(arr) && arr.length > 0)
                            ? "No se encontraron usuarios con los filtros aplicados"
                            : "No hay resultados disponibles"
                    }
                </div>
            ) : (
                <>
                    <div className="min-h-[400px] flex flex-col justify-between">
                        <UsersTable
                            data={paginatedFilteredData}
                            columns={columns}
                            selectedUser={selectedUser}
                            onCloseEdit={() => setSelectedUser(null)}
                            setReload={setReload}
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
                            type="usuario"
                        />
                    </div>
                </>
            )}
            {isAddingMode && (
                <AddUserModalPanel
                    onClose={() => setIsAddingMode(false)}
                    isEditing={false}
                    setReload={setReload}
                />
            )}
        </div>
    );
}
