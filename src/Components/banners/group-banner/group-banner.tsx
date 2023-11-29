import "./group-banner.css";

type GroupBannerType = {
  placeholder?: string;
  banner?: string;
  profile?: string;
  returnButton?: boolean;
  onClickBanner?: () => void;
  onClickProfile?: () => void;
  onClickReturn?: () => void;
};

const addImage = require("../../../Assets/add-image.png");
const arrow = require("../../../Assets/arrow.png");

export function GroupBanner({ banner, profile, onClickProfile, onClickBanner, onClickReturn, returnButton, placeholder = addImage }: GroupBannerType) {
  return (
    <div className='group-banner' onClick={onClickBanner}>
      <img className={`group-banner-${banner ? "image" : "placeholder"}`} src={banner ? banner : placeholder} />
      <div className='gp-blur' />
      <img className={`return-button gp-return ${returnButton ? "" : "hidden"}`} src={arrow} onClick={onClickReturn} />
      <div className='gp-profile' onClick={onClickProfile}>
        <img className={`gp-profile-${profile ? "image" : "placeholder"}`} src={profile ? profile : addImage} />
      </div>
    </div>
  );
}
