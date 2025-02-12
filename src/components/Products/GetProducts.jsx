import { useEffect, useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import BreadCrumb from "../common/Breadcrumb";
import Layout from "../layout";
import {
  createBilkProductsFunction,
  getProductsFunction,
} from "../../Services/Apis";
import Loading from "../common/Loading";
import "react-toastify/dist/ReactToastify.css";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function GetProducts() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search, setSearch] = useState("");

  const recordsPerPage = 50;
  const categoryName = sessionStorage.getItem("role");
  const authToken = sessionStorage.getItem("adminToken");
  const [bulkUploadError, setBulkUploadError] = useState("");
  const [copies, setCopies] = useState({});
  const role = sessionStorage.getItem("role");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const notifySuccess = () => {
    toast.success("Product Added successfully!", {
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

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const lowerSearch = search.toLowerCase();
      setFilteredProducts(
        data.filter(
          (product) =>
            product.inventoryProductName.toLowerCase().includes(lowerSearch) ||
            product.inventoryBarCodeId?.toLowerCase().includes(lowerSearch)
        )
      );
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [search, data]);

  const lastIndex = useMemo(() => currentPage * recordsPerPage, [currentPage]);
  const firstIndex = useMemo(() => lastIndex - recordsPerPage, [lastIndex]);
  const records = useMemo(
    () => filteredProducts.slice(firstIndex, lastIndex),
    [filteredProducts, firstIndex, lastIndex]
  );

  const npage = useMemo(
    () => Math.ceil(data.length / recordsPerPage),
    [data.length]
  );
  const pageNumbers = useMemo(
    () => [...Array(npage).keys()].map((n) => n + 1),
    [npage]
  );

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getProductsFunction(categoryName);

      if (response.status === 200) {
        const sortedProducts = (response?.data?.products || []).sort(
          (a, b) => Number(a.inventoryBarCodeId) - Number(b.inventoryBarCodeId)
        );
        setData(sortedProducts);
      }
    } catch (error) {
      console.error("Error fetching Products:", error);
      setLoading(false);
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
      { name: "ID", width: "80px" },
      { name: "Product Name", width: "200px" },
      { name: "Product Code", width: "100px" },

      { name: "Unit", width: "150px" },
      { name: "Quantity", width: "150px" },
      { name: "Category", width: "150px" },
      {
        name: "Actions",
        width: "200px",
      },
    ],
    []
  );

  const onSubmit = async (data) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("bulkFile", data.bulkFile[0]);

    const headers = {
      Authorization: `${authToken}`,
      "Content-Type": "multipart/form-data",
    };

    try {
      const response = await createBilkProductsFunction(formData, headers);
      if (response.status === 200) {
        notifySuccess();
        setLoading(false);
        fetchProducts();
      } else if (response.response.status === 422) {
        setLoading(false);
        fetchProducts();
        setBulkUploadError(response.response?.data?.message);
      }
    } catch (error) {
      setLoading(false);
      notifyError("Failed to upload file");
      console.error("Bulk Product creation error:", error);
    }
  };

  const handlePrint = async (orderData, copies = 1, labelsPerRow = 3) => {
    const price = orderData?.inventorySellingPrice
      ? orderData.inventorySellingPrice
      : orderData.inventoryCostPrice;
    if (orderData && orderData.inventoryBarCode) {
      const printWindow = window.open("", "PRINT", "height=800,width=800");
      printWindow.document.write(`
          <html>
            <head>
              <style>
               @media print {
      @page {
         size: 107.5mm 22mm;
        margin: 0;
      }
      body {
        margin: 0;
        padding: 0;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        width: ${labelsPerRow * 37}mm;
        height: auto;
      }
      .print-container {
        width: 35mm;
        text-align: center;
        height: 22mm;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-left: 1.7mm;

        overflow: hidden;
        page-break-inside: avoid;
      }
      img {
        width: 18mm;
        height: 9mm;
        object-fit: fill;
        margin: 0;
        padding: 0;
        display: block;
        margin-bottom:1mm;
      }
     small {
    font-size: 9px !important;
    font-weight: bold !important;
    line-height: 1em !important;
    text-align: center;
    width: 30mm;
    display: block;
    word-wrap: break-word;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-height: 16px;
  }
  small:first-child {
    margin-bottom: 1mm;
  }

  small:nth-child(2) {
    margin-bottom: 1mm;
  }

    }

              </style>
            </head>
            <body>
              ${Array.from({ length: copies })
                .map(
                  () => `
                    <div class="print-container">
                      <small>Oneness Shop</small>
                       <small>${orderData?.inventoryProductName}</small>
                      <img src="${orderData?.inventoryBarCode}" alt="barcode" />
                       <small>₹ ${price}</small>
                    </div>
                  `
                )
                .join("")}
            </body>
          </html>
        `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    } else {
      console.warn("No valid order data to print.");
    }
  };

  const handleCopyChange = (productId, value) => {
    setCopies((prev) => ({ ...prev, [productId]: value }));
  };

  return (
    <Layout>
      {loading ? (
        <Loading />
      ) : (
        <div className="container px-4 mx-auto md:px-8">
          <BreadCrumb pageName="Products" />

          <div className="flex justify-between mb-5">
            <div className="flex items-center gap-10">
              <div className="w-fit flex items-end ">
                <Link to="/product/add">
                  <h4 className="p-2 text-center text-white bg-black hover:bg-white hover:text-black transition duration-500">
                    Add New Product
                  </h4>
                </Link>
              </div>
              <div className="grid ">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="p-2 border rounded"
                  placeholder="Search by Name or Code"
                />
              </div>
            </div>

            <div>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex items-end gap-4 w-fit h-fit"
              >
                <div>
                  <label
                    htmlFor="bulkFile"
                    className="block text-sm font-medium text-gray-600"
                  >
                    CSV Upload
                  </label>
                  <input
                    type="file"
                    name="bulkFile"
                    {...register("bulkFile", {
                      required: "File is required",
                      validate: {
                        fileType: (value) => {
                          if (!value?.[0]) return "File is required";
                          const validTypes = ["text/csv"];
                          return validTypes.includes(value[0].type)
                            ? true
                            : "Only CSV is accepted";
                        },
                      },
                    })}
                    className="mt-1 p-2 border w-full bg-white"
                  />
                  {errors.bulkFile && (
                    <small className="text-red-500">
                      {errors.bulkFile.message}
                    </small>
                  )}

                  {bulkUploadError && (
                    <div>
                      <small className="text-red-500 text-center">
                        {bulkUploadError}
                      </small>
                    </div>
                  )}
                </div>

                <div>
                  <button
                    type="submit"
                    className="px-4 py-2 text-white bg-indigo-600 rounded-md"
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-md overflow-x-scroll">
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
                          {product.inventoryProductImageUrl && (
                            <img
                              src={product.inventoryProductImageUrl}
                              alt={product.inventoryProductName}
                              className="p-1 w-8 h-8"
                            />
                          )}
                          {product.inventoryProductName}
                        </td>
                        {role === "Cafe" || role === "Boutique" ? (
                          <td className="px-4 py-3">
                            <img
                              src={product?.inventoryBarCode}
                              alt="barCode"
                              className="w-[100px]"
                            />
                          </td>
                        ) : (
                          <td className="px-4 py-3">
                            {product?.inventoryBarCodeId}
                          </td>
                        )}

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
                          <div className="flex justify-start p-1 space-x-4">
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
                            {(role === "Cafe" || role === "Boutique") && (
                              <div className="flex items-center space-x-2">
                                <input
                                  type="number"
                                  value={copies[product._id] || ""}
                                  onChange={(e) =>
                                    handleCopyChange(
                                      product._id,
                                      e.target.value
                                    )
                                  }
                                  className="w-16 p-1 border rounded"
                                  placeholder="Copies"
                                />
                                <button
                                  onClick={() =>
                                    handlePrint(
                                      product,
                                      copies[product._id] || 1
                                    )
                                  }
                                  className="px-2 bg-red-100 border border-red-600 rounded-sm hover:bg-red-200"
                                >
                                  <small>Print</small>
                                </button>
                              </div>
                            )}
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
    </Layout>
  );
}
