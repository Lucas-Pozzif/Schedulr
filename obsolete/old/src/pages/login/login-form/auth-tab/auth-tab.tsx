import { IconButton } from "../../../../components/buttons/icon-button/icon-button"

import './style.css'

const designCache = require('../../../../cache/designCache.json')

type AuthTabType = {
    loginWithGoogle: () => void,
    loginWithApple: () => void,
}

export function AuthTab({ loginWithGoogle, loginWithApple }: AuthTabType) {
    const googleIcon = designCache[0].icons.google
    const AppleIcon = designCache[0].icons.apple

    return (
        <div className="login-tab">
            <IconButton state="active" icon={googleIcon} title="Entrar com" onClickButton={loginWithGoogle} />
            <IconButton state="active" icon={AppleIcon} title="Entrar com" onClickButton={loginWithApple} />
        </div>
    )
}