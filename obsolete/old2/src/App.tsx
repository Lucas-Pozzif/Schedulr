import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth } from "./Services/firebase/firebase";
import { routes } from "./_routes";
import { User } from "./Classes/user";

export default function App() {
  const user = new User();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (client: FirebaseUser | null) => {
      setLoading(true);
      if (!client) return;
      user.setId(client.uid);
      if (!user.getUser()) {
        console.log(user, client);
        //User has no account
      }

      // If user is not authenticated, ignore
      // await getClient(user.uid); // Fetch client data using user ID
      // setUserId(user.uid); // Set user ID in state
      // if (!clientCache[user.uid]) return; // If client data is not available, ignore
    });
    setLoading(false);
  }, []);

  return loading ? (
    <p>Carregando... tela inicial</p>
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
