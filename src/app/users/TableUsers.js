"use client";

import React, { useCallback } from "react";
import { DataTable, useDataTable, TableTopContent, TableBottomContent } from "@/components/DataTable";
import { userService } from "@/service/userService";
import { RenderCell } from "./components/RenderCell";
import { columns, statusOptions, INITIAL_VISIBLE_COLUMNS } from "./utils";

// Custom sort function for users
const customUserSort = (items, sortDescriptor) => {
  return [...items].sort((a, b) => {
    let first = a[sortDescriptor.column];
    let second = b[sortDescriptor.column];

    if (sortDescriptor.column === "name") {
      first = `${a.firstName || ""} ${a.lastName || ""}`.trim().toLowerCase();
      second = `${b.firstName || ""} ${b.lastName || ""}`.trim().toLowerCase();
    } else if (sortDescriptor.column === "status") {
      first = a.blocked ? "blocked" : "active";
      second = b.blocked ? "blocked" : "active";
    }

    const isFirstEmpty = first === null || first === undefined || first === "";
    const isSecondEmpty = second === null || second === undefined || second === "";

    if (isFirstEmpty && isSecondEmpty) return 0;
    if (isFirstEmpty) return 1;
    if (isSecondEmpty) return -1;

    if (typeof first === 'string' && typeof second === 'string') {
      const cmp = first.localeCompare(second);
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    }

    const cmp = first < second ? -1 : first > second ? 1 : 0;
    return sortDescriptor.direction === "descending" ? -cmp : cmp;
  });
};

// Custom filter function for users
const customUserFilter = (items, filterValue, statusFilter) => {
  let filtered = [...items];

  if (filterValue) {
    const lowerFilter = filterValue.toLowerCase();
    filtered = filtered.filter((user) =>
      (user.username || "").toLowerCase().includes(lowerFilter) ||
      (user.email || "").toLowerCase().includes(lowerFilter) ||
      (user.firstName || "").toLowerCase().includes(lowerFilter) ||
      (user.lastName || "").toLowerCase().includes(lowerFilter)
    );
  }

  if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
    filtered = filtered.filter((user) => {
      const status = user.blocked ? "blocked" : "active";
      return Array.from(statusFilter).includes(status);
    });
  }

  return filtered;
};

export function TableUsers() {
  const tableState = useDataTable({
    fetchData: userService.getAll,
    columns,
    initialVisibleColumns: INITIAL_VISIBLE_COLUMNS,
    enableFiltering: true,
    enableSorting: true,
    enablePagination: true,
    enableStatusFilter: true,
    statusOptions,
    customSort: customUserSort,
    customFilter: customUserFilter,
    initialRowsPerPage: 5,
    initialSortColumn: "name",
  });

  const {
    data,
    filterValue,
    selectedKeys,
    visibleColumns,
    statusFilter,
    sortDescriptor,
    page,
    pages,
    items,
    headerColumns,
    filteredItems,
    setSelectedKeys,
    setVisibleColumns,
    setStatusFilter,
    setSortDescriptor,
    setPage,
    onNextPage,
    onPreviousPage,
    onRowsPerPageChange,
    onSearchChange,
    onClear,
    handleRemove,
  } = tableState;

  const onRemove = handleRemove(userService.remove);

  const renderCell = useCallback((user, columnKey) => {
    return <RenderCell user={user} columnKey={columnKey} onRemove={onRemove} />;
  }, [onRemove]);

  return (
    <DataTable
      columns={columns}
      items={items}
      headerColumns={headerColumns}
      renderCell={renderCell}
      selectedKeys={selectedKeys}
      sortDescriptor={sortDescriptor}
      onSelectionChange={setSelectedKeys}
      onSortChange={setSortDescriptor}
      topContent={
        <TableTopContent
          filterValue={filterValue}
          onClear={onClear}
          onSearchChange={onSearchChange}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          visibleColumns={visibleColumns}
          setVisibleColumns={setVisibleColumns}
          dataLength={data.length}
          onRowsPerPageChange={onRowsPerPageChange}
          columns={columns}
          statusOptions={statusOptions}
          enableSearch={true}
          enableStatusFilter={true}
          enableColumnFilter={true}
          enableRowsPerPage={true}
          searchPlaceholder="Search by name..."
          entityName="users"
        />
      }
      bottomContent={
        <TableBottomContent
          selectedKeys={selectedKeys}
          filteredItemsLength={filteredItems.length}
          page={page}
          pages={pages}
          setPage={setPage}
          onPreviousPage={onPreviousPage}
          onNextPage={onNextPage}
          enablePagination={true}
        />
      }
      ariaLabel="Users table with custom cells, pagination and sorting"
      enableSorting={true}
      enableSelection={false}
    />
  );
}
