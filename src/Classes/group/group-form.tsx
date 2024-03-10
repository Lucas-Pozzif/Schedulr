import { useState } from "react";
import { Group } from "./group-class";
import { useParams } from "react-router-dom";

interface GroupFormInterface {
  groupData?: Group; //If it comes from an already loaded group
  groupId?: string; // if the group was not loaded yet
}

export function GroupForm({ groupData, groupId }: GroupFormInterface) {
  const [tab, setTab] = useState(0);

  const [group, setGroup] = useState(new Group());

  const { id } = useParams()

  
  return <p>{id}</p>;
}
