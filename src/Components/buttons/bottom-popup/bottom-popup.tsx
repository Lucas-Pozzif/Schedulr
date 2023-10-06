import './bottom-popup.css'

type bottomPopupType = {
    title: string;
    subtitle: string;
    buttonTitle: string;
    onClick: () => void
}

export function BottomPopup({ title, subtitle, buttonTitle, onClick }: bottomPopupType) {
    return (
        <div className="bottom-popup">
            <div className="bp-text-block">
                <p className="bp-title">{title}</p>
                <p className="bp-subtitle">{subtitle}</p>
            </div>
            <p className="bp-button" onClick={onClick}>{buttonTitle}</p>
        </div>
    )
}