import { ReturnButton } from "../../buttons/return-button/return-button";
import "./simple-header.css";

type HeaderType = {
  onClickReturn?: () => void;
  title?: string;
};

export function SimpleHeader({ onClickReturn, title }: HeaderType) {
  return (
    <div className='simple-header'>
      <ReturnButton onClick={onClickReturn} />
      <p className='sh-title'>{title}</p>
    </div>
  );
}
