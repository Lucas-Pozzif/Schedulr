import { LinkButton } from "../../buttons/link-button/link-button";
import "./link-list.css";

type LinkListType = {
  items?: {
    title: string;
    subtitle: string;
    onClick: () => void;
  }[];
};
export function LinkList({ items }: LinkListType) {
  return (
    <div className='link-list'>
      {items?.map((item, index) => (
        <LinkButton key={index} title={item.title} subtitle={item.subtitle} onClick={item.onClick} />
      ))}
    </div>
  );
}
