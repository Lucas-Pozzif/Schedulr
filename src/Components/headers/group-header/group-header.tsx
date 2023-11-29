import { SmallIconButton } from "../../component-imports";
import "./group-header.css";

type GroupHeaderType = {
  title: string;
  subtitle: string;
  iconButton: {
    icon: string;
    title: string;
    hide?: boolean;
    onClick: () => void;
  };
  editMode: boolean;
  titlePlaceholder: string;
  subtitlePlaceholder: string;
  onChangeTitle?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeSubtitle?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function GroupHeader({ title, subtitle, iconButton, editMode, titlePlaceholder, subtitlePlaceholder, onChangeTitle, onChangeSubtitle }: GroupHeaderType) {
  return (
    <div className='group-header'>
      {editMode ? (
        <>
          <input className='gh-input-title' value={title} placeholder={titlePlaceholder} onChange={onChangeTitle} />
          <input className='gh-input-subtitle' value={subtitle} placeholder={subtitlePlaceholder} onChange={onChangeSubtitle} />
        </>
      ) : (
        <>
          <p className='gh-title'>{title}</p>
          <p className='gh-subtitle'>{subtitle}</p>
        </>
      )}
      <div className='gh-small-button'>
        <SmallIconButton title={iconButton.title} icon={iconButton.icon} hide={iconButton.hide} onClick={iconButton.onClick} />{" "}
      </div>
    </div>
  );
}
