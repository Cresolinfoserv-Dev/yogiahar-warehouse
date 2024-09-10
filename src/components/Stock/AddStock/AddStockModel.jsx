import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { singleProductGetFunction } from "../../../Services/Apis";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddStockModel({
  showModal,
  setShowModal,
  productId,
  fetchProducts,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);

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

  const fetchSingleProduct = async () => {
    const response = await singleProductGetFunction(productId);

    if (response.status === 200) {
      setProduct(response.data.product);
    } else {
      notifyError("Failed to fetch product details.");
    }
  };

  useEffect(() => {
    fetchSingleProduct();
  }, [productId]);

  const onSubmit = async (data) => {
    try {
      const existingStockData = JSON.parse(
        localStorage.getItem("stockData")
      ) || {
        product: [],
      };

      const productIndex = existingStockData.product.findIndex(
        (item) => item.productId === productId
      );

      const wasEmpty = existingStockData.product.length === 0;

      if (productIndex !== -1) {
        existingStockData.product[productIndex].quantity =
          data.inventoryProductQuantity;
        existingStockData.product[productIndex].productName =
          product.inventoryProductName;
      } else {
        existingStockData.product.push({
          productId: productId,
          productName: product.inventoryProductName,
          quantity: data.inventoryProductQuantity,
        });
      }

      localStorage.setItem("stockData", JSON.stringify(existingStockData));

      notifySuccess("Stock added successfully!");
      setShowModal(false);
      fetchProducts();
      setLoading(false);

      if (wasEmpty && existingStockData.product.length > 0) {
        window.location.reload();
      }
    } catch (error) {
      setLoading(false);
      notifyError("Failed to add stock.");
      console.error("Stock saving error:", error);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    reset();
  };

  const numberInputOnWheelPreventChange = (e) => {
    e.target.blur();
    e.stopPropagation();
    setTimeout(() => {
      e.target.focus();
    }, 0);
  };

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-gray-700 bg-opacity-50">
          <div className="w-full max-w-md p-6 space-y-6 bg-white rounded-md shadow-lg">
            <div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <input
                  type="text"
                  {...register("productID")}
                  value={productId}
                  hidden
                />
                <div className="mb-4">
                  <label
                    htmlFor="inventoryProductQuantity"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Add Quantity{" "}
                    {product &&
                      `(${product.inventoryProductUnit.inventoryUnitName})`}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    onWheel={numberInputOnWheelPreventChange}
                    name="inventoryProductQuantity"
                    {...register("inventoryProductQuantity", {
                      required: "Product Quantity is required",
                    })}
                    className="w-full p-2 mt-1 border"
                  />
                  {errors.inventoryProductQuantity && (
                    <small className="text-red-500">
                      {errors.inventoryProductQuantity.message}
                    </small>
                  )}
                </div>

                <div className="mb-4">
                  <button
                    type="submit"
                    className="p-2 text-white bg-blue-500 rounded-md w-fit hover:bg-blue-600"
                  >
                    {loading ? "Adding Stock..." : "Add Stock"}
                  </button>
                </div>
              </form>
            </div>
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
  productId: PropTypes.string.isRequired,
  fetchProducts: PropTypes.func.isRequired,
};
