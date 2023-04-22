import { Input } from "../../../../components/input/input";
import { clientType } from "../../../../controllers/clientController";

import './input-tab.css'

type inputTabType = {
    user: clientType,
    setUser: (user: clientType) => void,
}

export function InputTab({ user, setUser }: inputTabType) {

    return (
        <div className="input-tab">
            <Input
                label="Por favor digite seu nome"
                placeholder="Nome"
                value={user.name || ''}
                onValueChange={(e) => {
                    setUser({
                        ...user,
                        name: e.target.value
                    })
                }}
            />
            <Input
                label="Por favor digite seu número"
                placeholder="(00)00000-0000"
                value={user.number || ''}
                onValueChange={(e) => {
                    setUser({
                        ...user,
                        number: e.target.value
                    })
                }}
            />
        </div>
    )
}