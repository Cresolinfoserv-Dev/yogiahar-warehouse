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
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [editingRowId, setEditingRowId] = useState(null);
  const categoryName = useMemo(() => sessionStorage.getItem("role"), []);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const storedStock = JSON.parse(localStorage.getItem("returnStock"));

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await getProductsFunction(categoryName);
      if (response.status === 200) {
        setData(response.data.products);
      } else {
        notifyError("Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      notifyError("An error occurred while fetching products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [categoryName]);

  const handleCancelEdit = () => {
    setQuantity("");
    setEditingRowId(null);
  };

  const handleAddStock = (row) => {
    const {
      _id,
      inventoryProductName,
      inventoryProductQuantity,
      inventoryProductUnit,
    } = row;
    const enteredQuantity = parseFloat(quantity);

    if (isNaN(enteredQuantity) || enteredQuantity < 0.1) {
      notifyError(
        "Please enter a valid quantity greater than or equal to 0.1."
      );
      return;
    }

    if (enteredQuantity > inventoryProductQuantity) {
      notifyError("Insufficient stock available.");
      return;
    }

    const stockData = {
      quantity: enteredQuantity,
      productId: _id,
      productName: inventoryProductName,
      unit: inventoryProductUnit.inventoryUnitName,
    };

    const existingStock = JSON.parse(localStorage.getItem("returnStock")) || [];
    const existingProductIndex = existingStock.findIndex(
      (item) => item.productId === _id
    );

    if (existingProductIndex !== -1) {
      existingStock[existingProductIndex].quantity = enteredQuantity;
    } else {
      existingStock.push(stockData);
    }

    localStorage.setItem("returnStock", JSON.stringify(existingStock));
    setQuantity("");
    setEditingRowId(null);
    notifySuccess("Return Stock data saved successfully!");
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
          <img
            src={row.inventoryProductImageUrl}
            alt={row.inventoryProductName}
            width="80px"
            className="p-1"
          />
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
      cell: (row) => (
        <div>
          {editingRowId === row._id ? (
            <div className="mt-2 mb-2 space-y-2">
              <input
                type="text"
                placeholder="Enter quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
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
    return data.slice(firstIndex, lastIndex);
  }, [data, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(data.length / rowsPerPage);

  return (
    <Layout>
      {loading ? (
        <Loading />
      ) : (
        <div className="container px-4 mx-auto mt-4 md:px-8">
          <BreadCrumb pageName="Return Stock" />
          <div className="border w-fit mb-7">
            <div
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
                Add Stock
              </h4>
            </div>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-md">
            {data.length === 0 ? (
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
                            {typeof col?.selector === "function"
                              ? col.selector(row, id)
                              : null}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <nav>
                  <ul className="flex justify-center space-x-2 my-4">
                    <li>
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition disabled:opacity-50"
                        disabled={currentPage === 1}
                      >
                        Prev
                      </button>
                    </li>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (pageNum) => (
                        <li key={pageNum}>
                          <button
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-4 py-2 rounded-md transition ${
                              currentPage === pageNum
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 hover:bg-gray-300"
                            }`}
                          >
                            {pageNum}
                          </button>
                        </li>
                      )
                    )}
                    <li>
                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition disabled:opacity-50"
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              </>
            )}
          </div>
          {modalVisible && (
            <ReturnStockMaintain onClose={() => setModalVisible(false)} />
          )}
          <ToastContainer />
        </div>
      )}
    </Layout>
  );
}
