import { useForm } from "react-hook-form";
import BreadCrumb from "../common/Breadcrumb";
import Layout from "../layout";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createProductsFunction,
  getCategoryFunction,
  getUnitsFunction,
} from "../../Services/Apis";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BackButton from "../common/BackButton";

export default function AddProducts() {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const authToken = sessionStorage.getItem("adminToken");
  const role = sessionStorage.getItem("role");
  const [category, setCategory] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const notifySuccess = () => {
    toast.success("Product Added successfully!", {
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

  const fetchUnits = async () => {
    setLoading(true);

    let categoryName = role;
    try {
      const response = await getUnitsFunction(categoryName);

      if (response.status === 200) {
        setUnits(response.data.units);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching Products:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getCategoryFunction(role);

      if (response.status === 200) {
        setCategory(response.data.categories || []);
      }
    } catch (error) {
      console.error("Error fetching Products:", error);
    } finally {
      setLoading(false);
    }
  }, [role]);

  const onSubmit = async (data) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("InventoryProductFile", data.InventoryProductFile[0]);
    formData.append("inventoryProductName", data.inventoryProductName);
    formData.append(
      "inventoryProductDescription",
      data.inventoryProductDescription
    );
    formData.append("inventoryProductQuantity", data.inventoryProductQuantity);
    if (data.inventorySellingPrice) {
      formData.append("inventorySellingPrice", data.inventorySellingPrice);
    }
    if (data.inventoryCostPrice) {
      formData.append("inventoryCostPrice", data.inventoryCostPrice);
    }
    if (data.gstPercent) {
      formData.append("gstPercent", data.gstPercent);
    }
    formData.append("inventoryProductUnit", data.inventoryProductUnit);
    formData.append("inventoryCategory", data.inventoryCategory);

    const headers = {
      Authorization: `${authToken}`,
      "Content-Type": "multipart/form-data",
    };

    try {
      const response = await createProductsFunction(formData, headers);

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
      notifyError(error.message || "An error occurred");
      console.error("Product creation error:", error);
    }
  };

  const numberInputOnWheelPreventChange = (e) => {
    e.target.blur();
    e.stopPropagation();
    setTimeout(() => {
      e.target.focus();
    }, 0);
  };

  useEffect(() => {
    fetchUnits();
    fetchCategories();
  }, []);

  const costPrice = watch("inventoryCostPrice");

  return (
    <Layout>
      <div className="px-2 mt-2 2xl:px-28 xl:px-16 md:mt-8">
        <BreadCrumb pageName="Create New Product" />
        <BackButton link="products" />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-4 p-4 mt-8 bg-white border rounded-lg shadow-md"
        >
          <div className="mb-4">
            <label
              htmlFor="InventoryProductFile"
              className="block text-sm font-medium text-gray-600"
            >
              Attach file
            </label>
            <input
              type="file"
              name="InventoryProductFile"
              {...register("InventoryProductFile")}
              className={`mt-1 p-2 border w-full`}
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="inventoryProductName"
              className="block text-sm font-medium text-gray-600"
            >
              Product Name
            </label>
            <input
              type="text"
              name="inventoryProductName"
              {...register("inventoryProductName", {
                required: "Product Name is required",
                maxLength: {
                  value: 30,
                  message: "Please enter 30 Characters",
                },
              })}
              className="w-full p-2 mt-1 border"
            />
            {errors.inventoryProductName && (
              <small className="text-red-500">
                {errors.inventoryProductName.message}
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
              htmlFor="inventoryProductDescription"
              className="block text-sm font-medium text-gray-600"
            >
              Product Description
            </label>
            <input
              type="text"
              name="inventoryProductDescription"
              {...register("inventoryProductDescription")}
              className="w-full p-2 mt-1 border"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="inventoryProductQuantity"
              className="block text-sm font-medium text-gray-600"
            >
              Product Quantity
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
            <label
              htmlFor="inventoryCostPrice"
              className="block text-sm font-medium text-gray-600"
            >
              Product Cost Price
            </label>
            <input
              type="number"
              step="0.01"
              onWheel={numberInputOnWheelPreventChange}
              name="inventoryCostPrice"
              {...register("inventoryCostPrice")}
              className="w-full p-2 mt-1 border"
            />
            {errors.inventoryCostPrice && (
              <small className="text-red-500">
                {errors.inventoryCostPrice.message}
              </small>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="inventorySellingPrice"
              className="block text-sm font-medium text-gray-600"
            >
              Product Selling Price
            </label>
            <input
              type="number"
              step="0.01"
              onWheel={numberInputOnWheelPreventChange}
              name="inventorySellingPrice"
              {...register(
                "inventorySellingPrice",
                {
                  required:
                    role === "Boutique" ? "Selling Price is required" : false,
                },
                {
                  validate: (value) =>
                    !costPrice ||
                    parseFloat(value) <= parseFloat(costPrice) ||
                    "Selling price cannot be greater than cost price",
                }
              )}
              className="w-full p-2 mt-1 border"
            />
            {errors.inventorySellingPrice && (
              <small className="text-red-500">
                {errors.inventorySellingPrice.message}
              </small>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              GST Percentage
            </label>
            <input
              type="number"
              step="1"
              placeholder="Enter GST Percent"
              onWheel={numberInputOnWheelPreventChange}
              {...register("gstPercent", {
                required: "GST Percent is required",
                validate: (value) =>
                  Number.isInteger(Number(value)) ||
                  "Only integers are allowed",
              })}
              className="mt-1 p-2 border w-full"
            />
            {errors.gstPercent && (
              <small className="text-red-500">
                {errors.gstPercent.message}
              </small>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="inventoryProductUnit"
              className="block text-sm font-medium text-gray-600"
            >
              Select Unit
            </label>
            <select
              name="inventoryProductUnit"
              id="inventoryProductUnit"
              {...register("inventoryProductUnit", {
                required: "Product Unit is required",
              })}
              className="w-full p-2 mt-1 border"
            >
              <option value="">Select an Option</option>
              {units?.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.inventoryUnitName}
                </option>
              ))}
            </select>
            {errors.inventoryProductUnit && (
              <small className="text-red-500">
                {errors.inventoryProductUnit.message}
              </small>
            )}
          </div>

          <div className="w-1/2 col-span-2 mb-4">
            <label
              htmlFor="inventoryCategory"
              className="block text-sm font-medium text-gray-600"
            >
              Select Category
            </label>
            <select
              name="inventoryCategory"
              id="inventoryCategory"
              {...register("inventoryCategory", {
                required: "Product Category is required",
              })}
              className="w-full p-2 mt-1 border"
            >
              <option value="">Select an Option</option>
              {category?.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.inventoryCategoryName}
                </option>
              ))}
            </select>
            {errors.inventoryCategory && (
              <small className="text-red-500">
                {errors.inventoryCategory.message}
              </small>
            )}
          </div>

          <div className="flex justify-end col-span-2 mb-4">
            <button
              type="submit"
              className="px-4 py-2 text-white bg-indigo-600 rounded-md"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </Layout>
  );
}
