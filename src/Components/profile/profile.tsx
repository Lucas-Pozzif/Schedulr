import "./profile.css";

import { SmallIconButton } from "../component-imports";

type ProfileType = {
  image?: string;
  name?: string;
  number?: string;
  mail?: string;
  iconButtons?: {
    icon: string;
    title: string;
    hide?: boolean;
    onClick: () => void;
  }[];
  editMode?: boolean;
  namePlaceholder?: string;
  numberPlaceholder?: string;
  onChangeName?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeNumber?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function Profile({ image, name, number, mail, iconButtons, editMode, namePlaceholder, numberPlaceholder, onChangeName, onChangeNumber }: ProfileType) {
  return (
    <div className='profile'>
      <img className='up-image' src={image} />
      <div className='up-text-block'>
        {editMode ? (
          <>
            <input className='up-input-name' value={name} placeholder={namePlaceholder} onChange={onChangeName} />
            <input className='up-input-number' value={number} placeholder={numberPlaceholder} onChange={onChangeNumber} />
          </>
        ) : (
          <>
            <p className='up-name'>{name}</p>
            <p className='up-number'>{number}</p>
          </>
        )}
        <p className='up-mail'>{mail}</p>
      </div>
      <div className='up-small-button-block'>
        {iconButtons?.map((iconButton, index) => (
          <SmallIconButton key={index} title={iconButton.title} hide={iconButton.hide} icon={iconButton.icon} onClick={iconButton.onClick} />
        ))}
      </div>
    </div>
  );
}
