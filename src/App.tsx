import { BrowserRouter, Route, Routes } from "react-router-dom";
import { routes } from "./_routes";

import './Styles/reset.css'
import './Styles/style.css'

import './Fonts/Roboto-Regular.ttf'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {
          routes.map((route: any) => {
            return (
              <Route
                path={route.path}
                element={route.element}
              />
            );
          })
        }
      </Routes>
    </BrowserRouter>
  );
}
