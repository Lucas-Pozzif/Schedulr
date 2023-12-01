import { DualButton } from "../../buttons/dual-button/dual-button";
import "./dual-list.css";

type DualListType = {
  items?: {
    title: string;
    subtitle?: string;
    select?: boolean;
    onClick?: () => void;
    leftButton: {
      title?: string;
      subtitle?: string;
    };
  }[];
};

export function DualList({ items }: DualListType) {
  return (
    <div className='dual-list'>
      {items?.map((item, index) => {
        return (
          <DualButton
            key={index}
            title={item.title}
            subtitle={item.subtitle}
            select={item.select}
            onClick={item.onClick}
            leftButton={{
              title: item.leftButton.title,
              subtitle: item.leftButton.subtitle,
            }}
          />
        );
      })}
    </div>
  );
}
