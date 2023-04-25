import { isSelected } from '../../../functions/is-selected/is-selected'

import './time-button.css'

type dateButtonType = {
    selected?: boolean
    disabled?: boolean
    time: string,
    onClickButton: () => void
}

export function TimeButton({ selected = false, time, onClickButton }: dateButtonType) {

    const selectedText = selected ? 'Selecionado' : 'Selecionar'

    return (
        <div className={`button date-button ${isSelected(selected)}`} onClick={onClickButton}>
            <p className={`dateb-title button-text ${isSelected(selected)}`}>{time}</p>
            <div className='datebrb-area'>
                <div className='datebrb-block'>
                    <div className={`dateb-right-button button ${isSelected(!selected)}`}>
                        <p className={`datebrb-title button-text ${isSelected(!selected)}`}>{selectedText}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}