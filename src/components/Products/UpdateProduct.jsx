import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getCategoryFunction,
  getUnitsFunction,
  productUpdateFunction,
  singleProductGetFunction,
} from "../../Services/Apis";
import Layout from "../layout";
import BreadCrumb from "../common/Breadcrumb";
import BackButton from "../common/BackButton";

export default function UpdateProduct() {
  const [product, setProduct] = useState({});
  const [updatedImages, setUpdatedImages] = useState([]);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const authToken = sessionStorage.getItem("adminToken");
  const role = sessionStorage.getItem("role");
  const [category, setCategory] = useState([]);
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      inventoryProductName: "",
      inventoryProductDescription: "",
      inventoryProductQuantity: "",
      inventorySellingPrice: "",
      inventoryProductUnit: "",
      inventoryCategory: "",
      inventoryCostPrice: "",
      gstPercent: "",
      inventoryBarCodeId: "",
      inventoryHSNCode: "",
    },
  });

  const notify = (type, message) => {
    toast[type](message, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
    });
  };

  const handleImage = (e) => setUpdatedImages(e.target.files);

  const fetchUnits = async () => {
    let categoryName = role;

    try {
      const { status, data } = await getUnitsFunction(categoryName);
      if (status === 200) {
        setUnits(data.units);
      }
    } catch (error) {
      console.error("Error fetching units:", error);
      notify("error", "Error fetching units");
    }
  };

  const fetchProduct = async () => {
    try {
      const { status, data } = await singleProductGetFunction(id);

      if (status === 200) {
        const { product } = data;
        setProduct(product);
        Object.keys(product).forEach((key) => setValue(key, product[key]));
        setValue("inventoryProductUnit", product?.inventoryProductUnit?._id);
        setValue("inventoryCategory", product?.inventoryCategory?._id);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      notify("error", "Error fetching product");
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

  useEffect(() => {
    fetchUnits();
    fetchProduct();
    fetchCategories();
  }, [id]);

  const handleUpdateProduct = async (data) => {
    setLoading(true);

    const formData = new FormData();
    Object.keys(data).forEach((key) => formData.append(key, data[key]));
    if (updatedImages[0]) {
      formData.append("InventoryProductFile", updatedImages[0]);
    }

    try {
      const response = await productUpdateFunction(id, formData, {
        Authorization: authToken,
        "Content-Type": "multipart/form-data",
      });
      if (response.status === 200) {
        notify("success", "Product Updated successfully!");
        navigate("/products");
      } else {
        notify("error", response.response.data.message);
      }
    } catch (error) {
      console.error("Product update error:", error);
      notify("error", "Product update error");
    } finally {
      setLoading(false);
    }
  };

  const numberInputOnWheelPreventChange = (e) => {
    e.target.blur();
    e.stopPropagation();
    setTimeout(() => {
      e.target.focus();
    }, 0);
  };

  return (
    <Layout>
      <div className="2xl:px-28 xl:px-16 px-2 md:mt-8 mt-2">
        <BreadCrumb pageName="Update Product" />
        <BackButton link="products" />
        <form
          onSubmit={handleSubmit(handleUpdateProduct)}
          className="mt-8 border rounded-lg shadow-md bg-white grid grid-cols-2 gap-4 p-4"
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
              accept=".png, .jpg, .jpeg"
              onChange={handleImage}
              className="mt-1 p-2 border w-full"
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
              {...register("inventoryProductName", {
                required: "Name is required",
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
              {...register("inventoryProductDescription")}
              className="w-full p-2 mt-1 border"
            />
            {errors.inventoryProductDescription && (
              <small className="text-red-500">
                {errors.inventoryProductDescription.message}
              </small>
            )}
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
              {...register(
                "inventorySellingPrice",
                {
                  required:
                    role === "Boutique" ? "Selling Price is required" : false,
                },
                {
                  validate: (value) => {
                    const costPrice = getValues("inventoryCostPrice");
                    return (
                      value <= costPrice ||
                      "Selling price cannot be greater than cost price"
                    );
                  },
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
              {...register(
                "gstPercent",
                {
                  required:
                    role === "Boutique" ? "GST Percent is required" : false,
                },
                {
                  validate: (value) =>
                    Number.isInteger(Number(value)) ||
                    "Only integers are allowed",
                }
              )}
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
              htmlFor="inventoryBarCodeId"
              className="block text-sm font-medium text-gray-600"
            >
              Product Bar Code
            </label>
            <input
              type="text"
              name="inventoryProductQuantity"
              {...register("inventoryBarCodeId")}
              className="w-full p-2 mt-1 border"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="inventoryHSNCode"
              className="block text-sm font-medium text-gray-600"
            >
              Product HSN Code
            </label>
            <input
              type="text"
              name="inventoryHSNCode"
              {...register("inventoryHSNCode", {
                required: role === "Boutique" ? "HSN Code is required" : false,
              })}
              className="w-full p-2 mt-1 border"
            />

            {errors.inventoryHSNCode && (
              <small className="text-red-500">
                {errors.inventoryHSNCode.message}
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
              {...register("inventoryProductUnit", {
                required: "Product Unit is required",
              })}
              className="w-full p-2 mt-1 border"
            >
              <option value="">Select an Option</option>
              {units.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.inventoryUnitName}
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

          {product?.inventoryProductImageUrl && (
            <div className="col-span-2 w-1/2 mb-4">
              <label className="block text-sm font-medium text-gray-600">
                Current Image
              </label>
              <img
                src={product.inventoryProductImageUrl}
                alt="inventoryImg"
                width={90}
                className="rounded-md"
              />
            </div>
          )}

          <div className="mb-4">
            <button
              type="submit"
              className="w-fit p-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md text-center"
              disabled={loading}
            >
              {loading ? "Loading..." : "Update Product"}
            </button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </Layout>
  );
}
