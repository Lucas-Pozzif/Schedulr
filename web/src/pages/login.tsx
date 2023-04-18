import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router";
import { auth } from "../firebase/firebase";

export function Login() {
    const [logged, setLogged] = useState(false);
    const [loading, setLoading] = useState(false);

    const provider = new GoogleAuthProvider();

    onAuthStateChanged(auth, (client) => {
        if(client){
            console.log(client)
        }else{
            setLogged(false)
        }
    })

    return (
        <>

        </>
    )
}