import { BackIcon, LogoIcon } from "./Icons";

export interface HeaderButton {
  icon: React.ComponentType<{ className?: string }> | null;
  action: () => void;
  id?: string;
}

export interface HeaderProps {
  text: string | null;
  hasBackBtn: boolean;
  buttons?: HeaderButton[];
  backhandler: () => void;
  buttonBlurred: boolean;
}

export const Header = ({
  text,
  hasBackBtn,
  buttons = [],
  backhandler,
  buttonBlurred,
}: HeaderProps) => {
  return (
    <div className="mb-[24px] sm:mb-[10px] flex justify-between items-center gap-[10px]">
      {hasBackBtn && (
        <div
          className="min-w-10 w-10 h-10 rounded-[12px] bg-white flex items-center justify-center cursor-pointer"
          onClick={backhandler}
        >
          <BackIcon />
        </div>
      )}
      <h2 className="text-[26px] leading-10 font-bold mr-auto truncate whitespace-nowrap overflow-hidden">
        {text !== null ? (
          text
        ) : (
          <LogoIcon className="w-[108px] relative z-[4]" />
        )}
      </h2>
      {buttons.length > 0 && (
        <div className="flex bg-white rounded-[12px]">
          {buttons.map((btn, index) => (
            <div
              key={btn.id || index}
              className={`relative h-10 flex items-center justify-center cursor-pointer bg-[#FFFFFFBF] hover:bg-white transition-all duration-200 ease-in-out rounded-[12px] select-none ${index > 0 ? "before:content-[''] before:absolute before:left-0 before:top-1 before:bottom-1 before:w-px before:bg-[#f0f0f0]" : ""} ${!btn.icon ? "w-[60px]" : "w-10"} ${buttonBlurred ? "z-[-1]" : ""}`}
              onClick={btn.action}
            >
              {!btn.icon ? (
                <span className="font-bold text-[#BD7760]">Done</span>
              ) : (
                <btn.icon />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
