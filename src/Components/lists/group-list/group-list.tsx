import { useNavigate } from "react-router-dom";
import { Group } from "../../../Classes/group/group";
import { GroupButton } from "../../buttons/group-button/group-button";

import "./group-list.css";

type groupListType = {
  groupList: Group[];
  onClick?: () => void;
};

export function GroupList({ groupList, onClick }: groupListType) {
  const navigate = useNavigate();

  return (
    <div className='group-list' onClick={onClick}>
      {groupList.map((group, index) => {
        return <GroupButton key={index} group={group} onClick={() => navigate(`/group/${group.getId()}`)} />;
      })}
    </div>
  );
}
