import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { createStock, singleProductGetFunction } from "../../../Services/Apis";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

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

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const authToken = sessionStorage.getItem("adminToken");
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
    setLoading(true);

    const headers = {
      Authorization: `${authToken}`,
    };

    try {
      const response = await createStock(data, headers);

      if (response.status === 200) {
        notifySuccess("Stock added successfully!");
        setShowModal(false);
        fetchProducts();
        setLoading(false);
        navigate("/in-stock");
      }
    } catch (error) {
      setLoading(false);
      notifyError("Failed to add stock.");
      console.error("Product creation error:", error);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    reset();
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
                    type="text"
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
