import { icon } from "../../../_global";
import "./return-button.css";

type ButtonType = {
  onClick?: () => void;
};

export function ReturnButton({ onClick }: ButtonType) {
  return <img className='return-button' src={icon.arrow} onClick={onClick} />;
}
