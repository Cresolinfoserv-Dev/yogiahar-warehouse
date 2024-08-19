import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import BreadCrumb from "../common/Breadcrumb";
import Layout from "../layout";
import { getStockOrdersFunction } from "../../Services/Apis";
import Loading from "../common/Loading";

export default function CompleteOrders() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const categoryName = sessionStorage.getItem("role");

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

  const columns = [
    {
      name: "ID",
      selector: (row, index) => (currentPage - 1) * rowsPerPage + index + 1,
      sortable: true,
      width: "100px",
    },
    {
      name: "Order Id",
      selector: (row) => <p className="uppercase">{row._id}</p>,
      sortable: true,
    },
    {
      name: "Products",
      selector: (row) => (
        <div className="p-2 space-y-2 bg-white rounded-lg shadow-md">
          {row.products.map((product) => (
            <div
              key={
                product.productID?._id ||
                product.productID?.inventoryProductName
              }
            >
              {product.productID?.inventoryProductName} - {product.sendQuantity}{" "}
              ({product.productID?.inventoryProductUnit?.inventoryUnitName})
            </div>
          ))}
        </div>
      ),
    },
    {
      name: "Sent To",
      cell: (row) => <p>{row.sentTo}</p>,
      sortable: true,
    },
    {
      name: "Order Status",
      cell: (row) => <p>{row.orderStatus}</p>,
      sortable: true,
    },
    {
      name: "Completion Time",
      selector: (row) => <p>{formatDate(row.updatedAt)}</p>,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex justify-center p-1 space-x-2">
          <Link to={`/view-order/${row._id}`}>
            <small className="px-2 bg-blue-100 border border-blue-600 rounded-sm hover:bg-blue-200 cursor-pointer">
              View
            </small>
          </Link>
        </div>
      ),
      sortable: true,
      width: "200px",
    },
  ];

  return (
    <Layout>
      {loading ? (
        <Loading />
      ) : (
        <div className="container px-4 mx-auto mt-4 md:px-8">
          <BreadCrumb pageName="Completed Orders" />
          <div className="p-4 bg-white rounded-lg shadow-md">
            <DataTable
              columns={columns}
              data={data}
              pagination
              paginationPerPage={rowsPerPage}
              paginationRowsPerPageOptions={[10, 20, 50]}
              paginationComponentOptions={{
                rowsPerPageText: "Rows per page:",
                rangeSeparatorText: "of",
                selectAllRowsItem: true,
                selectAllRowsItemText: "All",
              }}
              onChangePage={setCurrentPage}
              onChangeRowsPerPage={setRowsPerPage}
              noHeader
              responsive
              className="text-base"
              theme="solarized"
            />
          </div>
        </div>
      )}
    </Layout>
  );
}
