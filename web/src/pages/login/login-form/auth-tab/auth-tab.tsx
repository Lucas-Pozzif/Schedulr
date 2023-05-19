import { IconButton } from "../../../../components/buttons/icon-button/icon-button"

import './style.css'

const designCache = require('../../../../cache/designCache.json')

type AuthTabType = {
    googleSignIn: () => void,
    appleSignIn: () => void,
    anonSignIn: () => void,
}

export function AuthTab({ googleSignIn, appleSignIn, anonSignIn }: AuthTabType) {
    const googleIcon = designCache[0].icons.google
    const appleIcon = designCache[0].icons.apple
    const accountIcon = designCache[0].icons.account.active

    return (
        <div className="login-tab">
            <IconButton state="active" icon={googleIcon} title="Entrar com" onClickButton={googleSignIn} />
            <IconButton state="active" icon={accountIcon} title="Anônimo" onClickButton={anonSignIn} />
            {
                //<IconButton state="active" icon={AppleIcon} title="Entrar com" onClickButton={loginWithApple} />
            }
        </div>
    )
}