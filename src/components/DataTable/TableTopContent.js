import React from "react";
import {
    Input,
    Button,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
} from "@heroui/react";
import { SearchIcon, ChevronDownIcon } from "@/components/Icons";

function capitalize(s) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

export function TableTopContent({
    filterValue,
    onClear,
    onSearchChange,
    statusFilter,
    setStatusFilter,
    visibleColumns,
    setVisibleColumns,
    dataLength,
    onRowsPerPageChange,
    columns,
    statusOptions = [],
    enableSearch = true,
    enableStatusFilter = false,
    enableColumnFilter = true,
    enableRowsPerPage = true,
    searchPlaceholder = "Search...",
    entityName = "items",
    rowsPerPage = 10 // Default fallback if not provided
}) {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between gap-3 items-end">
                {enableSearch && (
                    <Input
                        isClearable
                        className="w-full sm:max-w-[44%]"
                        placeholder={searchPlaceholder}
                        startContent={<SearchIcon />}
                        value={filterValue}
                        onClear={onClear}
                        onValueChange={onSearchChange}
                    />
                )}
                <div className="flex gap-3">
                    {enableStatusFilter && statusOptions.length > 0 && (
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                                    Status
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Status Filter"
                                closeOnSelect={false}
                                selectedKeys={statusFilter}
                                selectionMode="multiple"
                                onSelectionChange={setStatusFilter}
                            >
                                {statusOptions.map((status) => (
                                    <DropdownItem key={status.uid} className="capitalize">
                                        {capitalize(status.name)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                    )}
                    {enableColumnFilter && (
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                                    Columns
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={visibleColumns}
                                selectionMode="multiple"
                                onSelectionChange={setVisibleColumns}
                            >
                                {columns.map((column) => (
                                    <DropdownItem key={column.uid || column.key} className="capitalize">
                                        {capitalize(column.name || column.label)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                    )}
                </div>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-default-700 text-small">Total {dataLength} {entityName}</span>
                {enableRowsPerPage && (
                    <label className="flex items-center text-default-700 text-small">
                        Rows per page:&nbsp;
                        <select
                            className="bg-transparent outline-solid outline-transparent text-default-700 text-small"
                            onChange={onRowsPerPageChange}
                            value={rowsPerPage}
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                        </select>
                    </label>
                )}
            </div>
        </div>
    );
}
