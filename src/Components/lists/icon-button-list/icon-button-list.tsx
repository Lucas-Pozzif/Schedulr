import { IconButton } from "../../buttons/icon-button/icon-button";

type ListType = {
  iconButton: {
    title: string;
    icon: string;
    onClick: () => void;
  }[];
};

export function IconButtonList({ iconButton }: ListType) {
  return (
    <div className='icon-button-list'>
      {iconButton.map(({ title, icon, onClick }) => {
        return <IconButton title={title} icon={icon} onClick={onClick} />;
      })}
    </div>
  );
}
