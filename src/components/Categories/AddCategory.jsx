import { useForm } from "react-hook-form";
import BreadCrumb from "../common/Breadcrumb";
import Layout from "../layout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCategoryFunction } from "../../Services/Apis";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BackButton from "../common/BackButton";

export default function AddCategory() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const authToken = sessionStorage.getItem("adminToken");
  const role = sessionStorage.getItem("role");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const notifySuccess = () => {
    toast.success("Category Added successfully!", {
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

    const formData = new FormData();
    formData.append("InventoryCategoryFile", data.InventoryCategoryFile[0]);
    formData.append("inventoryCategoryName", data.inventoryCategoryName);
    formData.append("inventoryType", data.inventoryType);

    const headers = {
      Authorization: `${authToken}`,
      "Content-Type": "multipart/form-data",
    };

    try {
      const response = await createCategoryFunction(formData, headers);

      if (response.status === 200) {
        notifySuccess();
        setLoading(false);
        navigate("/get-categories");
      } else if (response.response.status === 422) {
        setErrorMessage(response.response.data.message);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      notifyError(error.message || "An error occurred");
      console.error("Category creation error:", error);
    }
  };

  return (
    <Layout>
      <div className="px-2 mt-2 2xl:px-28 xl:px-16 md:mt-8">
        <BreadCrumb pageName="Create New Category" />
        <BackButton link="get-categories" />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-4 p-4 mt-8 bg-white border rounded-lg shadow-md"
        >
          <div className="mb-4">
            <label
              htmlFor="InventoryCategoryFile"
              className="block text-sm font-medium text-gray-600"
            >
              Attach file
            </label>
            <input
              type="file"
              name="InventoryCategoryFile"
              {...register("InventoryCategoryFile")}
              className={`mt-1 p-2 border w-full ${
                errors.InventoryCategoryFile ? "border-red-500" : ""
              }`}
            />
            {errors.InventoryCategoryFile && (
              <small className="text-red-500">
                {errors.InventoryCategoryFile.message}
              </small>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="inventoryCategoryName"
              className="block text-sm font-medium text-gray-600"
            >
              category Name
            </label>
            <input
              type="text"
              name="inventoryCategoryName"
              {...register("inventoryCategoryName", {
                required: "Name is required",
                maxLength: {
                  value: 30,
                  message: "Please enter 30 Characters",
                },
              })}
              className="w-full p-2 mt-1 border"
            />
            {errors.inventoryCategoryName && (
              <small className="text-red-500">
                {errors.inventoryCategoryName.message}
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
            {...register("inventoryType", {})}
          />

          <div className="mb-4">
            <button
              type="submit"
              className="p-2 text-white bg-blue-500 rounded-md w-fit hover:bg-blue-600"
            >
              {loading ? "Adding Category..." : "Create Category"}
            </button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </Layout>
  );
}
