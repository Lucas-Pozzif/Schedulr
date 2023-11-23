import "./item-button.css";

type itemButtonType = {
  title?: string;
  subtitle?: string;
  selected?: boolean;
  onClick?: () => void;
};

export function ItemButton({ title, subtitle, selected, onClick }: itemButtonType) {
  return (
    <div className={"item-button" + (selected ? " selected" : "")} onClick={onClick}>
      <p className='ib-title'>{title}</p>
      <p className='ib-subtitle'>{subtitle}</p>
      <div className={"selection-circle" + (selected ? " selected" : "")}>
        <div className='selection-inner-circle'></div>
      </div>
    </div>
  );
}
