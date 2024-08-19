import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import BreadCrumb from "../../common/Breadcrumb";
import Layout from "../../layout";
import { getProductsFunction } from "../../../Services/Apis";
import Loading from "../../common/Loading";
import AddStockModel from "./AddStockModel";

export default function InStock() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isGet, setIsGet] = useState(false);
  const [productId, setProductId] = useState("");
  const categoryName = sessionStorage.getItem("role");
  console.log(data);

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

  const handleClick = (id) => {
    setProductId(id);
    setModalVisible(true);
    setIsGet(true);
  };

  const columns = [
    {
      name: "ID",
      selector: (row, index) => (currentPage - 1) * rowsPerPage + index + 1,

      width: "100px",
    },
    {
      name: "Product Name",
      selector: (rows) => (
        <div className="flex items-center space-x-3">
          <img
            src={rows.inventoryProductImageUrl}
            alt={rows.name}
            className="p-1 w-24 h-24"
          />
          <p>{rows.inventoryProductName}</p>
        </div>
      ),

      width: "300px",
    },
    {
      name: "SKU",
      selector: (rows) => (
        <p className="uppercase">{rows.inventoryProductSKUCode}</p>
      ),
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

      width: "150px",
    },
    {
      name: "Quantity",
      selector: (rows) => (
        <p className="text-green-500">{`${rows.inventoryProductQuantity}`}</p>
      ),

      width: "150px",
    },
    {
      name: "Actions",
      selector: (rows) => (
        <div className="flex justify-center space-x-2">
          <div className="border w-fit mb-7">
            <div onClick={() => handleClick(rows._id)}>
              <h4 className="p-2 text-center text-white bg-black hover:bg-white hover:text-black hover:duration-500 w-fit">
                Add Stock
              </h4>
            </div>
          </div>
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
          <BreadCrumb pageName="In Stock" />

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

          {isGet && (
            <AddStockModel
              productId={productId}
              showModal={modalVisible}
              setShowModal={setModalVisible}
              fetchProducts={fetchProducts}
            />
          )}
        </div>
      )}
    </Layout>
  );
}
