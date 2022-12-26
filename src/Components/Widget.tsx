import React from "react";
import { DivProps } from "./Interface";

//#region Center
interface CenterProps extends DivProps {
  isRoot?: boolean;

  horizontal?: boolean;
  vertical?: boolean;
}

export const Center: React.FC<CenterProps> = (props: CenterProps) => {
  const style: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: props.isRoot ? "100vh" : "100%",
  };

  props.horizontal != undefined
    ? (style.justifyContent = !props.horizontal ? "start" : "end")
    : void 0;

  props.vertical != undefined
    ? (style.alignItems = !props.vertical ? "start" : "end")
    : void 0;

  return (
    <div style={{ ...style, ...props.style }} onClick={props.onClick}>
      {props.children}
    </div>
  );
};

Center.defaultProps = { isRoot: false };
//#endregion

//#region FloatLabel
interface FloatLabelProps extends DivProps {
  label: String;
  value: String;

  floatTop: string | number;
  floatLeft: string | number;

  centerTop: string | number;
  centerLeft: string | number;
}

export const FloatLabel: React.FC<FloatLabelProps> = (
  props: FloatLabelProps
) => {
  const [focus, setFocus] = React.useState(false);
  const { children, label, value, style } = props;

  const floatStyle: React.CSSProperties = {
    position: "relative",
  };

  const labelStyle: React.CSSProperties = {
    fontWeight: "normal",
    position: "absolute",
    pointerEvents: "none",
    top: props.centerTop || "0.5rem",
    left: props.centerLeft || "1rem",
    transition: "0.2s ease all",
  };

  const labelFloatStyle: React.CSSProperties = {
    top: props.floatTop || "-0.8rem",
    fontWeight: "bold",
  };

  const labelClass =
    focus || (value && value.length != 0)
      ? { ...labelStyle, ...labelFloatStyle }
      : labelStyle;

  return (
    <div
      style={{ ...floatStyle, ...style }}
      onBlur={() => setFocus(false)}
      onFocus={() => setFocus(true)}
    >
      {children}
      <label style={labelClass}>{label}</label>
    </div>
  );
};
//#endregion
