import NavContacts from "./NavContacts";
import NavIcons from "./NavIcons";
import WelcomeMessage from "./WelcomeMessage";

const TopNavbar = () => {
  return (
    <div className="flex justify-between items-center px-10 py-1">
      <div>
        <WelcomeMessage />
      </div>
      <section className="flex ">
        <NavContacts />
        <NavIcons />
      </section>
    </div>
  );
};

export default TopNavbar;
