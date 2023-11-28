import "./white-button.css";

type WhiteButtonType = {
  title: string;
  onClick: () => void;
};

export function WhiteButton({ title, onClick }: WhiteButtonType) {
  return (
    <div className='white-button' onClick={onClick}>
      <p className='wb-title'>{title}</p>
    </div>
  );
}
