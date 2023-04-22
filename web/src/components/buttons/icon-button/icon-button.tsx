import './icon-button.css'

type iconButtonType = {
    darkMode?: boolean,
    image: string,
    title: string,
    onClickButton: () => void
}

export function IconButton({ darkMode, image, title, onClickButton }: iconButtonType) {
    return (
        <div className="icon-button" onClick={onClickButton}>
            <img className='iconb-image' src={image} />
            <p className='iconb-title'>{title}</p>
        </div>
    )
}