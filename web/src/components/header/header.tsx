import { ReturnButton } from "../buttons/return-button/return-button";
import { SmallButton } from "../buttons/small-button/small-button";
import { headerType } from "./header-type";

import './style.css'

export function Header({ title, subtitle, buttonTitle, onClickButton, onClickReturn, state = 'active' }: headerType) {
    const RenderReturn = () => onClickReturn ? <ReturnButton onClickButton={onClickReturn} /> : null
    const RenderButton = () => onClickButton && buttonTitle ? <SmallButton
        title={buttonTitle}
        state={state}
        onClickButton={() => { if (state !== 'inactive') onClickButton() }
        } /> : null

    return (
        <div className="header flex-div">
            <RenderReturn />
            <div className="header-title-block">
                <p className="header-title">{title}</p>
                <div className="flex-div header-button-block">
                    <p className="header-subtitle">{subtitle}</p>
                    <RenderButton />
                </div>
            </div>
        </div>
    )
}