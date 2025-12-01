export const columns = [
    { name: "NAME", uid: "name", sortable: true },
    { name: "STATUS", uid: "status", sortable: true },
    { name: "SITE", uid: "esaSite", sortable: true },
    { name: "POSITION", uid: "position", sortable: true },
    { name: "BIRTHDAY", uid: "birthday", sortable: true },
    { name: "COUNTRY", uid: "country", sortable: true },
    { name: "DIRECTORATE", uid: "directorate", sortable: true },
    { name: "ACTIONS", uid: "actions" },
];

export const statusOptions = [
    { name: "Active", uid: "active" },
    { name: "Blocked", uid: "blocked" },
];

export const statusColorMap = {
    active: "success",
    blocked: "danger",
};

export const INITIAL_VISIBLE_COLUMNS = ["name", "status", "position", "country", "directorate", "actions"];

export function capitalize(s) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}
