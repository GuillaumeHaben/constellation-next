"use client";

import React from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
} from "@heroui/react";

export function DataTable({
    columns,
    items,
    headerColumns,
    renderCell,
    selectedKeys,
    sortDescriptor,
    onSelectionChange,
    onSortChange,
    topContent,
    bottomContent,
    emptyContent = "No items found",
    ariaLabel = "Data table",
    enableSorting = true,
    enableSelection = false,
}) {
    return (
        <Table
            isHeaderSticky
            aria-label={ariaLabel}
            bottomContent={bottomContent}
            bottomContentPlacement="inside"
            selectedKeys={selectedKeys}
            selectionMode={enableSelection ? "multiple" : undefined}
            sortDescriptor={enableSorting ? sortDescriptor : undefined}
            topContent={topContent}
            topContentPlacement="outside"
            onSelectionChange={enableSelection ? onSelectionChange : undefined}
            onSortChange={enableSorting ? onSortChange : undefined}
        >
            <TableHeader columns={headerColumns}>
                {(column) => (
                    <TableColumn
                        key={column.uid || column.key}
                        align={(column.uid || column.key) === "actions" ? "center" : "start"}
                        allowsSorting={enableSorting && column.sortable}
                    >
                        {column.name || column.label}
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody emptyContent={emptyContent} items={items}>
                {(item) => (
                    <TableRow key={item.id || item.documentId}>
                        {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
