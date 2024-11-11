import { useCallback, useEffect, useState } from "react";
import Layout from "../layout";
import PropTypes from "prop-types";
import {
  getBoutiqueEmployeesFunction,
  getCafeEmployeesFunction,
  getProductsFunction,
  getStockOrdersFunction,
} from "../../Services/Apis";
import Loading from "../common/Loading";
import { Link } from "react-router-dom";
import CardsGrid from "./CardsGrid";
import DateSelector from "./DateSelector";
import { format } from "date-fns";
import StockTable from "./StockTable";
import * as XLSX from "xlsx";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [data, setData] = useState({
    totalOrders: 0,
    totalProcessingOrders: 0,
    totalCompletedOrders: 0,
    totalReturnedOrders: 0,
  });
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const categoryName = sessionStorage.getItem("role");
  const [stockReport, setStockReport] = useState(new Map());
  const [allOrders, setAllOrders] = useState([]);
  const [boutiqueData, setBoutiqueData] = useState([]);
  const [cafeData, setCafeData] = useState([]);
  const [selectedStore, setSelectedStore] = useState("");

  const fetchBoutiqueEmployees = async () => {
    setLoading(true);
    try {
      const response = await getBoutiqueEmployeesFunction();
      if (response.status === 200) {
        setLoading(false);
        setBoutiqueData(response?.data?.boutiques);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching boutique employees:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCafeEmployees = async () => {
    setLoading(true);
    try {
      const response = await getCafeEmployeesFunction();
      if (response.status === 200) {
        setLoading(false);
        setCafeData(response?.data?.cafe);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching boutique employees:", error);
    } finally {
      setLoading(false);
    }
  };

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

      setAllOrders(ordersResponse?.value?.data?.allOrders);

      if (ordersResponse.status === "fulfilled" && ordersResponse.value.data) {
        dataToUpdate.totalOrders = ordersResponse.value.data.allOrders.length;
        dataToUpdate.totalProcessingOrders =
          ordersResponse.value.data.processingOrders.length;
        dataToUpdate.totalCompletedOrders =
          ordersResponse.value.data.completedOrders.length;
        dataToUpdate.totalReturnedOrders =
          ordersResponse.value.data.returnedOrders.length;
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

    const filteredOrders = allOrders.filter(
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
          const sendQuantity = parseFloat(product.sendQuantity) || 0;
          const returnQuantity = parseFloat(product.returnQuantity) || 0;
          const stockType = order.stockType;

          let outQuantity = 0;
          if (stockType === "Out") {
            outQuantity = sendQuantity - returnQuantity;
          }

          if (productMap.has(productId)) {
            const existingData = productMap.get(productId);

            if (stockType === "In") {
              existingData.inQuantity += sendQuantity;
            } else if (stockType === "Out") {
              existingData.outQuantity += outQuantity;
            } else if (stockType === "Returned") {
              existingData.returnQuantities += sendQuantity;
            }

            productMap.set(productId, existingData);
          } else {
            productMap.set(productId, {
              productName: productName,
              inQuantity: stockType === "In" ? sendQuantity : 0,
              outQuantity: stockType === "Out" ? outQuantity : 0,
              returnQuantities: stockType === "Returned" ? sendQuantity : 0,
              date: order.updatedAt,
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

  const handleStoreChange = async (event) => {
    const storeName = event.target.value;
    setSelectedStore(storeName);

    try {
      const response = await getStockOrdersFunction(categoryName, {
        storeName,
      });
      if (response.status === 200) {
        setAllOrders(response.data.allOrders);
      }
    } catch (error) {
      console.error("Error fetching filtered orders:", error);
    }
  };

  const handleStoreDownloadExcel = (selectedStore) => {
    const filteredStoreOrders = allOrders.filter(
      (order) => order.store === selectedStore
    );

    const formattedData = [];
    filteredStoreOrders.forEach((order) => {
      order.products.forEach((product) => {
        const productName = product.productID.inventoryProductName;
        const sendQuantity = parseFloat(product.sendQuantity) || 0;
        const returnQuantity = parseFloat(product.returnQuantity) || 0;
        const stockType = order.stockType;
        const orderDate = format(new Date(order.updatedAt), "yyyy-MM-dd");

        let outQuantity = 0;
        if (stockType === "Out") {
          outQuantity = sendQuantity - returnQuantity;
        }

        formattedData.push({
          Date: orderDate,
          ProductName: productName,
          StockType: stockType,
          OutQuantity: stockType === "Out" ? outQuantity : 0,
        });
      });
    });

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Filtered Orders");
    XLSX.writeFile(workbook, `${selectedStore}_Orders.xlsx`);
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getProductsFunction(categoryName);
      if (response.status === 200) {
        setProducts(response?.data?.products || []);
      }
    } catch (error) {
      console.error("Error fetching Products:", error);
    } finally {
      setLoading(false);
    }
  }, [categoryName]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetchData();
    fetchBoutiqueEmployees();
    fetchCafeEmployees();
  }, []);

  const handleDownloadExcel = () => {
    const formattedData = products.map((product) => {
      let vendorDetails = "No vendor details";
      if (product.vendorDetails && product.vendorDetails.length > 0) {
        vendorDetails = product.vendorDetails
          .map((vendor) => {
            const details = [];
            if (vendor.name) details.push(`Vendor Name: ${vendor.name}`);
            if (vendor.landingCost)
              details.push(`Landing Cost: ${vendor.landingCost}`);
            if (vendor.contact) details.push(`Contact: ${vendor.contact}`);
            if (vendor.address) details.push(`Address: ${vendor.address}`);
            if (vendor.city) details.push(`City: ${vendor.city}`);
            if (vendor.batchNumber)
              details.push(`Batch Number: ${vendor.batchNumber}`);
            if (vendor.gst) details.push(`GST: ${vendor.gst}`);
            if (vendor.igst) details.push(`IGST: ${vendor.igst}`);

            return details.join(", ");
          })
          .join("\n");
      }

      return {
        ProductName: product.inventoryProductName,
        Description: product.inventoryProductDescription,
        Category: product.inventoryCategory?.inventoryCategoryName,
        Quantity: product.inventoryProductQuantity,
        Unit: product.inventoryProductUnit?.inventoryUnitName,
        SKU: product.inventoryProductSKUCode,
        CostPrice: product.inventoryCostPrice,
        SellingPrice: product.inventorySellingPrice,
        GSTPercent: product.gstPercent,
        GSTAmount: product.gstAmount,
        VendorDetails: vendorDetails,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");

    XLSX.writeFile(workbook, "Products_Report.xlsx");
  };

  return (
    <Layout>
      <div className="px-2 2xl:px-28 xl:px-16 space-y-8">
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

        <div className="xl:flex items-end justify-between ">
          <DateSelector
            fromDate={fromDate}
            setFromDate={setFromDate}
            toDate={toDate}
            setToDate={setToDate}
            getStocksReport={getStocksReport}
          />

          {["Boutique", "Cafe"].includes(categoryName) && (
            <div className="flex gap-4 items-center xl:my-0 my-5">
              <div className="">
                <label htmlFor="storeSelect">Select Store:</label>
                <select
                  id="storeSelect"
                  value={selectedStore}
                  onChange={handleStoreChange}
                  className="p-2 border rounded-md ml-2"
                >
                  <option>Select</option>
                  {(categoryName === "Boutique" ? boutiqueData : cafeData).map(
                    (store) => (
                      <option key={store._id} value={store.storeType}>
                        {store.storeType}
                      </option>
                    )
                  )}
                </select>
              </div>
              <button
                className="p-2 text-white bg-blue-500 rounded-md h-fit"
                onClick={() => handleStoreDownloadExcel(selectedStore)}
              >
                Download
              </button>
            </div>
          )}
        </div>
        <div>
          <button
            onClick={handleDownloadExcel}
            className="p-2 text-white bg-blue-500 rounded-md h-fit"
          >
            Products Details Excel
          </button>
        </div>

        <div className="gap-10 mt-10 bg-white md:flex">
          <div className="w-full">
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
