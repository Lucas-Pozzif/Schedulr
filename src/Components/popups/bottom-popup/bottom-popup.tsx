import { DualButton } from "../../buttons/dual-button/dual-button";
import { Line } from "../../component-imports";
import "./bottom-popup";

type BottomPopupType = {
  stage?: number;
  title?: string;
  subtitle?: string;
  buttonTitle?: string;
  onClick?: () => void;
  topText?: string;
  bottomText?: string;
  hide?: boolean;
  items?: {
    title: string;
    subtitle: string;
    selected: boolean;
    leftTitle: string;
    leftSubtitle: string;
    onClick: () => void;
  }[];
};

export function BottomPopup({ stage, title, subtitle, buttonTitle, onClick, topText, bottomText, items }: BottomPopupType) {
  return (
    <>
      <div className={`bp-blur ${stage !== 2 ? "hidden" : ""}`} />
      <div className={`bottom-popup${stage === 0 ? "-hide" : stage === 1 ? "" : "-expand"}`}>
        {stage === 2 ? (
          <div className='bp-top-block'>
            <p className='bp-top-text'>{topText}</p>
            {items?.map((item) => {
              return (
                <DualButton
                  leftButton={{
                    title: item.leftTitle,
                    subtitle: item.leftSubtitle,
                  }}
                  title={item.title}
                  subtitle={item.subtitle}
                  selected={item.selected}
                  onClick={item.onClick}
                />
              );
            })}
            <p className='bp-bottom-text'>{bottomText}</p>
            <Line />
          </div>
        ) : null}
        <div className='bp-bottom-block'>
          <div className='bp-text-block'>
            <p className='bp-title'>{title}</p>
            <p className='bp-subtitle'>{subtitle}</p>
          </div>
          <p className='bp-button' onClick={onClick}>
            {buttonTitle}
          </p>
        </div>
      </div>
    </>
  );
}
