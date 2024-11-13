import { useEffect, useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import BreadCrumb from "../common/Breadcrumb";
import Layout from "../layout";
import {
  changeOrderStatusByID,
  getStockOrdersFunction,
} from "../../Services/Apis";
import Loading from "../common/Loading";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProcessingOrders() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 20;
  const categoryName = sessionStorage.getItem("role");

  const notify = (type, message) => {
    toast[type](message, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
    });
  };

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getStockOrdersFunction(categoryName);
      if (response.status === 200) {
        setData(response.data.processingOrders || []);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }, [categoryName]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleOrderStatus = async (id, orderStatus) => {
    try {
      const response = await changeOrderStatusByID(id, { orderStatus });
      if (response.status === 200) {
        fetchOrders();
        notify("success", "Order status updated");
      }
    } catch (error) {
      notify("error", "Failed to change the order status");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const records = useMemo(() => {
    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    return data.slice(firstIndex, lastIndex);
  }, [data, currentPage, recordsPerPage]);

  const npage = Math.ceil(data.length / recordsPerPage);
  const paginationNumbers = useMemo(
    () => Array.from({ length: npage }, (_, i) => i + 1),
    [npage]
  );

  const handlePageChange = (id) => setCurrentPage(id);

  const columns = [
    {
      name: "ID",
      selector: (_, index) => (currentPage - 1) * recordsPerPage + index + 1,
    },
    {
      name: "Products",
      selector: (row) => (
        <div className="p-2 bg-white rounded-lg shadow-md space-y-2">
          {row.products.map((product) => (
            <div key={product.productID?._id || Math.random()}>
              {product.productID?.inventoryProductName} - {product.sendQuantity}{" "}
              ({product.productID?.inventoryProductUnit?.inventoryUnitName})
            </div>
          ))}
        </div>
      ),
    },
    {
      name: "Send To",
      selector: (row) => (
        <p className="uppercase">
          {" "}
          {row.store === "" ? "In Stock" : row.store}
        </p>
      ),
    },
    {
      name: "Stock Type",
      selector: (row) => <p className="uppercase">{row.stockType}</p>,
    },
    {
      name: "Order Status",
      selector: (row) => (
        <select
          value={row.orderStatus}
          onChange={(e) => handleOrderStatus(row._id, e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Select an Option</option>
          <option value="Completed">Completed</option>
        </select>
      ),
    },
    {
      name: "Created Time",
      selector: (row) => <p>{formatDate(row.createdAt)}</p>,
    },
    {
      name: "Actions",
      selector: (row) => (
        <Link to={`/view-order/${row._id}`}>
          <button className="bg-black text-white px-4 py-2 rounded hover:bg-red-400">
            View
          </button>
        </Link>
      ),
    },
  ];

  return (
    <Layout>
      {loading ? (
        <Loading />
      ) : (
        <div className="container mx-auto px-4 mt-4 md:px-8">
          <BreadCrumb pageName="Processing Orders" />
          <div className="p-4 bg-white rounded-lg shadow-md">
            {data.length === 0 ? (
              <h1>No Data Found</h1>
            ) : (
              <>
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800">
                    <tr>
                      {columns.map((column, i) => (
                        <th key={i} className="px-4 py-3">
                          {column.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((row, index) => (
                      <tr key={row._id} className="border-b">
                        {columns.map((col, i) => (
                          <td key={i} className="px-4 py-3">
                            {col.selector(row, index)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <nav className="flex justify-center space-x-2 my-4">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    className={`px-4 py-2 bg-gray-200 rounded-md ${
                      currentPage === 1 && "cursor-not-allowed"
                    }`}
                    disabled={currentPage === 1}
                  >
                    Prev
                  </button>
                  {paginationNumbers.map((n) => (
                    <button
                      key={n}
                      onClick={() => handlePageChange(n)}
                      className={`px-4 py-2 rounded-md ${
                        currentPage === n
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, npage))
                    }
                    className={`px-4 py-2 bg-gray-200 rounded-md ${
                      currentPage === npage && "cursor-not-allowed"
                    }`}
                    disabled={currentPage === npage}
                  >
                    Next
                  </button>
                </nav>
              </>
            )}
          </div>
          <ToastContainer />
        </div>
      )}
    </Layout>
  );
}
