import { IconButton } from "../../component-imports";
import "./icon-list.css";

type IconListType = {
  items?: {
    title: string;
    icon: string;
    hide?: boolean;
    onClick: () => void;
  }[];
};
export function IconList({ items }: IconListType) {
  return (
    <div className='icon-list'>
      {items?.map((item, index) => (
        <IconButton key={index} title={item.title} hide={item.hide} icon={item.icon} onClick={item.onClick} />
      ))}
    </div>
  );
}
