import { useState, useEffect, useCallback } from "react";

import { toast } from "react-toastify";
import PropTypes from "prop-types";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useSocket } from "../../Context/SocketProvider";
import {
  changeOrderStatusByID,
  createStock,
  getBoutiqueEmployeesFunction,
  getCafeEmployeesFunction,
  sendStockFunction,
} from "../../Services/Apis";

const NewSendStock = ({ showModal, setShowModal, fetchProducts }) => {
  const [loading, setLoading] = useState(false);
  const [stockData, setStockData] = useState([]);
  const [selectedBoutique, setSelectedBoutique] = useState("");
  const [selectedStockType, setSelectedStockType] = useState("");
  const [selectedCafe, setSelectedCafe] = useState("");
  const type = sessionStorage.getItem("role");
  const socket = useSocket();
  const [boutiqueData, setBoutiqueData] = useState([]);
  const [cafeData, setCafeData] = useState([]);

  const data = [
    {
      id: 1,
      name: "In Stock",
      value: "In",
    },
    {
      id: 1,
      name: "Out Stock",
      value: "Out",
    },
    {
      id: 1,
      name: "Return Stock",
      value: "Returned",
    },
  ];

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
    if (!selectedStockType) {
      toast.error("Please select stock type");
      setLoading(false);
      return;
    }
    setLoading(true);

    const sentTo =
      type === "Boutique" ? "Boutique" : type === "Cafe" ? "Cafe" : "Kitchen";

    const Payload = {
      product: stockData,
      sentTo: sentTo,
      type: type,
      stockType: selectedStockType,
      ...(selectedStockType !== "Returned" && {
        store:
          type === "Boutique"
            ? selectedBoutique
            : type === "Cafe"
            ? selectedCafe
            : "",
      }),
    };

    try {
      const response = await sendStockFunction(Payload);

      if (response.status === 200) {
        if (selectedStockType === "Returned") {
          const id = response.data.orderID;
          const orderStatus = "Returned";
          try {
            const updateOrderStatusRes = await changeOrderStatusByID(id, {
              orderStatus,
            });

            if (updateOrderStatusRes.status === 200) {
              toast.success("Stock returned successfully");
              localStorage.removeItem("stock");
              fetchProducts();
              setShowModal(false);
            } else {
              toast.error("Failed to update order status");
            }
          } catch (error) {
            console.error("Error updating order status:", error);
            toast.error("Error updating order status");
          }
        } else {
          handleAction({
            orderId: response?.data?.orderID,
            role: sentTo,
            store:
              type === "Boutique"
                ? selectedBoutique
                : type === "Cafe"
                ? selectedCafe
                : "",
          });
          toast.success("Stock updated successfully");
          localStorage.removeItem("stock");
          fetchProducts();
          setShowModal(false);
        }
      } else {
        toast.error(response?.response?.data?.message);
      }
    } catch (error) {
      console.error("Error updating stock:", error);
      toast.error(error.message || "Failed to update stock");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async () => {
    if (!selectedStockType) {
      toast.error("Please select stock type");
      setLoading(false);
      return;
    }

    if (!stockData || stockData.length === 0) {
      return;
    }

    try {
      setLoading(true);
      const response = await createStock({
        product: stockData,
        type,
      });

      if (response.status === 200) {
        toast.success("Stock updated successfully");
        localStorage.removeItem("stock");
        setShowModal(false);
        fetchProducts();
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
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
                <div className="mt-4">
                  <label
                    htmlFor="boutique"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Select Stock Type:
                  </label>
                  <select
                    id="boutique"
                    onChange={(e) => setSelectedStockType(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select a Type</option>
                    {data.map((boutique) => (
                      <option key={boutique.id} value={boutique.value}>
                        {boutique.name}
                      </option>
                    ))}
                  </select>
                </div>
                {type === "Boutique" && selectedStockType === "Out" && (
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

                {type === "Cafe" && selectedStockType === "Out" && (
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
                    onClick={
                      selectedStockType === "In" ? onSubmit : handleSubmit
                    }
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

NewSendStock.propTypes = {
  showModal: PropTypes.bool.isRequired,
  setShowModal: PropTypes.func.isRequired,
  fetchProducts: PropTypes.func.isRequired,
};

export default NewSendStock;
