import { useEffect, useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import BreadCrumb from "../common/Breadcrumb";
import Layout from "../layout";
import Loading from "../common/Loading";
import { getCategoryFunction } from "../../Services/Apis";
import "react-toastify/dist/ReactToastify.css";

export default function GetCategories() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 20;
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

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getCategoryFunction(categoryName);

      if (response.status === 200) {
        setData(response.data.categories || []);
      }
    } catch (error) {
      console.error("Error fetching Products:", error);
    } finally {
      setLoading(false);
    }
  }, [categoryName]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

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
      { name: "Category ID", width: "100px" },
      { name: "Category Name", width: "300px" },
      { name: "Category Image", width: "150px" },
      {
        name: "Actions",
        width: "200px",
      },
    ],
    []
  );

  return (
    <Layout>
      {loading ? (
        <Loading />
      ) : (
        <div className="container px-4 mx-auto md:px-8">
          <BreadCrumb pageName="Categories" />
          <div className="border w-fit mb-7">
            <Link to="/add-categories">
              <h4 className="p-2 text-center text-white bg-black hover:bg-white hover:text-black transition duration-500">
                Add New Category
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
                    {records?.map((category, index) => (
                      <tr key={category._id} className="border-b">
                        <td className="px-4 py-3">{index + 1 + firstIndex}</td>
                        <td className="px-4 py-3">{category?._id}</td>
                        <td className="px-4 py-3 font-medium">
                          {category?.inventoryCategoryName}
                        </td>
                        <td className="px-4 py-3">
                          {category?.inventoryCategoryImageUrl && (
                            <img
                              src={category?.inventoryCategoryImageUrl}
                              alt=""
                              className="size-24"
                            />
                          )}
                        </td>

                        <td className="px-4 py-3">
                          <div className="grid gap-2">
                            <Link to={`/edit-categories/${category._id}`}>
                              <small className="px-2 bg-green-100 border border-green-600 rounded-sm hover:bg-green-200">
                                Edit
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
    </Layout>
  );
}
