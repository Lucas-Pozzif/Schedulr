import "./carousel.css";

type carouselType = {
  items: {
    title?: string;
    title2?: string;
    selected?: boolean;
    onClick?: () => void;
  }[];
};

export function Carousel({ items }: carouselType) {
  return (
    <div className='carousel'>
      {items.map((item) => {
        return (
          <div className={"carousel-item" + (item.selected ? " selected" : "")} onClick={item.onClick}>
            <p className={"carousel-title"}>{item.title}</p>
            <p className={"carousel-title"}>{item.title2}</p>
          </div>
        );
      })}
    </div>
  );
}
