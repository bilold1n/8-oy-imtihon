import { Outlet } from "react-router-dom";

import Navbar from "../companents/navbar";
import Footer from "../companents/footer";

export default function Layout() {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        <Footer />
      </footer>
    </>
  );
}
