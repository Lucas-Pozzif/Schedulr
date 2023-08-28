import { Auth } from "./Pages/auth/auth";
import { ServiceForm } from "./Pages/service-form/service-form";

export const routes = [
  { path: "/auth", element: <Auth /> },
  { path: "/service/edit/:serviceId", element: <ServiceForm /> },
];
