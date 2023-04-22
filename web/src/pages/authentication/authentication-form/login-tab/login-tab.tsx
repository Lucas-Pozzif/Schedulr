import { LoginButton } from "../../../../components/buttons/login-button/login-button"

import './login-tab.css'

const designCache = require('../../../../cache/designCache.json')

type loginTabType = {
    loginWithGoogle: () => void,
    loginWithApple: () => void,
}

export function LoginTab({ loginWithGoogle, loginWithApple }: loginTabType) {
    const googleIcon = designCache[0].icons.google
    const AppleIcon = designCache[0].icons.apple

    return (
        <div className="login-tab">
            <LoginButton image={googleIcon} title="Entrar com" onClickButton={loginWithGoogle} />
            <LoginButton image={AppleIcon} title="Entrar com" onClickButton={loginWithApple} />
        </div>
    )
}