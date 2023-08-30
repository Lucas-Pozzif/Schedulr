import { ServiceForm } from "./Forms/service-form/service-form";
import { Auth } from "./Pages/auth/auth";
import { Home } from "./Pages/home/home";

export const routes = [
    { path: "/", element: <Home /> },
    { path: "/auth", element: <Auth /> },

    { path: "/service/edit/:serviceId", element: <ServiceForm /> },
];
