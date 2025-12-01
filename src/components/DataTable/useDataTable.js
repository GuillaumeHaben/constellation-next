import { useState, useEffect, useMemo, useCallback } from "react";

export function useDataTable({
    fetchData,
    columns,
    initialVisibleColumns,
    enableFiltering = true,
    enableSorting = true,
    enablePagination = true,
    enableStatusFilter = false,
    statusOptions = [],
    customSort = null,
    customFilter = null,
    initialRowsPerPage = 5,
    initialSortColumn = null,
}) {
    const [data, setData] = useState([]);
    const [filterValue, setFilterValue] = useState("");
    const [selectedKeys, setSelectedKeys] = useState(new Set([]));
    const [visibleColumns, setVisibleColumns] = useState(
        initialVisibleColumns ? new Set(initialVisibleColumns) : "all"
    );
    const [statusFilter, setStatusFilter] = useState("all");
    const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
    const [sortDescriptor, setSortDescriptor] = useState({
        column: initialSortColumn || (columns[0]?.uid || columns[0]?.key),
        direction: "ascending",
    });
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const result = await fetchData(token);
                const dataArray = Array.isArray(result) ? result : (result?.data || []);
                setData(dataArray);
            } catch (err) {
                console.error("Failed to fetch data:", err);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            loadData();
        }
    }, [token, fetchData]);

    const handleRemove = useCallback((removeFunc) => {
        return async (id) => {
            try {
                await removeFunc(id, token);
                setData((prev) => prev.filter((item) => {
                    // Support both id and documentId
                    return item.id !== id && item.documentId !== id;
                }));
            } catch (err) {
                console.error("Failed to remove item:", err);
            }
        };
    }, [token]);

    const hasSearchFilter = Boolean(filterValue);

    const headerColumns = useMemo(() => {
        if (visibleColumns === "all") return columns;
        return columns.filter((column) =>
            Array.from(visibleColumns).includes(column.uid || column.key)
        );
    }, [visibleColumns, columns]);

    const filteredItems = useMemo(() => {
        if (!enableFiltering) return data;

        let filtered = [...data];

        if (customFilter) {
            filtered = customFilter(filtered, filterValue, statusFilter);
        } else {
            if (hasSearchFilter) {
                const lowerFilter = filterValue.toLowerCase();
                filtered = filtered.filter((item) =>
                    Object.values(item).some((value) =>
                        String(value || "").toLowerCase().includes(lowerFilter)
                    )
                );
            }

            if (enableStatusFilter && statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
                filtered = filtered.filter((item) => {
                    const status = item.blocked ? "blocked" : "active";
                    return Array.from(statusFilter).includes(status);
                });
            }
        }

        return filtered;
    }, [data, filterValue, statusFilter, hasSearchFilter, enableFiltering, customFilter, enableStatusFilter, statusOptions.length]);

    const pages = enablePagination ? Math.ceil(filteredItems.length / rowsPerPage) || 1 : 1;

    const sortedItems = useMemo(() => {
        if (!enableSorting) return filteredItems;

        if (customSort) {
            return customSort(filteredItems, sortDescriptor);
        }

        return [...filteredItems].sort((a, b) => {
            let first = a[sortDescriptor.column];
            let second = b[sortDescriptor.column];

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
    }, [sortDescriptor, filteredItems, enableSorting, customSort]);

    const items = useMemo(() => {
        if (!enablePagination) return sortedItems;

        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return sortedItems.slice(start, end);
    }, [page, sortedItems, rowsPerPage, enablePagination]);

    const onNextPage = useCallback(() => {
        if (page < pages) setPage(page + 1);
    }, [page, pages]);

    const onPreviousPage = useCallback(() => {
        if (page > 1) setPage(page - 1);
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

    return {
        data,
        setData,
        loading,
        filterValue,
        selectedKeys,
        visibleColumns,
        statusFilter,
        rowsPerPage,
        sortDescriptor,
        page,
        pages,
        items,
        headerColumns,
        filteredItems,
        setFilterValue,
        setSelectedKeys,
        setVisibleColumns,
        setStatusFilter,
        setRowsPerPage,
        setSortDescriptor,
        setPage,
        onNextPage,
        onPreviousPage,
        onRowsPerPageChange,
        onSearchChange,
        onClear,
        handleRemove,
        hasSearchFilter,
    };
}
