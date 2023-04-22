import './login-button.css'

type loginButtonType = {
    image: string,
    title: string,
    onClickButton: () => void

}

export function LoginButton({ image, title, onClickButton }: loginButtonType) {

    return (
        <div className='login-button' onClick={onClickButton}>
            <p className='title'>{title}</p>
            <img className='image' src={image} />
        </div>
    )

}