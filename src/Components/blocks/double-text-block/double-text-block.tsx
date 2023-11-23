import "./double-text-block.css";

type DoubleTextBlockType = {
  title: string;
  subtitle: string;
};

export function DoubleTextBlock({ title, subtitle }: DoubleTextBlockType) {
  return (
    <div className='double-text-block'>
      <p className='dtb-title'>{title}</p>
      <p className='dtb-subtitle'>{subtitle}</p>
    </div>
  );
}
