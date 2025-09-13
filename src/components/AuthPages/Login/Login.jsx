import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { z } from "zod";
import img from "../../../../public/thumb-1920-955164.png";

// ✅ Login Schema \\
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function Login() {
  const navigate = useNavigate();

  // ✅ React Hook Form \\
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  // ✅ Mutation for API call \\
  const mutation = useMutation({
  mutationFn: async (formData) => {
    const response = await axios.post(
      "https://note-sigma-black.vercel.app/api/v1/users/signIn",
      formData
    );
    return response.data; 
  },
  onSuccess: (data) => {
    console.log("🔐 Login Response:", data); 

    if (data?.token) {
      localStorage.setItem("token", data.token);
    }
    navigate("/Home");
  },
});


  // ✅ Submit Function \\
  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  // ✅ Auto clear errors after 3s \\
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const timer = setTimeout(() => clearErrors(), 3000);
      return () => clearTimeout(timer);
    }
  }, [errors, clearErrors]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-50 to-white">
      <div className="bg-white border-4 border-gray-200 rounded-3xl shadow-2xl flex w-full max-w-5xl overflow-hidden scale-95">
        {/* Form Section */}
        <div className="hidden md:block md:w-1/2 bg-gray-100">
          <img
            src={img}
            alt="Login Illustration"
            className="w-150 h-150 object-cover object-[95%] "
          />
        </div>

        {/* Image Section */}
        <div className="w-full md:w-1/2 p-7  m-auto">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
            Login
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                {...register("email")}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } focus:outline-pink-600`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-2 transition-opacity duration-300">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                {...register("password")}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } focus:outline-pink-600`}
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-2 transition-opacity duration-300">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={mutation.isLoading}
              className="w-full py-3 bg-purple-800 hover:bg-pink-700 text-white rounded-lg font-semibold text-lg transition duration-300"
            >
              {mutation.isLoading ? "Logging in..." : "Login"}
            </button>

            {/* Register Link */}
            <p className="text-center text-gray-600 mt-4">
              Don't have an account?{" "}
              <Link to="/register" className="text-indigo-600">
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
