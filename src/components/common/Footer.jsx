import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="p-4 mt-6 bg-white">
      <div className="flex space-x-2">
        <p>{`Copyright © ${new Date().getFullYear()}`}</p>{" "}
        <p>
          <Link
            to="/"
            className="font-bold text-blue-500 cursor-pointer hover:text-blue-600"
          >
            Yogi Warehouse
          </Link>
        </p>{" "}
        <p>All rights reserved.</p>
      </div>
    </div>
  );
};

export default Footer;
