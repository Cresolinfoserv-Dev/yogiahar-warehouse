import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import BreadCrumb from "../../common/Breadcrumb";
import Layout from "../../layout";
import { getProductsFunction } from "../../../Services/Apis";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "../../common/Loading";
import SendStock from "./SendStock";

export default function OutStock() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [productId, setProductId] = useState(null);
  const [editingRowId, setEditingRowId] = useState(null);
  const categoryName = sessionStorage.getItem("role");

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

  const fetchProducts = async () => {
    setLoading(true);

    try {
      const response = await getProductsFunction(categoryName);

      if (response.status === 200) {
        setData(response?.data?.products);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching Products:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const paginationOptions = {
    rowsPerPageText: "Rows per page:",
    rangeSeparatorText: "of",
    selectAllRowsItem: true,
    selectAllRowsItemText: "All",
  };

  const columns = [
    {
      name: "ID",
      selector: (row, index) => (currentPage - 1) * rowsPerPage + index + 1,
      sortable: true,
      width: "100px",
    },
    {
      name: "Product Name",
      selector: (rows) => (
        <div className="flex items-center space-x-3">
          <img
            src={rows.inventoryProductImageUrl}
            alt={rows.inventoryProductName}
            className="w-20 h-20 p-1"
          />
          <p>{rows.inventoryProductName}</p>
        </div>
      ),
      sortable: true,
      width: "300px",
    },
    {
      name: "SKU",
      selector: (rows) => (
        <p className="uppercase">{rows.inventoryProductSKUCode}</p>
      ),
      sortable: true,
      width: "150px",
    },
    {
      name: "Category",
      selector: (rows) => <p className="uppercase">{rows.inventoryCategory}</p>,
      width: "150px",
    },
    {
      name: "Unit",
      selector: (rows) => (
        <p className="uppercase">
          {rows?.inventoryProductUnit?.inventoryUnitName}
        </p>
      ),
      sortable: true,
      width: "150px",
    },
    {
      name: "Current Quantity",
      selector: (rows) => (
        <p className="text-green-500">{`${rows.inventoryProductQuantity}`}</p>
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
                type="number"
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
                  onClick={() => handleCancelEdit()}
                  className="p-2 text-white bg-red-500 hover:bg-white hover:text-red-500 hover:duration-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => {
                setProductId(row._id);
                setEditingRowId(row._id);
              }}
              className="p-2 text-center text-white bg-black hover:bg-white hover:text-black hover:duration-500 w-fit"
            >
              Out Stock
            </button>
          )}
        </div>
      ),
      width: "200px",
    },
  ];

  const handleAddStock = (row) => {
    const {
      _id,
      inventoryProductName,
      inventoryProductQuantity,
      inventoryProductUnit,
    } = row;

    const enteredQuantity = parseFloat(quantity);

    if (!enteredQuantity || enteredQuantity < 0.1) {
      notifyError(
        "Please enter a valid quantity greater than or equal to 0.1."
      );
      return;
    }

    if (productId === _id) {
      if (enteredQuantity > inventoryProductQuantity) {
        notifyError("Insufficient stock available.");
        return;
      }

      if (isNaN(enteredQuantity)) {
        notifyError("Please enter a valid quantity.");
        return;
      }

      const roleData = sessionStorage.getItem("role");

      const stockData = {
        role: roleData,
        quantity: enteredQuantity,
        productId,
        productName: inventoryProductName,
        unit: inventoryProductUnit.inventoryUnitName,
      };

      let existingStock = JSON.parse(localStorage.getItem("stock")) || [];
      const existingProductIndex = existingStock.findIndex(
        (item) => item.productId === productId
      );

      if (existingProductIndex !== -1) {
        existingStock[existingProductIndex].quantity = enteredQuantity;
      } else {
        existingStock.push(stockData);
      }

      localStorage.setItem("stock", JSON.stringify(existingStock));

      setQuantity("");
      setEditingRowId(null);

      notifySuccess("Stock data saved successfully!");
    } else {
      notifyError("Please enter a valid quantity.");
    }
  };

  const handleCancelEdit = () => {
    setQuantity("");
    setEditingRowId(null);
  };

  const handleSendStock = () => {
    setModalVisible(true);
  };

  const storedStock = JSON.parse(localStorage.getItem("stock"));

  return (
    <Layout>
      {loading ? (
        <Loading />
      ) : (
        <div className="container px-4 mx-auto mt-4 md:px-8">
          <BreadCrumb pageName="Out Stock" />

          <div className="border w-fit mb-7">
            <div
              onClick={storedStock?.length > 0 ? handleSendStock : undefined}
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
            </div>
          </div>

          <div className="p-4 bg-white rounded-lg shadow-md">
            <DataTable
              columns={columns}
              data={data}
              pagination
              paginationPerPage={10}
              paginationRowsPerPageOptions={[10, 20, 50]}
              paginationComponentOptions={paginationOptions}
              onChangePage={(page) => setCurrentPage(page)}
              onChangeRowsPerPage={(perPage) => setRowsPerPage(perPage)}
              noHeader
              responsive
              className="text-base"
              theme="solarized"
            />
          </div>

          {modalVisible && (
            <SendStock
              showModal={modalVisible}
              setShowModal={setModalVisible}
              fetchProducts={fetchProducts}
            />
          )}
          <ToastContainer />
        </div>
      )}
    </Layout>
  );
}
