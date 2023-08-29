import { useEffect, useState } from "react";
import { User } from "./Classes/user";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth } from "./Services/firebase/firebase";
import { LoadingScreen } from "./Components/loading/loading-screen/loading-screen";
import { routes } from "./_routes";

export function App() {
  const user = new User();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (client: FirebaseUser | null) => {
      setLoading(true);
      if (!client) return;
      user.setId(client.uid);
      user.getUser();
    });
    setLoading(false);
  }, []);

  loading ? (
    <LoadingScreen />
  ) : (
    <BrowserRouter>
      <Routes>
        {routes.map((route: any) => {
          return <Route path={route.path} element={route.element}></Route>;
        })}
      </Routes>
    </BrowserRouter>
  );
}
