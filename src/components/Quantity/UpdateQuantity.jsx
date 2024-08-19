import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { singleUnitGetFunction, unitUpdateFunction } from "../../Services/Apis";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BreadCrumb from "../common/Breadcrumb";
import Layout from "../layout";
import BackButton from "../common/BackButton";

export default function UpdateQuantity() {
  const [inputValue, setInputValue] = useState({
    inventoryUnitName: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const authToken = sessionStorage.getItem("adminToken");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const notifySuccess = () => {
    toast.success("Unit Name updated successfully!", {
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

  const fetchSingleUnit = async () => {
    try {
      const response = await singleUnitGetFunction(id);

      if (response.status === 200) {
        const fetchedUnit = response.data.unit;

        setInputValue({
          inventoryUnitName: fetchedUnit.inventoryUnitName,
        });
      }
    } catch (error) {
      console.error("Error fetching category:", error);
    }
  };

  useEffect(() => {
    setValue("inventoryUnitName", inputValue.inventoryUnitName);
  }, [inputValue]);

  useEffect(() => {
    fetchSingleUnit();
  }, [id]);

  const updateUnit = async (data) => {
    setLoading(true);
    const headers = {
      Authorization: `${authToken}`,
    };

    try {
      const response = await unitUpdateFunction(id, data, headers);

      if (response.status === 200) {
        notifySuccess();
        setLoading(false);
        navigate("/get-quantity");
      }
    } catch (error) {
      console.error("Unit update error:", error);
      notifyError("Failed to update Unit. Please try again.");
    }
  };

  return (
    <Layout>
      <div className="2xl:px-28 xl:px-16 px-2 md:mt-8 mt-2">
        <BreadCrumb pageName="Update Unit" />
        <BackButton link="get-quantity" />

        <form
          onSubmit={handleSubmit(updateUnit)}
          className="mt-8 border rounded-lg shadow-md bg-white grid grid-cols-2 gap-4 p-4"
        >
          <div className="mb-4 col-span-2 w-1/2">
            <label
              htmlFor="inventoryUnitName"
              className="block text-sm font-medium text-gray-600"
            >
              Unit Name
            </label>
            <input
              type="text"
              placeholder="Enter New Unit Name"
              {...register("inventoryUnitName", {
                required: "Unit Name is required",
              })}
              className="mt-1 p-2 border w-full"
            />
            {errors.inventoryUnitName && (
              <small className="text-red-500 text-start">
                {errors.inventoryUnitName.message}
              </small>
            )}
          </div>

          <div className="mb-4">
            <button
              type="submit"
              style={{ cursor: loading ? "not-allowed" : "pointer" }}
              className="w-fit p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              {loading ? "Updating Unit..." : "Update Unit"}
            </button>
          </div>
          <ToastContainer />
        </form>
      </div>
    </Layout>
  );
}
