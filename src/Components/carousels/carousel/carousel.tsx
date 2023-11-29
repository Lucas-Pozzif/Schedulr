import "./carousel.css";

type CarouselType = {
  items: {
    title?: string;
    subtitle?: string;
    select?: boolean;
    onClick?: () => void;
  }[];
};

export function Carousel({ items }: CarouselType) {
  return (
    <div className='carousel'>
      {items.map((item) => {
        return (
          <div className={"carousel-item" + (item.select ? "-selected" : "")} onClick={item.onClick}>
            <p className={"carousel-title"}>{item.title}</p>
            <p className={"carousel-subtitle"}>{item.subtitle}</p>
          </div>
        );
      })}
    </div>
  );
}
