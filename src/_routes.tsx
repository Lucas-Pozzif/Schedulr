import { GroupForm } from "./Classes/classpaths";

export const routes = [
  { path: "/", element: <GroupForm /> },
  { path: "/group/add", element: <GroupForm /> },
  { path: "/group/edit/:id", element: <GroupForm /> },
];
