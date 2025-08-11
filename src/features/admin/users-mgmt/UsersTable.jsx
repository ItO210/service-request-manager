import {
    useReactTable,
    getCoreRowModel,
    flexRender,
} from "@tanstack/react-table";
import { Fragment } from "react";
import AddUserPanel from "./AddUserPanel";

export default function UsersTable({
    data,
    columns,
    selectedUser,
    onCloseEdit,
    setReload,
}) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const getUserId = (user) => user.registrationNumber;

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
                            <tr className="bg-table-row border-b-4 border-background hover:bg-table-row-hover transition">
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

                            {selectedUser &&
                                getUserId(selectedUser) ===
                                    getUserId(row.original) && (
                                    <tr>
                                        <td colSpan={columns.length}>
                                            <AddUserPanel
                                                initialData={selectedUser}
                                                onClose={onCloseEdit}
                                                isEditing={true}
                                                setReload={setReload}
                                            />
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
