import { Home } from "./Pages/home/home";
import { UserPage } from "./Pages/user-page/user-page";

export const routes = [
    { path: "/", element: <Home /> },
    { path: "/user", element: <UserPage /> },
];
