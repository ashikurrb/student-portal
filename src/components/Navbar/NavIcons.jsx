import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";

const socialIcons = [
  {
    Icon: FaFacebookF,
    text: "Facebook",
    bgColor: "bg-blue-600",
    textColor: "text-blue-600",
    hoverBgColor: "hover:bg-blue-600",
  },
  {
    Icon: FaTwitter,
    text: "Twitter",
    bgColor: "bg-blue-400",
    textColor: "text-blue-400",
    hoverBgColor: "hover:bg-blue-400",
  },
  {
    Icon: FaLinkedinIn,
    text: "LinkedIn",
    bgColor: "bg-blue-700",
    textColor: "text-blue-700",
    hoverBgColor: "hover:bg-blue-700",
  },
  {
    Icon: FaInstagram,
    text: "Instagram",
    bgColor: "bg-pink-500",
    textColor: "text-pink-500",
    hoverBgColor: "hover:bg-pink-500",
  },
];

const NavIcons = () => {
  return (
    <div className="flex justify-between">
      {socialIcons.map((socialIcon, index) => (
        <div
          key={index}
          className={`flex p-[6px] rounded-full border justify-center items-center transition-colors duration-300 ${
            index !== socialIcons.length - 1 ? "mr-5" : ""
          } ${socialIcon.textColor} ${
            socialIcon.hoverBgColor
          } hover:text-white`}
        >
          <socialIcon.Icon className="cursor-pointer text-[12px]" />
          <p className="hidden">{socialIcon.text}</p>
        </div>
      ))}
    </div>
  );
};

export default NavIcons;
