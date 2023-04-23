
type tabButtonType = {
    selected?: boolean,
    title: string,
    onClickButton: () => void
}

export function TabButton({ selected, title, onClickButton }: tabButtonType) {
    return (
        <div className={`tab-button ${selected ? 'selected' : null}`} onClick={onClickButton}>
            <p className={`title`}>{title} </p>
        </div>
    )

}