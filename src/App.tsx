import React, { useEffect, useState } from "react";
import { User } from "./Classes/user";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth } from "./Services/firebase/firebase";
import { LoadingScreen } from "./Components/loading/loading-screen/loading-screen";
import { routes } from "./_routes";


import './Styles/reset.css'
import './Styles/style.css'

export function App() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(new User());

  useEffect(() => {
    setLoading(true);
    onAuthStateChanged(auth, async (client: FirebaseUser | null) => {
      if (!client) return setLoading(false);
      //await user.getUser(client.uid);
      console.log('user updated')
      setUser(user); // Update the user state with the fetched user data
      setLoading(false);
    });
  }, []);

  return loading ? (
    <LoadingScreen />
  ) : (
    <BrowserRouter>
      <Routes>
        {routes.map((route: any) => {
          return (
            <Route
              path={route.path}
              element={React.cloneElement(route.element, { user: user })}
            ></Route>
          );
        })}
      </Routes>
    </BrowserRouter>
  );
}
