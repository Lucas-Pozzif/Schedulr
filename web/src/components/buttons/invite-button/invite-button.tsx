
import './invite-button.css'

type inviteButtonType = {
    selected?: boolean,
    title: string,
    onClickButton: () => void
}

export function InviteButton({ selected, title, onClickButton }: inviteButtonType) {
    return (
        <div className={`invite-button ${selected ? 'selected' : null}`} onClick={onClickButton}>
            <p className={`ib-title`}>{title} </p>
        </div>
    )

}