import './sub-header.css'

type subHeaderType = {
    title: string;
    buttonTitle: string
    onClick: () => void;
}

export function SubHeader({ title, buttonTitle, onClick }: subHeaderType) {
    return (
        <div className="sub-header">
            <div className="sub-header-left">{title}</div>
            <p className="sub-header-button" onClick={onClick}>{buttonTitle}</p>
        </div>
    )
}