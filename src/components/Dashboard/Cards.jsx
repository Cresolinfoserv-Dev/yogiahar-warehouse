// import { useEffect, useState } from "react";
// import Layout from "../layout";
// import PropTypes from "prop-types";
// import { FaUsers } from "react-icons/fa";
// import { getOrdersFunction } from "../../Services/Apis";
// import Loading from "../common/Loading";
// import { Link } from "react-router-dom";

// const Dashboard = () => {
//   const [loading, setLoading] = useState(true);
//   const [data, setData] = useState({
//     totalOrders: 0,
//     totalProcessingOrders: 0,
//     totalFinishedOrders: 0,
//     totalFoodReadyOrders: 0,
//   });

//   const fetchData = async () => {
//     const dataToUpdate = {
//       totalOrders: 0,
//       totalProcessingOrders: 0,
//       totalFinishedOrders: 0,
//       totalFoodReadyOrders: 0,
//     };

//     try {
//       const [ordersResponse] = await Promise.allSettled([getOrdersFunction()]);

//       if (ordersResponse.status === "fulfilled" && ordersResponse.value.data) {
//         dataToUpdate.totalOrders = ordersResponse.value.data.allOrders.length;
//         dataToUpdate.totalProcessingOrders =
//           ordersResponse.value.data.processingOrders.length;
//         dataToUpdate.totalFinishedOrders =
//           ordersResponse.value.data.closedOrders.length;
//         dataToUpdate.totalFoodReadyOrders =
//           ordersResponse.value.data.readyToServe.length;
//       } else {
//         console.error(
//           "Error fetching restaurant owners:",
//           ordersResponse.reason
//         );
//       }

//       setData(dataToUpdate);
//     } catch (error) {
//       console.error("Unexpected error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const cards = [
//     {
//       icon: <FaUsers />,
//       name: "Total Orders",
//       number: data.totalOrders,
//       link: "#",
//     },
//     {
//       icon: <FaUsers />,
//       name: "Total Processing Orders",
//       number: data.totalProcessingOrders,
//       link: "/orders/processing",
//     },
//     {
//       icon: <FaUsers />,
//       name: "Total Ready To Serve Orders",
//       number: data.totalFoodReadyOrders,
//       link: "/orders/food-ready",
//     },
//     {
//       icon: <FaUsers />,
//       name: "Total Finished Orders",
//       number: data.totalFinishedOrders,
//       link: "/orders/closed",
//     },
//   ];

//   return (
//     <Layout>
//       <div className="grid grid-cols-1 gap-4 px-2 mt-2 sm:grid-cols-2 lg:grid-cols-4 2xl:px-28 xl:px-16 md:mt-8">
//         {loading ? (
//           <Loading />
//         ) : (
//           cards.map((card, index) => (
//             <Card
//               key={index}
//               icon={card.icon}
//               name={card.name}
//               number={card.number}
//               link={card.link}
//             />
//           ))
//         )}
//       </div>
//     </Layout>
//   );
// };

// const Card = ({ icon, name, number, link }) => (
//   <Link
//     to={link}
//     className="grow-[1] basis-[200px] bg-white p-6 rounded-md shadow-md w-full"
//   >
//     <div className="flex items-center justify-between">
//       <span className="text-xl">{icon}</span>
//       <span className="text-2xl font-bold text-orange-600">{number}</span>
//     </div>
//     <div className="mt-4">
//       <h3 className="text-lg font-semibold">{name}</h3>
//     </div>
//   </Link>
// );

// Card.propTypes = {
//   icon: PropTypes.element.isRequired,
//   name: PropTypes.string.isRequired,
//   number: PropTypes.number.isRequired,
//   link: PropTypes.string.isRequired,
// };

// export default Dashboard;

import Layout from "../layout";
import GetStockOrders from "./GetStockOrders";

const Cards = () => {
  return (
    <Layout>
      <div className="p-2">
        <h1>cards</h1>

        <GetStockOrders />
      </div>
    </Layout>
  );
};

export default Cards;
