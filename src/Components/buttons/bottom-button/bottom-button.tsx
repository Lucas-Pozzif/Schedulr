import "./bottom-button.css";

type bottomButtonType = {
  title: string;
  onClick?: () => void;
  hidden: boolean;
};

export function BottomButton({ hidden, title, onClick }: bottomButtonType) {
  return (
    <p className={"bottom-button" + (hidden ? " hidden" : "")} onClick={onClick}>
      {title}
    </p>
  );
}
