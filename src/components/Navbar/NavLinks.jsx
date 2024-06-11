import { Link } from "react-router-dom";

import { useMobileNav } from "../../contexts/MobileNavContext";

const navLinks = [
  { title: "Home", path: "/home" },
  { title: "About", path: "/about" },
  {
    title: "Services",
    path: "/services",
    // dropdown: true,
    // submenu: ["Service 1", "Service 2", "Service 3"],
  },
  { title: "Contact", path: "/contact" },
];

const NavLinks = () => {
  const { handleClick } = useMobileNav();

  return (
    <ul className=" flex flex-col  lg:flex-row relative z-50 w-full lg:w-auto">
      {navLinks.map((link, index) => (
        <li
          key={index}
          className="flex-1 px-10 lg:px-5 michroma-regular text-[10px] lg:text-[12px] py-4 border-b-[1px] border-gray-200 lg:border-none "
          onClick={handleClick}
        >
          <Link to={link.path} className="block uppercase">
            {link.title}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default NavLinks;
