import { useState, useEffect } from "react"
import { User } from "../../Classes/user"
import { Line } from "../../Components/line/line";
import { LoginHeader } from "../../Components/header/login-header/login-header";
import { ErrorScreen } from "../../Components/error/error-screen/error-screen";
import { IconButton } from "../../Components/buttons/icon-button/icon-button";
import { LoadingScreen } from "../../Components/loading/loading-screen/loading-screen";
import { Input } from "../../Components/input/input";
import { SubmitButton } from "../../Components/buttons/submit-button/submit-button";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../Services/firebase/firebase";

type AuthType = {
    user?: User
}

export function Auth({ user = new User() }: AuthType) {
    const [tab, setTab] = useState('loading'); //Possible tabs: loading, auth, form
    const [userForm, setUserForm] = useState({
        id: user.getId(),
        name: user.getName(),
        email: user.getEmail(),
        number: user.getNumber(),
        photo: user.getPhoto(),
    })

    const navigate = useNavigate();

    useEffect(() => {
        onAuthStateChanged(auth, async (client) => {
            if (!client) return setTab('auth') //There is no user on the firebase authentication
            await user.getUser(client.uid)
            if (user.getId() == "") //There is a user on the firebase auth but not on the firestore
            {
                user.setId(client.uid)
                setUserForm({
                    id: user.getId(),
                    name: client.displayName || "",
                    number: client.phoneNumber || "",
                    email: client.email || "",
                    photo: client.photoURL || "",
                })
                return setTab('form')
            }
            else navigate('/') //There is a user on the firebase auth and on the firestore, redirect to home
        })
    }, [])

    const tabHandler = () => {
        console.log(userForm)
        switch (tab) {
            case 'loading':
                return (<LoadingScreen />);
            case 'auth':
                return (
                    <div className="auth-tab">
                        <IconButton state="active" icon={''} title="Entrar com" onClickButton={() => user.AuthWithGoogle()} />
                        <IconButton state="active" icon={''} title="Entrar com" onClickButton={() => user.AuthWithGoogle()} />
                    </div>
                );
            case 'form':

                return (
                    <div className="auth-form-tab">
                        <div className="af-inputs">
                            <Input
                                label="Por favor digite seu nome"
                                placeholder="Nome"
                                value={userForm.name}
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
                                value={userForm.number}
                                onValueChange={(e) => {
                                    setUserForm({
                                        ...userForm,
                                        number: e.target.value
                                    })
                                }}
                            />
                        </div>
                        <SubmitButton
                            state={(userForm.name && userForm.number.length >= 7) ? 'active' : 'selected'}
                            title="Concluir"
                            onClickButton={() => {
                                user.setName(userForm.name);
                                user.setNumber(userForm.number);
                                user.setEmail(userForm.email);
                                user.setPhoto(userForm.photo);
                                user.setUser()
                                navigate('/')
                            }}
                        />
                    </div>
                );
            default:
                return (<ErrorScreen />)
        }
    }

    return (
        <div className="auth">
            <img className="auth-logo" />
            <div className="auth-header">
                <Line />
                <LoginHeader title="Atendimento é a nossa prioridade" subtitle="Para isso precisamos te conhecer melhor" />
                <Line />
            </div>
            {tabHandler()}
        </div>
    )
}

