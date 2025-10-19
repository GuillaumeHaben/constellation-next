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
  const [selectedClub, setSelectedClub] = useState(null); // for editing

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const token = localStorage.getItem("token");
    clubService.getAll(token).then(setClubs).catch(console.error);
  }, []);

  const handleCreate = async (name, description) => {
    try {
      const created = await clubService.create({ name, description }, token);
      setClubs((prev) => [...prev, created.data]);
    } catch (err) {
      console.error("Failed to create club:", err);
    }
  };

  const handleUpdate = async (documentId, name, description) => {
    try {
      const updated = await clubService.updateByDocumentId(documentId, name, description, token);
      setClubs((prev) =>
        prev.map((club) =>
          club.documentId === documentId ? updated.data : club
        )
      );
    } catch (err) {
      console.error("Failed to update club:", err);
    }
  };

  const handleRemove = async (documentId) => {
    try {
      await clubService.removeByDocumentId(documentId, token);
      setClubs((prev) => prev.filter((c) => c.documentId !== documentId));
    } catch (err) {
      console.error("Failed to remove club:", err);
    }
  };

  return (
    <>
      <Button
        color="success"
        onPress={() => {
          setSelectedClub(null); // reset for create
          setModalOpen(true);
        }}
      >
        Create a club
      </Button>

      <ModalClub
        isOpen={isModalOpen}
        onOpenChange={setModalOpen}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        initialData={selectedClub}
      />

      <br /><br />
      <Table aria-label="Example table with dynamic content">
        <TableHeader columns={columns}>
          {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
        </TableHeader>
        <TableBody items={clubs}>
          {(item) => (
            <TableRow key={item.documentId}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell>{item.creation}</TableCell>
              <TableCell>
                <div className="relative flex items-center gap-2">
                  <Tooltip content="Edit club" placement="bottom">
                    <Button
                      isIconOnly
                      onPress={() => {
                        setSelectedClub(item);
                        setModalOpen(true);
                      }}
                    >
                      <PencilSquareIcon className="h-5 w-5 text-yellow-500" />
                    </Button>
                  </Tooltip>
                  <Tooltip content="Delete club" placement="bottom">
                    <Button isIconOnly onClick={() => handleRemove(item.documentId)}>
                      <TrashIcon className="h-5 w-5 text-red-500" />
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
