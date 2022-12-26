import { Layout, Menu } from "antd";
import { ItemType } from "antd/es/menu/hooks/useItems";
import { lazy, Suspense } from "react";
import { Link, Outlet, Route, Routes } from "react-router-dom";

const HomeDownload = lazy(() => import("@page/Download/Home"));

const { Header, Content, Footer } = Layout;

function App(): JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<SharedLayout />}>
        <Route path="/" element={<HomeDownload />} />
      </Route>
    </Routes>
  );
}

function SharedLayout(): JSX.Element {
  const menuItems: ItemType[] = [
    { key: 1, label: <Link to={"/"}>Tải về</Link> },
    { key: 2, label: "Xem offline" },
    { key: 3, label: "Chỉnh sửa" },
  ];

  return (
    <Layout>
      <Header>
        <Menu
          items={menuItems}
          theme="dark"
          mode="horizontal"
          style={{ color: "white" }}
        />
      </Header>
      <Content>
        <Suspense fallback={<h1>Loading...</h1>}>
          <Outlet />
        </Suspense>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Mangaka @2022 Created by fsfssfssfsfsfs
      </Footer>
    </Layout>
  );
}

export default App;
