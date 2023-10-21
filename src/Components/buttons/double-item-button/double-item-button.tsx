import { ItemButton } from "../item-button/item-button";

type DoubleButtonType = {
  leftButtonTitle: {
    title1: string;
    title2: string;
  };
  title: string;
  subtitle: string;
  isSelected: boolean;
  onClick: () => void;
};

export function DoubleItemButton({ leftButtonTitle, title, subtitle, isSelected, onClick }: DoubleButtonType) {
  return (
    <div className='double-item-button' onClick={onClick}>
      <div className={"di-left-button" + (isSelected ? " selected" : "")}>
        <p className='dilb-title'>{leftButtonTitle.title1}</p>
        <p className='dilb-title'>{leftButtonTitle.title2}</p>
      </div>
      <ItemButton title={title} subtitle={subtitle} isSelected={isSelected} onClick={() => {}} />
    </div>
  );
}
