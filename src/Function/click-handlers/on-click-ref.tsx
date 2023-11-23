import { Group } from "../../Classes/group";

export const onClickRef = (reference: React.RefObject<HTMLInputElement>) => {
  reference.current!.click();
};
export const handleImageInput = async (event: React.ChangeEvent<HTMLInputElement>, group: Group, setGroup: React.Dispatch<React.SetStateAction<Group>>, attribute: "banner" | "profile") => {
  const selectedFile = event.target.files?.[0];
  if (selectedFile) {
    if (attribute == "banner") group.setBanner(URL.createObjectURL(selectedFile));
    else if (attribute == "profile") group.setProfile(URL.createObjectURL(selectedFile));
    setGroup(new Group(group));
  }
};
