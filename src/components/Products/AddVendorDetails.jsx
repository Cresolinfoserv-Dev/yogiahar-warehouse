import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import PropTypes from "prop-types";
import { useState } from "react";
import { createVendorDetailsFunction } from "../../Services/Apis";
import { useNavigate } from "react-router-dom";

export default function AddVendorDetails({
  showModal,
  setShowModal,
  productId,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const authToken = sessionStorage.getItem("adminToken");

  const navigate = useNavigate();

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

  const onSubmit = async (data) => {
    try {
      const headers = {
        Authorization: `${authToken}`,
      };

      const response = await createVendorDetailsFunction(
        productId,
        data,
        headers
      );
      if (response.status === 200) {
        notifySuccess();
        setLoading(false);
        navigate("/products");
      } else if (response.response.status === 422) {
        setErrorMessage(response.response.data.message);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      notifyError("Failed to add stock.");
      console.error("Stock saving error:", error);
    }
  };
  return (
    <>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-gray-700 bg-opacity-50">
          <div className="w-full max-w-md p-6 space-y-6 bg-white rounded-md shadow-lg">
            <div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Vendor Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    {...register("name", {
                      required: "Vendor Name is required",
                      maxLength: {
                        value: 30,
                        message: "Please enter 30 Characters",
                      },
                    })}
                    className="w-full p-2 mt-1 border"
                  />
                  {errors.name && (
                    <small className="text-red-500">
                      {errors.name.message}
                    </small>
                  )}
                  {errorMessage && (
                    <div>
                      <small className="text-red-500 text-center">
                        {errorMessage}
                      </small>
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="landingCost"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Landing Cost
                  </label>
                  <input
                    type="text"
                    name="landingCost"
                    {...register("landingCost", {
                      required: "Landing Cost is required",
                      maxLength: {
                        value: 15,
                        message: "Please enter 15 Characters",
                      },
                    })}
                    className="w-full p-2 mt-1 border"
                  />
                  {errors.landingCost && (
                    <small className="text-red-500">
                      {errors.landingCost.message}
                    </small>
                  )}
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="contact"
                    className="block text-sm font-medium text-gray-600"
                  >
                    contact
                  </label>
                  <input
                    type="number"
                    name="contact"
                    onWheel={numberInputOnWheelPreventChange}
                    {...register("contact", {
                      required: "Contact Number is required",
                      maxLength: {
                        value: 10,
                        message: "Please enter 10 Characters",
                      },
                    })}
                    className="w-full p-2 mt-1 border"
                  />
                  {errors.contact && (
                    <small className="text-red-500">
                      {errors.contact.message}
                    </small>
                  )}
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    {...register("address", {
                      required: "address is required",
                    })}
                    className="w-full p-2 mt-1 border"
                  />
                  {errors.address && (
                    <small className="text-red-500">
                      {errors.address.message}
                    </small>
                  )}
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-600"
                  >
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    {...register("city", {
                      required: "City is required",
                      maxLength: {
                        value: 30,
                        message: "Please enter 30 Characters",
                      },
                    })}
                    className="w-full p-2 mt-1 border"
                  />
                  {errors.city && (
                    <small className="text-red-500">
                      {errors.city.message}
                    </small>
                  )}
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="gst"
                    className="block text-sm font-medium text-gray-600"
                  >
                    GST
                  </label>
                  <input
                    type="number"
                    name="gst"
                    onWheel={numberInputOnWheelPreventChange}
                    {...register("gst", {
                      required: "GST is required",
                      maxLength: {
                        value: 10,
                        message: "Please enter 10 Characters",
                      },
                    })}
                    className="w-full p-2 mt-1 border"
                  />
                  {errors.gst && (
                    <small className="text-red-500">{errors.gst.message}</small>
                  )}
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="igst"
                    className="block text-sm font-medium text-gray-600"
                  >
                    IGST
                  </label>
                  <input
                    type="number"
                    name="igst"
                    {...register("igst", {
                      required: "IGST is required",
                      maxLength: {
                        value: 10,
                        message: "Please enter 10 Characters",
                      },
                    })}
                    className="w-full p-2 mt-1 border"
                    onWheel={numberInputOnWheelPreventChange}
                  />
                  {errors.igst && (
                    <small className="text-red-500">
                      {errors.igst.message}
                    </small>
                  )}
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="batchNumber"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Batch Number
                  </label>
                  <input
                    type="text"
                    name="batchNumber"
                    {...register("batchNumber", {
                      required: "Batch Number is required",
                      maxLength: {
                        value: 10,
                        message: "Please enter 10 Characters",
                      },
                    })}
                    className="w-full p-2 mt-1 border"
                  />
                  {errors.batchNumber && (
                    <small className="text-red-500">
                      {errors.batchNumber.message}
                    </small>
                  )}
                </div>

                <div className="mb-4">
                  <button
                    type="submit"
                    className="p-2 text-white bg-blue-500 rounded-md w-fit hover:bg-blue-600"
                  >
                    {loading ? "Adding Vendor..." : "Add Vendor"}
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

AddVendorDetails.propTypes = {
  showModal: PropTypes.bool.isRequired,
  setShowModal: PropTypes.func.isRequired,
  productId: PropTypes.string.isRequired,
};
