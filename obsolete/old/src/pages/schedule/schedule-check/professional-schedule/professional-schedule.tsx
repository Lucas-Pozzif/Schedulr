import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../../../../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { getClient } from "../../../../controllers/clientController";
import { Header } from "../../../../components/header/header";
import { Line } from "../../../../components/line/line";
import { SmallButton } from "../../../../components/buttons/small-button/small-button";
import { getSchedule, scheduleDayType, setSchedule } from "../../../../controllers/scheduleController";
import { ItemButton } from "../../../../components/buttons/item-button/item-button";
import { arrayIndexToTime } from "../../../../functions/array-index-to-time/array-index-to-time";
import { getService } from "../../../../controllers/serviceController";
import { SubmitButton } from "../../../../components/buttons/submit-button/submit-button";

const scheduleCache = require('../../../../cache/scheduleCache.json')
const serviceCache = require('../../../../cache/serviceCache.json')
const clientCache = require('../../../../cache/clientCache.json')

export default function ProfessionalSchedule(props: any) {
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<any>(null);

    const [scheduleForm, setScheduleForm] = useState<any>({});
    const [history, setHistory] = useState(false);
    const [blockMode, setBlockMode] = useState(false);
    const [saved, setSaved] = useState(true);

    const navigate = useNavigate();
    const profId = props.profId

    useEffect(() => {
        setLoading(true)
        onAuthStateChanged(auth, async (user) => {
            if (!user) return navigate('/login');

            await getClient(user.uid)
            if (!clientCache[user.uid]) return navigate('/login');

            await getSchedule(profId)

            setScheduleForm(scheduleCache[profId])
            const dates = Object.keys(scheduleCache[profId])
            for (const date of dates) {
                for (const time of scheduleCache[profId][date]) {
                    if (time.takenAt !== null && time.takenAt !== 'blocked' && time.takenAt !== 'permablocked') {
                        await getService(time.service.toString())
                    }
                }
            }
            setUserId(user.uid)
            setLoading(false);

        })
    }, [navigate])

    if (userId === null) return (<p>Usuário não encontrado</p>)

    const dates = Object.keys(scheduleCache[profId])
    const today = new Date();
    const filteredDates = dates.filter(date => new Date(date) >= today);
    const newDates = history ? dates : filteredDates
    const sortedDates = newDates.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    console.log(scheduleForm, scheduleCache[profId])

    return loading ?
        <p>Loading...</p> :
        <div className="schedule-check">
            <Header
                title="Precisa de um tempinho na sua agenda?"
                subtitle="Bloqueie os horários para evitar agendamentos"
                buttonTitle={blockMode ? 'Esconder' : 'Mostrar horários livres'}
                onClickButton={() => setBlockMode(!blockMode)}
                onClickReturn={() => navigate(-1)}
            />
            <div>
                {
                    sortedDates.map((date: string) => {
                        const displayDate = `${new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })} - ${new Date(date).toLocaleDateString('pt-BR', { weekday: 'long' })}`
                        const dateTimes = scheduleCache[profId][date]
                        const clients: string[] = []

                        return (
                            <div className="schedcheck-day">
                                <Line />
                                <Header title={displayDate} subtitle={`${clients.length} ${clients.length === 1 ? 'Clientes agendados' : 'Cliente agendado'}`} />
                                <Line />
                                {
                                    dateTimes.map((time: scheduleDayType, index: number) => {
                                        const unsavedChanges = scheduleForm[date][index].takenAt !== time.takenAt

                                        switch (time.takenAt) {
                                            case null:
                                                return blockMode ?
                                                    <ItemButton
                                                        state={unsavedChanges ? 'selected' : 'active'}
                                                        title={`Horário ${unsavedChanges ? 'Bloqueado' : 'Disponível'} - ${arrayIndexToTime(index)}`}
                                                        detailText={`Bloquear`}
                                                        detailSubtitleText={unsavedChanges ? 'Não salvo' : undefined}
                                                        onClickButton={() => {
                                                            setSaved(false)
                                                            const updatedValue = unsavedChanges ? null : 'blocked'
                                                            const updatedDate = scheduleForm[date].map((value: scheduleDayType, i: number) => {
                                                                if (i === index) {
                                                                    return { ...value, takenAt: updatedValue };
                                                                }
                                                                return value;
                                                            });
                                                            const updatedSchedule = {
                                                                ...scheduleForm,
                                                                [date]: updatedDate
                                                            }
                                                            setScheduleForm(updatedSchedule)
                                                        }}
                                                    /> :
                                                    null
                                            case 'blocked':
                                                return blockMode ?
                                                    null :
                                                    <ItemButton
                                                        state={unsavedChanges ? 'active' : 'selected'}
                                                        title={`Horário ${unsavedChanges ? 'Desbloqueado' : 'Bloqueado'} - ${arrayIndexToTime(index)}`}
                                                        detailText="Desbloquear"
                                                        detailSubtitleText={unsavedChanges ? 'Não salvo' : undefined}
                                                        onClickButton={() => {
                                                            setSaved(false)
                                                            const updatedValue = unsavedChanges ? 'blocked' : null
                                                            const updatedDate = scheduleForm[date].map((value: scheduleDayType, i: number) => {
                                                                if (i === index) {
                                                                    return { ...value, takenAt: updatedValue };
                                                                }
                                                                return value;
                                                            });
                                                            const updatedSchedule = {
                                                                ...scheduleForm,
                                                                [date]: updatedDate
                                                            }
                                                            setScheduleForm(updatedSchedule)
                                                        }}
                                                    />
                                            case 'permablock':
                                                return null
                                            default:
                                                return blockMode ?
                                                    null :
                                                    <ItemButton
                                                        state="active"
                                                        title={`${serviceCache[time.service!.toString()].name} - ${arrayIndexToTime(index)}`}
                                                        subtitle={`Agendado ${new Date(time.takenAt).toLocaleString('pt-BR', { day: '2-digit', month: 'long', 'hour': '2-digit', minute: '2-digit' })}`}
                                                        detailSubtitleText={time.client ? time.client : 'Cliente não encontrado'}
                                                        detailText="Editar"
                                                    />
                                        }
                                    })
                                }
                            </div >
                        )
                    })

                }
            </div >
            <SmallButton
                state={!history ? 'active' : 'selected'}
                title={history ? 'Ocultar Histórico' : 'Ver Histórico'}
                onClickButton={() => setHistory(!history)}
            />

            <SubmitButton
                state={saved ? 'selected' : 'active'}
                title="Salvar alterações"
                onClickButton={async () => {
                    await setSchedule(scheduleForm, profId)
                    setSaved(true)
                }}
            />

        </div >
}


