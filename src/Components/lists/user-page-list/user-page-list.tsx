import { IconButton } from "../../component-imports";
import "./user-page-list.css";

type UserPageListType = {
  items?: {
    title: string;
    icon: string;
    hide?: boolean;
    onClick: () => void;
  }[];
};
export function UserPageList({ items }: UserPageListType) {
  return (
    <div className='user-page-list'>
      {items?.map((item,index) => (
        <IconButton key={index} title={item.title} hide={item.hide} icon={item.icon} onClick={item.onClick} />
      ))}
    </div>
  );
}
