import { FaPhone, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";

const contactDetails = [
  {
    icon: <FaPhone />,
    detail: "+880 11111111",
  },
  {
    icon: <IoMdMail />,
    detail: "@gmail.com",
  },
  {
    icon: <FaMapMarkerAlt />,
    detail: "Bangladesh",
  },
  {
    icon: <FaClock />,
    detail: "Mon - Fri: 9am - 10pm",
  },
];

const NavContacts = () => {
  return (
    <main className="flex flex-col md:flex-row justify-between">
      {contactDetails.map((contact, index) => (
        <div
          key={index}
          className="flex text-[13px] poppins-regular items-center mr-4 mb-3 lg:mb-0"
        >
          <div className="mr-3 flex justify-center items-center ">
            {contact.icon}
          </div>
          <div className="">
            <h2>{contact.detail}</h2>
          </div>
        </div>
      ))}
    </main>
  );
};

export default NavContacts;
