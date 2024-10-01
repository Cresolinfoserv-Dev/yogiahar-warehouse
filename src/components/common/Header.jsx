import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiFillDashboard } from "react-icons/ai";
import {
  FaExpandArrowsAlt,
  FaCompressArrowsAlt,
  FaBusinessTime,
} from "react-icons/fa";
import { RxHamburgerMenu } from "react-icons/rx";
import { Disclosure } from "@headlessui/react";
import { IoIosArrowDown } from "react-icons/io";
import { useClickOutside } from "@mantine/hooks";
import { useFullscreen } from "@mantine/hooks";
import PropTypes from "prop-types";
import icon from "../../assets/Yogi-Logo.png";

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
    icon: <FaBusinessTime />,
    route: "#",
    dropItems: [
      {
        id: 1,
        title: "In Stock",
        icon: <FaBusinessTime />,
        route: "/in-stock",
        dropItems: false,
      },
      {
        id: 2,
        title: "Out Stock",
        icon: <FaBusinessTime />,
        route: "/out-stock",
        dropItems: false,
      },
      {
        id: 3,
        title: "Return Stock",
        icon: <FaBusinessTime />,
        route: "/return-stock",
        dropItems: false,
      },
    ],
  },
  {
    id: 4,
    title: "Order",
    icon: <FaBusinessTime />,
    route: "#",
    dropItems: [
      {
        id: 1,
        title: "Processing orders",
        icon: <FaBusinessTime />,
        route: "/processing-orders",
        dropItems: false,
      },
      {
        id: 2,
        title: "Completed orders",
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

export default function Header() {
  const { toggle, fullscreen } = useFullscreen();
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("role");
    navigate(`/`);
  };

  const ref = useClickOutside(() => setIsOpen(false));

  const handleNav = () => {
    setIsOpen(!isOpen);
  };

  const role = sessionStorage.getItem("role");

  return (
    <div>
      <div className="top-0 transition-all duration-700 flex 240Screen:grid grid-cols-1 gap-2 justify-between  text-[#7f7f7f] p-4  h-[57px] bg-white shadow-sm ">
        <div className="flex items-center  340Screen:space-x-6 space-x-4">
          <Link to="/dashboard" className="cursor-pointer">
            <p className="text-xl">Home</p>
          </Link>
          <RxHamburgerMenu onClick={handleNav} className="lg:hidden block" />
        </div>
        <div>
          {role === "Kitchen"
            ? "Yogi Ahar Restaurant Warehouse"
            : `Yogi Ahar ${role} Warehouse`}
        </div>
        <div className="flex items-center 440Screen:space-x-6 space-x-4 ">
          <div>
            <button onClick={toggle}>
              {fullscreen ? (
                <FaCompressArrowsAlt className="text-base" />
              ) : (
                <FaExpandArrowsAlt className="text-base" />
              )}
            </button>
          </div>
          <div>
            <button onClick={handleClick} className="text-base">
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}

      {isOpen && (
        <div
          ref={ref}
          className={
            isOpen
              ? "bg-[#343a40] z-[1000]  top-0 left-0  fixed transition-all duration-700 block lg:hidden w-[300px] h-[100vh]  overflow-y-scroll   scroll-smooth p-2 "
              : "fixed  right-[100%]  "
          }
        >
          <div className="flex items-center  space-x-2 py-[13px] px-[8px]">
            <Link to="/">
              <div className="flex items-center space-x-2">
                <img
                  src={icon}
                  alt="logo"
                  className="rounded-[50%] sm:w-[51px] sm:h-[33px] w-[35px] h-[25px] "
                  style={{ display: isOpen ? "block" : "none" }}
                />
                <h3
                  className="text-[#ced0d1]"
                  style={{ display: isOpen ? "block" : "none" }}
                >
                  Yogi Ware House
                </h3>
              </div>
            </Link>
          </div>
          <hr className="border-[#4a535b]" />

          <div className="text-[#ced0d1] text-lg my-[8px]  ">
            {data.map((d) =>
              d?.dropItems ? (
                <div key={d.title}>
                  <Dropdown
                    title={d.title}
                    icon={d.icon}
                    dropItems={d.dropItems}
                    pathname={pathname}
                  />
                </div>
              ) : (
                <Link key={d.route} to={d.route}>
                  <div
                    className={`${
                      pathname === d.route && "bg-[#007bff] text-white"
                    } text-[#ced0d1] flex space-x-6 items-center py-[8px] px-[16px] mb-[3.2px] hover:bg-[#494e53] hover:rounded-md hover:text-white hover:cursor-pointer`}
                  >
                    <p>{d.icon}</p>
                    <p style={{ display: isOpen ? "block" : "none" }}>
                      {d.title}
                    </p>
                  </div>
                </Link>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const Dropdown = ({ title, icon, dropItems, pathname }) => {
  return (
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button className="flex w-full ">
            <div className="flex space-x-6 items-center py-[8px] px-[16px] mb-[3.2px] hover:bg-[#494e53] hover:rounded-md hover:text-white hover:cursor-pointer">
              <>
                {icon}
                <p>{title}</p>
              </>
              <IoIosArrowDown
                className={`${
                  open ? "rotate-180 transform transition-all duration-500" : ""
                } h-4 w-4 text-white `}
              />
            </div>
          </Disclosure.Button>

          <Disclosure.Panel className="px-4 text-lg space-y-2 ">
            {dropItems?.map((d, id) => {
              return d?.dropItems ? (
                <div key={id}>
                  <Dropdown
                    title={d.title}
                    icon={d.icon}
                    dropItems={d.dropItems}
                  />
                </div>
              ) : (
                <Link to={d.route}>
                  <div
                    className={`${
                      pathname === d.route && "bg-[#007bff] text-white"
                    } flex space-x-6 items-center text-[#ced0d1] py-[8px] px-[16px] mb-[3.2px] hover:bg-[#494e53] hover:rounded-md hover:text-white hover:cursor-pointer`}
                  >
                    <p>{d.icon}</p>
                    <p>{d.title}</p>
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
};
