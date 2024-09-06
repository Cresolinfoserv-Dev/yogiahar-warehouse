import { useEffect, useState } from "react";
import { getStockOrdersFunction } from "../../Services/Apis";

export default function GetStockOrders() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const categoryName = sessionStorage.getItem("role");

  const fetchStockOrders = async () => {
    setLoading(true);
    try {
      const response = await getStockOrdersFunction(categoryName);

      console.log(response);
      if (response.status === 200) {
        setData(response?.data?.products);
      }
    } catch (error) {
      console.error("Error fetching Products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockOrders();
  }, []);

  return <div>GetStockOrders</div>;
}
