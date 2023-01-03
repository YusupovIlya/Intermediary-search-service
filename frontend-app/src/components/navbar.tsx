import React from "react";
import { CgMonday } from "react-icons/cg";
import classNames from "classnames";
import { Link } from "react-router-dom";
import { INav } from "../store/navigation";


export interface NavbarProps {
  navigationData: INav[]
  currentRoute: string
  setCurrentRoute: (option: any) => void
}


export function Navbar({ navigationData, currentRoute, setCurrentRoute }: NavbarProps) {
  return (
    <nav className="flex flex-row items-center justify-between px-8 h-20 rounded-b-3xl bg-white">
      <span className="text-5xl text-gray-800 -mb-1">
        <CgMonday />
      </span>
      <ul className="flex flex-row self-end h-12">
        {navigationData.map((item, index) => (
          <li
            className={classNames([
              "w-24 text-gray-400 hover:text-gray-700 cursor-pointer font-medium tracking-wide text-sm flex items-start justify-center",
              currentRoute === item.text && "text-gray-700 border-b-4 border-gray-700 bg-gradient-to-b from-white to-gray-100",
            ])}
            key={index}
            onClick={() => setCurrentRoute(item.text)}
          >
            <Link to={item.route}>
              {item.text}
            </Link>
          </li>           
        ))}
      </ul>
      <button className="bg-white hover:bg-gray-50 border-2 border-gray-900 text-sm text-gray-900 py-3 px-5 rounded-lg font-medium tracking-wide leading-none">Logout</button>
    </nav>
  )
}