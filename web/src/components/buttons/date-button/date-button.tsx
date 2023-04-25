import { isSelected } from '../../../functions/is-selected/is-selected'
import './date-button.css'

type dateButtonType = {
    selected?: boolean
    disabled?: boolean
    date: Date,
    onClickButton: () => void
}

export function DateButton({ selected = false, disabled, date, onClickButton }: dateButtonType) {
    const monthDay = date.toLocaleDateString("pt-BR", { month: "long", day: "numeric" })
    const wd = date.toLocaleDateString("pt-BR", { weekday: 'long' }).split('-')[0]
    const weekday = wd.charAt(0).toUpperCase() + wd.slice(1);

    return (
        <div className={`button date-button ${isSelected(selected)}`} onClick={onClickButton}>
            <p className={`dateb-title button-text ${isSelected(selected)}`}>{monthDay}</p>
            <div className='datebrb-area'>
                <div className='datebrb-block'>
                    <p className={`datebrb-side-text button-text ${isSelected(selected)}`}>Promocao</p>
                    <div className={`dateb-right-button button ${isSelected(!selected)}`}>
                        <p className={`datebrb-title button-text ${isSelected(!selected)}`}>{weekday}</p>
                    </div>
                </div>
                <p className={`datebrb-subtitle button-text ${isSelected(selected)}`}>00:00 - 00:00</p>
            </div>
        </div>
    )
}