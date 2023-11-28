import "./small-icon-button.css";

type SmallIconButtonType = {
  title: string;
  icon: string;
  hide?: boolean;
  onClick: () => void;
};

export function SmallIconButton({ title, hide, icon, onClick }: SmallIconButtonType) {
  return (
    <div className={`small-icon-button${hide ? "-hide" : ""}`} onClick={onClick}>
      <img className='sib-icon' src={icon} />
      <p className='sib-title'>{title}</p>
    </div>
  );
}
