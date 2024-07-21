import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { FileAddOutlined } from "@ant-design/icons";

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <p className=" bg-base-300 text-base-content p-4 mt-5 text-center">
      Copyright © {new Date().getFullYear()} - All right reserved by{" "}
      <NavLink to={"/"}>Abdumutalov Biloliddin</NavLink>
      {location.pathname !== "/createrecipe" && (
        <div
          onClick={() => {
            navigate("/createrecipe");
          }}
          className="fixed bottom-5 right-5 w-16 h-16 bg-blue-500 text-white flex items-center justify-center rounded-full shadow-lg transition-transform duration-300 hover:scale-105 hover:bg-blue-600 cursor-pointer"
        >
          <FileAddOutlined className="text-3xl" />
        </div>
      )}
    </p>
  );
}
