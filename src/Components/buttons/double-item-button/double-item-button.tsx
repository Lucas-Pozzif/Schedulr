import { ItemButton } from "../item-button/item-button";
import "./double-item-button.css";

type DoubleButtonType = {
  leftButtonTitle: {
    title1?: string;
    title2?: string;
  };
  title: string;
  subtitle?: string;
  selected?: boolean;
  onClick?: () => void;
};

export function DoubleItemButton({ leftButtonTitle, title, subtitle, selected, onClick }: DoubleButtonType) {
  return (
    <div className='double-item-button' onClick={onClick}>
      <div className={"di-left-button" + (selected ? " selected" : "")}>
        <p className='dilb-title'>{leftButtonTitle.title1}</p>
        <p className='dilb-title'>{leftButtonTitle.title2}</p>
      </div>
      <div className='dbib'>
        <ItemButton title={title} subtitle={subtitle} selected={selected} onClick={() => {}} />
      </div>
    </div>
  );
}
