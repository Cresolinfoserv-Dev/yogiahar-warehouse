import { useEffect, useState, useMemo, useCallback } from "react";
import BreadCrumb from "../../common/Breadcrumb";
import Layout from "../../layout";
import { getProductsFunction } from "../../../Services/Apis";
import Loading from "../../common/Loading";
import AddStockModel from "./AddStockModel";
import GetStockModel from "./GetStockModel";

export default function InStock() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(20);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleGetStock, setModalVisibleGetStock] = useState(false);
  const [productId, setProductId] = useState("");
  const categoryName = sessionStorage.getItem("role");
  const [stock, setStock] = useState([]);

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

  const handleClick = (id) => {
    setProductId(id);
    setModalVisible(true);
  };

  const npage = useMemo(
    () => Math.ceil(data.length / rowsPerPage),
    [data.length, rowsPerPage]
  );
  const records = useMemo(() => {
    const lastIndex = currentPage * rowsPerPage;
    const firstIndex = lastIndex - rowsPerPage;
    return data.slice(firstIndex, lastIndex);
  }, [data, currentPage, rowsPerPage]);

  const changePage = (page) => {
    if (page >= 1 && page <= npage) setCurrentPage(page);
  };

  const columns = [
    { name: "ID", width: "100px" },
    { name: "Product Name", width: "300px" },
    { name: "SKU", width: "150px" },
    { name: "Category", width: "150px" },
    { name: "Unit", width: "150px" },
    { name: "Quantity", width: "150px" },
    { name: "Actions", width: "200px" },
  ];

  useEffect(() => {
    const storedStock = localStorage.getItem("stockData");
    if (storedStock) {
      setStock(JSON.parse(storedStock));
    }
  }, []);

  const handleClickGetStock = () => {
    if (stock?.product?.length > 0) {
      setModalVisibleGetStock(true);
    } else {
      console.error("No stock available to send");
    }
  };

  return (
    <Layout>
      {loading ? (
        <Loading />
      ) : (
        <div className="container px-4 mx-auto mt-4 md:px-8">
          <BreadCrumb pageName="In Stock" />

          <div className="border w-fit mb-7">
            <button
              onClick={() => handleClickGetStock()}
              style={{
                cursor: stock?.product?.length > 0 ? "pointer" : "not-allowed",
              }}
            >
              <h4
                className={
                  stock?.product?.length > 0
                    ? "p-2 text-center text-white bg-black hover:bg-white hover:text-black hover:duration-500 w-fit"
                    : "p-2 text-center text-gray-400 bg-gray-200 cursor-not-allowed w-fit"
                }
              >
                Add Stock
              </h4>
            </button>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-md">
            {data.length === 0 ? (
              <div>
                <h1>No Data Found</h1>
              </div>
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
                  <tbody>
                    {records.map((value, index) => (
                      <tr
                        key={value._id}
                        className="border-b border-gray-300 dark:border-slate-700"
                      >
                        <td className="px-4 py-3">
                          {index + 1 + (currentPage - 1) * rowsPerPage}
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
                          {value.inventoryProductSKUCode}
                        </td>
                        <td className="px-4 py-3">
                          {value.inventoryCategory?.inventoryCategoryName}
                        </td>
                        <td className="px-4 py-3">
                          {value.inventoryProductUnit?.inventoryUnitName}
                        </td>
                        <td className="px-4 py-3 text-green-500">
                          {value.inventoryProductQuantity}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleClick(value._id)}
                            className="px-4 py-2 font-medium text-white bg-green-600 rounded-md shadow-md hover:bg-blue-700 transition"
                          >
                            Add Stock
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <nav className="flex justify-center space-x-2 my-4">
                  <button
                    onClick={() => changePage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition ${
                      currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
                    }`}
                  >
                    Prev
                  </button>
                  {Array.from({ length: npage }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => changePage(page)}
                        className={`px-4 py-2 rounded-md transition ${
                          currentPage === page
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 hover:bg-gray-300"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                  <button
                    onClick={() => changePage(currentPage + 1)}
                    disabled={currentPage === npage}
                    className={`px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition ${
                      currentPage === npage
                        ? "cursor-not-allowed opacity-50"
                        : ""
                    }`}
                  >
                    Next
                  </button>
                </nav>
              </>
            )}
          </div>
          {modalVisible && (
            <AddStockModel
              productId={productId}
              showModal={modalVisible}
              setShowModal={setModalVisible}
              fetchProducts={fetchProducts}
            />
          )}

          {modalVisibleGetStock && (
            <GetStockModel
              showModal={modalVisibleGetStock}
              setShowModal={setModalVisibleGetStock}
            />
          )}
        </div>
      )}
    </Layout>
  );
}
