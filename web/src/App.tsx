import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { ServiceList } from "./pages/service/service-list/service-list";
import ServiceForm from "./pages/service/service-form/service-form";
import { ServiceAdd } from "./pages/service/service-add/service-add";
import { ServiceEdit } from "./pages/service/service-edit/service-edit";
import ProfessionalForm from "./pages/professional/professional-form/professional-form";
import ScheduleAdd from "./pages/schedule/schedule-add/schedule-add";
import ProfessionalList from "./pages/professional/professional-list/professional-list";
import Home from "./pages/home/home";
import Login from "./pages/authentication/login";
import AuthForm from "./pages/authentication/authentication-form/authentication-form";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/firebase";

function App() {

	const routes = [
		{ path: '/service', element: <ServiceList /> },
		{ path: '/service/add', element: <ServiceAdd /> },
		{ path: '/service/edit/:serviceId', element: <ServiceEdit /> },

		{ path: '/professional', element: <ProfessionalList /> },
		{ path: '/professional/add', element: <ProfessionalForm /> },
		{ path: '/professional/edit/:professionalId', element: <ServiceEdit /> },

		{ path: '/schedule', element: <ScheduleAdd /> },

		{ path: '/', element: <Home /> },

		{ path: '/login', element: <AuthForm /> },

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
