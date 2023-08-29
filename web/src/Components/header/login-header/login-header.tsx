import './style.css'

type loginHeaderType = {
    title: string,
    subtitle: string,
}

export function LoginHeader({ title, subtitle }: loginHeaderType) {

    return (
        <div className="login-header">
            <p className="login-header-title">{title}</p>
            <p className="login-header-subtitle">{subtitle}</p>
        </div>
    )
}