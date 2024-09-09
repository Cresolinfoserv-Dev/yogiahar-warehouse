import { useEffect, useState } from "react";
import Layout from "../layout";
import PropTypes from "prop-types";
import { getStockOrdersFunction } from "../../Services/Apis";
import Loading from "../common/Loading";
import { Link } from "react-router-dom";
import CardsGrid from "./CardsGrid";
import DateSelector from "./DateSelector";
import { format } from "date-fns";
import StockTable from "./StockTable";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    totalOrders: 0,
    totalProcessingOrders: 0,
    totalCompletedOrders: 0,
    totalReturnedOrders: 0,
  });
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const categoryName = sessionStorage.getItem("role");
  const [orders, setOrders] = useState([]);
  const [stockReport, setStockReport] = useState(new Map());

  const fetchData = async () => {
    const dataToUpdate = {
      totalOrders: 0,
      totalProcessingOrders: 0,
      totalCompletedOrders: 0,
      totalReturnedOrders: 0,
    };

    try {
      const [ordersResponse] = await Promise.allSettled([
        getStockOrdersFunction(categoryName),
      ]);

      if (ordersResponse.status === "fulfilled" && ordersResponse.value.data) {
        dataToUpdate.totalOrders = ordersResponse.value.data.allOrders.length;
        dataToUpdate.totalProcessingOrders =
          ordersResponse.value.data.processingOrders.length;
        dataToUpdate.totalCompletedOrders =
          ordersResponse.value.data.completedOrders.length;
        dataToUpdate.totalReturnedOrders =
          ordersResponse.value.data.returnedOrders.length;
        setOrders(ordersResponse.value.data.completedOrders);
      } else {
        console.error("Error fetching orders:", ordersResponse.reason);
      }

      setData(dataToUpdate);
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStocksReport = () => {
    const formattedFromDate = format(fromDate, "yyyy-MM-dd");
    const formattedToDate = format(toDate, "yyyy-MM-dd");

    const filteredOrders = orders.filter(
      (order) =>
        format(new Date(order.updatedAt), "yyyy-MM-dd") >= formattedFromDate &&
        format(new Date(order.updatedAt), "yyyy-MM-dd") <= formattedToDate
    );

    if (filteredOrders.length > 0) {
      const productMap = new Map();

      filteredOrders.forEach((order) => {
        order.products.forEach((product) => {
          const productId = product.productID._id;
          const productName = product.productID.inventoryProductName;
          const sendQuantity = parseFloat(product.sendQuantity);
          const stockType = order.stockType;
          const date = order.updatedAt;

          if (productMap.has(productId)) {
            const existingData = productMap.get(productId);
            existingData.sendQuantity += sendQuantity;
            productMap.set(productId, existingData);
          } else {
            productMap.set(productId, {
              productName: productName,
              sendQuantity: sendQuantity,
              stockType: stockType,
              date: date,
            });
          }
        });
      });

      setStockReport(productMap);
      return productMap;
    } else {
      setStockReport(new Map());
      return new Map();
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Layout>
      <div className="px-2 2xl:px-28 xl:px-16">
        <div className="grid grid-cols-1 gap-4 mt-2 sm:grid-cols-2 lg:grid-cols-4 md:mt-8">
          {loading ? (
            <Loading />
          ) : (
            <CardsGrid
              totalOrders={data.totalOrders}
              totalProcessingOrders={data.totalProcessingOrders}
              totalCompletedOrders={data.totalCompletedOrders}
              totalReturnedOrders={data.totalReturnedOrders}
            />
          )}
        </div>

        <DateSelector
          fromDate={fromDate}
          setFromDate={setFromDate}
          toDate={toDate}
          setToDate={setToDate}
          getStocksReport={getStocksReport}
        />

        <div className="gap-10 mt-10 bg-white md:flex">
          <div className="md:w-1/2">
            <StockTable stockReport={stockReport} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

const Card = ({ icon, name, number, link }) => (
  <Link
    to={link}
    className="grow-[1] basis-[200px] bg-white p-6 rounded-md shadow-md w-full"
  >
    <div className="flex items-center justify-between">
      <span className="text-xl">{icon}</span>
      <span className="text-2xl font-bold text-orange-600">{number}</span>
    </div>
    <div className="mt-4">
      <h3 className="text-lg font-semibold">{name}</h3>
    </div>
  </Link>
);

Card.propTypes = {
  icon: PropTypes.element.isRequired,
  name: PropTypes.string.isRequired,
  number: PropTypes.number.isRequired,
  link: PropTypes.string.isRequired,
};

export default Dashboard;
