import { arrow } from "../../../_global";
import "./return-button.css";

type ReturnButtonType = {
  onClick: () => void;
};

export function ReturnButton({ onClick }: ReturnButtonType) {
  return <img className='return-button' src={arrow} onClick={onClick} />;
}
