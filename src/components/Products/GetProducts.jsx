import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import BreadCrumb from "../common/Breadcrumb";
import Layout from "../layout";
import { getProductsFunction } from "../../Services/Apis";
import Loading from "../common/Loading";

export default function GetProducts() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const categoryName = sessionStorage.getItem("role");

  const fetchProducts = async () => {
    setLoading(true);

    try {
      const response = await getProductsFunction(categoryName);

      if (response.status === 200) {
        setData(response.data.products);
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
            alt={rows.name}
            width="80px"
            className="p-1"
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
      name: "Quantity",
      selector: (rows) => (
        <p className="text-green-500">{`${rows.inventoryProductQuantity}`}</p>
      ),
      sortable: true,
      width: "150px",
    },
    {
      name: "Category",
      selector: (rows) => <p className="">{rows.inventoryCategory}</p>,
      sortable: true,
      width: "150px",
    },
    {
      name: "Actions",
      selector: (rows) => (
        <div className="flex justify-center p-1 space-x-2">
          <Link to={`/product/update/${rows._id}`}>
            <small className="px-2 bg-green-100 border border-green-600 rounded-sm hover:bg-green-200 hover:cursor-pointer">
              Edit
            </small>
          </Link>
          <Link to={`/product/view/${rows._id}`}>
            <small className="px-2 bg-blue-100 border border-blue-600 rounded-sm hover:bg-blue-200 hover:cursor-pointer">
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
        <div className="container px-4 mx-auto md:px-8">
          <BreadCrumb pageName="Products" />
          <div className="border w-fit mb-7">
            <Link to="/product/add">
              <h4 className="p-2 text-center text-white bg-black hover:bg-white hover:text-black hover:duration-500 w-fit">
                Add New Product
              </h4>
            </Link>
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
        </div>
      )}
    </Layout>
  );
}
