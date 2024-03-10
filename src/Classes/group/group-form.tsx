import { useState } from "react";
import { Group } from "./group-class";
import { useParams } from "react-router-dom";
import { GroupFormMenu } from "./group-form-tabs/group-form-menu/group-form-menu";

interface GroupFormInterface {
  groupData?: Group; //If it comes from an already loaded group
  groupId?: string; // if the group was not loaded yet
}

export function GroupForm({ groupData, groupId }: GroupFormInterface) {
  const [tab, setTab] = useState(0);
  const [group, setter] = useState(new Group());
  const { id } = useParams();

  const tabs = [<GroupFormMenu group={group} setter={setter} setTab={setTab} />];

  return tabs[tab];
}
