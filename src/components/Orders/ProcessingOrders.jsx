import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
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

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await getStockOrdersFunction(categoryName);

      if (response.status === 200) {
        setData(response.data.processingOrders);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching Products:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderStatus = async (id, orderStatus) => {
    try {
      const response = await changeOrderStatusByID(id, { orderStatus });
      if (response.status === 200) {
        fetchOrders();
        notifySuccess("Order Status updated");
      }
    } catch (error) {
      notifyError("Failed to change the order status");
      console.error("Error changing order status:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const paginationOptions = {
    rowsPerPageText: "Rows per page:",
    rangeSeparatorText: "of",
    selectAllRowsItem: true,
    selectAllRowsItemText: "All",
  };

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

  const columns = [
    {
      name: "ID",
      selector: (row, index) => (currentPage - 1) * rowsPerPage + index + 1,
      sortable: true,
      width: "100px",
    },
    {
      name: "Order Id",
      selector: (rows) => <p className="uppercase">{rows._id}</p>,
      sortable: true,
    },
    {
      name: "Products",
      selector: (row) => (
        <div className="p-2 space-y-2 bg-white rounded-lg shadow-md">
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
      selector: (rows) => <p className="uppercase">{rows.sentTo}</p>,
      sortable: true,
    },
    {
      name: "Order Status",
      cell: (rows) => (
        <div className="relative">
          <select
            value={rows.orderStatus}
            onChange={(e) => handleOrderStatus(rows._id, e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">Select an Option</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      ),
      sortable: true,
    },
    {
      name: "Created Time",
      selector: (rows) => <p>{formatDate(rows.createdAt)}</p>,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (rows) => (
        <div className="flex justify-center p-1 space-x-2">
          <Link to={`/view-order/${rows._id}`}>
            <small className="px-2 bg-blue-100 border border-blue-600 rounded-sm hover:bg-blue-200 hover:cursor-pointer">
              View
            </small>
          </Link>
        </div>
      ),
      width: "200px",
    },
  ];

  return (
    <Layout>
      {loading ? (
        <Loading />
      ) : (
        <div className="container px-4 mx-auto mt-4 md:px-8">
          <BreadCrumb pageName="Processing Orders" />

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
          <ToastContainer />
        </div>
      )}
    </Layout>
  );
}
