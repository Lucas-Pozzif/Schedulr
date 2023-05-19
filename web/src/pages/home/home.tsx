import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom"
import { Line } from "../../components/line/line"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../../firebase/firebase"
import { getClient } from "../../controllers/clientController"
import { timeToArrayIndex } from '../../functions/time-to-array-index/time-to-array-index'
import { VerticalIconButton } from '../../components/buttons/vertical-icon-button/vertical-icon-button'
import { Header } from '../../components/header/header'

import './style.css'

const clientCache = require('../../cache/clientCache.json')
const designCache = require('../../cache/designCache.json')

function Home() {
    const navigate = useNavigate()
    const [userId, setUserId] = useState<string | undefined>()

    const logo = designCache[0].lightLogo
    const accountIcon = designCache[0].icons.account.selected
    const date = new Date().getHours()

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (!user) return // If user is not authenticated, ignore
            await getClient(user.uid) // Fetch client data using user ID
            setUserId(user.uid) // Set user ID in state
            if (!clientCache[user.uid]) return  // If client data is not available, ignore
        });
    }, [navigate]);

    let salutation: string
    if (date < 5) salutation = 'Boa madrugada'
    else if (date >= 5 && date < 13) salutation = 'Bom dia'
    else if (date >= 13 && date < 18) salutation = 'Boa tarde'
    else salutation = 'Boa noite'

    let username = '!'
    if (userId) {
        username = `, `
        username += `${clientCache[userId].name.split(' ')[0]}!`

    }

    let nextService: string = 'Você pode ver seus agendamentos na aba minha agenda'
    if (userId) {
        const today = new Date()
        const nowIndex = timeToArrayIndex(new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }))

        const clientSchedule = clientCache[userId].schedule
        const userScheduleDates = Object.keys(clientSchedule).sort()

        /*
        const hasToday = scheduledDays.includes(today.toLocaleDateString('en-US'))
        const distanceArray = scheduledDays.map((date) => dayIntervalCounter(date, today)).filter((int) => int > 0 && int <= 7)
        const nearestDay = intervalToDay(today, Math.min(...distanceArray))
        const nearestDayTimeIndexes = Object.keys(clientSchedule[nearestDay]).sort()
        /*
        const validTodayTimes = nearestDayTimeIndexes.filter(index => parseInt(index) >= nowIndex)
        /*
        if (hasToday && validTodayTimes.length > 0) nextService = `Você tem um serviço agendado para hoje às ${arrayIndexToTime(parseInt(validTodayTimes[0]))}.`
        else if (!nearestDay) nextService = `Você não possui nenhum serviço agendado para esta semana`
        else nextService = `Você possui um serviço agendado com para as ${arrayIndexToTime(parseInt(nearestDayTimeIndexes[0]))} do dia ${nearestDay}`
        */
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) return
            await getClient(user.uid)
            if (clientCache[user.uid]) setUserId(user.uid)
        });
        return unsubscribe
    }, []);
    return (
        <div className="home">
            <div className="home-top">
                <img className="home-logo" src={logo} />
                <img className="home-account-icon" src={accountIcon} />
            </div>
            <div className='home-header-block'>
                <Line />
                <Header
                    title={`${salutation} ${username}`}
                    subtitle={userId ? nextService : 'Você ainda não entrou com sua conta.'}
                    buttonTitle='Agendar serviço'
                    onClickButton={() => navigate('/schedule')}
                />
                <Line />
            </div>
            <div className='home-button-tab'>
                <VerticalIconButton
                    state='active'
                    title='Tabela de Profissionais'
                    icon={designCache[0].icons.professional}
                    onClickButton={() => navigate('/professional')}
                />
                <VerticalIconButton
                    state='active'
                    title='Tabela de Serviços'
                    icon={designCache[0].icons.service.selected}
                    onClickButton={() => navigate('/service')}
                />
                <VerticalIconButton
                    state='active'
                    title='Entrar em Contato'
                    icon={designCache[0].icons.chat}
                    onClickButton={() => navigate('/contact')}
                />
                <VerticalIconButton
                    state='active'
                    title='Ver Minha Agenda'
                    icon={designCache[0].icons.schedule}
                    onClickButton={() => navigate('/schedule/my')}
                />
            </div>
        </div>
    )
}
export default Home