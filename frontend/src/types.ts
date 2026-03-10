import { HeaderButton } from "./components/header";

export enum Screen {
  START = "start",
  LIST = "list",
  SUBLIST = "sublist",
}

export enum ButtonType {
  PRIMARY = "primary",
  SECONDARY = "secondary",
  TERTIARY = "tertiary",
}

export interface HeaderConfig {
  text: string | null;
  hasBackBtn: boolean;
  buttons?: HeaderButton[];
}
