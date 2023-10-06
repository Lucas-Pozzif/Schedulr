import './link-button.css'
type linkButtonType = {
    title: string;
    onClick: () => void
}
const arrow = require("../../../Assets/arrow.png");

export function LinkButton({ title, onClick }: linkButtonType) {
    return (
        <div className="link-button" onClick={onClick}>
            <p className="lb-title">{title}</p>
            <img className={"sched-arrow right"} src={arrow} />
        </div>
    )
}