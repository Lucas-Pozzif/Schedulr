import "./item-button.css";

type itemButtonType = {
  title?: string;
  subtitle?: string;
  select?: boolean;
  onClick?: () => void;
};

export function ItemButton({ title, subtitle, select, onClick }: itemButtonType) {
  return (
    <div className={"item-button" + (select ? "-selected" : "")} onClick={onClick}>
      <p className='ib-title'>{title}</p>
      <p className='ib-subtitle'>{subtitle}</p>
      <div className={"selection-circle" + (select ? "-selected" : "")}>
        <div className='selection-inner-circle'></div>
      </div>
    </div>
  );
}
