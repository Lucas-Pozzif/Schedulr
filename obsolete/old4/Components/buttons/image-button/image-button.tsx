import { ItemButton } from "../item-button/item-button";
import "./image-button.css";

type ImageButtonType = {
  title: string;
  subtitle?: string;
  select?: boolean;
  onClick?: () => void;
  image: string;
};

export function ImageButton({ image, title, subtitle, select, onClick }: ImageButtonType) {
  return (
    <div className='image-button' onClick={onClick}>
      <div className={"ib-left-button" + (select ? "-selected" : "")}>
        <img className='ib-image' src={image} />
      </div>
      <ItemButton title={title} subtitle={subtitle} select={select} />
    </div>
  );
}
