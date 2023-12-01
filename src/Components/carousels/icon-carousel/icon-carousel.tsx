import { SmallIconButton } from "../../component-imports";
import "./icon-carousel.css";

type IconCarouselType = {
  items: {
    title: string;
    icon: string;
    onClick: () => void;
    select?: boolean;
  }[];
};

export function IconCarousel({ items }: IconCarouselType) {
  return (
    <div className='icon-carousel'>
      {items.map((item,index) => {
        return <SmallIconButton key={index} title={item.title} select={item.select} icon={item.icon} onClick={item.onClick} />;
      })}
    </div>
  );
}
