import "./icon-button.css";

type IconButtonType = {
  title: string;
  icon: string;
  hide?: boolean;
  onClick: () => void;
};

export function IconButton({ title, icon, hide = false, onClick }: IconButtonType) {
  return (
    <div className={`icon-button${hide ? "-hide" : ""}`} onClick={onClick}>
      <img className='ib-icon' src={icon} />
      <p className='ib-title'>{title}</p>
    </div>
  );
}
