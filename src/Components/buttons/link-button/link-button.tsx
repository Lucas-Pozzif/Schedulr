import "./link-button.css";
type linkButtonType = {
  title: string;
  onClick?: () => void;
  hidden?: boolean;
};
const arrow = require("../../../Assets/arrow.png");

export function LinkButton({ title, hidden = false, onClick }: linkButtonType) {
  return (
    <div className={"link-button" + (hidden ? " hidden" : "")} onClick={onClick}>
      <p className='lb-title'>{title}</p>
      <img className={"sched-arrow right"} src={arrow} />
    </div>
  );
}
