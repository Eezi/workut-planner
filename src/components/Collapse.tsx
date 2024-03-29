interface Props {
  children: React.ReactNode;
  Content: React.ReactNode;
}

export const Collapse = ({ children, Content }: Props) => (
  <div className="collapse w-full">
    <input type="checkbox" />
    <div className="collapse-title p-0">{children}</div>
    <div className="collapse-content">{Content}</div>
  </div>
);
