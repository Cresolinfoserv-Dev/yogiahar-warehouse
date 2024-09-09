import PropTypes from "prop-types";
import { FaUsers } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function CardsGrid({
  totalOrders,
  totalCompletedOrders,
  totalProcessingOrders,
  totalReturnedOrders,
}) {
  const cards = [
    {
      icon: <FaUsers />,
      name: "Total Orders",
      number: totalOrders,
      link: "#",
    },
    {
      icon: <FaUsers />,
      name: "Total Processing Orders",
      number: totalProcessingOrders,
      link: "/processing-orders",
    },
    {
      icon: <FaUsers />,
      name: "Total Completed Orders",
      number: totalCompletedOrders,
      link: "/completed-orders",
    },
    {
      icon: <FaUsers />,
      name: "Total Returned Orders",
      number: totalReturnedOrders,
      link: "/returned-orders",
    },
  ];

  return (
    <>
      {cards.map((card, index) => (
        <Link
          key={index}
          to={card.link}
          className="grow-[1] basis-[200px] bg-white p-6 rounded-md shadow-md w-full"
        >
          <div className="flex items-center justify-between">
            <span className="text-xl">{card.icon}</span>
            <span className="text-2xl font-bold text-orange-600">
              {card.number}
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-semibold">{card.name}</h3>
          </div>
        </Link>
      ))}
    </>
  );
}

CardsGrid.propTypes = {
  totalOrders: PropTypes.number.isRequired,
  totalProcessingOrders: PropTypes.number.isRequired,
  totalCompletedOrders: PropTypes.number.isRequired,
  totalReturnedOrders: PropTypes.number.isRequired,
};
