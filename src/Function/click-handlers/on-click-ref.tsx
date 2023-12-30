import { Group } from "../../Classes/group/group";

export const onClickRef = (reference: React.RefObject<HTMLInputElement>) => {
  reference.current!.click();
};
export const handleImageInput = async (event: React.ChangeEvent<HTMLInputElement>, group: Group, setGroup: React.Dispatch<React.SetStateAction<Group>>, attribute: "banner" | "profile") => {
  const selectedFile = event.target.files?.[0];
  if (selectedFile) {
    if (attribute == "banner") group.updateValue("banner", URL.createObjectURL(selectedFile), false, setGroup);
    else if (attribute == "profile") group.updateValue("profile", URL.createObjectURL(selectedFile), false, setGroup);
  }
};
