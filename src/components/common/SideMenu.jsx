import { useState } from "react";
import { FaBusinessTime } from "react-icons/fa";
import { AiFillDashboard } from "react-icons/ai";
import { RxHamburgerMenu } from "react-icons/rx";
import { Disclosure } from "@headlessui/react";
import { IoIosArrowDown } from "react-icons/io";
import { Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import logo from "../../assets/Yogi-Logo.png";

const data = [
  {
    id: 1,
    title: "Dashboard",
    icon: <AiFillDashboard />,
    route: "/dashboard",
    dropItems: false,
  },
  {
    id: 2,
    title: "Products",
    icon: <FaBusinessTime />,
    route: "#",
    dropItems: [
      {
        id: 1,
        title: "Unit",
        icon: <FaBusinessTime />,
        route: "/get-quantity",
        dropItems: false,
      },
      {
        id: 2,
        title: "Categories",
        icon: <FaBusinessTime />,
        route: "/get-categories",
        dropItems: false,
      },
      {
        id: 3,
        title: "Products",
        icon: <FaBusinessTime />,
        route: "/products",
        dropItems: false,
      },
    ],
  },
  {
    id: 3,
    title: "Stock",
    icon: <AiFillDashboard />,
    route: "/stock",
    dropItems: false,
  },
  {
    id: 4,
    title: "Order",
    icon: <FaBusinessTime />,
    route: "#",
    dropItems: [
      {
        id: 1,
        title: "Processing Orders",
        icon: <FaBusinessTime />,
        route: "/processing-orders",
        dropItems: false,
      },
      {
        id: 2,
        title: "Completed Orders",
        icon: <FaBusinessTime />,
        route: "/completed-orders",
        dropItems: false,
      },
      {
        id: 3,
        title: "Returned Orders",
        icon: <FaBusinessTime />,
        route: "/returned-orders",
        dropItems: false,
      },
    ],
  },
];

export default function SideMenu() {
  const location = useLocation();
  const { pathname } = location;
  const [isOpen, setIsOpen] = useState(true);
  const toggle = () => setIsOpen(!isOpen);

  const role = sessionStorage.getItem("role");

  return (
    <div
      style={{ overflowX: "hidden" }}
      className={`bg-[#1c2434] shadow-sm shadow-black lg:block hidden sticky top-0 group h-[100vh] scroll-smooth p-2 transition-all duration-700 ${
        isOpen ? "w-[250px]" : "w-[75px]"
      }`}
    >
      <div
        className="flex items-center space-x-2 py-[13px] px-[8px]"
        style={{ width: isOpen ? "300px" : "100px" }}
      >
        <Link to="/dashboard">
          <div className="flex items-center space-x-2">
            <img
              src={logo}
              alt="logo"
              className="rounded-[100%]  w-[27px] h-[27px] object-fill"
              style={{ display: isOpen ? "block" : "none" }}
            />
            <h5
              className="text-white"
              style={{ display: isOpen ? "block" : "none" }}
            >
              {role === "Kitchen"
                ? "Restaurant Warehouse"
                : `${role} Warehouse`}
            </h5>
          </div>
        </Link>

        <RxHamburgerMenu
          onClick={toggle}
          className="text-2xl text-white cursor-pointer "
        />
      </div>
      <hr className="border-[#4a535b]" />

      <div className="text-[#d1d7e1]  my-[8px] ">
        {data.map((d) =>
          d?.dropItems ? (
            <div key={d.id}>
              <Dropdown
                title={d.title}
                icon={d.icon}
                dropItems={d.dropItems}
                pathname={pathname}
                isOpen={isOpen}
              />
            </div>
          ) : (
            <Link key={d.id} to={d.route}>
              <div
                className={`${
                  pathname === d.route && "bg-[#333a48]"
                }  text-[#d1d7e1] flex items-center space-x-2 py-[8px]  px-[16px] mb-[3.2px]  hover:cursor-pointer hover:bg-[#333a48]`}
              >
                <h5>{d.icon}</h5>
                <h5 className={`${isOpen ? "block" : "hidden"} `}>{d.title}</h5>
              </div>
            </Link>
          )
        )}
      </div>
    </div>
  );
}

const Dropdown = ({ title, icon, dropItems, pathname, isOpen }) => {
  return (
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button className="flex w-full hover:bg-[#333a48]">
            <div className="flex w-full justify-between items-center space-x-2 py-[8px] px-[16px] mb-[3.2px] hover:cursor-pointer">
              <div className="flex items-center space-x-2">
                <h5>{icon}</h5>
                <h5 className={`${isOpen ? "block" : "hidden"}`}>{title}</h5>
              </div>
              <IoIosArrowDown
                className={`${
                  open ? "rotate-180 transform transition-all" : ""
                } ml-4 h-4 w-4 text-[#d1d7e1] hover:text-white `}
              />
            </div>
          </Disclosure.Button>

          <Disclosure.Panel className="space-y-2 ">
            {dropItems?.map((d, id) => {
              return d?.dropItems ? (
                <div key={d.id}>
                  <Dropdown
                    key={d.id}
                    title={d.title}
                    icon={d.icon}
                    dropItems={d.dropItems}
                    pathname={d.pathname}
                    isOpen={isOpen}
                  />
                </div>
              ) : (
                <Link to={d.route} key={d.id}>
                  <div
                    key={id}
                    className={`${
                      pathname === d.route && "bg-[#333a48]"
                    }  text-[#d1d7e1] flex items-center space-x-2 py-[8px] px-[16px] ml-4 mb-[3.2px] hover:text-white hover:cursor-pointer`}
                  >
                    <h5>{d.icon}</h5>
                    <h5 className={`${isOpen ? "block" : "hidden"} `}>
                      {d.title}
                    </h5>
                  </div>
                </Link>
              );
            })}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

Dropdown.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  dropItems: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      icon: PropTypes.node.isRequired,
      route: PropTypes.string.isRequired,
      dropItems: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.object),
        PropTypes.bool,
      ]).isRequired,
    })
  ),
  pathname: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
};
