import { useEffect, useState } from 'react'
import { Header } from "../../../components/headers/header/header";
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../../firebase/firebase';
import { getClient } from '../../../controllers/clientController';
import { useNavigate } from 'react-router-dom';
import { arrayIndexToTime } from '../../../functions/array-index-to-time/array-index-to-time';
import { getService } from '../../../controllers/serviceController';
import { getProfessional } from '../../../controllers/professionalController';

const clientCache = require('../../../cache/clientCache.json')
const serviceCache = require('../../../cache/serviceCache.json')
const professionalCache = require('../../../cache/professionalCache.json')


export function ScheduleCheck() {
    const [userId, setUserId] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (!user) return navigate('/login'); // If user is not authenticated, navigate to login page
            await getClient(user.uid) // Fetch client data using user ID
            setUserId(user.uid) // Set user ID in state
            if (!clientCache[user.uid]) return navigate('/login'); // If client data is not available, navigate to login page
        });
    }, [navigate]);

    if (!userId) return <p>error</p>
    const dates = Object.keys(clientCache[userId].schedule)
    dates.map((date) => {
        const serviceTimes = Object.keys(clientCache[userId].schedule[date])
        serviceTimes.map((timeIndex) => {
            const serviceId = clientCache[userId].schedule[date][timeIndex].service
            const professionalId = clientCache[userId].schedule[date][timeIndex].professional


            console.log(`${date} - ${arrayIndexToTime(parseInt(timeIndex))}`)
        })
    })
    return (
        <div>
            <Header title="Titulo" subtitle="subtitulo" buttonText="Agendar servico" onClickButton={() => { }} onClickReturn={() => { }} />
            <div className='date-list'>
                {
                }
            </div>
        </div>
    )
}