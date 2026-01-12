export const columns = [
    { name: "NAME", uid: "name", sortable: true },
    { name: "ROLE", uid: "role", sortable: true },
    { name: "SITE", uid: "esaSite", sortable: true },
    { name: "POSITION", uid: "position", sortable: true },
    { name: "BIRTHDAY", uid: "birthday", sortable: true },
    { name: "COUNTRY", uid: "country", sortable: true },
    { name: "DIRECTORATE", uid: "directorate", sortable: true },
    { name: "ACTIONS", uid: "actions" },
];

export const roleOptions = [
    { name: "Admin", uid: "admin" },
    { name: "Crew", uid: "crew" },
    { name: "Manager", uid: "manager" },
];

export const roleColorMap = {
    admin: "warning",
    crew: "primary",
    manager: "secondary",
};

export const INITIAL_VISIBLE_COLUMNS = ["name", "role", "position", "country", "directorate", "actions"];

export function capitalize(s) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}
