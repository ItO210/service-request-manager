import {
    useReactTable,
    getCoreRowModel,
    flexRender,
} from "@tanstack/react-table";
import { Fragment } from "react";
import AddEquipmentPanel from "./forms/AddEquipmentPanel";
import AddReagentPanel from "./forms/AddReagentPanel";
import AddMaterialPanel from "./forms/AddMaterialPanel";

const panelMap = {
    equipos: AddEquipmentPanel,
    reactivos: AddReagentPanel,
    materiales: AddMaterialPanel,
};

export default function InventoryTable({
    data,
    columns,
    selectedProduct,
    type,
    onCloseEdit,
}) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const PanelComponent = panelMap[type];

    const getProductId = (product) => {
        if (type === "equipos") return product.barcode;
        if (type === "reactivos") return product.barcode;
        if (type === "materiales") return product.barcode;
        return null;
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full table-auto rounded-lg overflow-hidden font-poppins border-collapse">
                <thead className="bg-dark-blue text-white text-lg border-b-6 border-background">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th
                                    key={header.id}
                                    className="px-4 py-5 text-left font-semibold break-words whitespace-normal min-w-[90px] max-w-[180px]"
                                >
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <Fragment key={row.id}>
                            <tr
                                key={row.id}
                                className="bg-table-row border-b-4 border-background hover:bg-table-row-hover transition"
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <td
                                        key={cell.id}
                                        className="px-4 py-3 text-black text-left text-sm whitespace-normal break-words break-all min-w-[90px] max-w-[180px]"
                                    >
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </td>
                                ))}
                            </tr>

                            {selectedProduct && getProductId(selectedProduct) ===
                                getProductId(row.original) && (
                                <tr>
                                    <td colSpan={columns.length}>
                                        {PanelComponent && (
                                        <PanelComponent
                                            initialData={selectedProduct}
                                            onClose={onCloseEdit}
                                            isEditing={true}
                                        />
                                        )}
                                    </td>
                                </tr>
                            )}
                        </Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
