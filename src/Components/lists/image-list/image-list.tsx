import { DualButton } from "../../buttons/dual-button/dual-button";
import { ImageButton } from "../../buttons/image-button/image-button";
import "./image-list.css";

type ImageListType = {
  items?: {
    title: string;
    subtitle?: string;
    select?: boolean;
    onClick?: () => void;
    image: string;
  }[];
};

export function ImageList({ items }: ImageListType) {
  return (
    <div className='dual-list'>
      {items?.map((item, index) => {
        return <ImageButton key={index} title={item.title} subtitle={item.subtitle} select={item.select} onClick={item.onClick} image={item.image} />;
      })}
    </div>
  );
}
