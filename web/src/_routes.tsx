import { ServiceForm } from "./Forms/service-form/service-form";
import { Auth } from "./Pages/auth/auth";
import { Home } from "./Pages/home/home";
import { ServiceList } from "./Pages/service-list/service-list";

export const routes = [
    { path: "/", element: <Home /> },
    { path: "/auth", element: <Auth /> },

    { path: "/service", element: <ServiceList /> },
    { path: "/service/edit/:serviceId", element: <ServiceForm /> },
    { path: "/service/edit/", element: <ServiceForm /> },
];
