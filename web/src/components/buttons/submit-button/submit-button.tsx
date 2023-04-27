import './submit-button.css'

type submitButtonType = {
    hide: boolean,
    title: string,
    onClickButton: () => void

}

export function SubmitButton({ hide, title, onClickButton }: submitButtonType) {

    return (
        <div className={`submit-button ${hide ? 'button-hide' : ''}`} onClick={onClickButton}>
            <p className='sb-title'>{title}</p>
        </div>
    )

}