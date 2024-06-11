import { Outlet } from "react-router-dom";
import Navbar from "../pages/Navbar";
import ScrollToTop from "../utils/ScrollToTop";

const Main = () => {
  return (
    <div>
      <ScrollToTop />
      <Navbar />
      <Outlet />
    </div>
  );
};

export default Main;
