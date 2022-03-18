import { NavLink } from "react-router-dom";

const HeaderLink = ({ label, href, hidden = false, large }) => {
  return (
    <NavLink to={href} className="text-black/60 hover:text-black ">
      <div
        className={`${
          hidden && "hidden md:inline-flex"
        } flex items-center cursor-pointer `}
      >
        <h4 className={`text-lg tracking-wide title ${large && "text-4xl"}`}>
          {label}
        </h4>
      </div>
    </NavLink>
  );
};

export default HeaderLink;
