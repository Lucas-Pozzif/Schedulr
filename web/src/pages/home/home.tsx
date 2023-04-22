import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom"
import { Line } from "../../components/line/line"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../../firebase/firebase"
import { clientType, getClient } from "../../controllers/clientController"
import { arrayIndexToTime } from '../../functions/array-index-to-time/array-index-to-time'
import { timeToArrayIndex } from '../../functions/time-to-array-index/time-to-array-index'
import { dayIntervalCounter } from '../../functions/day-interval-counter/day-interval-counter'
import { intervalToDay } from '../../functions/interval-to-day/interval-to-day'

import './home.css'
import { TabButton } from '../../components/buttons/tab-button/tab-button'
import { InviteButton } from '../../components/buttons/invite-button/invite-button'
import { IconButton } from '../../components/buttons/icon-button/icon-button'

const clientCache = require('../../cache/clientCache.json')
const designCache = require('../../cache/designCache.json')

function Home() {
    const navigate = useNavigate()
    const [userId, setUserId] = useState<string | undefined>()

    const logo = designCache[0].lightLogo
    const accountIcon = designCache[0].icons.account
    const date = new Date().getHours()

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

    let nextService: string = 'Você não possui nenhum agendamento marcado para essa semana'
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
            <div className="home-header">
                <img className="home-logo" src={logo} />
                <img className="account-icon" src={accountIcon} />
            </div>
            <Line />
            <div className='salutation-block'>
                <div className="home-text-block">
                    <p className='salutation'>{salutation}{username}</p>
                    <p className='message'>{userId ? nextService : 'Você ainda não entrou com sua conta.'}</p>
                </div>
                <InviteButton
                    title='Agendar serviço'
                    onClickButton={() => navigate('/schedule')}
                />
            </div>
            <Line />
            <div className='home-button-tab'>
                <IconButton
                    title='Tabela de Profissionais'
                    image=''
                    onClickButton={() => navigate('/professional')}
                />
                <IconButton
                    title='Tabela de Serviços'
                    image=''
                    onClickButton={() => navigate('/service')}
                />
                <IconButton
                    title='Entrar em Contato'
                    image=''
                    onClickButton={() => navigate('/professional')}
                />
                <IconButton
                    title='Ver Minha Agenda'
                    image=''
                    onClickButton={() => navigate('/professional')}
                />
            </div>
        </div>
    )
}
export default Home