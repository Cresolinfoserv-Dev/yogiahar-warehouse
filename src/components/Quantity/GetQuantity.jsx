import { useEffect, useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import BreadCrumb from "../common/Breadcrumb";
import Layout from "../layout";
import {
  getUnitsFunction,
  unitStatusUpdateFunction,
} from "../../Services/Apis";
import "react-toastify/dist/ReactToastify.css";
import Loading from "../common/Loading";
import ToggleButton from "react-toggle-button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function GetQuantity() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 20;
  const categoryName = sessionStorage.getItem("role");

  useEffect(() => {
    fetchUnits();
  }, []);

  const fetchUnits = async () => {
    setLoading(true);
    try {
      const response = await getUnitsFunction(categoryName);
      if (response.status === 200) {
        setData(response.data.units || []);
      } else {
        notifyError("Failed to fetch units.");
      }
    } catch (error) {
      console.error("Error fetching units:", error);
      notifyError("Error fetching units.");
    } finally {
      setLoading(false);
    }
  };

  const paginatedData = useMemo(() => {
    const firstIndex = (currentPage - 1) * recordsPerPage;
    return data.slice(firstIndex, firstIndex + recordsPerPage);
  }, [data, currentPage]);

  const totalPages = useMemo(
    () => Math.ceil(data.length / recordsPerPage),
    [data.length]
  );

  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage);
  }, []);

  const handleToggleStatus = useCallback(async (id, status) => {
    const authToken = sessionStorage.getItem("adminToken");
    const headers = { Authorization: authToken };
    const newStatus = status === "Active" ? "Inactive" : "Active";

    try {
      const response = await unitStatusUpdateFunction(
        id,
        { newStatus },
        headers
      );
      if (response.status === 200) {
        notifySuccess("Unit Status Updated!");
        fetchUnits();
      } else {
        notifyError("Failed to update status.");
      }
    } catch (error) {
      console.error("Error updating unit status:", error);
      notifyError("Error updating unit status.");
    }
  }, []);

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

  const isStatusActive = useCallback((status) => status === "Active", []);

  const renderPaginationButtons = () => (
    <div className="flex justify-center my-4 space-x-2">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-4 py-2 bg-gray-200 rounded-md transition ${
          currentPage === 1 ? "opacity-50" : "hover:bg-gray-300"
        }`}
      >
        Prev
      </button>
      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index}
          onClick={() => handlePageChange(index + 1)}
          className={`px-4 py-2 rounded-md transition ${
            currentPage === index + 1
              ? "bg-blue-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          {index + 1}
        </button>
      ))}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 bg-gray-200 rounded-md transition ${
          currentPage === totalPages ? "opacity-50" : "hover:bg-gray-300"
        }`}
      >
        Next
      </button>
    </div>
  );

  const renderTableRows = () =>
    paginatedData.map((row, index) => (
      <tr key={row._id} className="border-b border-gray-300">
        <td className="px-4 py-3">
          {(currentPage - 1) * recordsPerPage + index + 1}
        </td>
        <td className="px-4 py-3 uppercase">{row.inventoryUnitName}</td>
        {categoryName === "Boutique" && (
          <td className="px-4 py-3">
            <ToggleButton
              value={isStatusActive(row.inventoryUnitStatus)}
              onToggle={() =>
                handleToggleStatus(row._id, row.inventoryUnitStatus)
              }
            />
          </td>
        )}
        <td className="px-4 py-3">
          <Link to={`/update-quantity/${row._id}`}>
            <button className="px-2 bg-green-100 border border-green-600 rounded-sm hover:bg-green-200">
              Edit
            </button>
          </Link>
        </td>
      </tr>
    ));

  return (
    <Layout>
      {loading ? (
        <Loading />
      ) : (
        <div className="container px-4 mx-auto md:px-8">
          <BreadCrumb pageName="Unit" />
          <div className="mb-7">
            <Link to="/add-quantity">
              <button className="p-2 text-white bg-black hover:bg-white hover:text-black border hover:duration-500">
                Add New Unit
              </button>
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
                      <th className="px-4 py-3 w-20">ID</th>
                      <th className="px-4 py-3 w-20">Units Name</th>
                      {categoryName === "Boutique" && (
                        <th className="px-4 py-3 w-20">Status</th>
                      )}
                      <th className="px-4 py-3 w-20">Actions</th>
                    </tr>
                  </thead>
                  <tbody>{renderTableRows()}</tbody>
                </table>
                {renderPaginationButtons()}
              </>
            )}
          </div>
          <ToastContainer />
        </div>
      )}
    </Layout>
  );
}
