import { DoubleButton, ItemButton } from "../../component-imports";
import "./alert-block.css";

type AlertBlockType = {
  title?: string;
  itemButtons: {
    title: string;
    subtitle: string;
    selected: boolean;
    onClick?: () => void;
  }[];
  bottomText: string;
  button1: {
    hidden: boolean;
    title: string;
    onClick: () => void;
  };
  button2?: {
    hidden: boolean;
    title: string;
    onClick: () => void;
  };
  hidden?: boolean;
  onClickOut?: () => void;
};

export function AlertBlock({ title, itemButtons, bottomText, button1, button2, hidden = false, onClickOut }: AlertBlockType) {
  return (
    <>
      <div className={`ab-background ${hidden ? "hidden" : ""}`} onClick={onClickOut} />
      <div className={`alert-block ${hidden ? "hidden" : ""}`}>
        <p className='ab-title'>{title}</p>
        <div className='ab-list'>
          {itemButtons?.map((itemButton) => {
            return <ItemButton title={itemButton.title} subtitle={itemButton.subtitle} selected={itemButton.selected} onClick={itemButton.onClick} />;
          })}
        </div>
        <p className='ab-bottom-text'>{bottomText}</p>
        <DoubleButton title={[button1.title, button2?.title || ""]} onClick={[() => button1.onClick(), () => button2?.onClick()]} hidden={[button1?.hidden, button2?.hidden === undefined ? true : button2.hidden]} />
      </div>
    </>
  );
}
