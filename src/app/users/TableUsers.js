import { PencilSquareIcon, EyeIcon } from "@heroicons/react/24/solid";
import { TrashIcon } from "@heroicons/react/24/solid";
import {
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
} from "@heroui/react";
import { userService } from "@/service/userService";
import { useEffect, useState } from "react";

const columns = [
  {
    key: "id",
    label: "ID",
  },
  {
    key: "slug",
    label: "SLUG",
  },
  {
    key: "firstName",
    label: "FIRSTNAME",
  },
  {
    key: "lastName",
    label: "LASTNAME",
  },
  {
    key: "email",
    label: "EMAIL",
  },
  {
    key: "actions",
    label: "ACTIONS",
  }
];

export function TableUsers() {
  const [users, setUsers] = useState([]);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const token = localStorage.getItem("token");
    userService.getAll(token).then(setUsers).catch(console.error);
  }, []);

  const handleRemove = async (id) => {
    try {
      await userService.remove(id, token);
      setUsers((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Failed to remove user:", err);
    }
  };

  return (
    <>
      {users && <Table aria-label="Example table with dynamic content">
        <TableHeader columns={columns}>
          {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
        </TableHeader>
        <TableBody items={users}>
          {(item) => (
            <TableRow key={item.documentId}>
              <TableCell>{item.documentId}</TableCell>
              <TableCell>{item.slug}</TableCell>
              <TableCell>{item.firstName}</TableCell>
              <TableCell>{item.lastName}</TableCell>
              <TableCell>{item.email}</TableCell>
              <TableCell>
                <div className="relative flex items-center gap-2">
                  <Tooltip content="Delete user" placement="bottom">
                    <Button isIconOnly onPress={() => handleRemove(item.id)}>
                      <TrashIcon className="h-5 w-5 text-red-500" />
                    </Button>
                  </Tooltip>
                  <Tooltip content="View profile" placement="bottom">
                    <Button isIconOnly as="a" href={`/user/${item.slug}`}>
                      <EyeIcon className="h-5 w-5 text-blue-500" />
                    </Button>
                  </Tooltip>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>}
    </>
  );
}
