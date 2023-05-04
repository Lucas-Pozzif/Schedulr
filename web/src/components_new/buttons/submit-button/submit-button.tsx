import { titleButtonType } from "../button-type";
import './style.css';

export function SubmitButton({
    title,
    state,
    onClickButton = () => { }
}: titleButtonType) {
    return (
        <div className={`button submit-button ${state}`} onClick={onClickButton}>
            <p className={`button-text submit-button-text ${state}`}>{title}</p>
        </div>
    )
}