import { useEffect, useState, useMemo } from "react";
import BreadCrumb from "../../common/Breadcrumb";
import Layout from "../../layout";
import { getProductsFunction } from "../../../Services/Apis";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "../../common/Loading";
import ReturnStockMaintain from "./ReturnStockMaintain";

export default function ReturnStock() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [editingRowId, setEditingRowId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const categoryName = useMemo(() => sessionStorage.getItem("role"), []);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 20;
  const storedStock = JSON.parse(localStorage.getItem("returnStock"));

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await getProductsFunction(categoryName);
      if (response.status === 200 && response?.data?.products) {
        setData(response?.data?.products);
        setFilteredData(response?.data?.products);
      } else {
        setData([]);
        setFilteredData([]);
      }
    } catch (error) {
      console.error("Error fetching Products:", error);
      setData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [categoryName]);

  const handleSearch = (e) => {
    const keyword = e.target.value.toLowerCase();
    setSearchTerm(keyword);
    setFilteredData(
      data.filter(
        (item) =>
          item.inventoryProductName.toLowerCase().includes(keyword) ||
          item.inventoryProductSKUCode.toLowerCase().includes(keyword)
      )
    );
    setCurrentPage(1);
  };

  const handleCancelEdit = () => {
    setQuantity("");
    setEditingRowId(null);
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    const validValue = value.match(/^\d*(\.\d{0,2})?$/);
    if (validValue) {
      setQuantity(value);
    }
  };

  const handleAddStock = (row) => {
    const {
      _id,
      inventoryProductName,
      inventoryProductQuantity,
      inventoryProductUnit,
    } = row;
    const enteredQuantity = parseFloat(quantity).toFixed(2);

    if (isNaN(enteredQuantity) || parseFloat(enteredQuantity) < 0.1) {
      notifyError(
        "Please enter a valid quantity greater than or equal to 0.1."
      );
      return;
    }

    const availableStock = parseFloat(inventoryProductQuantity);
    if (enteredQuantity > availableStock) {
      notifyError("Insufficient stock available.");
      return;
    }

    const stockData = {
      quantity: parseFloat(enteredQuantity),
      productId: _id,
      productName: inventoryProductName,
      unit: inventoryProductUnit.inventoryUnitName,
    };

    const existingStock = JSON.parse(localStorage.getItem("returnStock")) || [];
    const existingProductIndex = existingStock.findIndex(
      (item) => item.productId === _id
    );

    if (existingProductIndex !== -1) {
      existingStock[existingProductIndex].quantity =
        parseFloat(enteredQuantity);
    } else {
      existingStock.push(stockData);
    }

    localStorage.setItem("returnStock", JSON.stringify(existingStock));
    setQuantity("");
    setEditingRowId(null);
    notifySuccess("Return Stock data saved successfully!");
  };

  const numberInputOnWheelPreventChange = (e) => {
    e.target.blur();
    e.stopPropagation();
    setTimeout(() => {
      e.target.focus();
    }, 0);
  };

  const columns = [
    {
      name: "ID",
      selector: (_, index) => (currentPage - 1) * rowsPerPage + index + 1,
      sortable: true,
      width: "100px",
    },
    {
      name: "Product Name",
      selector: (row) => (
        <div className="flex items-center space-x-3">
          {row.inventoryProductImageUrl && (
            <img
              src={row.inventoryProductImageUrl}
              alt={row.inventoryProductName}
              className="p-1 w-8 h-8"
            />
          )}
          <p>{row.inventoryProductName}</p>
        </div>
      ),
      sortable: true,
      width: "300px",
    },
    {
      name: "SKU",
      selector: (row) => (
        <p className="uppercase">{row.inventoryProductSKUCode}</p>
      ),
      sortable: true,
      width: "150px",
    },
    {
      name: "Unit",
      selector: (row) => (
        <p className="uppercase">
          {row.inventoryProductUnit?.inventoryUnitName}
        </p>
      ),
      sortable: true,
      width: "150px",
    },
    {
      name: "Current Quantity",
      selector: (row) => (
        <p className="text-green-500">{row?.inventoryProductQuantity}</p>
      ),
      sortable: true,
      width: "150px",
    },
    {
      name: "Actions",
      selector: (row) => (
        <div>
          {editingRowId === row._id ? (
            <div className="mt-2 mb-2 space-y-2">
              <input
                type="number"
                step="0.01"
                placeholder="Enter quantity"
                value={quantity}
                onWheel={numberInputOnWheelPreventChange}
                onChange={handleQuantityChange}
                className="p-2 border"
              />
              <div className="flex space-x-2">
                <button
                  onClick={() => handleAddStock(row)}
                  className="p-2 text-white bg-black hover:bg-white hover:text-black hover:duration-500"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="p-2 text-white bg-red-500 hover:bg-white hover:text-red-500 hover:duration-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => {
                setEditingRowId(row._id);
                setQuantity("");
              }}
              className="p-2 text-center text-white bg-black hover:bg-white hover:text-black hover:duration-500 w-fit"
            >
              Return Stock
            </button>
          )}
        </div>
      ),
      width: "200px",
    },
  ];

  const notifySuccess = (message) => {
    toast.success(message, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
    });
  };

  const notifyError = (message) => {
    toast.error(message, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
    });
  };

  const paginatedData = useMemo(() => {
    const lastIndex = currentPage * rowsPerPage;
    const firstIndex = lastIndex - rowsPerPage;
    return filteredData.slice(firstIndex, lastIndex);
  }, [filteredData, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  return (
    <Layout>
      {loading ? (
        <Loading />
      ) : (
        <div className="container px-4 mx-auto mt-4 md:px-8">
          <BreadCrumb pageName="Return Stock" />
          <div className="border w-fit mb-4 flex items-center gap-4">
            <button
              onClick={
                storedStock?.length > 0
                  ? () => setModalVisible(true)
                  : undefined
              }
              style={{
                cursor: storedStock?.length > 0 ? "pointer" : "not-allowed",
              }}
            >
              <h4
                className={`p-2 text-center ${
                  storedStock?.length > 0
                    ? "text-white bg-black hover:bg-white hover:text-black hover:duration-500"
                    : "text-gray-400 bg-gray-200 cursor-not-allowed"
                } w-fit`}
              >
                Return Stock
              </h4>
            </button>

            <input
              type="text"
              placeholder="Search by product name or SKU..."
              value={searchTerm}
              onChange={handleSearch}
              className="px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div className="p-4 bg-white rounded-lg shadow-md">
            {filteredData.length === 0 ? (
              <h1>No Data Found</h1>
            ) : (
              <>
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800 dark:text-white">
                    <tr className="border-b border-gray-300 dark:border-gray-500">
                      {columns.map((col, i) => (
                        <th key={i} scope="col" className="px-4 py-3 w-20">
                          {col.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.map((row, id) => (
                      <tr
                        key={row._id}
                        className="border-b border-gray-300 dark:border-slate-700"
                      >
                        {columns?.map((col, i) => (
                          <td key={i} className="px-4 py-3 w-20">
                            {col.selector(row, id)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredData.length > rowsPerPage && (
                  <div className="flex justify-center mt-4">
                    <button
                      onClick={() => setCurrentPage((prev) => prev - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 mx-1 text-white bg-black rounded disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2 mx-1">{`Page ${currentPage} of ${totalPages}`}</span>
                    <button
                      onClick={() => setCurrentPage((prev) => prev + 1)}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 mx-1 text-white bg-black rounded disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
      {modalVisible && (
        <ReturnStockMaintain onClose={() => setModalVisible(false)} />
      )}
      <ToastContainer />
    </Layout>
  );
}
