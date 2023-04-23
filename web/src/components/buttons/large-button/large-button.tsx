
import './large-button.css'

type largeButtonType = {
    selected?: boolean,
    title: string,
    onClickButton: () => void
}
export function LargeButton({ selected, title, onClickButton }: largeButtonType) {

    return (
        <div className={`button ${selected ? 'dark-mode' : ''}`} onClick={onClickButton}>
            <p className="text">{title}</p>
        </div>
    )
}