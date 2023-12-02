import { ItemButton } from "../../buttons/item-button/item-button";
import "./item-list.css";

type ItemListType = {
  items?: {
    title?: string;
    subtitle?: string;
    select?: boolean;
    onClick?: () => void;
  }[];
};

export function ItemList({ items }: ItemListType) {
  return (
    <div className='item-list'>
      {items?.map((item, index) => {
        return <ItemButton key={index} title={item.title} subtitle={item.subtitle} select={item.select} onClick={item.onClick} />;
      })}
    </div>
  );
}
