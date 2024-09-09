import { useEffect, useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import BreadCrumb from "../common/Breadcrumb";
import Layout from "../layout";
import { getStockOrdersFunction } from "../../Services/Apis";
import Loading from "../common/Loading";

export default function ReturnedOrders() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const categoryName = sessionStorage.getItem("role");

  const lastIndex = useMemo(() => currentPage * recordsPerPage, [currentPage]);
  const firstIndex = useMemo(() => lastIndex - recordsPerPage, [lastIndex]);
  const paginatedData = useMemo(
    () => data.slice(firstIndex, lastIndex),
    [data, firstIndex, lastIndex]
  );
  const totalPages = useMemo(
    () => Math.ceil(data.length / recordsPerPage),
    [data.length]
  );

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getStockOrdersFunction(categoryName);
      if (response.status === 200) {
        setData(response.data.returnedOrders || []);
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

  const formatDate = useCallback((dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }, []);

  const columns = useMemo(
    () => [
      {
        name: "ID",
        selector: (row, index) =>
          (currentPage - 1) * recordsPerPage + index + 1,
        width: "100px",
      },
      {
        name: "Products",
        selector: (row) => (
          <div className="p-2 space-y-2 bg-white rounded-lg shadow-md">
            {row.products.map((product) => (
              <div key={product.productID?._id || Math.random()}>
                {product.productID?.inventoryProductName} -{" "}
                {product.sendQuantity} (
                {product.productID?.inventoryProductUnit?.inventoryUnitName})
              </div>
            ))}
          </div>
        ),
      },
      {
        name: "Order Status",
        selector: (row) => <p>{row.orderStatus}</p>,
      },
      {
        name: "Returned Time",
        selector: (row) => <p>{formatDate(row.updatedAt)}</p>,
      },
      {
        name: "Actions",
        selector: (row) => (
          <Link
            to={`/view-order/${row._id}`}
            className="px-2 bg-blue-100 border border-blue-600 rounded-sm hover:bg-blue-200"
          >
            View
          </Link>
        ),
        width: "200px",
      },
    ],
    [currentPage, recordsPerPage, formatDate]
  );

  const handlePrevPage = useCallback(() => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  }, [currentPage]);

  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  }, [currentPage, totalPages]);

  return (
    <Layout>
      {loading ? (
        <Loading />
      ) : (
        <div className="container px-4 mx-auto mt-4 md:px-8">
          <BreadCrumb pageName="Returned Orders" />
          <div className="p-4 bg-white rounded-lg shadow-md">
            {data.length === 0 ? (
              <h1>No Data Found</h1>
            ) : (
              <>
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800 dark:text-white dark:duration-700">
                    <tr className="border-b border-gray-300 dark:border-gray-500">
                      {columns.map((col, i) => (
                        <th key={i} className="px-4 py-3 w-20">
                          {col.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.map((row, index) => (
                      <tr
                        key={row._id}
                        className="border-b border-gray-300 dark:border-slate-700"
                      >
                        {columns.map((col, i) => (
                          <td key={i} className="px-4 py-3 w-20">
                            {col.selector(row, index)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <nav className="flex justify-center space-x-2 my-4">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 ${
                      currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    Prev
                  </button>
                  {[...Array(totalPages)].map((_, n) => (
                    <button
                      key={n + 1}
                      onClick={() => setCurrentPage(n + 1)}
                      className={`px-4 py-2 rounded-md ${
                        currentPage === n + 1
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                    >
                      {n + 1}
                    </button>
                  ))}
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 ${
                      currentPage === totalPages
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    Next
                  </button>
                </nav>
              </>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}
