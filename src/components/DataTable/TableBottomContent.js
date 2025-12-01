import React from "react";
import { Pagination, Button } from "@heroui/react";

export function TableBottomContent({
    selectedKeys,
    filteredItemsLength,
    page,
    pages,
    setPage,
    onPreviousPage,
    onNextPage,
    enablePagination = true,
}) {
    if (!enablePagination) return null;

    return (
        <div className="py-2 px-2 flex justify-between items-center">
            <span className="w-[30%] text-small text-default-700">
                {selectedKeys === "all"
                    ? "All items selected"
                    : `${selectedKeys.size} of ${filteredItemsLength} selected`}
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
}
