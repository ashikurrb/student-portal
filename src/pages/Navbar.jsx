import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import NavLogo from "../components/Navbar/NavLogo";
import NavLinks from "../components/Navbar/NavLinks";
import FaBars from "../components/Navbar/FaBars/FaBars";
import { useMobileNav } from "../contexts/MobileNavContext";
import TopNavbar from "../components/Navbar/TopNavbar";
import NavButton from "../components/Navbar/NavButton";
import ThemeSwitcher from "../utils/ThemeSwitcher";

const Navbar = () => {
  const location = useLocation(); // Use the useLocation hook
  const { isActive, handleClick } = useMobileNav();
  const [scrolling, setScrolling] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [scrollThreshold, setScrollThreshold] = useState(100);
  const [isScrolled, setIsScrolled] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const scrolledDistance = Math.abs(currentScrollPos - prevScrollPos);

      if (scrolledDistance > scrollThreshold) {
        setScrolling(currentScrollPos > prevScrollPos);
        setPrevScrollPos(currentScrollPos);
      }

      setIsScrolled(currentScrollPos > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevScrollPos, scrollThreshold]);

  return (
    <nav
      className={`w-full fixed  montserrat-regular z-50 top-0 transition-all duration-400 ease-in-out`}
      ref={navRef}
    >
      {/* Top Navigation section, hidden when scrolled for large screen */}
      <header
        className={`text-black relative hidden lg:block  ${
          scrolling ? "lg:hidden" : ""
        }`}
      >
        <TopNavbar />
      </header>

      {/* Navigation links, buttons and slider navbar */}
      <main
        className={` w-full px-10 py-2 lg:py-auto lg:w-auto h-[6vh] lg:h-auto flex justify-between items-center`}
      >
        {/* For small screen logo and bar icon visible */}
        <section className="flex justify-between items-center w-full lg:w-auto">
          <div className="w-40">
            <NavLogo />
          </div>
          <div className="flex justify-between w-32 h-full items-center lg:hidden">
            <FaBars />
            <ThemeSwitcher />
          </div>
        </section>

        {/* For small screen hidden sidebar  */}
        <section
          className={`h-[94vh]  left-0 lg:h-auto lg:-translate-x-0 w-full absolute lg:relative top-[6vh] lg:top-0 z-20 transition-all duration-500 ease-in-out ${
            isActive ? "-translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="w-full flex">
            <section className="h-full w-full flex flex-col lg:flex-row justify-end items-center montserrat-bold">
              <div className="mb-10 lg:mb-0 w-full lg:w-auto">
                <NavLinks />
              </div>
              <div className="flex justify-start w-full px-10 lg:block lg:w-auto lg:justify-normal lg:px-0">
                <NavButton />
              </div>
              <div className="w-20  hidden lg:flex justify-center items-center">
                <ThemeSwitcher />
              </div>
            </section>
          </div>
        </section>
      </main>
    </nav>
  );
};

export default Navbar;
