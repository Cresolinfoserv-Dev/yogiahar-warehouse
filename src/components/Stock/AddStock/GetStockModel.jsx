import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createStock } from "../../../Services/Apis";
import { RiDeleteBin6Line } from "react-icons/ri";

export default function AddStockModel({ showModal, setShowModal }) {
  const [loading, setLoading] = useState(false);
  const [stock, setStock] = useState([]);

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

  useEffect(() => {
    const storedStock = localStorage.getItem("stockData");
    if (storedStock) {
      setStock(JSON.parse(storedStock));
    }
  }, []);

  const onSubmit = async () => {
    if (!stock || stock.product.length === 0) {
      notifyError("No stock data available to send.");
      return;
    }

    try {
      setLoading(true);

      const response = await createStock({ product: stock.product });

      if (response.status === 200) {
        notifySuccess("Stock data sent successfully!");
        localStorage.removeItem("stockData");
        window.location.reload();
        setShowModal(false);
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleDeleteStock = (index) => {
    const updatedStock = stock?.product?.filter((_, i) => i !== index);
    setStock(updatedStock);
    localStorage.setItem("stockData", JSON.stringify(updatedStock));
  };

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-gray-700 bg-opacity-50">
          <div className="w-full max-w-md p-6 space-y-6 bg-white rounded-md shadow-lg">
            {stock?.product?.length > 0 ? (
              <div>
                <h2 className="text-lg font-bold">Confirm Stock Submission</h2>
                <p>You are about to submit the following stock data:</p>
                {stock?.product?.map((s, idx) => (
                  <div key={idx} className="mt-2">
                    <p>
                      <strong>Product Name:</strong> {s.productName}
                    </p>
                    <p>
                      <strong>Quantity:</strong> {s.quantity}
                    </p>
                  </div>
                ))}

                {stock?.product?.map((item, index) => (
                  <div key={index} className="flex justify-between p-2 gap-5">
                    <h2 className="font-bold">{item.productName}</h2>
                    <span>Quantity: {item.quantity}</span>
                    <button
                      onClick={() => handleDeleteStock(index)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      <RiDeleteBin6Line />
                    </button>
                  </div>
                ))}

                <div className="mt-4">
                  <button
                    onClick={onSubmit}
                    className="p-2 text-white bg-blue-500 rounded-md w-fit hover:bg-blue-600"
                    disabled={loading}
                  >
                    {loading ? "Sending Stock Data..." : "Submit Stock Data"}
                  </button>
                </div>
              </div>
            ) : (
              <div>No stock products Data found</div>
            )}
            <button
              className="text-red-500"
              type="button"
              onClick={handleClose}
            >
              Close
            </button>
          </div>

          <ToastContainer />
        </div>
      )}
    </>
  );
}

AddStockModel.propTypes = {
  showModal: PropTypes.bool.isRequired,
  setShowModal: PropTypes.func.isRequired,
  fetchProducts: PropTypes.func.isRequired,
};
