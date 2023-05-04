import { loginHeaderType } from '../header-type'

import './style.css'

export function LoginHeader({ title, subtitle }: loginHeaderType) {

    return (
        <div className="login-header">
            <p className="login-header-title">{title}</p>
            <p className="login-header-subtitle">{subtitle}</p>
        </div>
    )
}