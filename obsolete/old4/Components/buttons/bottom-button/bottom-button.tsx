import "./bottom-button.css";

type bottomButtonType = {
  title: string;
  onClick?: () => void;
  hide?: boolean;
};

export function BottomButton({ hide, title, onClick }: bottomButtonType) {
  return (
    <p className={"bottom-button" + (hide ? "-hide" : "")} onClick={onClick}>
      {title}
    </p>
  );
}
