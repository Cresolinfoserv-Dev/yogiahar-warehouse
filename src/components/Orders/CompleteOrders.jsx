import { useEffect, useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import BreadCrumb from "../common/Breadcrumb";
import Layout from "../layout";
import { getStockOrdersFunction } from "../../Services/Apis";
import Loading from "../common/Loading";

export default function CompleteOrders() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 20;
  const categoryName = useMemo(() => sessionStorage.getItem("role"), []);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getStockOrdersFunction(categoryName);
      if (response.status === 200) {
        setData(response.data.completedOrders);
      } else {
        console.error("Failed to fetch orders:", response.statusText);
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

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;

  const records = useMemo(
    () => data.slice(firstIndex, lastIndex),
    [data, firstIndex, lastIndex]
  );
  const npage = useMemo(() => Math.ceil(data.length / recordsPerPage), [data]);
  const numbers = useMemo(() => [...Array(npage + 1).keys()].slice(1), [npage]);

  const columns = [
    { name: "ID", width: "100px" },
    { name: "Products", width: "auto" },
    { name: "Sent To", width: "auto" },
    { name: "Stock Type", width: "auto" },
    { name: "Order Status", width: "auto" },
    { name: "Completion Time", width: "auto" },
    { name: "Actions", width: "200px" },
  ];

  const renderTableRows = () =>
    records.map((row, index) => (
      <tr
        key={row._id}
        className="border-b border-gray-300 dark:border-slate-700"
      >
        <td className="px-4 py-3">
          {(currentPage - 1) * recordsPerPage + index + 1}
        </td>
        <td className="md:px-4 py-3">
          <div className="p-2 space-y-2 bg-white rounded-lg shadow-md">
            {row.productsData.map((product) => (
              <div
                key={
                  product.productId?._id ||
                  product.productId?.inventoryProductName
                }
              >
                {product.productId?.name} - {product.sendQuantity} (
                {product.productId?.unit?.unitName})
              </div>
            ))}
          </div>
        </td>
        <td className="px-4 py-3 ">
          {row.store === "" ? "In Stock" : row.store}
        </td>
        <td className="px-4 py-3 ">{row.stockType}</td>
        <td className="px-4 py-3">{row.orderStatus}</td>
        <td className="px-4 py-3">{formatDate(row.updatedAt)}</td>
        <td className="px-4 py-3 lg:flex grid lg:space-x-5 lg:space-y-0 space-y-5 w-fit justify-center lg:mt-5">
          <Link to={`/view-order/${row._id}`}>
            <small className="px-2 bg-blue-100 border border-blue-600 rounded-sm hover:bg-blue-200 cursor-pointer">
              View
            </small>
          </Link>
        </td>
      </tr>
    ));

  return (
    <Layout>
      {loading ? (
        <Loading />
      ) : (
        <div className="container px-4 mx-auto mt-4 md:px-8">
          <BreadCrumb pageName="Completed Orders" />
          <div className="p-4 bg-white rounded-lg shadow-md">
            {data.length === 0 ? (
              <h1>No Data Found</h1>
            ) : (
              <>
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800 dark:text-white dark:duration-700">
                    <tr className="border-b border-gray-300 dark:border-gray-500">
                      {columns.map((col, i) => (
                        <th
                          key={i}
                          scope="col"
                          className="px-4 py-3"
                          style={{ width: col.width }}
                        >
                          {col.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>{renderTableRows()}</tbody>
                </table>

                <nav>
                  <ul className="flex justify-center space-x-2 my-4">
                    <li>
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition"
                        disabled={currentPage === 1}
                      >
                        Prev
                      </button>
                    </li>
                    {numbers.map((n) => (
                      <li key={n}>
                        <button
                          onClick={() => setCurrentPage(n)}
                          className={`px-4 py-2 rounded-md transition ${
                            currentPage === n
                              ? "bg-blue-500 text-white"
                              : "bg-gray-200 hover:bg-gray-300"
                          }`}
                        >
                          {n}
                        </button>
                      </li>
                    ))}
                    <li>
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.min(prev + 1, npage))
                        }
                        className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition"
                        disabled={currentPage === npage}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              </>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}
