
import './large-button.css'

type largeButtonType = {
    darkMode?: boolean,
    title: string,
    onClickButton: () => void
}
export function LargeButton({ darkMode, title, onClickButton }: largeButtonType) {

    return (
        <div className={`button ${darkMode ? 'dark-mode' : ''}`} onClick={onClickButton}>
            <p className="text">{title}</p>
        </div>
    )
}