import { useState, useEffect, useCallback } from "react";
import { sendStockFunction } from "../../../Services/Apis";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useSocket } from "../../../Context/SocketProvider";

const SendStock = ({ showModal, setShowModal, fetchProducts }) => {
  const [loading, setLoading] = useState(false);
  const [stockData, setStockData] = useState([]);
  const categoryName = sessionStorage.getItem("role");
  const socket = useSocket();

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
  }, [showModal]);

  const handleDeleteStock = (index) => {
    const updatedStock = stockData.filter((_, i) => i !== index);
    setStockData(updatedStock);
    localStorage.setItem("stock", JSON.stringify(updatedStock));
  };

  const handleSubmit = async () => {
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
      });

      if (response.status === 200) {
        handleAction({ orderId: response?.data?.orderID, role: sentTo });
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
