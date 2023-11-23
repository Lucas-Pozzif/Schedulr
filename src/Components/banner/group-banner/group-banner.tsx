import "./group-banner.css";

type GroupBannerType = {
  placeholder?: string;
  banner?: string;
  returnButton?: boolean;
  onClick?: () => void;
  onClickReturn?: () => void;
};

const addImage = require("../../../Assets/add-image.png");
const arrow = require("../../../Assets/arrow.png");

export function GroupBanner({ banner, onClick, onClickReturn, returnButton, placeholder = addImage }: GroupBannerType) {
  return (
    <div className='group-banner' onClick={onClick}>
      <img className={`group-banner-${banner ? "image" : "placeholder"}`} src={banner ? banner : placeholder} />
      <div className='gp-blur' />
      <img className={`return-button gp-return ${returnButton ? "" : "hidden"}`} src={arrow} onClick={onClickReturn} />
    </div>
  );
}
