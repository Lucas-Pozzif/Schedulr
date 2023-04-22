import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom"
import { Line } from "../../components/line/line"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../../firebase/firebase"
import { clientType, getClient } from "../../controllers/clientController"

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
    else if (date >= 13 && date < 19) salutation = 'Boa tarde'
    else salutation = 'Boa noite'

    let username = '!'
    if (userId) username = `, ${clientCache[userId].name}`

    let nextService: string
    if (userId) {
        const today = new Date().getTime()

        const clientSchedule = clientCache[userId].schedule
        const scheduledDays = Object.keys(clientSchedule)

        const nearestDate = scheduledDays.find(date => {
            const diff = Math.abs(new Date(date).getTime() - new Date(today).getTime());
            return diff === Math.min(...scheduledDays.map(d => Math.abs(new Date(d).getTime() - new Date(today).getTime())));
        });

        if (nearestDate === undefined) nextService = 'Você não tem nenhum serviço agendado ainda.'
        else {
            const nearestServices = Object.keys(clientSchedule[nearestDate])
            console.log(nearestServices)
        }

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
                <img className="logo" src={logo} />
                <img className="account-icon" src={accountIcon} />
            </div>
            <Line />
            <div className="home-text-block">
                <p>{salutation}{username}</p>
            </div>

            <Line />
            <button onClick={() => {
                navigate('/schedule')
            }}>Agendar</button>
            <div>

                <button onClick={() => {
                    navigate('/professional')
                }}>Tabela de servicos</button>
                <button onClick={() => {
                    navigate('/service')
                }}>Tabela de servicos</button>
            </div>
        </div>
    )
}
export default Home