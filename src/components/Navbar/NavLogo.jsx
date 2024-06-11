import { Link } from "react-router-dom";

const NavLogo = () => {
  return (
    <div className="michroma-regular">
      <Link to="/">
        <h1 className="text-xl   font-extrabold uppercase">Logo</h1>
      </Link>
    </div>
  );
};

export default NavLogo;
