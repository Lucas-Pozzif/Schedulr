import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { useState, useEffect } from "react";
import { auth } from "../../../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { clientType, getClient, setClient } from "../../../controllers/clientController";
import { SubmitButton } from "../../../components/buttons/submit-button/submit-button";
import { AuthTab } from "./auth-tab/auth-tab";
import { InputTab } from "./input-tab/input-tab";

const clientCache = require('../../../cache/clientCache.json')

export type authenticationTabType = {
    user: clientType,
    setUser: (user: clientType) => void
}

export function LoginForm() {
    const navigate = useNavigate()
    const [tab, setTab] = useState('loading')
    const [userId, setUserId] = useState('')
    const [userForm, setUserForm] = useState<clientType>({
        name: '',
        email: '',
        number: '',
        photo: '',
        schedule: {},
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
                name: user.displayName || '',
                email: user.email,
                number: user.phoneNumber || '',
                photo: user.photoURL,
                schedule: {},
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
                    <AuthTab
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
                        state={(userForm.name && userForm.number.length >= 7) ? 'active' : 'selected'}
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