import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { ServiceList } from "./pages/service/service-list/service-list";
import { ServiceAdd } from "./pages/service/service-add/service-add";
import { ServiceEdit } from "./pages/service/service-edit/service-edit";
import ProfessionalForm from "./pages/professional/professional-form/professional-form";
import ScheduleAdd from "./pages/schedule/schedule-add/schedule-add";
import ProfessionalList from "./pages/professional/professional-list/professional-list";
import Home from "./pages/home/home";
import { useEffect, useState } from "react";
import AuthenticationPage from "./pages/authentication/authentication-page";
import { getDesigns } from "./controllers/configController";

const designCache = require('./cache/designCache.json')

function App() {
	const [loading, setLoading] = useState(true)

	const routes = [
		{ path: '/service', element: <ServiceList /> },
		{ path: '/service/add', element: <ServiceAdd /> },
		{ path: '/service/edit/:serviceId', element: <ServiceEdit /> },

		{ path: '/professional', element: <ProfessionalList /> },
		{ path: '/professional/add', element: <ProfessionalForm /> },
		{ path: '/professional/edit/:professionalId', element: <ServiceEdit /> },

		{ path: '/schedule', element: <ScheduleAdd /> },

		{ path: '/', element: <Home /> },

		{ path: '/login', element: <AuthenticationPage /> },

	]
	var sheet = document.styleSheets[0];
	sheet.insertRule(":root{--blue:#4444FF}");

	useEffect(() => {
		getDesigns().then(() => {
			setLoading(false);
			const colors = designCache[0].colors
			document.documentElement.style.setProperty('--primary', colors.primary);
			document.documentElement.style.setProperty('--secondary', colors.secondary);
			document.documentElement.style.setProperty('--accent-light', colors.accent.light);
			document.documentElement.style.setProperty('--accent-dark', colors.accent.dark);
		});
	}, []);


	return (
		<>
			{
				loading ?
					<p>loading</p> :
					<BrowserRouter>
						<Routes>
							{
								routes.map((route) => {
									return <Route path={route.path} element={route.element}></Route>
								})
							}
						</Routes>
					</BrowserRouter>

			}
		</>
	);
}

export default App;
