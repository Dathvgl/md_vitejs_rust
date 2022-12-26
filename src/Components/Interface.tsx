import React from "react";

type AllType = string | number | boolean | Object | undefined;
type NumChar = number | string;

interface DivProps extends React.HTMLAttributes<HTMLDivElement> {}

interface AnchorProps
  extends HoverProps,
    React.HTMLAttributes<HTMLAnchorElement> {
  link?: string;
  onClick?: React.MouseEventHandler;
}

interface ButtonProps
  extends HoverProps,
    React.HtmlHTMLAttributes<HTMLButtonElement> {
  type: "button" | "submit" | "reset" | undefined;
}

interface HoverProps {
  hoverText?: string;
  hoverBack?: string;
}

interface TextProps {
  textSize?: number;
  textColor?: string;
  textWeight?: string;
  textDecoration?: string;
}

interface BackProps {
  backgroundColor?: string;
}

interface SizeProps {
  width?: NumChar;
  height?: NumChar;
}

interface BorderProps {
  borderWidth?: number;
  borderRadius?: number;
  borderStyle?: string;
  borderColor?: string;
}

export type {
  AllType,
  NumChar,
  DivProps,
  AnchorProps,
  ButtonProps,
  HoverProps,
  TextProps,
  BackProps,
  SizeProps,
  BorderProps,
};
