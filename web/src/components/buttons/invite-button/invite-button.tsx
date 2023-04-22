
import './invite-button.css'

type inviteButtonType = {
    darkMode?: boolean,
    title: string,
    onClickButton: () => void
}

export function InviteButton({ darkMode, title, onClickButton }: inviteButtonType) {
    return (
        <div className={`invite-button ${darkMode ? 'selected' : null}`} onClick={onClickButton}>
            <p className={`ib-title`}>{title} </p>
        </div>
    )

}