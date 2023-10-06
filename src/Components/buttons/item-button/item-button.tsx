import './item-button.css'

type itemButtonType = {
    title: string;
    subtitle: string;
    isSelected: boolean;
    onClick: () => void
}

export function ItemButton({ title, subtitle, isSelected, onClick }: itemButtonType) {
    return (
        <div className={"item-button" + (isSelected ? " selected" : "")} onClick={onClick}>
            <p className="ib-title">{title}</p>
            <p className="ib-subtitle">{subtitle}</p>
            <div className={"selection-circle" + (isSelected ? " selected" : "")}>
                <div className="selection-inner-circle"></div>
            </div>
        </div>
    )
}