import { useNavigate } from "react-router-dom";
import { ReturnButton } from "../../buttons/return-button/return-button";
import { InviteButton } from "../../buttons/invite-button/invite-button";

import './header.css'

type headerType = {
    title: string,
    subtitle: string,
    buttonText: string,
    onClickButton: () => void
    onClickReturn: () => void


}

export function Header(
    {
        title,
        subtitle,
        buttonText,
        onClickButton,
        onClickReturn
    }: headerType
) {
    const navigate = useNavigate()

    return (
        <div className="header">
            <ReturnButton onClickButton={onClickReturn} />
            <div className="header-text-block">
                <p className="header-title">{title}</p>
                <div className="header-subtitle-block">
                    <p className="header-subtitle">{subtitle}</p>
                    <InviteButton title={buttonText} onClickButton={onClickButton} />
                </div>
            </div>
        </div>
    )
}