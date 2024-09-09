import { useEffect, useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import BreadCrumb from "../common/Breadcrumb";
import Layout from "../layout";
import {
  getProductsFunction,
  productUpdateStatusFunction,
} from "../../Services/Apis";
import Loading from "../common/Loading";
import ToggleButton from "react-toggle-button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function GetProducts() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const categoryName = sessionStorage.getItem("role");

  const lastIndex = useMemo(() => currentPage * recordsPerPage, [currentPage]);
  const firstIndex = useMemo(() => lastIndex - recordsPerPage, [lastIndex]);
  const records = useMemo(
    () => data.slice(firstIndex, lastIndex),
    [data, firstIndex, lastIndex]
  );

  const npage = useMemo(
    () => Math.ceil(data.length / recordsPerPage),
    [data.length]
  );
  const pageNumbers = useMemo(
    () => [...Array(npage).keys()].map((n) => n + 1),
    [npage]
  );

  const notifySuccess = (toastMessage) => {
    toast.success(toastMessage, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
    });
  };

  const notifyError = (errorMessage) => {
    toast.error(errorMessage, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
    });
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getProductsFunction(categoryName);
      if (response.status === 200) {
        setData(response?.data?.products || []);
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

  const handlePrevPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(prev + 1, npage));
  }, [npage]);

  const setCurrentPageHandler = useCallback((pageNum) => {
    setCurrentPage(pageNum);
  }, []);

  const columns = useMemo(
    () => [
      { name: "ID", width: "100px" },
      { name: "Product Name", width: "300px" },
      { name: "SKU", width: "150px" },
      { name: "Unit", width: "150px" },
      { name: "Quantity", width: "150px" },
      { name: "Category", width: "150px" },
      { name: "Status", width: "150px" },
      {
        name: "Actions",
        width: "200px",
      },
    ],
    []
  );

  const handleToggleStatus = async (id, status) => {
    const authToken = sessionStorage.getItem("adminToken");
    const headers = { Authorization: authToken };
    const newStatus = status === "Active" ? "Inactive" : "Active";

    try {
      const response = await productUpdateStatusFunction(
        id,
        { newStatus },
        headers
      );
      if (response.status === 200) {
        notifySuccess("Product Status Changed!");
        fetchProducts();
      }
    } catch (error) {
      notifyError(error);
      console.error("Error updating product status:", error);
    }
  };

  const isStatusActive = (status) => status === "Active";

  return (
    <Layout>
      {loading ? (
        <Loading />
      ) : (
        <div className="container px-4 mx-auto md:px-8">
          <BreadCrumb pageName="Products" />
          <div className="border w-fit mb-7">
            <Link to="/product/add">
              <h4 className="p-2 text-center text-white bg-black hover:bg-white hover:text-black transition duration-500">
                Add New Product
              </h4>
            </Link>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-md">
            {data.length === 0 ? (
              <h1>No Data Found</h1>
            ) : (
              <>
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      {columns.map((col, i) => (
                        <th key={i} scope="col" className="px-4 py-3 w-20">
                          {col.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {records?.map((product, index) => (
                      <tr key={product._id} className="border-b">
                        <td className="px-4 py-3">{index + 1 + firstIndex}</td>
                        <td className="flex items-center space-x-3 px-4 py-3 font-medium whitespace-nowrap">
                          <img
                            src={product.inventoryProductImageUrl}
                            alt={product.inventoryProductName}
                            className="p-1 w-8 h-8"
                          />
                          {product.inventoryProductName}
                        </td>
                        <td className="px-4 py-3">
                          {product?.inventoryProductSKUCode}
                        </td>
                        <td className="px-4 py-3">
                          {product?.inventoryProductUnit?.inventoryUnitName}
                        </td>
                        <td className="px-4 py-3">
                          {product?.inventoryProductQuantity}
                        </td>
                        <td className="px-4 py-3">
                          {product?.inventoryCategory?.inventoryCategoryName}
                        </td>
                        <td className="px-4 py-3">
                          <ToggleButton
                            value={isStatusActive(
                              product.inventoryProductStatus
                            )}
                            onToggle={() =>
                              handleToggleStatus(
                                product._id,
                                product.inventoryProductStatus
                              )
                            }
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-center p-1 space-x-2">
                            <Link to={`/product/update/${product._id}`}>
                              <small className="px-2 bg-green-100 border border-green-600 rounded-sm hover:bg-green-200">
                                Edit
                              </small>
                            </Link>
                            <Link to={`/product/view/${product._id}`}>
                              <small className="px-2 bg-blue-100 border border-blue-600 rounded-sm hover:bg-blue-200">
                                View
                              </small>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <nav className="flex justify-center space-x-2 my-4">
                  <button
                    onClick={handlePrevPage}
                    className={`px-4 py-2 bg-gray-200 rounded-md transition ${
                      currentPage === 1
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-300"
                    }`}
                    disabled={currentPage === 1}
                  >
                    Prev
                  </button>
                  {pageNumbers.map((n) => (
                    <button
                      key={n}
                      onClick={() => setCurrentPageHandler(n)}
                      className={`px-4 py-2 rounded-md transition ${
                        currentPage === n
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                  <button
                    onClick={handleNextPage}
                    className={`px-4 py-2 bg-gray-200 rounded-md transition ${
                      currentPage === npage
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-300"
                    }`}
                    disabled={currentPage === npage}
                  >
                    Next
                  </button>
                </nav>
              </>
            )}
          </div>
        </div>
      )}
      <ToastContainer />
    </Layout>
  );
}
