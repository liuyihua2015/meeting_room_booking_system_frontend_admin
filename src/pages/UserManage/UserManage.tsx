import { Button, Form, Input, message, Table, Image, Badge } from "antd";
import { useEffect, useMemo, useState } from "react";
import "./UserManage.css";
import { ColumnsType } from "antd/es/table";
import { freeze, userSearch } from "../../interface/interfaces";
import { useForm } from "antd/es/form/Form";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// 添加时区和 UTC 插件
dayjs.extend(utc);
dayjs.extend(timezone);
interface SearchUser {
  username: string;
  nickName: string;
  email: string;
}

export interface UserSearchResult {
  id: number;
  username: string;
  nickName: string;
  email: string;
  headPic: string;
  createTime: Date;
  isFrozen: boolean;
}

export function UserManage() {
  const [pageNo, setPageNo] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [userResult, setUserResult] = useState<UserSearchResult[]>();
  const [total, setTotal] = useState<number>(0);
  const [num, setNum] = useState<number>(0);

  const columns: ColumnsType<UserSearchResult> = useMemo(
    () => [
      {
        title: "序号",
        render: (_, __, index) => (pageNo - 1) * pageSize + index + 1,
      },
      {
        title: "用户名",
        dataIndex: "username",
      },
      {
        title: "头像",
        dataIndex: "headPic",
        render: (value: any) => {
          return value ? (
            <Image width={50} src={`http://localhost:3001/${value}`} />
          ) : (
            ""
          );
        },
      },
      {
        title: "昵称",
        dataIndex: "nickName",
      },
      {
        title: "邮箱",
        dataIndex: "email",
      },
      {
        title: "注册时间",
        dataIndex: "createTime",
        render: (text) =>
          dayjs(text).tz("Asia/Shanghai").format("YYYY-MM-DD HH:mm:ss"),
      },
      {
        title: "状态",
        dataIndex: "isFrozen",
        render: (_, record) =>
          record.isFrozen ? <Badge status="success">已冻结</Badge> : "",
      },
      {
        title: "操作",
        render: (_, record) => (
          <a
            href="#"
            onClick={() => {
              freezeUser(record.id);
            }}
          >
            冻结
          </a>
        ),
      },
    ],
    []
  );

  async function freezeUser(id: number) {
    const res = await freeze(id);
    if (res) {
      const { data } = res.data;
      if (res.status === 201 || res.status === 200) {
        setNum(Math.random());
        message.success("冻结成功");
      } else {
        message.error(data || "系统繁忙，请稍后再试");
      }
    }
  }

  const [form] = useForm();

  useEffect(() => {
    searchUser({
      username: form.getFieldValue("username"),
      email: form.getFieldValue("email"),
      nickName: form.getFieldValue("nickName"),
    });
  }, [pageNo, pageSize, num]);

  const changePage = function (pageNo: number, pageSize: number) {
    setPageNo(pageNo);
    setPageSize(pageSize);
  };
  const searchUser = async (values: SearchUser) => {
    const res = await userSearch(
      values.username,
      values.nickName,
      values.email,
      pageNo,
      pageSize
    );
    if (res) {
      const { data } = res.data;
      if (res.status === 201 || res.status === 200) {
        setTotal(data.totalCount);
        setUserResult(
          data.users.map((item: UserSearchResult) => {
            return {
              key: item.username,
              ...item,
            };
          })
        );
      } else {
        message.error(data || "系统繁忙，请稍后再试");
      }
    }
  };

  return (
    <div id="userManage-container">
      <div className="userManage-form">
        <Form
          form={form}
          onFinish={searchUser}
          name="search"
          layout="inline"
          colon={false}
        >
          <Form.Item label="用户名" name="username">
            <Input />
          </Form.Item>

          <Form.Item label="昵称" name="nickName">
            <Input />
          </Form.Item>

          <Form.Item
            label="邮箱"
            name="email"
            rules={[{ type: "email", message: "请输入合法邮箱地址!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label=" ">
            <Button type="primary" htmlType="submit">
              搜索用户
            </Button>
            <span style={{ marginLeft: 20 }}></span>
            <Button
              type="primary"
              style={{ background: "red" }}
              onClick={() => {
                form.resetFields();
                setNum(Math.random());
              }}
            >
              重置
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="userManage-table">
        <Table
          columns={columns}
          dataSource={userResult}
          pagination={{
            current: pageNo,
            pageSize: pageSize,
            onChange: changePage,
            total: total,
          }}
        />
      </div>
    </div>
  );
}
