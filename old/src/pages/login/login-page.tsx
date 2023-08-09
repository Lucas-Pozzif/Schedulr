import { LoginHeader } from "../../components/header/login-header/login-header"
import { Line } from "../../components/line/line"
import { LoginForm } from "./login-form/login-form"

import './style.css'

const designCache = require('../../cache/designCache.json');

export default function LoginPage() {
    const logo = designCache[0].lightLogo

    return (
        <div className="login-page">
            <img className="login-logo" src={logo} />
            <div className="login-header-block">
                <Line />
                <LoginHeader title="Atendimento é a nossa prioridade" subtitle="Para isso precisamos te conhecer melhor" />
                <Line />
            </div>
            <LoginForm />
        </div>
    )
}