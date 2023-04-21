
type tabButtonType = {
    darkMode?: boolean,
    title: string,
    onClickButton: () => void
}

export function TabButton({ darkMode, title, onClickButton }: tabButtonType) {
    return (
        <div onClick={onClickButton}>
            <p>{title} {darkMode ? '-selected' : null}</p>
        </div>
    )

}