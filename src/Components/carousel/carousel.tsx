import "./carousel.css";

type carouselType = {
  items: {
    title?: string;
    selected?: boolean;
    onClick?: () => void;
  }[];
};

export function Carousel({ items }: carouselType) {
  return (
    <div className='carousel'>
      {items.map((item) => {
        return (
          <p className={"carousel-item" + (item.selected ? " selected" : "")} onClick={item.onClick}>
            {item.title}
          </p>
        );
      })}
    </div>
  );
}
