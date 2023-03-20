import React, { useEffect } from "react";
import s from "./index.module.less";
import { useNavigate } from "react-router-dom";
import {
  Tabs,
  Form,
  Input,
  Checkbox,
  DatePicker,
  Select,
  InputNumber,
  Button,
  Radio,
} from "antd";
import { EDU_STU_LIST } from "@/constant/urls";
import { inject, observer, MobXProviderContext } from "mobx-react";

const EvalMent = () => {
  const { store } = React.useContext(MobXProviderContext);
  const [form] = Form.useForm();
  const [grade, setGrade] = React.useState("不合格");
  const [slist, setList] = React.useState([]);
  const [gradearr, setGradearr] = React.useState(() => {
    let arr = [];
    EDU_STU_LIST.forEach((item) => {
      arr.push(Array(item.length).fill(0));
    });
    return arr;
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!window.token) {
      navigate("/login");
    } else {
      let params = { uid: store.user.uid };
      store.studListForMent(params).then((r) => {
        if (r.length > 0) {
          console.log("slist", r);
          setList(r);
        }
      });
    }
  }, []);

  const getsum = (val, index0, index) => {
    setGradearr((gradearr) => {
      let newgradearr = [...gradearr];
      newgradearr[index0][index] = val;
      setGrade(() => {
        let newgrade = eval(gradearr.toString().split(",").join("+"));
        return newgrade > 30 ? "优秀" : newgrade > 10 ? "合格" : "不合格";
      });
      return newgradearr;
    });
  };

  const checkhalf = (value) => {
    if (value) {
      return Math.floor(value * 2) / 2;
    }
    return value;
  };

  const initialvaluesform = async () => {
    let obj = {};
    EDU_STU_LIST.map((item0, index0) => {
      item0.map((item, index) => {
        if (item.name !== "担任本科学生综合导师") obj[`${index0}_${index}`] = 0;
        else {
          obj[`${index0}_${index}`] = slist.length;
          setGradearr((gradearr) => {
            let newgradearr = [...gradearr];
            newgradearr[index0][index] =
              slist.length * EDU_STU_LIST[index0][index].input.v;
            return newgradearr;
          });
        }
      });
    });
    console.log("obj", obj);
    return obj;
  };

  useEffect(() => {
    initialvaluesform().then((res) => {
      form.setFieldsValue(res);
    });
  }, [slist]);

  const items = [
    `思想育人`,
    `科研育人`,
    `创新创业育人`,
    `实践育人`,
    `其他课外育人`,
  ];
  return (
    <div className={s.main}>
      <span className="g-tl">导师测评</span>
      <Form
        form={form}
        {...{
          labelCol: { span: 16 },
          wrapperCol: { span: 8 },
        }}
        labelCol={{
          style: {
            width: "66%",
            whiteSpace: "normal",
            marginRight: "50px",
          },
        }}
        labelAlign="left"
      >
        <div className={s.mform}>
          <div className={s.tit}>
            {`信息科学与技术学院课外育人考核表`}
            {<div className={s.sp}>{`评价：${grade}`}</div>}
          </div>
        </div>

        {EDU_STU_LIST?.map((item0, index0) => {
          return (
            <div className={s.mform}>
              <div className={s.tit2}>{`${items[index0]}`}</div>

              <div>
                {item0?.map((item, index) => {
                  return (
                    <>
                      <Form.Item
                        extra={item.input?.i ? `请输入${item.input.i}` : null}
                        label={
                          <>
                            <span
                              style={{
                                marginRight: "25px",
                                color: "var(--clr-main)",
                                width: "50px",
                              }}
                            >
                              {gradearr[index0][index]}
                              <span
                                style={{
                                  marginLeft: "5px",
                                }}
                              >
                                分
                              </span>
                            </span>
                            {item.name}
                          </>
                        }
                        rules={[{ required: true, message: "必填" }]}
                        key={item.index}
                        name={`${index0}_${index}`}
                      >
                        {item.list.length > 0 ? (
                          <Radio.Group
                            onChange={(e) => {
                              getsum(e.target.value, index0, index);
                            }}
                          >
                            {item.list.map((i, index) => {
                              return (
                                <Radio.Button value={i.v} key={index}>
                                  {i.m}
                                </Radio.Button>
                              );
                            })}
                          </Radio.Group>
                        ) : (
                          item.input && (
                            <InputNumber
                              min={0}
                              max={item.input.m ?? undefined}
                              formatter={checkhalf}
                              style={{ width: "100%" }}
                              placeholder={`请输入${item.input.i}`}
                              key={index}
                              onChange={(e) => {
                                getsum(e * item.input.v, index0, index);
                              }}
                            />
                          )
                        )}
                      </Form.Item>
                    </>
                  );
                })}
              </div>
            </div>
          );
        })}
        <div className={s.mform}>
          <div className={s.mft}>
            <Button
              type="primary"
              onClick={() => {
                console.log(form.getFieldsValue());
                console.log(grade, gradearr);
              }}
            >
              保存
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default observer(EvalMent);
