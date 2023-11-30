import { closeIcon } from "../../../_global";
import "./popup.css";

type PopupType = {
  title: string;
  text: string;
  onClickExit: () => void;
  buttons: {
    title: string;
    onClick: () => void;
  }[];
};

export function Popup({ title, text, onClickExit, buttons }: PopupType) {
  return (
    <div className='popup'>
      <p className='p-title'>{title}</p>
      <p className='p-text'>{text}</p>
      <div className='p-button-list'>
        {buttons.map((button) => {
          return (
            <div className='p-button' onClick={button.onClick}>
              <p className='p-button-title'>{button.title}</p>
            </div>
          );
        })}
      </div>
      <img className='p-exit' src={closeIcon} onClick={onClickExit} />
    </div>
  );
}
