import { PencilSquareIcon } from "@heroicons/react/24/solid";
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
import { clubService } from "@/service/clubService";
import { useEffect, useState } from "react";
import { ModalClub } from "./ModalClub";

const columns = [
  {
    key: "id",
    label: "ID",
  },
  {
    key: "name",
    label: "NAME",
  },
  {
    key: "description",
    label: "DESCRIPTION",
  },
  {
    key: "creation",
    label: "CREATION",
  },
  {
    key: "actions",
    label: "ACTIONS",
  },
];

export function TableClub() {
  const [clubs, setClubs] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;


  useEffect(() => {
    const token = localStorage.getItem("token");
    clubService.getAll(token).then(setClubs).catch(console.error);
  }, []);

  // Create a new club
  const handleCreate = async (name, description) => {
    try {
      const created = await clubService.create({ name: name, description: description }, token);
      setClubs((prev) => [...prev, created.data]); // add new club to state
    } catch (err) {
      console.error("Failed to create club:", err);
    }
  };

  // Remove a club
  const handleRemove = async (documentId) => {
    try {
      await clubService.removeByDocumentId(documentId, token);
      setClubs((prev) => prev.filter((c) => c.documentId !== documentId)); // use documentId
    } catch (err) {
      console.error("Failed to remove club:", err);
    }
  };
  return (
    <>
      <Button color="success" onPress={() => setModalOpen(true)}>Create a club</Button>
      <ModalClub isOpen={isModalOpen} onOpenChange={setModalOpen} onCreate={handleCreate}></ModalClub>
      <br /><br />
      <Table aria-label="Example table with dynamic content">
        <TableHeader columns={columns}>
          {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
        </TableHeader>
        <TableBody items={clubs}>
          {(item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell>{item.creation}</TableCell>
              <TableCell>
                <div className="relative flex items-center gap-2">
                  <Tooltip content="Edit user" placement="bottom">
                    <Button isIconOnly onPress={() => setModalOpen(true)}>
                      <span className="text-lg text-default-400 cursor-pointer active:opacity-50">

                        <PencilSquareIcon
                          className="h-5 w-5 text-yellow-500" />
                      </span>
                    </Button>
                  </Tooltip>
                  <Tooltip content="Delete user" placement="bottom">
                    <Button isIconOnly onClick={() => handleRemove(item.documentId)}>
                      <span className="text-lg text-danger cursor-pointer active:opacity-50" >
                        <TrashIcon
                          className="h-5 w-5 text-red-500" />
                      </span>
                    </Button>
                  </Tooltip>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
