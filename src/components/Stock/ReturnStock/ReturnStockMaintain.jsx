import { useEffect, useState } from "react";
import {
  changeOrderStatusByID,
  sendStockFunction,
} from "../../../Services/Apis";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import { RiDeleteBin6Line } from "react-icons/ri";

export default function ReturnStockMaintain({
  showModal,
  setModalVisible,
  fetchProducts,
}) {
  const [loading, setLoading] = useState(false);
  const [stockData, setStockData] = useState([]);

  console.log(setModalVisible);

  useEffect(() => {
    const storedStock = JSON.parse(localStorage.getItem("returnStock")) || [];
    setStockData(storedStock);
  }, [showModal]);

  const handleDeleteStock = (index) => {
    const updatedStock = stockData.filter((_, i) => i !== index);
    setStockData(updatedStock);
    localStorage.setItem("returnStock", JSON.stringify(updatedStock));
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const response = await sendStockFunction({
        product: stockData,
        sentTo: "Returned",
      });

      if (response.status === 200) {
        let id = response.data.orderID;
        let orderStatus = "Returned";
        const updateOrderStatusRes = await changeOrderStatusByID(id, {
          orderStatus,
        });
        if (updateOrderStatusRes.status === 200) {
          toast.success("Stock updated successfully");
          localStorage.removeItem("returnStock");
          fetchProducts();
          setShowModal(false);
        }
      } else {
        toast.error(response?.response?.data?.message);
      }
    } catch (error) {
      console.error("Error updating stock:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const onClose = () => {
    console.log("ff");
    setModalVisible(false);
  };

  return (
    <div>
      {showModal && stockData.length === 0 ? (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg">
            <p className="text-lg font-semibold">No Data Found</p>
            <button
              onClick={() => onClose}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      ) : (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg">
            <h2 className="text-lg font-semibold">Return Stock</h2>
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
                onClick={() => setModalVisible(false)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

ReturnStockMaintain.propTypes = {
  showModal: PropTypes.bool.isRequired,
  setModalVisible: PropTypes.func.isRequired,
  fetchProducts: PropTypes.func.isRequired,
};
