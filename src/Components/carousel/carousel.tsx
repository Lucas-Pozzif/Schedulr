import "./carousel.css";

type carouselType = {
  items: {
    title?: string;
    isSelected?: boolean;
    onClick?: () => void;
  }[];
};

export function Carousel({ items }: carouselType) {
  return (
    <div className='carousel'>
      {items.map((item) => {
        return (
          <p className={"carousel-item" + (item.isSelected ? " selected" : "")} onClick={item.onClick}>
            {item.title}
          </p>
        );
      })}
    </div>
  );
}
