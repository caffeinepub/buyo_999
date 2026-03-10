import { ButtonType } from "../types";
import { Button } from "./button";
import { ComponentType } from "react";

export interface FooterButton {
  text: string;
  action: () => void;
  style: ButtonType;
  icon: ComponentType<{ className?: string }> | null;
}

interface FooterProps {
  buttons: FooterButton[];
}

export const Footer = ({ buttons }: FooterProps) => {
  if (!buttons.length) return null;

  return (
    <>
      <div className="flex mt-auto gap-4">
        {buttons.map((btn) => (
          <Button
            icon={btn.icon}
            key={btn.text}
            btnType={btn.style}
            text={btn.text}
            onClick={btn.action}
          />
        ))}
      </div>
    </>
  );
};
