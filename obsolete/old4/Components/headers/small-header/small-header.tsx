import { ReturnButton } from "../../buttons/return-button/return-button";
import "./small-header.css";

type SmallHeaderType = {
  title: string;
  onClickReturn: () => void;
};

export function SmallHeader({ title, onClickReturn }: SmallHeaderType) {
  return (
    <div className='small-header'>
      <ReturnButton onClick={onClickReturn} />
      <p className='sh-title'>{title}</p>
    </div>
  );
}
