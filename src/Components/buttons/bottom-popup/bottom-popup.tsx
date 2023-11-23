import "./bottom-popup.css";

type bottomPopupType = {
  title: string;
  title2?: string;
  subtitle?: string;
  buttonTitle: string;
  onClick: () => void;
  activated?: boolean;
  hidden?: boolean;
};

export function BottomPopup({ title, title2, subtitle, buttonTitle, onClick, activated = true, hidden = false }: bottomPopupType) {
  return (
    <div className={"bottom-popup" + (hidden ? " hidden" : "")}>
      <div className='bp-text-block'>
        <p className='bp-title'>{title}</p>
        <p className='bp-title'>{title2}</p>
        <p className='bp-subtitle'>{subtitle}</p>
      </div>
      <p className={"bp-button" + (activated ? "" : " inactive")} onClick={() => (activated ? onClick() : null)}>
        {buttonTitle}
      </p>
    </div>
  );
}
