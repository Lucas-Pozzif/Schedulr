import React, { useEffect, useState } from "react";
import { User } from "./Classes/user";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth } from "./Services/firebase/firebase";
import { LoadingScreen } from "./Components/loading/loading-screen/loading-screen";
import { routes } from "./_routes";

export function App() {
  const [loading, setLoading] = useState(false);
  const user = new User();

  useEffect(() => {
    onAuthStateChanged(auth, (client: FirebaseUser | null) => {
      setLoading(true);
      if (!client) return setLoading(false);
      user.getUser(client.uid);
      user.setName('teste');
      setLoading(false);
    });
  }, []);

  return loading ? (
    <LoadingScreen />
  ) : (
    <BrowserRouter>
      <Routes>
        {routes.map((route: any) => {
          return <Route path={route.path} element={React.cloneElement(route.element, { user: user })}></Route>;
        })}
      </Routes>
    </BrowserRouter>
  );
}
