import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ServiceList } from "./pages/service/service-list/service-list";
import ServiceForm from "./pages/service/service-form/service-form";
import { ServiceAdd } from "./pages/service/service-add/service-add";
import { ServiceEdit } from "./pages/service/service-edit/service-edit";
import ProfessionalForm from "./pages/professional/professional-form/professional-form";

function App() {

	const routes = [
		{ path: '/service', element: <ServiceList /> },
		{ path: '/service/add', element: <ServiceAdd /> },
		{ path: '/service/edit/:serviceId', element: <ServiceEdit /> },

		{ path: '/professional', element: <ProfessionalForm /> },
		{ path: '/professional/add', element: <ServiceEdit /> },
		{ path: '/professional/edit/:professionalId', element: <ServiceEdit /> },

	]

	return (
		<BrowserRouter>
			<Routes>
				{
					routes.map((route) => {
						return <Route path={route.path} element={route.element}></Route>
					})
				}
			</Routes>
		</BrowserRouter>
	);
}

export default App;
