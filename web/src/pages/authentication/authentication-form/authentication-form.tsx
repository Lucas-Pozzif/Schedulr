import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { useState, useEffect } from "react";
import { auth } from "../../../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { clientType, getClient, setClient } from "../../../controllers/clientController";
import { InputTab } from "./input-tab/input-tab";
import { LoginTab } from "./login-tab/login-tab";
import { SubmitButton } from "../../../components/buttons/submit-button/submit-button";

const clientCache = require('../../../cache/clientCache.json')

export type authenticationTabType = {
    user: clientType,
    setUser: (user: clientType) => void
}

export function AuthenticationForm() {
    const navigate = useNavigate()
    const [tab, setTab] = useState('loading')
    const [userId, setUserId] = useState('')
    const [userForm, setUserForm] = useState<clientType>({
        name: '',
        email: '',
        number: '',
        photo: '',
        lastOnline: new Date().getTime()
    })

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) return setTab('log-in')
            await getClient(user.uid)

            if (clientCache[user.uid]) return navigate('/')

            setTab('enter-data')
            setUserId(user.uid)
            const newUser: clientType = {
                name: user.displayName,
                email: user.email,
                number: user.phoneNumber,
                photo: user.photoURL,
                lastOnline: new Date().getTime()
            }
            setUserForm(newUser)
        });
        return unsubscribe
    }, []);

    const handleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
    }
    switch (tab) {
        case 'loading':
            return (
                <>
                    <p>loading</p>
                </>
            )
        case 'log-in':
            return (
                <>
                    <LoginTab
                        loginWithApple={handleSignIn}
                        loginWithGoogle={handleSignIn}
                    />
                </>
            )
        case 'enter-data':
            return (
                <>
                    <InputTab user={userForm} setUser={setUserForm} />
                    <SubmitButton
                        hide={(userForm.name && userForm.number)?false:true}
                        title="Concluir"
                        onClickButton={() => {
                            setClient(userForm, userId)
                            navigate('/')
                        }}
                    />
                </>
            )
        default:
            return <p>error</p>
    }
}