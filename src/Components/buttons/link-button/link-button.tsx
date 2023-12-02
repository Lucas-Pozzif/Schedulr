import { arrow } from "../../../_global";
import "./link-button.css";

type LinkButtonType = {
  title?: string;
  subtitle?: string;
  select?: boolean;
  onClick?: () => void;
};

export function LinkButton({ title, subtitle, select, onClick }: LinkButtonType) {
  return (
    <div className={"link-button" + (select ? "-selected" : "")} onClick={onClick}>
      <p className='lb-title'>{title}</p>
      <p className='lb-subtitle'>{subtitle}</p>
      <img className='lb-arrow' src={arrow} />
    </div>
  );
}
