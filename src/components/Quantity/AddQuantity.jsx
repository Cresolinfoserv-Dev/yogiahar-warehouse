import { useNavigate } from "react-router-dom";
import { createUnitsCodes } from "../../Services/Apis";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "../layout";
import BreadCrumb from "../common/Breadcrumb";
import BackButton from "../common/BackButton";

const AddQuantity = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const authToken = sessionStorage.getItem("adminToken");
  const role = sessionStorage.getItem("role");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const notifySuccess = () => {
    toast.success("Unit added successfully!", {
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

  const onSubmit = async (data) => {
    setLoading(true);
    const headers = {
      Authorization: `${authToken}`,
    };

    try {
      const response = await createUnitsCodes(data, headers);

      if (response.status === 200) {
        notifySuccess();
        setLoading(false);
        navigate("/get-quantity");
      } else if (response.response.status === 422) {
        setErrorMessage(response.response.data.message);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      notifyError(error.message);
      console.error(error);
    }
  };

  return (
    <Layout>
      <div className="px-2 mt-2 2xl:px-28 xl:px-16 md:mt-8">
        <BreadCrumb pageName="Create New Unit" />
        <BackButton link="get-quantity" />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-4 p-4 mt-8 bg-white border rounded-lg shadow-md"
        >
          <div className="w-1/2 col-span-2 mb-4">
            <label
              htmlFor="inventoryUnitName"
              className="block text-sm font-medium text-gray-600"
            >
              Unit
            </label>
            <input
              type="text"
              placeholder="Enter New Unit Name"
              {...register("inventoryUnitName", {
                required: "Unit Name is required",
              })}
              className="w-full p-2 mt-1 border"
            />
            {errors.inventoryUnitName && (
              <small className="text-red-500 text-start">
                {errors.inventoryUnitName.message}
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

          <input
            type="text"
            hidden
            value={role}
            {...register("inventoryUnitType", {})}
          />

          <div className="mb-4">
            <button
              type="submit"
              style={{ cursor: loading ? "not-allowed" : "pointer" }}
              className="p-2 text-white bg-blue-500 rounded-md w-fit hover:bg-blue-600"
            >
              {loading ? "Adding Unit..." : "Create Unit"}
            </button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </Layout>
  );
};

export default AddQuantity;
