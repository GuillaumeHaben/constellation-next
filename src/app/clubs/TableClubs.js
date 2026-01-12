"use client";

import React, { useCallback, useState } from "react";
import { Button } from "@heroui/react";
import { DataTable, useDataTable, TableTopContent, TableBottomContent } from "@/components/DataTable";
import { clubService } from "@/service/clubService";
import { ModalClub } from "./ModalClub";
import { RenderCell } from "./components/RenderCell";
import { useAuth } from "@/context/AuthContext";

const columns = [
  { key: "id", label: "ID", sortable: true },
  { key: "name", label: "NAME", sortable: true },
  { key: "owner", label: "OWNER", sortable: true },
  { key: "creation", label: "CREATION", sortable: true },
  { key: "actions", label: "ACTIONS", sortable: false },
];

const INITIAL_VISIBLE_COLUMNS = ["name", "owner", "creation", "actions"];

// Custom sort function
const customClubSort = (items, sortDescriptor) => {
  return [...items].sort((a, b) => {
    let first = a[sortDescriptor.column];
    let second = b[sortDescriptor.column];

    if (sortDescriptor.column === "owner") {
      first = a.owner ? `${a.owner.firstName || ""} ${a.owner.lastName || ""}` : "";
      second = b.owner ? `${b.owner.firstName || ""} ${b.owner.lastName || ""}` : "";
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

    if (first < second) return sortDescriptor.direction === "descending" ? 1 : -1;
    if (first > second) return sortDescriptor.direction === "descending" ? -1 : 1;
    return 0;
  });
};

// Custom filter function
const customClubFilter = (items, filterValue) => {
  if (!filterValue) return items;
  const lower = filterValue.toLowerCase();
  return items.filter(item =>
    (item.name || "").toLowerCase().includes(lower) ||
    (item.description || "").toLowerCase().includes(lower)
  );
};

export function TableClubs() {
  const { user: currentUser } = useAuth();
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedClub, setSelectedClub] = useState(null);

  const canCreate = currentUser?.role?.name === 'Manager' || currentUser?.role?.name === 'Admin';
  const isAdmin = currentUser?.role?.name === 'Admin';

  const tableState = useDataTable({
    fetchData: clubService.getAll,
    columns,
    initialVisibleColumns: INITIAL_VISIBLE_COLUMNS,
    enableFiltering: true,
    enableSorting: true,
    enablePagination: true,
    initialRowsPerPage: 10,
    initialSortColumn: "name",
    customSort: customClubSort,
    customFilter: customClubFilter
  });

  const {
    data,
    setData,
    items,
    headerColumns,
    selectedKeys,
    sortDescriptor,
    filterValue,
    visibleColumns,
    page,
    pages,
    filteredItems,
    setSelectedKeys,
    setSortDescriptor,
    setPage,
    setVisibleColumns,
    onNextPage,
    onPreviousPage,
    onRowsPerPageChange,
    onSearchChange,
    onClear,
    handleRemove: originalHandleRemove,
  } = tableState;

  const handleRemove = (id) => {
    if (window.confirm("Are you sure you want to delete this club? This action cannot be undone.")) {
      clubService.delete(id).then(() => {
        // Basic state update for removal from list would be handled if useDataTable exposes it directly or we trigger a refetch.
        // But useDataTable's handleRemove typically returns a function that does the optimistic/state update.
        // We need to check how tableState.handleRemove works. 
        // Actually, tableState.handleRemove returns a function that calls the service AND updates state.
        // So we should wrap THAT function.
      });
    }
  };

  // Actually, tableState.handleRemove is higher order. 
  // const onRemove = tableState.handleRemove(service.delete);
  // We need to intercept.

  const onRemove = useCallback((id) => {
    if (window.confirm("Are you sure you want to delete this club? This action cannot be undone.")) {
      // We can't easily access the internal state updater of useDataTable if we bypass handleRemove wrapper
      // UNLESS handleRemove takes the service function and returns a handler.
      // Let's check useDataTable usage in TableUsers: const onRemove = handleRemove(userService.delete);
      // If we want confirmation, we must pass a wrapper to handleRemove? 
      // No, handleRemove(serviceFn) returns a function that takes ID.
      // So we can wrap THAT.

      tableState.handleRemove(clubService.delete)(id);
    }
  }, [tableState]);

  const handleCreate = async (name, description, creation) => {
    try {
      const token = localStorage.getItem("token");
      const created = await clubService.create({ name, description, creation }, token);
      const newClub = { ...created.data, owner: currentUser };
      setData((prev) => [...prev, newClub]);
    } catch (err) {
      console.error("Failed to create club:", err);
    }
  };

  const handleUpdate = async (documentId, name, description, creation) => {
    try {
      const token = localStorage.getItem("token");
      const updated = await clubService.update(documentId, name, description, creation, token);
      setData((prev) =>
        prev.map((club) =>
          club.documentId === documentId ? { ...updated.data, owner: club.owner } : club
        )
      );
    } catch (err) {
      console.error("Failed to update club:", err);
    }
  };

  const onEdit = (club) => {
    setSelectedClub(club);
    setModalOpen(true);
  };

  const renderCell = useCallback((club, columnKey) => {
    // Logic for permissions:
    // Admin sees everything.
    // Manager seeing own club.
    const ownerId = club.owner?.id;
    const currentUserId = currentUser?.id;
    const ownerDocId = club.owner?.documentId;
    const currentUserDocId = currentUser?.documentId;

    const isOwner = (ownerId && ownerId === currentUserId) || (ownerDocId && ownerDocId === currentUserDocId);
    const canEdit = isAdmin || (isOwner && currentUser?.role?.name === 'Manager');
    const canDelete = isAdmin || (isOwner && currentUser?.role?.name === 'Manager');

    return (
      <RenderCell
        club={club}
        columnKey={columnKey}
        onEdit={onEdit}
        onRemove={onRemove}
        canEdit={canEdit}
        canDelete={canDelete}
      />
    );
  }, [onRemove, currentUser, isAdmin]);

  return (
    <>
      <ModalClub
        isOpen={isModalOpen}
        onOpenChange={setModalOpen}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        initialData={selectedClub}
      />

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
            visibleColumns={visibleColumns}
            setVisibleColumns={setVisibleColumns}
            dataLength={data.length}
            onRowsPerPageChange={onRowsPerPageChange}
            columns={columns}
            enableSearch={true}
            enableColumnFilter={true}
            enableRowsPerPage={true}
            searchPlaceholder="Search by name..."
            entityName="clubs"
          />
        }
        ariaLabel="Clubs table"
        enableSorting={true}
        enableSelection={false}
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
      />

      <div className="flex justify-between items-center mt-4">
        {canCreate && (
          <Button
            color="primary"
            onPress={() => {
              setSelectedClub(null);
              setModalOpen(true);
            }}
          >
            Create a new club
          </Button>
        )}
      </div>

    </>
  );
}
