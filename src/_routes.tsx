import { GroupForm } from "./Forms/group-form/group-form";
import { GroupPage } from "./Pages/group-page/group-page";
import { Home } from "./Pages/home/home";
import { UserPage } from "./Pages/user-page/user-page";

export const routes = [
    { path: "/", element: <Home /> },
    { path: "/user", element: <UserPage /> },
    { path: "/group/:groupId", element: <GroupPage /> },
    { path: "/group/add", element: <GroupForm /> },
];
