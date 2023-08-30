import { Auth } from "./Pages/auth/auth";
import { Home } from "./Pages/home/home";

export const routes = [
    { path: "/", element: <Home /> },
    { path: "/auth", element: <Auth /> },
];
