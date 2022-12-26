import {
  MinusCircleOutlined,
  PlusOutlined,
  SnippetsOutlined,
} from "@ant-design/icons";
import { invoke } from "@tauri-apps/api";
import { Alert, Button, Form, Input, InputRef, Upload } from "antd";
import { Fragment, useEffect, useRef, useState } from "react";
import { lazily } from "react-lazily";
import { z } from "zod";

const { Column, Padding, Row } = lazily(() => import("@component/Layout"));
const { Center } = lazily(() => import("@component/Widget"));

const { Item, List } = Form;
const { Dragger } = Upload;

function HomeDownload() {
  const [form] = Form.useForm();
  const [formError, setFormError] = useState({
    dir: "",
  });

  const [state, setState] = useState<boolean>(false);
  const [fileText, setFileText] = useState<string | Blob>("");

  const folderRef: React.RefObject<HTMLInputElement> =
    useRef<HTMLInputElement>(null);
  const inputSrcRef: React.RefObject<InputRef> = useRef<InputRef>(null);
  const inputDirRef: React.RefObject<InputRef> = useRef<InputRef>(null);

  const schema = z.object({
    dir: z
      .string()
      .min(1)
      .regex(/^[a-zA-Z]:\\(((?![<>:"/\\|?*]).)+((?<![ .])\\)?)*/g),
  });

  useEffect(() => {
    // console.log(folderRef.current?.dir);
    // if (folderRef.current !== null) {
    //   folderRef.current.setAttribute("directory", "");
    //   folderRef.current.setAttribute("webkitdirectory", "");
    // }
  }, [folderRef]);

  useEffect(() => {
    type onloadFile = ProgressEvent<FileReader>;
    const reader: FileReader = new FileReader();
    reader.onload = async ({ target }: onloadFile): Promise<void> => {
      type textsFile = string | ArrayBuffer | null | undefined;
      const texts: textsFile = target?.result;

      type splitFile = string[] | undefined;
      const split: splitFile = texts?.toString().split("\n");

      form.resetFields();
      if (split !== undefined) {
        const last: string | undefined = split.pop();
        if (last !== "") split.push(last as string);

        const url: LinksProps = { links: [] };
        for (const line of split) {
          url.links.push({ link: line });
        }
        form.setFieldsValue({ links: url.links });
      }
    };
    if (fileText instanceof Blob) reader.readAsText(fileText);
    else reader.readAsText(new Blob([fileText], { type: "text/plain" }));
  }, [fileText]);

  interface LinkProps {
    link: string;
  }

  interface LinksProps {
    links: Array<LinkProps>;
  }

  async function onFinish({ links }: LinksProps): Promise<void> {
    setState(() => false);

    const inputSrc: InputRef | null = inputSrcRef.current;
    const inputDir: InputRef | null = inputDirRef.current;

    const zodData = {
      src: inputSrc?.input?.value,
      dir: inputDir?.input?.value,
    };

    const results = schema.safeParse(zodData);
    if (!results.success) {
      const errors = results.error.format();
      setFormError((prev) => ({
        ...prev,
        dir: errors.dir?._errors.join(", ") || "",
      }));
    } else {
      setFormError((prev) => ({
        ...prev,
        dir: "",
      }));

      const src = zodData.src;
      const origin = zodData.dir?.replace(/\\/g, "/");

      for (const { link } of links) {
        await invoke("download", { src, base: link, origin })
          .then(() => console.log(`Done: ${link}`))
          .catch(() => console.log(`Fail: ${link}`));
      }
      setState(() => true);
    }
  }

  async function onClipBoard(index: number): Promise<void> {
    const text: string = await navigator.clipboard.readText();
    const { links }: LinksProps = form.getFieldsValue();
    links[index].link = text;
    form.setFieldsValue({ links });
  }

  return (
    <>
      <Padding all={2}>
        <input ref={folderRef} type="file" />
        <Center style={{ marginBottom: "1rem" }}>
          <Column space="1rem" style={{ width: "30rem" }}>
            <Dragger
              name="file"
              accept=".txt"
              customRequest={({ file, onSuccess }) => {
                setFileText(() => file);
                setTimeout(() => {
                  onSuccess?.("ok");
                }, 0);
              }}
              onRemove={() => {
                form.resetFields();
                setFileText(() => "");
                setState(() => false);
              }}
            >
              <div>File text</div>
            </Dragger>
            <Input ref={inputSrcRef} placeholder="Tham trang chủ (nếu cần)" />
            <Input ref={inputDirRef} placeholder="Đường dẫn để truyện" />
            {formError.dir && (
              <Alert
                style={{ marginBottom: "1rem" }}
                message={formError.dir}
                type="error"
              />
            )}
          </Column>
        </Center>
        <Center>
          <Form
            form={form}
            name="manga"
            style={{ width: "30rem" }}
            autoComplete="off"
            onFinish={onFinish}
          >
            <List name="links">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name }) => (
                    <Fragment key={key}>
                      <Row
                        style={{ gap: "1rem", marginBottom: "1rem" }}
                        mainAxisAlign="space-between"
                      >
                        <Item
                          name={[name, "link"]}
                          style={{ width: "100%", marginBottom: 0 }}
                          rules={[
                            { required: true, message: "Thiếu link truyện" },
                          ]}
                        >
                          <Input placeholder="Link truyện" />
                        </Item>
                        <SnippetsOutlined onClick={() => onClipBoard(name)} />
                        <MinusCircleOutlined onClick={() => remove(name)} />
                      </Row>
                    </Fragment>
                  ))}
                  <Item>
                    <Button onClick={() => add()} block icon={<PlusOutlined />}>
                      Thêm link truyện
                    </Button>
                  </Item>
                </>
              )}
            </List>
            <Row mainAxisAlign="space-between">
              <Button
                onClick={() => {
                  setState(() => false);
                  form.resetFields();
                }}
              >
                Reset
              </Button>
              <Item style={{ marginBottom: "1rem" }}>
                <Button type="primary" htmlType="submit">
                  Tải truyện
                </Button>
              </Item>
            </Row>
            {state && <Alert message="Success Text" type="success" />}
          </Form>
        </Center>
      </Padding>
    </>
  );
}

export default HomeDownload;
