import { MdOutlineMailOutline } from "react-icons/md";
import { adminLoginFunction } from "../Services/Apis";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoMdEyeOff } from "react-icons/io";
import { IoEye } from "react-icons/io5";

const Login = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const changeIcon = showPassword === true ? false : true;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const notifySuccess = () => {
    toast.success("Login successfully!", {
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

  const handleLogin = async (data) => {
    setLoading(true);

    try {
      const response = await adminLoginFunction(data);

      if (
        response.status === 200 &&
        response.data.result.validateUser.role === "Warehouse" &&
        response.data.result.validateUser.subRole === "WarehouseManager"
      ) {
        setLoading(true);
        notifySuccess();
        sessionStorage.setItem("adminToken", response.data.result.token);
        sessionStorage.setItem("role", "Warehouse");
        navigate("/dashboard");
      } else if (
        response.status === 200 &&
        response.data.result.validateUser.role === "Warehouse" &&
        response.data.result.validateUser.subRole === "CafeWarehouse"
      ) {
        setLoading(true);
        notifySuccess();
        sessionStorage.setItem("adminToken", response.data.result.token);
        sessionStorage.setItem("role", "Cafe");
        navigate("/dashboard");
      } else if (
        response.status === 200 &&
        response.data.result.validateUser.role === "Warehouse" &&
        response.data.result.validateUser.subRole === "BoutiqueWarehouse"
      ) {
        setLoading(true);
        notifySuccess();
        sessionStorage.setItem("adminToken", response.data.result.token);
        sessionStorage.setItem("role", "Boutique");
        navigate("/dashboard");
      } else if (
        response.status === 200 &&
        response.data.result.validateUser.role === "Warehouse" &&
        response.data.result.validateUser.subRole === "RestaurantWarehouse"
      ) {
        setLoading(true);
        notifySuccess();
        sessionStorage.setItem("adminToken", response.data.result.token);
        sessionStorage.setItem("role", "Restaurant");
        navigate("/dashboard");
      } else {
        notifyError("Invalid Credentials, please verify them and retry");
        setServerError("Invalid Credentials, please verify them and retry");
        setLoading(false);
      }
    } catch (error) {
      console.error("Catch Block Error:", error);
      notifyError(error);
      setServerError(
        "There was an error processing your request. Please try again."
      );
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem("adminToken");

    if (token) {
      navigate("/dashboard");
    } else {
      setChecking(false);
    }
  }, []);

  if (checking) return;

  return (
    <div className="md:grid md:place-items-center md:h-screen h-[100vh] ">
      <div className="w-full bg-white xl:w-1/2 ">
        <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
          <h2 className="text-2xl font-bold text-center text-black mb-9 sm:text-title-xl2">
            Warehouse Login
          </h2>

          <form onSubmit={handleSubmit(handleLogin)}>
            <div className="mb-4">
              <label className="mb-2.5 block font-medium text-black ">
                Email
              </label>
              <div className="relative">
                <input
                  type="text"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "Enter a valid email address",
                    },
                  })}
                  placeholder="Enter your email"
                  className="w-full py-4 pl-6 pr-10 bg-transparent border rounded-lg outline-none border-stroke focus:border-blue-500 focus-visible:shadow-none"
                />

                <span className="absolute right-4 top-4">
                  <MdOutlineMailOutline />
                </span>
              </div>
              {errors.email && (
                <small className="text-red-500 text-start">
                  {errors.email.message}
                </small>
              )}
            </div>

            <div className="mb-6">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                  id="password"
                  placeholder="Enter Password"
                  className="w-full py-4 pl-6 pr-10 bg-transparent border rounded-lg outline-none border-stroke focus:border-blue-500 focus-visible:shadow-none"
                />

                <span
                  className="absolute right-4 top-4"
                  onClick={() => {
                    setShowPassword(changeIcon);
                  }}
                >
                  {changeIcon ? <IoMdEyeOff /> : <IoEye />}
                </span>
              </div>

              {errors.password && (
                <small className="text-red-500 text-start">
                  {errors.password.message}
                </small>
              )}
            </div>

            {serverError && (
              <div className="text-center text-red-500">
                <small>{serverError}</small>
              </div>
            )}

            <div className="mb-5">
              <button
                type="submit"
                className="w-full p-4 text-white transition bg-blue-600 border border-blue-500 rounded-lg cursor-pointer hover:bg-opacity-90"
              >
                {loading ? "Loading..." : "Sign In"}
              </button>
              <ToastContainer autoClose={1000} position="top-right" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
