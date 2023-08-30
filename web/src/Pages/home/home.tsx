import { useNavigate } from "react-router-dom"
import { useState, useEffect } from 'react'
import { User } from "../../Classes/user"
import { Header } from "../../Components/header/header"
import { Line } from "../../Components/line/line"
import { VerticalIconButton } from "../../Components/buttons/vertical-icon-button/vertical-icon-button"

import './home.css'

type HomeType = {
    user?: User
}
export function Home({ user }: HomeType) {

    const navigate = useNavigate()
    return (
        <div className="home">
            <div className="home-top">
                <img className="home-logo" src={''} />
                <img className="home-account-icon" src={user?.getPhoto() || ''} />
            </div>
            <div className='home-header-block'>
                <Line />
                <Header
                    title={`${user?.getName()}`}
                    subtitle={'Você ainda não entrou com sua conta.'}
                    buttonTitle='Agendar serviço'
                    onClickButton={() => navigate('/schedule')}
                />
                <Line />
            </div>
            <div className='home-button-tab'>
                <VerticalIconButton
                    state='active'
                    title='Tabela de Profissionais'
                    icon=''
                    onClickButton={() => navigate('/professional')}
                />
                <VerticalIconButton
                    state='active'
                    title='Tabela de Serviços'
                    icon=''
                    onClickButton={() => navigate('/service')}
                />
                <VerticalIconButton
                    state='active'
                    title='Entrar em Contato'
                    icon=''
                    onClickButton={() => navigate('/contact')}
                />
                <VerticalIconButton
                    state='active'
                    title='Ver Minha Agenda'
                    icon=''
                    onClickButton={() => navigate('/schedule/my')}
                />
            </div>
        </div>
    )
}