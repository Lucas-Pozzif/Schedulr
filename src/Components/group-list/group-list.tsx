import { useNavigate } from "react-router-dom"
import { Group } from "../../Classes/group"
import { GroupButton } from "../buttons/group-button/group-button"

import "./group-list.css"

type groupListType = {
    groupList: Group[]
}

export function GroupList({ groupList }: groupListType) {

    const navigate = useNavigate()

    return (
        <div className="group-list">
            {
                groupList.map((group) => {
                    return (
                        <GroupButton group={group} onClick={() => { navigate(`/group/${group.getId()}`) }} />
                    )
                })
            }
        </div>
    )
}