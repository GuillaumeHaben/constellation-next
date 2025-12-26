"use client";

import React, { useCallback, useState } from "react";
import { Button, Tooltip } from "@heroui/react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import { DataTable, useDataTable } from "@/components/DataTable";
import { clubService } from "@/service/clubService";
import { ModalClub } from "./ModalClub";

const columns = [
  { key: "id", label: "ID", sortable: true },
  { key: "name", label: "NAME", sortable: true },
  { key: "description", label: "DESCRIPTION", sortable: false },
  { key: "creation", label: "CREATION", sortable: true },
  { key: "actions", label: "ACTIONS", sortable: false },
];

export function TableClubs() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedClub, setSelectedClub] = useState(null);

  const tableState = useDataTable({
    fetchData: clubService.getAll,
    columns,
    initialVisibleColumns: null, // Show all columns
    enableFiltering: false,
    enableSorting: true,
    enablePagination: false,
    initialSortColumn: "name",
  });

  const {
    data,
    setData,
    selectedKeys,
    sortDescriptor,
    items,
    headerColumns,
    setSelectedKeys,
    setSortDescriptor,
    handleRemove,
  } = tableState;

  const onRemove = handleRemove(clubService.delete);

  const handleCreate = async (name, description) => {
    try {
      const token = localStorage.getItem("token");
      const created = await clubService.create({ name, description }, token);
      setData((prev) => [...prev, created.data]);
    } catch (err) {
      console.error("Failed to create club:", err);
    }
  };

  const handleUpdate = async (documentId, name, description) => {
    try {
      const token = localStorage.getItem("token");
      const updated = await clubService.update(documentId, name, description, token);
      setData((prev) =>
        prev.map((club) =>
          club.documentId === documentId ? updated.data : club
        )
      );
    } catch (err) {
      console.error("Failed to update club:", err);
    }
  };

  const renderCell = useCallback((club, columnKey) => {
    const cellValue = club[columnKey];

    switch (columnKey) {
      case "actions":
        return (
          <div className="flex items-center justify-center gap-2">
            <Tooltip content="Edit club" placement="bottom">
              <Button
                isIconOnly
                onPress={() => {
                  setSelectedClub(club);
                  setModalOpen(true);
                }}
              >
                <PencilSquareIcon className="h-5 w-5 text-yellow-500" />
              </Button>
            </Tooltip>
            <Tooltip content="Delete club" placement="bottom">
              <Button isIconOnly onClick={() => onRemove(club.documentId)}>
                <TrashIcon className="h-5 w-5 text-red-500" />
              </Button>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }, [onRemove]);

  return (
    <>

      <ModalClub
        isOpen={isModalOpen}
        onOpenChange={setModalOpen}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        initialData={selectedClub}
      />

      <Button
        color="success"
        onPress={() => {
          setSelectedClub(null);
          setModalOpen(true);
        }}
      >
        Create a club
      </Button>

      <br /><br />

      <DataTable
        columns={columns}
        items={items}
        headerColumns={headerColumns}
        renderCell={renderCell}
        selectedKeys={selectedKeys}
        sortDescriptor={sortDescriptor}
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
        ariaLabel="Clubs table"
        enableSorting={true}
        enableSelection={false}
      />
    </>
  );
}
