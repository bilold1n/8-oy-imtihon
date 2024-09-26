import { message } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  const { users } = useSelector((state: any) => state.user);
  const [length, setLength] = useState(localStorage.getItem("lengt"));
  const [isOpen, setIsOpen] = useState(false); // State to toggle burger menu

  const handleTheme = (value: any) => {
    console.log(value.value);

    localStorage.setItem("theme", value.value);
    document.getElementById("root")!.setAttribute("data-theme", value.value);
  };

  const onOut = () => {
    message.success("Logged out successfully");
  };

  useEffect(() => {
    setLength(localStorage.getItem("lengt"));
  }, [length]);

  return (
    <div className="w-full shadow-md shadow-base-300">
      <nav className="flex container mx-auto items-center justify-between py-2">
        <NavLink to={"/"}>
          <h1 className="text-[18px] font-medium">Kitchen app</h1>
        </NavLink>

        {/* Links outside of burger (Create Recipe, Statistics) */}

        {/* Burger icon for mobile */}
        <div className="md:hidden flex items-center">
          <button
            className="btn btn-ghost btn-circle"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              // X icon when the menu is open
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            ) : (
              // Burger icon when the menu is closed
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            )}
          </button>
        </div>

        {/* Full menu for larger screens */}
        <div className="hidden md:flex gap-[20px] items-center">
          <div className="flex-none">
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle"
              >
                <div className="indicator">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <span className="badge badge-sm indicator-item">
                    {length}
                  </span>
                </div>
              </div>
              <div
                tabIndex={0}
                className="card card-compact dropdown-content bg-base-100 z-[1] mt-3 w-52 shadow"
              >
                <div className="card-body">
                  <span className="text-lg font-bold">{length} Items</span>
                  <span className="text-info">Subtotal: $999</span>
                  <div className="card-actions">
                    <Link to={"/cart"} className="btn btn-primary btn-block">
                      View cart
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Theme Dropdown */}
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn m-1">
              Theme
              <svg
                width="12px"
                height="12px"
                className="h-2 w-2 fill-current opacity-60 inline-block"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 2048 2048"
              >
                <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
              </svg>
            </div>
            <ul
              onClick={(e) => handleTheme(e.target)}
              tabIndex={0}
              className="dropdown-content z-[1] p-2 shadow-2xl bg-base-300 rounded-box w-52"
            >
              <li>
                <input
                  type="radio"
                  name="theme-dropdown"
                  className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                  aria-label="Default"
                  value="light"
                />
              </li>
              <li>
                <input
                  type="radio"
                  name="theme-dropdown"
                  className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                  aria-label="Retro"
                  value="retro"
                />
              </li>
              <li>
                <input
                  type="radio"
                  name="theme-dropdown"
                  className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                  aria-label="Synthwave"
                  value="synthwave"
                />
              </li>
              <li>
                <input
                  type="radio"
                  name="theme-dropdown"
                  className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                  aria-label="Valentine"
                  value="valentine"
                />
              </li>
            </ul>
          </div>

          {/* User Avatar */}
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img alt="User avatar" src={users?.photoURL} />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <NavLink to={"/"} className="justify-between">
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to={"/createrecipe"} className="">
                  Create Recipe
                </NavLink>
              </li>
              <li>
                <NavLink to={"/statistika"} className="">
                  Statistics
                </NavLink>
              </li>
              <li>
                <NavLink to={"/cart"} className="">
                  View cart
                </NavLink>
              </li>
              <li>
                <NavLink onClick={onOut} to={"/login"}>
                  Logout
                </NavLink>
              </li>
            </ul>
          </div>
        </div>

        {/* Burger menu for mobile */}
        {isOpen && (
          <div
            style={{ backdropFilter: "blur(5px)" }}
            className="md:hidden absolute top-14 mr-[50px] w-full  z-50"
          >
            <div className="flex items-center flex-col gap-4 p-4">
              <div className="dropdown">
                <div tabIndex={0} role="button" className="btn w-[200px] ml-7">
                  Theme
                  <svg
                    width="12px"
                    height="12px"
                    className="h-2 w-2 fill-current opacity-60 inline-block"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 2048 2048"
                  >
                    <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
                  </svg>
                </div>
                <ul
                  onClick={(e) => handleTheme(e.target)}
                  tabIndex={0}
                  className="dropdown-content z-[1] p-2 shadow-2xl bg-base-300 rounded-box w-52"
                >
                  <li>
                    <input
                      type="radio"
                      name="theme-dropdown"
                      className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                      aria-label="Default"
                      value="light"
                    />
                  </li>
                  <li>
                    <input
                      type="radio"
                      name="theme-dropdown"
                      className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                      aria-label="Retro"
                      value="retro"
                    />
                  </li>
                  <li>
                    <input
                      type="radio"
                      name="theme-dropdown"
                      className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                      aria-label="Synthwave"
                      value="synthwave"
                    />
                  </li>
                  <li>
                    <input
                      type="radio"
                      name="theme-dropdown"
                      className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                      aria-label="Valentine"
                      value="valentine"
                    />
                  </li>
                </ul>
              </div>

              <NavLink to={"/"} className="btn btn-outline w-[250px]">
                Home
              </NavLink>

              <NavLink
                to={"/createrecipe"}
                className="btn btn-outline w-[250px]"
              >
                Create Recipe
              </NavLink>

              <NavLink to={"/statistika"} className="btn btn-outline w-[250px]">
                Statistics
              </NavLink>

              <NavLink to={"/cart"} className="btn btn-outline w-[250px]">
                View cart
              </NavLink>

              <NavLink
                className="btn btn-outline w-[250px]"
                onClick={onOut}
                to={"/login"}
              >
                Logout
              </NavLink>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}
