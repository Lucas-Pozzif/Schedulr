import { useState } from "react"
import { User } from "../../Classes/user";
import { Line } from "../../Components/line/line";

import "./user-page.css"

export function UserPage() {
    const [user, setUser] = useState(new User())
    const [hasAccount, setHasAccount] = useState(false)

    const arrow = require('../../Assets/arrow.png');
    const edit = require('../../Assets/edit.png');

    if (user.getId() === "") {

    }

    return (
        <div className="user-page">
            <div className="up-header">
                <img className="up-return left" src={arrow} />

                <img className="up-profile" src={user.getPhoto()} />
                <div className="up-name-block">
                    <p className="up-name">{user.getName()}</p>
                    <img className="up-edit-button" src={edit} />
                </div>
                <p className="up-email">{user.getEmail()}</p>
            </div>
            {
                !hasAccount ?
                    <>
                        <div className="up-login-block">
                            <div className="up-login-button" onClick={() => { }}>
                                <p className="up-login-title">Entrar com</p>
                                <img className="up-login-icon" />
                            </div>
                            <Line />
                        </div>
                    </>
                    : null
            }
            <div className="up-item-list">
                <div className="up-item">
                    <img className="up-icon" src="" />
                    <p className="up-title">Sair</p>
                </div>
            </div>
        </div>
    )
}