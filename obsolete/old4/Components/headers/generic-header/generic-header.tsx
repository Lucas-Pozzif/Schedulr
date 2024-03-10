import { emptySquare } from "../../../_global";
import { ReturnButton } from "../../buttons/return-button/return-button";
import "./generic-header.css";

type GenericHeaderType = {
  title: string;
  icon?: string;
  onClickReturn: () => void;
  onClickIcon?: () => void;
};

export function GenericHeader({ title, icon, onClickReturn, onClickIcon }: GenericHeaderType) {
  return (
    <div className='generic-header'>
      <ReturnButton onClick={onClickReturn} />
      <p className='gh-title'>{title}</p>
      <img className='gh-icon' src={icon == "" ? emptySquare : icon} onClick={onClickIcon} />
    </div>
  );
}
