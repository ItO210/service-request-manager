import { Icon } from "@iconify/react";

export default function PaginationControls({
    page,
    setPage,
    pageSize,
    setPageSize,
    totalItems,
    type = "registros",
    isAbsolute = true,
}) {
    const totalPages = Math.ceil(totalItems / pageSize);
    const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, totalItems);

    const pluralize = (word, count) => {
        const irregulars = {
            material: "materiales",
            solicitud: "solicitudes",
            equipo: "equipos",
            reactivo: "reactivos",
            usuario: "usuarios",
            movimiento: "movimientos"
        };
        if (count === 1) return word;
        if (irregulars[word]) return irregulars[word];
        if (word.endsWith("z")) return word.slice(0, -1) + "ces";
        if (word.endsWith("s")) return word;
        return word + "s";
    };

    return (
        <div
            className={`${
                isAbsolute ? "absolute bottom-10 left-0" : ""
            } w-full px-6 md:px-10 flex flex-row justify-between items-center gap-4 pt-4 font-montserrat font-medium text-sm text-gray-500 leading-tight`}
        >
            <p className="text-center sm:text-left flex items-center gap-2">
                Mostrando {start} a {end} de {totalItems}{" "}
                {pluralize(type, totalItems)}
            </p>

            <div className="flex items-center gap-2">
                <label htmlFor="rows" className="text-gray-500 sr-only">
                    Número de filas por página
                </label>
                <select
                    id="rows"
                    className="rounded-md border px-1 py-1 cursor-pointer focus:ring-2 focus:border-none focus:ring-primary-blue focus:outline-none"
                    value={pageSize}
                    onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setPage(1);
                    }}
                >
                    {[5, 10, 15, 20].map((size) => (
                        <option key={size} value={size}>
                            {size}
                        </option>
                    ))}
                </select>
                <button
                    className="py-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    onClick={() => setPage(1)}
                    disabled={page === 1}
                    aria-label="Página inicial"
                >
                    <Icon
                        icon="material-symbols:keyboard-double-arrow-left-rounded"
                        className="text-gray-500 text-2xl hover:text-primary-blue transition-colors"
                    />
                </button>
                <button
                    className="py-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={page === 1}
                    aria-label="Página anterior"
                >
                    <Icon
                        icon="material-symbols:chevron-left-rounded"
                        className="text-gray-500 text-2xl hover:text-primary-blue transition-colors"
                    />
                </button>
                {(() => {
                    const maxButtons = 5;
                    let startPage = Math.max(1, page - Math.floor(maxButtons / 2));
                    let endPage = startPage + maxButtons - 1;

                    if (endPage > totalPages) {
                        endPage = totalPages;
                        startPage = Math.max(1, endPage - maxButtons + 1);
                    }

                    const visiblePages = [];
                    for (let p = startPage; p <= endPage; p++) {
                        visiblePages.push(p);
                    }

                    return visiblePages.map((p) => (
                        <button
                            key={p}
                            className={`w-6 h-6 rounded-sm cursor-pointer ${
                                p === page
                                    ? "bg-primary-blue text-white transition-colors"
                                    : "border bg-gray-50 border-gray-300 text-gray-700 hover:border-primary-blue transition-colors"
                            }`}
                            onClick={() => setPage(p)}
                            aria-label={`Ir a página ${p}`}
                        >
                            {p}
                        </button>
                    ));
                })()}
                <button
                    className="py-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    disabled={page === totalPages}
                    aria-label="Página siguiente"
                >
                    <Icon
                        icon="material-symbols:chevron-right-rounded"
                        className="text-gray-500 text-2xl hover:text-primary-blue transition-colors"
                    />
                </button>
                <button
                    className="py-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    onClick={() => setPage(totalPages)}
                    disabled={page === totalPages}
                    aria-label="Página final"
                >
                    <Icon
                        icon="material-symbols:keyboard-double-arrow-right-rounded"
                        className="text-gray-500 text-2xl hover:text-primary-blue transition-colors"
                    />
                </button>
            </div>
        </div>
    );
}
