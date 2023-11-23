import "./small-button.css";

type smallButtonType = {
  title: string;
  selected: boolean;
  onClick: () => void;
};
export function SmallButton({ title, selected, onClick }: smallButtonType) {
  return (
    <p className={"small-button" + (selected ? " selected" : "")} onClick={onClick}>
      {title}
    </p>
  );
}
