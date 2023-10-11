import { useState } from "react"
import { Group } from "../../../Classes/group"
import { Line } from "../../line/line"

import "./group-button.css"

type groupButtonType = {
    group: Group
}

export function GroupButton({ group }: groupButtonType) {
    const [selectedDay, setSelectedDay] = useState(0);
    const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"]
    console.log(group.getHours()[selectedDay], group.getStartHours()[selectedDay])

    const triangle = require('../../../Assets/triangle.png')

    return (
        <div className="group-button">
            <img className="gb-banner" src={group.getBanner()} />
            <p className="gb-title">{group.getTitle()}</p>
            <Line />
            <div className="gb-day-selector">
                <img className="gbds left" src={triangle} onClick={() => {
                    if (selectedDay > 0) {
                        setSelectedDay(selectedDay - 1)
                    } else {
                        setSelectedDay(6)
                    }
                }} />
                <p className="gb-day">{days[selectedDay]}</p>
                <img className="gbds right" src={triangle} onClick={() => {
                    if (selectedDay < 6) {
                        setSelectedDay(selectedDay + 1)
                    } else {
                        setSelectedDay(0)
                    }
                }} />
            </div>

        </div>
    )

}