import { message } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";

export default function Navbar() {
  const { users } = useSelector((state: any) => state.user);
  const [length, setLength] = useState(localStorage.getItem("lengt"));
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

  // ▶ THEME (senga tashlagan HOZIRGI holatiga qaytarildi)
  const handleTheme = (value: any) => {
    localStorage.setItem("theme", value.value);
    document.getElementById("root")!.setAttribute("data-theme", value.value);
  };
  const cartlength = localStorage.getItem("cartlen");

  // ▶ LOGOUT CONFIRM FUNCTION (desktop + mobile)
  const onOut = () => {
    const ok = window.confirm("Haqiqatan ham chiqmoqchimisiz?");
    if (ok) {
      message.success("Logged out successfully");
      navigate("/login");
    }
  };

  // ▶ Badge length auto update
  useEffect(() => {
    setLength(localStorage.getItem("lengt"));
  }, [length]);

  return (
    <div className="w-full shadow-md shadow-base-300">
      <nav className="flex container mx-auto items-center justify-between py-2">
        <NavLink to={"/"}>
          <h1 className="text-[18px] font-medium">Kitchen app</h1>
        </NavLink>

        {/* MOBILE BURGER BUTTON */}
        <div className="md:hidden flex items-center">
          <button
            className="btn btn-ghost btn-circle"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              // X ICON
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              // BURGER ICON
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex gap-[20px] items-center">
          {/* CART DROPDOWN */}
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
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 
                      2.293c-.63.63-.184 1.707.707 1.707H17m0 
                      0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <span className="badge badge-sm indicator-item">
                    {cartlength}
                  </span>
                </div>
              </div>

              <div
                tabIndex={0}
                className="card card-compact dropdown-content bg-base-100 z-[1] mt-3 w-52 shadow"
              >
                <div className="card-body">
                  <span className="text-lg font-bold">{cartlength} Items</span>

                  <div className="card-actions">
                    <Link to={"/cart"} className="btn btn-primary btn-block">
                      View cart
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* THEME (senga tashlagan eski holati 100% qaytarildi) */}
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
              className="dropdown-content z-[1] p-2 shadow-2xl bg-base-300 rounded-box w-52 "
            >
              <li>
                <input
                  type="radio"
                  name="theme-dropdown"
                  className="theme-controller btn btn-sm btn-block mt-1 mb-1"
                  value="light"
                  aria-label="Default"
                />
              </li>
              <li>
                <input
                  type="radio"
                  name="theme-dropdown"
                  className="theme-controller btn btn-sm btn-block mt-1 mb-1"
                  value="retro"
                  aria-label="Retro"
                />
              </li>
              <li>
                <input
                  type="radio"
                  name="theme-dropdown"
                  className="theme-controller btn btn-sm btn-block mt-1 mb-1"
                  value="synthwave"
                  aria-label="Synthwave"
                />
              </li>
              <li>
                <input
                  type="radio"
                  name="theme-dropdown"
                  className="theme-controller btn btn-sm btn-block mt-1 mb-1"
                  value="valentine"
                  aria-label="Valentine"
                />
              </li>
              <li>
                <input
                  type="radio"
                  name="theme-dropdown"
                  className="theme-controller btn btn-sm btn-block mt-1 mb-1"
                  value="dim"
                  aria-label="Dim"
                />
              </li>
              <li>
                <input
                  type="radio"
                  name="theme-dropdown"
                  className="theme-controller btn btn-sm btn-block mt-1 mb-1"
                  value="lemonade"
                  aria-label="Lemonade"
                />
              </li>
            </ul>
          </div>

          {/* USER AVATAR */}
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
                <NavLink to={"/"}>Home</NavLink>
              </li>
              <li>
                <NavLink to={"/createrecipe"}>Create Recipe</NavLink>
              </li>
              <li>
                <NavLink to={"/statistika"}>Statistics</NavLink>
              </li>
              <li>
                <NavLink to={"/cart"}>View cart</NavLink>
              </li>

              {/* DESKTOP LOGOUT CONFIRM */}
              <li>
                <button
                  onClick={onOut}
                  className="text-left w-full px-3 py-2 hover:bg-base-200"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* MOBILE MENU */}
        {isOpen && (
          <div
            style={{ backdropFilter: "blur(5px)" }}
            className="md:hidden absolute top-14 w-full z-50"
          >
            <div className="flex items-center flex-col gap-4 p-4">
              {/* THEME MOBILE (ESKI HOLATIGA QAYTARILDI) */}
              <div className="dropdown">
                <div tabIndex={0} role="button" className="btn w-[200px] ml-7">
                  Theme
                  <svg
                    width="12px"
                    height="12px"
                    className="h-2 w-2 opacity-60 inline-block"
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
                      value="light"
                      className="theme-controller btn btn-sm btn-block"
                    />
                  </li>
                  <li>
                    <input
                      type="radio"
                      name="theme-dropdown"
                      value="retro"
                      className="theme-controller btn btn-sm btn-block"
                    />
                  </li>
                  <li>
                    <input
                      type="radio"
                      name="theme-dropdown"
                      value="synthwave"
                      className="theme-controller btn btn-sm btn-block"
                    />
                  </li>
                  <li>
                    <input
                      type="radio"
                      name="theme-dropdown"
                      value="valentine"
                      className="theme-controller btn btn-sm btn-block"
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

              {/* MOBILE LOGOUT CONFIRM */}
              <button
                className="btn btn-outline w-[250px]"
                onClick={() => {
                  setIsOpen(false);
                  onOut();
                }}
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}
