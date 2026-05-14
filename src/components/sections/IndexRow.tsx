import { ReactNode } from "react";

interface IndexRowProps {
  name: ReactNode;
  description: ReactNode;
  descriptionClass?: string;
}

const IndexRow = ({
  name,
  description,
  descriptionClass = "text-foreground/85 mt-1 sm:mt-0 text-sm",
}: IndexRowProps) => (
  <div className="sm:grid sm:grid-cols-[auto_1fr] sm:gap-x-6 sm:items-baseline">
    <div className="font-mono">{name}</div>
    <div className={descriptionClass}>{description}</div>
  </div>
);

export default IndexRow;
