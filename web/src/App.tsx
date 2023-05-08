import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import { getDesigns } from "./controllers/configController";

import LoginPage from "./pages/login/login-page";
import Home from "./pages/home/home";
import ProfessionalList from "./pages/professional/professional-list/professional-list";
import ProfessionalAdd from "./pages/professional/professional-add/professional-add";
import { ServiceList } from "./pages/service/service-list/service-list";
import { ServiceAdd } from "./pages/service/service-add/service-add";
import ServiceEdit from "./pages/service/service-edit/service-edit";
import ScheduleAdd from "./pages/schedule/schedule-add/schedule-add";
import ProfessionalEdit from "./pages/professional/professional-edit/professional-edit";
import ScheduleCheck from "./pages/schedule/schedule-check/schedule-check";

const designCache = require('./cache/designCache.json')

function App() {
	const [loading, setLoading] = useState(true)

	const routes = [
		{ path: '/service', element: <ServiceList /> },
		{ path: '/service/add', element: <ServiceAdd /> },
		{ path: '/service/edit/:serviceId', element: <ServiceEdit /> },

		{ path: '/professional', element: <ProfessionalList /> },
		{ path: '/professional/add', element: <ProfessionalAdd /> },
		{ path: '/professional/edit/:professionalId', element: <ProfessionalEdit /> },

		{ path: '/schedule', element: <ScheduleAdd /> },
		{ path: '/schedule/my', element: <ScheduleCheck /> },

		{ path: '/', element: <Home /> },

		{ path: '/login', element: <LoginPage /> },
	]
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
