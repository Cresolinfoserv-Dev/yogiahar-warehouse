import { useState, useEffect, useCallback } from "react";
import {
  getBoutiqueEmployeesFunction,
  getCafeEmployeesFunction,
  sendStockFunction,
} from "../../../Services/Apis";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useSocket } from "../../../Context/SocketProvider";

const SendStock = ({ showModal, setShowModal, fetchProducts }) => {
  const [loading, setLoading] = useState(false);
  const [stockData, setStockData] = useState([]);
  const [selectedBoutique, setSelectedBoutique] = useState("");
  const [selectedCafe, setSelectedCafe] = useState("");
  const categoryName = sessionStorage.getItem("role");
  const socket = useSocket();
  const [boutiqueData, setBoutiqueData] = useState([]);
  const [cafeData, setCafeData] = useState([]);

  const fetchBoutiqueEmployees = async () => {
    setLoading(true);
    try {
      const response = await getBoutiqueEmployeesFunction();
      if (response.status === 200) {
        setLoading(false);
        setBoutiqueData(response?.data?.boutiques);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching boutique employees:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCafeEmployees = async () => {
    setLoading(true);
    try {
      const response = await getCafeEmployeesFunction();
      if (response.status === 200) {
        setLoading(false);
        setCafeData(response?.data?.cafe);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching boutique employees:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = useCallback(
    (action) => {
      socket.emit("wareHouseAction", action);
    },
    [socket]
  );

  useEffect(() => {
    const storedStock = JSON.parse(localStorage.getItem("stock")) || [];
    const roleData = storedStock.map((r) => r.role);
    const secondRole = sessionStorage.getItem("role");

    if (roleData.includes(secondRole)) {
      setStockData(storedStock);
    }
    fetchBoutiqueEmployees();
    fetchCafeEmployees();
  }, [showModal]);

  const handleDeleteStock = (index) => {
    const updatedStock = stockData.filter((_, i) => i !== index);
    setStockData(updatedStock);
    localStorage.setItem("stock", JSON.stringify(updatedStock));
  };

  const handleSubmit = async () => {
    if (categoryName === "Boutique" && !selectedBoutique) {
      toast.error("please select boutique");
      return;
    }

    if (categoryName === "Cafe" && !selectedCafe) {
      toast.error("please select cafe");
      return;
    }

    setLoading(true);
    const sentTo =
      categoryName === "Boutique"
        ? "Boutique"
        : categoryName === "Cafe"
        ? "Cafe"
        : "Kitchen";

    try {
      const response = await sendStockFunction({
        product: stockData,
        sentTo,
        type: categoryName,
        stockType: "Out",
        store:
          categoryName === "Boutique"
            ? selectedBoutique
            : categoryName === "Cafe"
            ? selectedCafe
            : "",
      });

      if (response.status === 200) {
        handleAction({
          orderId: response?.data?.orderID,
          role: sentTo,
          store:
            categoryName === "Boutique"
              ? selectedBoutique
              : categoryName === "Cafe"
              ? selectedCafe
              : "",
        });
        toast.success("Stock updated successfully");
        localStorage.removeItem("stock");
        fetchProducts();
        setShowModal(false);
      } else {
        toast.error(response?.response?.data?.message);
      }
    } catch (error) {
      console.error("Error updating stock:", error);
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg">
            {stockData.length === 0 ? (
              <div>
                <p className="text-lg font-semibold">No Data Found</p>
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-lg font-semibold">Send Stock</h2>
                <div>
                  {stockData?.map((item, index) => (
                    <div key={index} className="flex justify-between p-2 gap-5">
                      <h2 className="font-bold">{item.productName}</h2>
                      <span>
                        Quantity: {item.quantity} ({item.unit})
                      </span>
                      <button
                        onClick={() => handleDeleteStock(index)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        <RiDeleteBin6Line />
                      </button>
                    </div>
                  ))}
                </div>

                {categoryName === "Boutique" && (
                  <div className="mt-4">
                    <label
                      htmlFor="boutique"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Select Boutique:
                    </label>
                    <select
                      id="boutique"
                      value={selectedBoutique}
                      onChange={(e) => setSelectedBoutique(e.target.value)}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select a boutique</option>
                      {boutiqueData.map((boutique) => (
                        <option key={boutique._id} value={boutique.storeType}>
                          {boutique.storeType}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {categoryName === "Cafe" && (
                  <div className="mt-4">
                    <label
                      htmlFor="cafe"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Select Cafe:
                    </label>
                    <select
                      id="cafe"
                      value={selectedCafe}
                      onChange={(e) => setSelectedCafe(e.target.value)}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select a Cafe</option>
                      {cafeData.map((cafe) => (
                        <option key={cafe._id} value={cafe.storeType}>
                          {cafe.storeType}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="flex space-x-4 mt-4">
                  <button
                    onClick={handleSubmit}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                  >
                    {loading ? "Submitting..." : "Submit"}
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

SendStock.propTypes = {
  showModal: PropTypes.bool.isRequired,
  setShowModal: PropTypes.func.isRequired,
  fetchProducts: PropTypes.func.isRequired,
};

export default SendStock;
