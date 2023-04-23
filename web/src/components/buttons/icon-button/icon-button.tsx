import './icon-button.css'

type iconButtonType = {
    selected?: boolean,
    image: string,
    title: string,
    onClickButton: () => void
}

export function IconButton({ selected, image, title, onClickButton }: iconButtonType) {
    return (
        <div className="icon-button" onClick={onClickButton}>
            <img className='iconb-image' src={image} />
            <p className='iconb-title'>{title}</p>
        </div>
    )
}