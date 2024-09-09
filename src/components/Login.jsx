import { MdOutlineMailOutline } from "react-icons/md";
import { adminLoginFunction } from "../Services/Apis";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoMdEyeOff } from "react-icons/io";
import { IoEye } from "react-icons/io5";

export default function Login() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const notifySuccess = useCallback(() => {
    toast.success("Login successfully!", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
    });
  }, []);

  const notifyError = useCallback((errorMessage) => {
    toast.error(errorMessage, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
    });
  }, []);

  const handleLogin = useCallback(
    async (data) => {
      setLoading(true);
      setServerError("");

      try {
        const response = await adminLoginFunction(data);

        if (response.status === 200) {
          const { role, subRole } = response.data.result.validateUser;
          const token = response.data.result.token;
          let userRole = "";

          if (role === "Warehouse") {
            if (subRole === "CafeWarehouse") userRole = "Cafe";
            if (subRole === "BoutiqueWarehouse") userRole = "Boutique";
            if (subRole === "RestaurantWarehouse") userRole = "Kitchen";

            if (userRole) {
              notifySuccess();
              sessionStorage.setItem("adminToken", token);
              sessionStorage.setItem("role", userRole);
              navigate("/dashboard");
              return;
            }
          }
        }

        notifyError("Invalid Credentials, please verify them and retry");
        setServerError("Invalid Credentials, please verify them and retry");
      } catch (error) {
        console.error("Catch Block Error:", error);
        notifyError(
          error.response?.data?.message || "Error processing your request"
        );
        setServerError("There was an error processing your request.");
      } finally {
        setLoading(false);
      }
    },
    [navigate, notifySuccess, notifyError]
  );

  useEffect(() => {
    const token = sessionStorage.getItem("adminToken");
    if (token) {
      navigate("/dashboard");
    } else {
      setChecking(false);
    }
  }, [navigate]);

  if (checking) return null;

  return (
    <div className="md:grid md:place-items-center md:h-screen h-[100vh]">
      <div className="w-full bg-white xl:w-1/2">
        <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
          <h2 className="text-2xl font-bold text-center text-black mb-9 sm:text-title-xl2">
            Warehouse Login
          </h2>

          <form onSubmit={handleSubmit(handleLogin)}>
            <div className="mb-4">
              <label className="mb-2.5 block font-medium text-black">
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
              <label className="mb-2.5 block font-medium text-black">
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
                  placeholder="Enter Password"
                  className="w-full py-4 pl-6 pr-10 bg-transparent border rounded-lg outline-none border-stroke focus:border-blue-500 focus-visible:shadow-none"
                />
                <span
                  className="absolute right-4 top-4 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <IoMdEyeOff /> : <IoEye />}
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
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
