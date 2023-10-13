import { useEffect, useState } from "react"
import { User } from "../../Classes/user";
import { Line } from "../../Components/line/line";

import "./user-page.css"
import { LoadingScreen } from "../../Components/loading/loading-screen/loading-screen";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../Services/firebase/firebase";
import { useNavigate } from "react-router-dom";

export function UserPage() {
    const [loading, setLoading] = useState(false)
    const [editing, setEditing] = useState(false)
    const [user, setUser] = useState(new User())
    const [hasAccount, setHasAccount] = useState(false)

    const navigate = useNavigate()

    const arrow = require('../../Assets/arrow.png');
    const edit = require('../../Assets/edit.png');
    const google = require('../../Assets/google.png');
    const exit = require('../../Assets/exit.png');
    const confirm = require('../../Assets/confirm.png');
    const mail = require('../../Assets/mail.png');

    useEffect(() => {
        onAuthStateChanged(auth, async (client) => {
            if (!client) return //There is no user on the firebase authentication
            await user.getUser(client.uid)
            if (user.getId() !== "") { setHasAccount(true) }
        })
    }, [])

    return loading ?
        <LoadingScreen /> :
        (
            <div className="user-page">
                <div className="up-header">
                    <img className="up-return left" src={arrow} onClick={() => { navigate('/') }} />

                    <img className="up-profile" src={user.getPhoto()} />
                    <div className="up-name-block">
                        {
                            editing ?
                                <input className="up-name-input" placeholder={"Digitar novo nome"} onChange={(e) => {
                                    user.setName(e.target.value)
                                    setUser(new User(user))
                                }} /> :
                                <p className="up-name">{user.getName()}</p>
                        }
                        <img className="up-edit-button" src={editing ? confirm : edit} onClick={async (e) => {
                            if (editing) {
                                console.log(user.getName())
                                await user.updateUser({ name: user.getName() })
                            }
                            setEditing(!editing)
                        }} />
                    </div>
                    <p className="up-email">{user.getEmail()}</p>
                </div>
                {
                    !hasAccount ?
                        <>
                            <div className="up-login-block">
                                <div className="up-login-button" onClick={async () => {
                                    setLoading(true)
                                    await user.loginWithGoogle()
                                    if (await user.checkUser()) {
                                        console.log('tem conta')
                                        await user.getUser(user.getId())
                                    } else {
                                        console.log('nao tem conta')
                                        await user.setUser()
                                    }
                                    setHasAccount(true)
                                    setLoading(false)
                                }}>
                                    <p className="up-login-title">Entrar com</p>
                                    <img className="up-login-icon" src={google} />
                                </div>
                                <Line />
                            </div>
                        </>
                        : null
                }
                <div className="up-item-list">
                    <div className="up-item" onClick={async () => {
                        navigate(`/group/add`)
                    }}>
                        <img className="up-icon" src={mail} />
                        <p className="up-title">Solicitar uma Agenda</p>
                    </div>

                    <div className="up-item" onClick={async () => {
                        setLoading(true)
                        await user.logout()
                        setUser(new User())
                        setHasAccount(false)
                        setLoading(false)
                    }}>
                        <img className="up-icon" src={exit} />
                        <p className="up-title">Sair</p>
                    </div>
                </div>
            </div>
        )
}