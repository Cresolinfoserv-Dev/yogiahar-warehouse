import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import BreadCrumb from "../common/Breadcrumb";
import Layout from "../layout";
import { getUnitsFunction } from "../../Services/Apis";
import "react-toastify/dist/ReactToastify.css";
import Loading from "../common/Loading";

export default function GetQuantity() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const paginatedData = useMemo(() => {
    const firstIndex = (currentPage - 1) * recordsPerPage;
    return data.slice(firstIndex, firstIndex + recordsPerPage);
  }, [data, currentPage, recordsPerPage]);

  const totalPages = useMemo(
    () => Math.ceil(data.length / recordsPerPage),
    [data.length, recordsPerPage]
  );

  const fetchUnits = async () => {
    setLoading(true);
    try {
      const response = await getUnitsFunction();
      if (response.status === 200) {
        setData(response.data.units || []);
      }
    } catch (error) {
      console.error("Error fetching units:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnits();
  }, []);

  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const setPage = (page) => setCurrentPage(page);

  const columns = useMemo(
    () => [
      {
        name: "ID",
        selector: (_, index) => (currentPage - 1) * recordsPerPage + index + 1,
        width: "100px",
      },
      {
        name: "Units Name",
        selector: (row) => <p className="uppercase">{row.inventoryUnitName}</p>,
        width: "150px",
      },
      {
        name: "Actions",
        selector: (row) => (
          <Link to={`/update-quantity/${row._id}`}>
            <button className="px-2 bg-green-100 border border-green-600 rounded-sm hover:bg-green-200">
              Edit
            </button>
          </Link>
        ),
        width: "150px",
      },
    ],
    [currentPage, recordsPerPage]
  );

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
                      {columns.map((col, i) => (
                        <th key={i} className="px-4 py-3 w-20">
                          {col.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.map((row, index) => (
                      <tr key={row._id} className="border-b border-gray-300">
                        <td className="px-4 py-3">
                          {columns[0].selector(row, index)}
                        </td>
                        <td className="px-4 py-3">
                          {columns[1].selector(row)}
                        </td>
                        <td className="px-4 py-3">
                          {columns[2].selector(row)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex justify-center my-4 space-x-2">
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 bg-gray-200 rounded-md transition ${
                      currentPage === 1 ? "opacity-50" : "hover:bg-gray-300"
                    }`}
                  >
                    Prev
                  </button>
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => setPage(index + 1)}
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
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 bg-gray-200 rounded-md transition ${
                      currentPage === totalPages
                        ? "opacity-50"
                        : "hover:bg-gray-300"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}
