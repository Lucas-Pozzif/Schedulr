import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { useState, useEffect } from "react";
import { auth } from "../../../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { clientType, getClient, setClient } from "../../../controllers/clientController";
import { Input } from "../../../components/input/input";

const clientCache = require('../../../cache/clientCache.json')

type tabHandlerType = {
    tab: number,
    userForm: clientType,
    setUserForm: (client: clientType) => void,
    userId: string
}

async function handleSignIn() {
    const provider = new GoogleAuthProvider();
    const { user } = await signInWithPopup(auth, provider);
}
function TabHandler({ tab, userForm, setUserForm, userId }: tabHandlerType) {
    const navigate = useNavigate()
    switch (tab) {
        case 1:
            return (
                <>
                    <Input
                        label="Por favor digite seu nome"
                        placeholder="Nome"
                        value={userForm.name || ''}
                        onValueChange={(e) => {
                            setUserForm({
                                ...userForm,
                                name: e.target.value
                            })
                        }}
                    />
                    <Input
                        label="Por favor digite seu número"
                        placeholder="(00)00000-0000"
                        value={userForm.number || ''}
                        onValueChange={(e) => {
                            setUserForm({
                                ...userForm,
                                number: e.target.value
                            })
                        }}
                    />
                    <button onClick={() => {
                        console.log(userForm, userId);
                        setClient(userForm, userId)
                        navigate('/')
                    }}>Concluir</button>
                </>
            )
        default:
            return <div onClick={handleSignIn}>Entrar com google</div>
    }
}

export default function AuthForm() {
    const [tab, setTab] = useState(0)
    const [userForm, setUserForm] = useState<clientType>({
        name: '',
        email: '',
        number: '',
        photo: '',
        lastOnline: new Date().getTime()
    })
    const [userId, setUserId] = useState('')

    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUserId(user.uid)
                await getClient(user.uid)
                if (clientCache[user.uid]) return navigate('/')

                const newUser: clientType = {
                    name: user.displayName,
                    email: user.email,
                    number: user.phoneNumber,
                    photo: user.photoURL,
                    lastOnline: new Date().getTime()
                }
                setUserForm(newUser)
                setTab(1)
            } else {
                setTab(0)
            }
        });
        return unsubscribe
    }, []);

    return (
        <TabHandler
            tab={tab}
            userForm={userForm}
            setUserForm={setUserForm}
            userId={userId}
        />
    )

}