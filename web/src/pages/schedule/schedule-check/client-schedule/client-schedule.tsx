import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth } from "../../../../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { getClient } from "../../../../controllers/clientController";
import { Header } from "../../../../components/header/header";
import { Line } from "../../../../components/line/line";
import { getService } from "../../../../controllers/serviceController";
import { getProfessional } from "../../../../controllers/professionalController";
import { ScheduleButton } from "../../../../components/buttons/item-button/schedule-button/schedule-button";
import { selectedServiceType } from "../../schedule-add/schedule-add";
import { SmallButton } from "../../../../components/buttons/small-button/small-button";

const clientCache = require('../../../../cache/clientCache.json')

export default function ClientSchedule() {
    const [loading, setLoading] = useState(true)
    const [userId, setUserId] = useState<string>('error')

    const [history, setHistory] = useState(false)

    const navigate = useNavigate()

    // Using an effect hook to handle authentication state change
    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (!user) return navigate('/login'); // If user is not authenticated, navigate to login page
            await getClient(user.uid); // Fetch client data using user ID
            setUserId(user.uid); // Set user ID in state
            const days = Object.keys(clientCache[user.uid].schedule);
            for (const date of days) {
                const dateTimes = Object.keys(clientCache[user.uid].schedule[date]);
                for (const time of dateTimes) {
                    await getService(clientCache[user.uid].schedule[date][time][0].service.toString());
                    await getProfessional(clientCache[user.uid].schedule[date][time][0].professional.toString());
                }
            }
            setLoading(false);
            if (!clientCache[user.uid]) return navigate('/login'); // If client data is not available, navigate to login page
        });
    }, [navigate]);

    if (userId === 'error') return (<p>errore</p>)

    const dates = Object.keys(clientCache[userId].schedule)
    const today = new Date();
    const filteredDates = dates.filter(date => new Date(date) >= today);
    const newDates = history ? dates : filteredDates
    const sortedDates = newDates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    return loading ?
        <p>loading...</p> :
        <div className="schedule-check">
            <Header
                title="Aqui estão todos seus agendamentos."
                subtitle="Que tal adicionar mais um?"
                buttonTitle="Agendar Serviço"
                onClickButton={() => navigate('/schedule')}
                onClickReturn={() => navigate(-1)}
            />
            <div>
                {
                    sortedDates.map((date) => {
                        const displayDate = `${new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })} - ${new Date(date).toLocaleDateString('pt-BR', { weekday: 'long' })}`
                        const dateTimes = Object.keys(clientCache[userId].schedule[date])
                        return (
                            <div className="schedcheck-day">
                                <Line />
                                <Header title={displayDate} subtitle={`${dateTimes.length} ${dateTimes.length > 1 ? 'Serviços agendados' : 'Serviço agendado'}`} />
                                <Line />
                                {
                                    dateTimes.map(time => {
                                        const data = clientCache[userId].schedule[date][time][0]
                                        const selectedService: selectedServiceType = {
                                            service: data.service.toString(),
                                            state: data.state?.toString(),
                                            professional: data.professional.toString(),
                                            startTime: parseInt(time)
                                        }
                                        return (
                                            <ScheduleButton
                                                state="active"
                                                selectedService={selectedService}
                                                detailText="Editar"
                                                onClickButton={() => { }}
                                            />
                                        )
                                    })
                                }
                            </div>
                        )
                    })
                }
            </div>
            <SmallButton state={!history ? 'active' : 'selected'} title={history ? 'Ocultar Histórico' : 'Ver Histórico'} onClickButton={() => setHistory(!history)} />
        </div >

}