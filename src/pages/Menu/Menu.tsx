import { Outlet, useLocation } from "react-router-dom";
import { Menu as AntdMenu, MenuProps } from "antd";
import { router } from "../.."; // 确保router被正确引入
import "./menu.css";
import { MenuClickEventHandler } from "rc-menu/lib/interface";

const pathToKeyMapping = {
  "/meeting_room_manage": "1",
  "/booking_manage": "2",
  "/user_manage": "3",
  "/statistics": "4",
};

const handleMenuItemClick: MenuClickEventHandler = (info) => {
  const path = Object.keys(pathToKeyMapping).find(
    (key) => pathToKeyMapping[key as keyof typeof pathToKeyMapping] === info.key
  );
  if (path) {
    router.navigate(path);
  }
};

export function Menu() {
  const location = useLocation();
  function getSelectedKeys() {
    if (location.pathname in pathToKeyMapping) {
      return [
        pathToKeyMapping[location.pathname as keyof typeof pathToKeyMapping],
      ];
    } else {
      return ["1"]; // You can choose to return other default values or an empty array
    }
  }

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: "会议室管理",
    },
    {
      key: "2",
      label: "预定管理",
    },
    {
      key: "3",
      label: "用户管理",
    },
    {
      key: "4",
      label: "统计",
    },
  ];

  return (
    <div id="menu-container">
      <div className="menu-area">
        <AntdMenu
          defaultSelectedKeys={getSelectedKeys()}
          items={items}
          onClick={handleMenuItemClick}
        />
      </div>
      <div className="content-area">
        <Outlet />
      </div>
    </div>
  );
}
