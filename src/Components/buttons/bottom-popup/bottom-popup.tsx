import './bottom-popup.css'

type bottomPopupType = {
    title: string;
    subtitle: string;
    buttonTitle: string;
    onClick: () => void
    isActive: boolean
}

export function BottomPopup({ title, subtitle, buttonTitle, onClick, isActive }: bottomPopupType) {
    return (
        <div className={"bottom-popup"}>
            <div className="bp-text-block">
                <p className="bp-title">{title}</p>
                <p className="bp-subtitle">{subtitle}</p>
            </div>
            <p className={"bp-button" + (isActive ? "" : " inactive")} onClick={() => isActive ? onClick() : null}>{buttonTitle}</p>
        </div>
    )
}