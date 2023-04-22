import { AuthenticationForm } from "./authentication-form/authentication-form"
import { AuthenticationHeader } from "./authentication-header/authentication-header"

import './authentication-page.css'

function AuthenticationPage() {

    return (
        <div className="authentication-page">
            <AuthenticationHeader />
            <AuthenticationForm />
        </div>
    )
}
export default AuthenticationPage