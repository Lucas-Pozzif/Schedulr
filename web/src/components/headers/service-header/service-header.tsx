import { useState, useEffect } from "react";
import { getAdmins } from "../../../controllers/configController";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebase/firebase";
import { getClient } from "../../../controllers/clientController";
import { Header } from "../header/header";
import { useNavigate } from "react-router-dom";

const clientCache = require('../../../cache/clientCache.json')

export function ServiceHeader() {
    const [loading, setLoading] = useState(true)
    const [isAdmin, setIsAdmin] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            getAdmins().then((adms) => {
                if (adms && user?.email) {
                    if (adms.emails.includes(user.email)) setIsAdmin(true)
                }
                setLoading(false)
            })

        });
    })

    if (loading) return (<p>loading</p>)

    if (isAdmin) return (
        <Header
            title="Quer editar algum detalhe?"
            subtitle="É so clicar no serviço!"
            buttonText="Adicionar Serviços"
            onClickReturn={() => { navigate(-1) }}
            onClickButton={() => { navigate('/service/add') }}
        />)
    return ((
        <Header
            title="Não sabe o tamanho do seu cabelo?"
            subtitle="A gente te ajuda!"
            buttonText="Entrar em contato"
            onClickReturn={() => { navigate(-1) }}
            onClickButton={() => { navigate('') }}
        />)
    )
}