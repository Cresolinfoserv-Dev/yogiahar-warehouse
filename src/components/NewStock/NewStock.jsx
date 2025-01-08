import { useEffect, useMemo, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PropTypes from "prop-types";
import NewSendStock from "./NewSendStock";
import { getProductsFunction } from "../../Services/Apis";
import Layout from "../layout";
import Loading from "../common/Loading";
import BreadCrumb from "../common/Breadcrumb";

const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <nav>
    <ul className="flex justify-center space-x-2 my-4">
      <li
        className={`${
          currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <button
          onClick={() => onPageChange(currentPage - 1)}
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition disabled:hover:bg-gray-200"
          disabled={currentPage === 1}
        >
          Prev
        </button>
      </li>
      {[...Array(totalPages)].map((_, n) => (
        <li key={n + 1}>
          <button
            onClick={() => onPageChange(n + 1)}
            className={`px-4 py-2 rounded-md transition ${
              currentPage === n + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {n + 1}
          </button>
        </li>
      ))}
      <li
        className={`${
          currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <button
          onClick={() => onPageChange(currentPage + 1)}
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition disabled:hover:bg-gray-200"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </li>
    </ul>
  </nav>
);

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default function NewStock() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [quantity, setQuantity] = useState("");
  const [editingRowId, setEditingRowId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [productId, setProductId] = useState("");
  const categoryName = sessionStorage.getItem("role");
  const recordsPerPage = 20;

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await getProductsFunction(categoryName);

      if (response.status === 200 && response?.data?.products) {
        setData(response?.data?.products);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching Products:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredData = useMemo(() => {
    return data.filter((product) =>
      searchTerm
        ? product.inventoryProductName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          product.inventoryBarCodeId
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
        : true
    );
  }, [data, searchTerm]);

  const records = useMemo(() => {
    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    return filteredData.slice(firstIndex, lastIndex);
  }, [filteredData, currentPage]);

  const totalPages = useMemo(
    () => Math.ceil(filteredData.length / recordsPerPage),
    [filteredData.length]
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const notifySuccess = (toastMessage) =>
    toast.success(toastMessage, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
    });

  const notifyError = (errorMessage) =>
    toast.error(errorMessage, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
    });

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    const validValue = value.match(/^\d*(\.\d{0,2})?$/);

    if (validValue) {
      setQuantity(value);
    }
  };

  const handleAddStock = (row) => {
    const enteredQuantity = parseFloat(quantity).toFixed(2);

    if (!enteredQuantity || parseFloat(enteredQuantity) < 0.1) {
      notifyError(
        "Please enter a valid quantity greater than or equal to 0.1."
      );
      return;
    }

    const stockData = {
      role: categoryName,
      quantity: parseFloat(enteredQuantity),
      productId: row._id,
      productName: row.inventoryProductName,
      unit: row.inventoryProductUnit.inventoryUnitName,
    };

    let existingStock = JSON.parse(localStorage.getItem("stock")) || [];
    const existingProductIndex = existingStock.findIndex(
      (item) => item.productId === productId
    );

    if (existingProductIndex !== -1) {
      existingStock[existingProductIndex].quantity =
        parseFloat(enteredQuantity);
    } else {
      existingStock.push(stockData);
    }

    localStorage.setItem("stock", JSON.stringify(existingStock));

    setQuantity("");
    setEditingRowId(null);
    notifySuccess("Stock data saved successfully!");
  };

  const handleClick = () => {
    setModalVisible(true);
  };

  const numberInputOnWheelPreventChange = (e) => {
    e.target.blur();
    e.stopPropagation();
    setTimeout(() => {
      e.target.focus();
    }, 0);
  };

  const storedStock = JSON.parse(localStorage.getItem("stock"));

  return (
    <Layout>
      {loading ? (
        <Loading />
      ) : (
        <div className="container px-4 mx-auto mt-4 md:px-8">
          <BreadCrumb pageName="New Stock" />

          <div className="border w-fit mb-4 flex items-center gap-4">
            <button
              onClick={handleClick}
              style={{
                cursor: storedStock?.length > 0 ? "pointer" : "not-allowed",
              }}
            >
              <h4
                className={
                  storedStock?.length > 0
                    ? "p-2 text-center text-white bg-black hover:bg-white hover:text-black hover:duration-500 w-fit"
                    : "p-2 text-center text-gray-400 bg-gray-200 cursor-not-allowed w-fit"
                }
              >
                Send Stock
              </h4>
            </button>

            <input
              type="text"
              placeholder="Search Products"
              value={searchTerm}
              onChange={handleSearchChange}
              className="px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div className="p-4 bg-white rounded-lg shadow-md ">
            {data.length === 0 ? (
              <div>
                <h1>No Data Found</h1>
              </div>
            ) : (
              <>
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800 dark:text-white dark:duration-700">
                    <tr className="border-b border-gray-300 dark:border-gray-500">
                      {[
                        "ID",
                        "Product Name",
                        "Unit",
                        "Category",
                        "Current Quantity",
                        "Actions",
                      ].map((col) => (
                        <th key={col} scope="col" className="px-4 py-3">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((value, index) => (
                      <tr
                        key={value._id}
                        className="border-b border-gray-300 dark:border-slate-700"
                      >
                        <td className="px-4 py-3">
                          {index + 1 + (currentPage - 1) * recordsPerPage}
                        </td>
                        <td className="flex items-center space-x-3 px-4 py-3 font-medium whitespace-nowrap">
                          {value.inventoryProductImageUrl && (
                            <img
                              src={value.inventoryProductImageUrl}
                              alt={value.name}
                              className="p-1 w-8 h-8"
                            />
                          )}
                          {value.inventoryProductName}
                        </td>
                        <td className="px-4 py-3">
                          {value.inventoryProductUnit?.inventoryUnitName || ""}
                        </td>
                        <td className="px-4 py-3">
                          {value.inventoryCategory?.inventoryCategoryName}
                        </td>
                        <td className="px-4 py-3 text-green-500">
                          {value.inventoryProductQuantity}
                        </td>
                        <td className="px-4 py-3">
                          {editingRowId === value._id ? (
                            <div className="mt-2 mb-2 space-y-2">
                              <input
                                type="number"
                                value={quantity}
                                min="0.1"
                                step="0.01"
                                onChange={handleQuantityChange}
                                onWheel={numberInputOnWheelPreventChange}
                                className="p-2 border rounded-md"
                              />
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleAddStock(value)}
                                  className="px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600 transition"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingRowId(null)}
                                  className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 transition"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setEditingRowId(value._id);
                                setProductId(value._id);
                              }}
                              className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition"
                            >
                              Add
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </>
            )}
          </div>
          <ToastContainer />
        </div>
      )}
      <NewSendStock
        showModal={modalVisible}
        setShowModal={setModalVisible}
        fetchProducts={fetchProducts}
      />
    </Layout>
  );
}
