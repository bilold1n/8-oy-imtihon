import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Layout from "./layout/layout";
import Home from "./pages/home/home";
import CreateRecipe from "./pages/createrecipe";
import Statistika from "./pages/statistika";
import Login from "./pages/loginn";
import Register from "./pages/Register";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import Detalis from "./pages/detalis";
import YouCart from "./pages/cart";

function App() {
  const themee = localStorage.getItem("theme") || "light";

  useEffect(() => {
    document.getElementById("root")!.setAttribute("data-theme", themee);
  }, [themee]);
  document.getElementById("root7")!.setAttribute("data-theme", themee);

  const { users } = useSelector((state: any) => state.user);
  console.log(users);

  const RouterProviderWrapper = ({
    children,
  }: {
    children: React.ReactNode;
  }) => {
    return users ? <>{children}</> : <Navigate to="/login" />;
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <RouterProviderWrapper>
          <Layout />
        </RouterProviderWrapper>
      ),
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/createrecipe",
          element: <CreateRecipe />,
        },
        {
          path: "/cart",
          element: <YouCart />,
        },
        {
          path: "/statistika",
          element: <Statistika />,
        },
        {
          path: "/detalis/:id",
          element: <Detalis />,
        },
      ],
    },
    {
      path: "*",
      element: <div>404</div>,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Register />,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
