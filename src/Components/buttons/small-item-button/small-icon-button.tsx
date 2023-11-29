import "./small-icon-button.css";

type SmallIconButtonType = {
  title: string;
  icon: string;
  select?: boolean;
  hide?: boolean;
  onClick: () => void;
};

export function SmallIconButton({ title, hide, select, icon, onClick }: SmallIconButtonType) {
  return (
    <div className={`small-icon-button${hide ? "-hide" : select ? "-select" : ""}`} onClick={onClick}>
      <img className='sib-icon' src={icon} />
      <p className='sib-title'>{title}</p>
    </div>
  );
}
