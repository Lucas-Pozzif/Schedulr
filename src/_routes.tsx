import { GroupForm } from "./Forms/group-form/group-form";
import { ProfessionalForm } from "./Forms/professional-form/professional-form";
import { GroupPage } from "./Pages/group-page/group-page";
import { Home } from "./Pages/home/home";
import { ProfessionalSchedulePage } from "./Pages/schedule-page/professional-schedule/professional-schedule-page";
import { UserPage } from "./Pages/user-page/user-page";

export const routes = [
  { path: "/", element: <Home /> },
  { path: "/user", element: <UserPage /> },
  { path: "/group/:groupId", element: <GroupPage /> },
  { path: "/group/add", element: <GroupForm /> },
  { path: "/professional/schedule/:professionalId", element: <ProfessionalSchedulePage /> },
];
