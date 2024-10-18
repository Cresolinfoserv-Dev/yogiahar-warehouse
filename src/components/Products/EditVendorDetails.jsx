import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { updateVendorDetailsFunction } from "../../Services/Apis";

export default function EditVendorDetails({
  showModal,
  setShowModal,
  productId,
  vendorId,
  vendorData,
  getSingleDetails,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [loading, setLoading] = useState(false);
  const authToken = sessionStorage.getItem("adminToken");

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

  useEffect(() => {
    if (vendorId && vendorData) {
      const vendor = vendorData.find((v) => v._id === vendorId);

      if (vendor) {
        reset({
          name: vendor.name,
          landingCost: vendor.landingCost,
          contact: vendor.contact,
          address: vendor.address,
          city: vendor.city,
          gst: vendor.gst,
          igst: vendor.igst,
          batchNumber: vendor.batchNumber,
          manufacturedDate: vendor.manufacturedDate,
          expiryDate: vendor.expiryDate,
        });
      }
    }
  }, [vendorId, vendorData, reset]);

  const onSubmit = async (data) => {
    try {
      const headers = {
        Authorization: `${authToken}`,
      };

      const response = await updateVendorDetailsFunction(
        vendorId,
        productId,
        data,
        headers
      );
      if (response.status === 200) {
        setShowModal(false);
        notifySuccess("Vendor details updated successfully");
        setLoading(false);
        getSingleDetails();
      } else if (response.response.status === 422) {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      notifyError("Failed to update vendor details.");
    }
  };

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-gray-700 bg-opacity-50">
          <div className="w-full max-w-md p-6 space-y-6 bg-white rounded-md shadow-lg">
            <div>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid grid-cols-2 gap-6"
              >
                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Vendor Name
                  </label>
                  <input
                    type="text"
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
                    {...register("landingCost")}
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
                    Contact
                  </label>
                  <input
                    type="number"
                    onWheel={numberInputOnWheelPreventChange}
                    {...register("contact", {
                      required: "Contact Number is required",
                      maxLength: {
                        value: 10,
                        message: "Please enter 10 digits",
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
                    {...register("address")}
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
                    {...register("city")}
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
                    GST Number
                  </label>
                  <input
                    type="text"
                    name="gst"
                    onWheel={numberInputOnWheelPreventChange}
                    {...register("gst", {
                      minLength: {
                        value: 15,
                        message: "Please enter exactly 15 characters",
                      },
                      maxLength: {
                        value: 15,
                        message: "Please enter exactly 15 characters",
                      },
                    })}
                    maxLength={15}
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
                    IGST Number
                  </label>
                  <input
                    type="text"
                    name="igst"
                    onWheel={numberInputOnWheelPreventChange}
                    {...register("igst", {
                      minLength: {
                        value: 15,
                        message: "Please enter exactly 15 characters",
                      },
                      maxLength: {
                        value: 15,
                        message: "Please enter exactly 15 characters",
                      },
                    })}
                    maxLength={15}
                    className="w-full p-2 mt-1 border"
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
                    {...register("batchNumber")}
                    className="w-full p-2 mt-1 border"
                  />
                  {errors.batchNumber && (
                    <small className="text-red-500">
                      {errors.batchNumber.message}
                    </small>
                  )}
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="expiryDate"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Expiry Date
                  </label>
                  <input
                    type="Date"
                    name="expiryDate"
                    {...register("expiryDate")}
                    className="w-full p-2 mt-1 border"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="manufacturedDate"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Manufactured Date
                  </label>
                  <input
                    type="Date"
                    name="manufacturedDate"
                    {...register("manufacturedDate")}
                    className="w-full p-2 mt-1 border"
                  />
                </div>

                <div className="mb-4">
                  <button
                    type="submit"
                    className="p-2 text-white bg-blue-500 rounded-md w-fit hover:bg-blue-600"
                  >
                    {loading ? "Editing Vendor..." : "Submit"}
                  </button>
                  <button
                    type="button"
                    className="p-2 ml-2 text-gray-500 border rounded-md w-fit hover:text-gray-700"
                    onClick={handleClose}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
            <ToastContainer />
          </div>
        </div>
      )}
    </>
  );
}

EditVendorDetails.propTypes = {
  showModal: PropTypes.bool.isRequired,
  setShowModal: PropTypes.func.isRequired,
  productId: PropTypes.string.isRequired,
  vendorId: PropTypes.string.isRequired,
  vendorData: PropTypes.array.isRequired,
  getSingleDetails: PropTypes.func.isRequired,
};
