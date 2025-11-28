"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Link,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  User,
  Pagination,
  Tooltip,
} from "@heroui/react";
import { EyeIcon, TrashIcon } from "@heroicons/react/24/solid";
import { userService } from "@/service/userService";
import { getProfilePictureUrl } from "@/utils/media";

import { SearchIcon, ChevronDownIcon, TeamsIcon } from "@/components/Icons";

// --- Constants ---

// --- Constants ---
const columns = [
  { name: "NAME", uid: "name", sortable: true },
  { name: "STATUS", uid: "status", sortable: true },
  { name: "SITE", uid: "esaSite", sortable: true },
  { name: "POSITION", uid: "position", sortable: true },
  { name: "BIRTHDAY", uid: "birthday", sortable: true },
  { name: "COUNTRY", uid: "country", sortable: true },
  { name: "DIRECTORATE", uid: "directorate", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

const statusOptions = [
  { name: "Active", uid: "active" },
  { name: "Blocked", uid: "blocked" },
];

const statusColorMap = {
  active: "success",
  blocked: "danger",
};

const INITIAL_VISIBLE_COLUMNS = ["name", "status", "position", "country", "directorate", "actions"];

export function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

export function TableUsers() {
  const [users, setUsers] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS));
  const [statusFilter, setStatusFilter] = useState("all");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "name",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const token = localStorage.getItem("token");
    userService.getAll(token).then((res) => {
      // Handle Strapi v4 response format ( { data: [...] } ) or direct array
      const usersData = Array.isArray(res) ? res : (res?.data || []);
      setUsers(usersData);
    }).catch(console.error);
  }, []);

  const handleRemove = async (id) => {
    try {
      await userService.remove(id, token);
      setUsers((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Failed to remove user:", err);
    }
  };

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    let filteredUsers = [...users];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        (user.username || "").toLowerCase().includes(filterValue.toLowerCase()) ||
        (user.email || "").toLowerCase().includes(filterValue.toLowerCase()) ||
        (user.firstName || "").toLowerCase().includes(filterValue.toLowerCase()) ||
        (user.lastName || "").toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
      filteredUsers = filteredUsers.filter((user) => {
        const status = user.blocked ? "blocked" : "active";
        return Array.from(statusFilter).includes(status);
      });
    }

    return filteredUsers;
  }, [users, filterValue, statusFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage) || 1;

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      let first = a[sortDescriptor.column];
      let second = b[sortDescriptor.column];

      if (sortDescriptor.column === "name") {
        first = `${a.firstName || ""} ${a.lastName || ""}`.trim().toLowerCase();
        second = `${b.firstName || ""} ${b.lastName || ""}`.trim().toLowerCase();
      } else if (sortDescriptor.column === "status") {
        first = a.blocked ? "blocked" : "active";
        second = b.blocked ? "blocked" : "active";
      }

      // Handle null/undefined/empty values
      // We want empty values to always be at the end, regardless of direction
      const isFirstEmpty = first === null || first === undefined || first === "";
      const isSecondEmpty = second === null || second === undefined || second === "";

      if (isFirstEmpty && isSecondEmpty) return 0;
      if (isFirstEmpty) return 1;
      if (isSecondEmpty) return -1;

      // Use localeCompare for strings to handle accents and case correctly
      if (typeof first === 'string' && typeof second === 'string') {
        const cmp = first.localeCompare(second);
        return sortDescriptor.direction === "descending" ? -cmp : cmp;
      }

      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, filteredItems]);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return sortedItems.slice(start, end);
  }, [page, sortedItems, rowsPerPage]);

  const renderCell = useCallback((user, columnKey) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      case "name":
        return (
          <Link href={`/user/${user.slug}`} className="no-underline text-default-700">
            <User
              avatarProps={{ radius: "lg", src: getProfilePictureUrl(user) }}
              description={user.email}
              name={`${user.firstName || ""} ${user.lastName || ""}`}
            >
              {user.email}
            </User>
          </Link>
        );
      case "role":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">User</p>
            {/* <p className="text-bold text-tiny capitalize text-default-700">{user.team}</p> */}
          </div>
        );
      case "status":
        const status = user.blocked ? "blocked" : "active";
        return (
          <Chip className="capitalize" color={statusColorMap[status]} size="sm" variant="flat">
            {status}
          </Chip>
        );
      case "actions":
        return (
          <div className="flex items-center justify-center gap-2">
            <Tooltip content="View profile" placement="bottom">
              <Button isIconOnly as="a" href={`/user/${user.slug}`} size="sm" variant="light">
                <EyeIcon className="h-5 w-5 text-slate-400" />
              </Button>
            </Tooltip>
            <Tooltip content="Connect on Teams" placement="bottom">
              <Button isIconOnly size="sm" variant="light">
                <TeamsIcon className="h-5 w-5 text-indigo-600" />
              </Button>
            </Tooltip>
            <Tooltip content="Delete user" placement="bottom">
              <Button isIconOnly onPress={() => handleRemove(user.id)} size="sm" variant="light">
                <TrashIcon className="h-5 w-5 text-red-800" />
              </Button>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }, [token]);

  const onNextPage = useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = useCallback((value) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by name..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
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
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-700 text-small">Total {users.length} users</span>
          <label className="flex items-center text-default-700 text-small">
            Rows per page:&nbsp;
            <select
              className="bg-transparent outline-solid outline-transparent text-default-700 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onRowsPerPageChange,
    users.length,
    onSearchChange,
    hasSearchFilter,
  ]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-700">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${filteredItems.length} selected`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onPreviousPage}>
            Previous
          </Button>
          <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onNextPage}>
            Next
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  return (
    <Table
      isHeaderSticky
      aria-label="Users table with custom cells, pagination and sorting"
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      selectedKeys={selectedKeys}
      // selectionMode="multiple"
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSelectionChange={setSelectedKeys}
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={"No users found"} items={items}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
