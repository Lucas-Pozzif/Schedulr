import { Group } from "../../Classes/group"
import { GroupButton } from "../buttons/group-button/group-button"

import "./group-list.css"

type groupListType = {
    groupList: Group[]
}

export function GroupList({ groupList }: groupListType) {

    return (
        <div className="group-list">
            {
                groupList.map((group) => {
                    return (
                        <GroupButton group={group} />
                    )
                })
            }
        </div>
    )
}