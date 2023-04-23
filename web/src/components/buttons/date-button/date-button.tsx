import './date-button.css'

type dateButtonType = {
    selected?: boolean
    disabled?: boolean
    date: Date,
    onClickButton: () => void
}

export function DateButton({ selected, disabled, date, onClickButton }: dateButtonType) {
    const monthDay = date.toLocaleDateString("pt-BR", { month: "long", day: "numeric" })
    const wd = date.toLocaleDateString("pt-BR", { weekday: 'long' }).split('-')[0]
    const weekday = wd.charAt(0).toUpperCase() + wd.slice(1);

    return (
        <div className="date-button">
            <p className="dateb-title">{monthDay}</p>
            <div className='datebrb-area'>
                <div className='datebrb-block'>
                    <p className="datebrb-side-text">Promocao</p>
                    <div className="dateb-right-button">
                        <p className="datebrb-title">{weekday}</p>
                    </div>
                </div>
                <p className="datebrb-subtitle">00:00 - 00:00</p>
            </div>
        </div>
    )
}