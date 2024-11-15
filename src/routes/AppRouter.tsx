import { useState, useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ROUTE_LINK from "./RouterLink.ts";
import List from "../pages/List/List.tsx";
import LoginPage from "../pages/LoginPage/LoginPage.tsx";
import SignupPage from "../pages/SignupPage/SignupPage.tsx";
import Detail from "../pages/Detail/Detail.tsx";
import AddOrEditProduct from "../pages/AddOrEditProduct/AddOrEditProduct.tsx";
import CartPage from "../pages/CartPage/CartPage.tsx";
import PaymentPage from "../pages/PaymentPage/PaymentPage.tsx";
import { fetchAddressInfo, fetchOrderItems } from "../utils/mockData.ts";

function AppRouter() {
  const [addressInfo, setAddressInfo] = useState(null);
  const [orderItems, setOrderItems] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const address = await fetchAddressInfo();
      const items = await fetchOrderItems();
      setAddressInfo(address);
      setOrderItems(items);
    };

    loadData();
  }, []);

  const router = createBrowserRouter([
    {
      path: ROUTE_LINK.LIST.path,
      element: <List />,
      children: [
        {
          // path: '/',
          // element: <List />,
        },
      ],
    },
    {
      path: ROUTE_LINK.LOGIN.path,
      element: <LoginPage />,
    },
    {
      path: ROUTE_LINK.SIGNUP.path,
      element: <SignupPage />,
    },
    {
      path: ROUTE_LINK.DETAIL.path,
      element: <Detail />,
    },
    {
      path: ROUTE_LINK.ADD_PRODUCT.path,
      element: <AddOrEditProduct />,
    },
    {
      path: ROUTE_LINK.CART.path,
      element: <CartPage />,
    },
    {
      path: ROUTE_LINK.PAYMENT.path,
      element:
        addressInfo && orderItems ? (
          <PaymentPage addressInfo={addressInfo} orderItems={orderItems} />
        ) : (
          <div>Loading...</div>
        ),
    },
  ]);

  return <RouterProvider router={router} />;
}

export default AppRouter;
