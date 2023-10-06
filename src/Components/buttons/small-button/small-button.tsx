import "./small-button.css"

type smallButtonType = {
    title: string;
    isSelected: boolean;
    onClick: () => void;
}
export function SmallButton({ title, isSelected, onClick }: smallButtonType) {
    return (
        <p className={"small-button" + (isSelected ? " selected" : "")} onClick={onClick}>{title}</p>
    )
}