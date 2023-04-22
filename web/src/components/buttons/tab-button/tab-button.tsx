
type tabButtonType = {
    darkMode?: boolean,
    title: string,
    onClickButton: () => void
}

export function TabButton({ darkMode, title, onClickButton }: tabButtonType) {
    return (
        <div className={`tab-button ${darkMode ? 'selected' : null}`} onClick={onClickButton}>
            <p className={`title`}>{title} </p>
        </div>
    )

}