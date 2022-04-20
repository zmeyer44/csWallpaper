import { useState } from "react";
import HeaderLink from "./HeaderLink";
const logo = require("../assets/headerlogo.png");

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  return (
    <header className="fixed top-0 bg-white w-full flex justify-between sm:justify-around items-center py-4 shadow-lg z-50">
      <div className="relative w-36 h-10 z-20 ml-2">
        <a
          href="https://cryptoskulls.vercel.app"
          target="_blank"
          rel="noreferrer"
        >
          <img
            src={logo}
            objectFit="contain"
            alt="cryptoskulls"
            className="h-[45px]"
          />
        </a>
      </div>

      <div className="flex items-center">
        <div className="hidden lg:flex space-x-8 pr-4">
          <HeaderLink label="Wallpaper" href="/" />
          <HeaderLink label="Banner" href="/banner" />
          <HeaderLink label="Combine" href="/combine" />
          <HeaderLink label="oG x Demonic" href="/ogxdemonic" />
          <HeaderLink label="Demonic Combine" href="/demonic-combine" />
        </div>
        <button
          className={`menu ${menuOpen} z-20 lg:hidden`}
          onClick={toggleMenu}
        >
          <div className="">
            <span className="top"></span>
            <span className="bottom"></span>
          </div>
        </button>
      </div>
      <nav
        className={`bg-white flex-col flex mt-[72px] pb-[216px] h-screen w-screen fixed top-0 center space-y-7 sm:hidden transition-all translate-x-full ${
          menuOpen && "translate-x-0"
        }`}
      >
        <HeaderLink label="Wallpaper" href="/" large onClick={toggleMenu} />
        <HeaderLink label="Banner" href="/banner" large onClick={toggleMenu} />
        <HeaderLink
          label="Combine"
          href="/combine"
          large
          onClick={toggleMenu}
        />
        <HeaderLink
          label="oG x Demonic"
          href="/ogxdemonic"
          large
          onClick={toggleMenu}
        />
        <HeaderLink
          label="Demonic Combine"
          href="/demonic-combine"
          large
          onClick={toggleMenu}
        />
      </nav>
    </header>
  );
};

export default Header;
