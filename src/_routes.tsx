import { Group } from "./Classes/classes-imports";
import { GroupForm } from "./Forms/group-form/group-form";
import { ErrorPage } from "./Pages/error-page/error-page";
import { GroupPage } from "./Pages/group-page/group-page";
import { Home } from "./Pages/home/home";
import { ClientSchedulePage } from "./Pages/schedule-page/client-schedule/client-schedule-page";
import { ProfessionalSchedulePage } from "./Pages/schedule-page/professional-schedule/professional-schedule-page";
import { UserPage } from "./Pages/user-page/user-page";

const g = new Group("1");

export const routes = [
  { path: "/", element: <UserPage /> },
  { path: "/user", element: <UserPage /> },
  { path: "/user/schedule/:userId", element: <ClientSchedulePage /> },
  { path: "/group/:groupId", element: <GroupPage /> },
  { path: "/group/add", element: <GroupForm /> },
  { path: "/group/edit/:groupId", element: <GroupForm /> },
  { path: "/professional/schedule/:professionalId", element: <ProfessionalSchedulePage /> },
  { path: "/error", element: <ErrorPage /> },
];
