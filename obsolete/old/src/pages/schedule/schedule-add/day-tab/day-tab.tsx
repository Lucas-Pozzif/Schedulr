import { useNavigate } from "react-router-dom";
import { ItemButton } from "../../../../components/buttons/item-button/item-button";
import { Header } from "../../../../components/header/header";
import { dateArrayGenerator } from "../../../../functions/date-time/date-array-generator";
import { scheduleTabType } from "../schedule-add";

import './style.css'

export function DayTab({ schedule, setSchedule, setTab }: scheduleTabType) {
    const dates = dateArrayGenerator(30)
    const navigate = useNavigate()

    return (
        <div className="day-tab">
            <Header
                title="Escolha o melhor dia para você"
                subtitle="Estaremos à disposição"
                buttonTitle="Escolher Serviços"

                onClickReturn={() => { navigate(-1) }}
                onClickButton={() => setTab(1)}
            />
            {
                dates.map((date) => {
                    const dateValue = date.toLocaleDateString('en-US')
                    return (
                        <div>
                            <ItemButton
                                state={dateValue == schedule.selectedDate ? 'selected' : 'active'}
                                title={date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}
                                //subtitle=""
                                detailText={date.toLocaleDateString('pt-BR', { weekday: 'long' })}

                                onClickButton={() => setSchedule({ ...schedule, selectedDate: dateValue })}
                            />
                        </div>
                    )
                })
            }
        </div>
    );
}