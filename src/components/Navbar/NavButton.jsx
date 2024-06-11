import { IoHandLeft } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useMobileNav } from "../../contexts/MobileNavContext";

const NavButton = () => {
  const { handleClick } = useMobileNav();
  return (
    <div className="px-4 py-2 uppercase text-[10px] border lg:text-[12px] rounded-sm">
      <Link
        to="/contact"
        onClick={handleClick}
        className=" michroma-regular   focus:outline-none inline-block text-center"
      >
        demo button
      </Link>
    </div>
  );
};

export default NavButton;
