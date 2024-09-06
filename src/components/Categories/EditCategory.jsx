import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  categoryUpdateFunction,
  singleCategoryGetFunction,
} from "../../Services/Apis";
import Layout from "../layout";
import BreadCrumb from "../common/Breadcrumb";
import BackButton from "../common/BackButton";

export default function EditCategory() {
  const [category, setCategory] = useState({});
  const [updatedImages, setUpdatedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  console.log(id);
  const navigate = useNavigate();
  const authToken = sessionStorage.getItem("adminToken");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      inventoryCategoryName: "",
    },
  });

  const notify = (type, message) => {
    toast[type](message, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
    });
  };

  const handleImage = (e) => setUpdatedImages(e.target.files);

  const fetchCategoryByID = async () => {
    try {
      const response = await singleCategoryGetFunction(id);

      console.log(response);
      if (response.status === 200) {
        setCategory(response.data.category || []);
      }
    } catch (error) {
      console.error("Error fetching Category:", error);
      notify("error", "Error fetching Category");
    }
  };

  useEffect(() => {
    if (category) {
      setValue(
        "inventoryCategoryImageUrl",
        category.inventoryCategoryImageUrl || ""
      );
      setValue("inventoryCategoryName", category.inventoryCategoryName || "");
    }
  }, [category, setValue]);

  useEffect(() => {
    fetchCategoryByID();
  }, [id]);

  const handleUpdateCategory = async (data) => {
    setLoading(true);

    const formData = new FormData();

    Object.keys(data).forEach((key) => formData.append(key, data[key]));

    if (updatedImages[0]) {
      formData.append("InventoryCategoryFile", updatedImages[0]);
    }

    try {
      const response = await categoryUpdateFunction(id, formData, {
        Authorization: authToken,
        "Content-Type": "multipart/form-data",
      });
      if (response.status === 200) {
        notify("success", "category Updated successfully!");
        navigate("/get-categories");
      } else {
        notify("error", response.response.data.message);
      }
    } catch (error) {
      console.error("Category update error:", error);
      notify("error", "Category update error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="2xl:px-28 xl:px-16 px-2 md:mt-8 mt-2">
        <BreadCrumb pageName="Update Category" />
        <BackButton link="get-categories" />
        <form
          onSubmit={handleSubmit(handleUpdateCategory)}
          className="mt-8 border rounded-lg shadow-md bg-white grid grid-cols-2 gap-4 p-4"
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
              accept=".png, .jpg, .jpeg"
              onChange={handleImage}
              className="mt-1 p-2 border w-full"
            />
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
              {...register("inventoryCategoryName", {
                required: "Category Name is required",
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
          </div>

          <div className="col-span-2 w-1/2 mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Current Image
            </label>
            {category?.inventoryCategoryImageUrl && (
              <img
                src={category.inventoryCategoryImageUrl}
                alt="inventoryImg"
                width={90}
                className="rounded-md"
              />
            )}
          </div>

          <div className="mb-4">
            <button
              type="submit"
              className="w-fit p-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md text-center"
              disabled={loading}
            >
              {loading ? "Loading..." : "Update category"}
            </button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </Layout>
  );
}
