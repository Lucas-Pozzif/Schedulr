import { SmallIconButton } from "../../buttons/small-icon-button/small-icon-button";
import "./group-form-header.css";

type HeaderType = {
  title: string;
  subtitle: string;
  id: string;
  image: string;
  smallButtonList: {
    icon: string;
    title: string;
    onClick: () => void;
  }[];
};

export function GroupFormHeader({ title, subtitle, id, image, smallButtonList }: HeaderType) {
  return (
    <div className='group-form-header'>
      <img className='gh-profile' src={image} />
      <div className='gh-text-block'>
        <p className='gh-title'>{title}</p>
        <p className='gh-subtitle'>{subtitle}</p>
        <p className='gh-id'>{id}</p>
        <div className='gh-button-block'>
          {smallButtonList.map(({ icon, title, onClick }) => {
            return <SmallIconButton icon={icon} title={title} onClick={onClick} />;
          })}
        </div>
      </div>
    </div>
  );
}
