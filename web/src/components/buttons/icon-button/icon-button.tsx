import { useNavigate } from "react-router"

type iconButtonType = {
    darkMode?: boolean,
    icon: string,
    title: string,
    onClickButton: () => void
}

export function IconButton({ darkMode, icon, title, onClickButton }: iconButtonType) {
    return (
        <div className="icon-button" onClick={onClickButton}>
            <img src={icon} />
            <p>{title}</p>
        </div>
    )
}