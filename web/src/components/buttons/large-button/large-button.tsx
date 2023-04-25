
import './large-button.css'

type largeButtonType = {
    selected?: boolean,
    title: string,
    onClickButton: () => void
}
export function LargeButton({ selected, title, onClickButton }: largeButtonType) {

    return (
        <div className={`large-button button ${selected ? 'selected' : ''}`} onClick={onClickButton}>
            <p className="text">{title}</p>
        </div>
    )
}