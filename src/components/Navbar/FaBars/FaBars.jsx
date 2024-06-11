import "./FaBars.css";
import { useMobileNav } from "../../../contexts/MobileNavContext";

const FaBars = () => {
  const { isActive, handleClick } = useMobileNav();

  return (
    <div
      className={`mobile-nav-toggle ${isActive ? "active" : ""} h-full w-full`}
      onClick={handleClick}
    >
      <span className=""></span>
    </div>
  );
};

export default FaBars;
