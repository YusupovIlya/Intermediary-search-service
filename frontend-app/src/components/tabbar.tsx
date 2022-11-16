import React, { useCallback } from "react";
import classNames from "classnames";
import { AiFillEdit } from "react-icons/ai";
import { FaSearchDollar } from "react-icons/fa";
import { NavbarProps } from "./navbar";
import { Link } from "react-router-dom";

export function Tabbar({ navigationData, currentRoute, setCurrentRoute }: NavbarProps) {

  const getTabIcon = useCallback((item: string) => {
    switch (item) {
      case "Заказать":
        return <AiFillEdit />;
      case "Выполнить":
        return <FaSearchDollar />;
    }
  }, []);
  return (
    <nav className="flex md:hidden flex-row items-center justify-around px-8 h-20 bg-white visible md:invisible fixed bottom-0 w-full rounded-t-3xl text-2xl">
      {navigationData.map((item, index) => (
        <span
          key={index}
          className={classNames([
            "text-gray-400 hover:text-gray-700 cursor-pointer w-20 h-full flex items-center justify-center",
            currentRoute === item.text && "bg-gradient-to-t from-white to-gray-100 border-t-4 border-gray-700 text-gray-700",
          ])}
          onClick={() => setCurrentRoute(item.text)}
        >
            <span className="-mb-1">
              <Link to={item.route}>
                {getTabIcon(item.text)}
              </Link>
            </span>
        </span>       
      ))}
    </nav>
  )
}