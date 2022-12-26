import React, { Fragment } from "react";
import { AllType, DivProps, NumChar, SizeProps } from "./Interface";

//#region Row-Column
export class AxisSize {
  static readonly min: boolean = false;
  static readonly max: boolean = true;
}

export class AxisAlign {
  static readonly start: string = "flex-start";
  static readonly end: string = "flex-end";
  static readonly center: string = "center";
  static readonly spaceBetween: string = "space-between";
  static readonly spaceAround: string = "space-around";
  static readonly spaceEvenly: string = "space-evenly";
}

interface AlignProps extends DivProps {
  space?: NumChar;
  mainAxisSize?: "min" | "max";
  mainAxisAlign?:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around"
    | "space-evenly";
  crossAxisAlign?:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around"
    | "space-evenly";
}

interface ColumnProps {
  isRoot?: boolean;
}

export const Row: React.FC<AlignProps> = (props: AlignProps) => {
  const style: React.CSSProperties = {
    display: "flex",
    width: props.mainAxisSize == "min" ? "fit-content" : "100%",
    justifyContent: props.mainAxisAlign,
    alignItems: props.crossAxisAlign,
  };

  let half: string = "0";
  if (props.space != undefined) {
    if (typeof props.space == "string") {
      const num = Number(props.space.replace(/[^\d\.]+/g, "")) / 2;
      const type = props.space.replace(/[\d\.]+/g, "");
      half = `${num}${type}`;
    } else half = `${props.space / 2}rem`;
  }

  const list: any[] = [];
  const childrens: AllType = props.children?.valueOf();
  if (typeof childrens == "object") {
    const array: any[] = [];
    Object.entries(childrens.valueOf()).forEach((item) => {
      array.push(item[1]);
    });
    list.push(...array.filter((item) => item != ""));
  }

  return (
    <div
      style={{ ...style, ...props.style }}
      className={props.className}
      onClick={props.onClick}
    >
      {list.length == 0 || list.length == 1
        ? props.children
        : list.map((item, index, { length }) => (
            <Fragment key={index}>
              {index == 0 ? (
                <div style={{ marginLeft: half }}>{item}</div>
              ) : index == length - 1 ? (
                <div style={{ marginRight: half }}>{item}</div>
              ) : (
                <div style={{ marginLeft: half, marginRight: half }}>
                  {item}
                </div>
              )}
            </Fragment>
          ))}
    </div>
  );
};

Row.defaultProps = {
  space: 0,
  mainAxisSize: "max",
  mainAxisAlign: "center",
  crossAxisAlign: "center",
};

export const Column: React.FC<AlignProps & ColumnProps> = (
  props: AlignProps & ColumnProps
) => {
  const style: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "100%",
    width: "100%",
    height:
      props.mainAxisSize == "min"
        ? "fit-content"
        : !props.isRoot
        ? "100%"
        : "100vh",
    justifyContent: props.mainAxisAlign,
    justifyItems: props.mainAxisAlign,
    alignContent: props.crossAxisAlign,
  };

  let half: string = "0";
  if (props.space != undefined) {
    if (typeof props.space == "string") {
      const num = Number(props.space.replace(/[^\d\.]+/g, "")) / 2;
      const type = props.space.replace(/[\d\.]+/g, "");
      half = `${num}${type}`;
    } else half = `${props.space / 2}rem`;
  }

  const list: any[] = [];
  const childrens: AllType = props.children?.valueOf();
  if (typeof childrens == "object") {
    const array: any[] = [];
    Object.entries(childrens.valueOf()).forEach((item) => {
      array.push(item[1]);
    });
    list.push(...array.filter((item) => item != ""));
  }

  return (
    <div
      style={{ ...style, ...props.style }}
      className={props.className}
      onClick={props.onClick}
    >
      {list.length == 0 ? (
        <div>{props.children}</div>
      ) : (
        list.map((item, index, { length }) => (
          <Fragment key={index}>
            {index == 0 ? (
              <div style={{ width: "100%", marginBottom: half }}>{item}</div>
            ) : index == length - 1 ? (
              <div style={{ width: "100%", marginTop: half }}>{item}</div>
            ) : (
              <div
                style={{ width: "100%", marginTop: half, marginBottom: half }}
              >
                {item}
              </div>
            )}
          </Fragment>
        ))
      )}
    </div>
  );
};

Column.defaultProps = {
  isRoot: false,
  space: 0,
  mainAxisSize: "max",
  mainAxisAlign: "center",
  crossAxisAlign: "center",
};
//#endregion

//#region SizedBox
interface SizedBoxProps extends DivProps, SizeProps {}

export const SizedBox: React.FC<SizedBoxProps> = (props: SizedBoxProps) => {
  const style: React.CSSProperties = {
    width: isNaN(Number(props.width)) ? props.width : `${props.width}rem`,
    height: isNaN(Number(props.height)) ? props.height : `${props.height}rem`,
  };

  return (
    <div
      style={{ ...style, ...props.style }}
      className={props.className}
      onClick={props.onClick}
    >
      {props.children}
    </div>
  );
};

SizedBox.defaultProps = { width: 0, height: 0 };
//#endregion

//#region Padding
interface PaddingProps extends DivProps {
  all?: NumChar;

  horizontal?: NumChar;
  vertical?: NumChar;

  left?: NumChar;
  right?: NumChar;
  top?: NumChar;
  bottom?: NumChar;
}

export const Padding: React.FC<PaddingProps> = (props: PaddingProps) => {
  const style: React.CSSProperties = {
    width: "100%",
    height: "100%",
  };

  if (props.left != undefined) {
    style.paddingLeft = isNaN(Number(props.left))
      ? props.left
      : `${props.left}rem`;
  }

  if (props.right != undefined) {
    style.paddingRight = isNaN(Number(props.right))
      ? props.right
      : `${props.right}rem`;
  }

  if (props.top != undefined) {
    style.paddingTop = isNaN(Number(props.top)) ? props.top : `${props.top}rem`;
  }

  if (props.bottom != undefined) {
    style.paddingBottom = isNaN(Number(props.bottom))
      ? props.bottom
      : `${props.bottom}rem`;
  }

  if (props.horizontal != undefined) {
    style.paddingLeft = isNaN(Number(props.horizontal))
      ? props.horizontal
      : `${props.horizontal}rem`;
    style.paddingRight = isNaN(Number(props.horizontal))
      ? props.horizontal
      : `${props.horizontal}rem`;
  }

  if (props.vertical != undefined) {
    style.paddingTop = isNaN(Number(props.vertical))
      ? props.vertical
      : `${props.vertical}rem`;
    style.paddingBottom = isNaN(Number(props.vertical))
      ? props.vertical
      : `${props.vertical}rem`;
  }

  if (props.all != undefined) {
    style.padding = isNaN(Number(props.all)) ? props.all : `${props.all}rem`;
  }

  return (
    <div
      style={{ ...style, ...props.style }}
      className={props.className}
      onClick={props.onClick}
    >
      {props.children}
    </div>
  );
};

Padding.defaultProps = {};
//#endregion
