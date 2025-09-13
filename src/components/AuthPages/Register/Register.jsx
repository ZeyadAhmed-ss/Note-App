import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { z } from "zod";
import img from "../../../../public/thumb-1920-955164.png";
import { Link } from "react-router-dom";



// ✅ Register Schema \\
const registerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must include uppercase, lowercase, number, and special character"
    ),
  age: z.coerce.number().min(18, "Enter a valid age"),
  phone: z.string().regex(/^[0-9]{10,}$/, "Enter a valid phone number"),
});

export default function Register() {
  const navigate = useNavigate();

  // ✅ React Hook Form \\
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  // ✅ Mutation for API call \\
  const mutation = useMutation({
    mutationFn: async (formData) => {
      const response = await axios.post(
        "https://note-sigma-black.vercel.app/api/v1/users/signUp",
        formData
        
      );
      console.log("API Response:", response.data); 
      return response.data;
    },
    onSuccess: () => {
      reset();
      navigate("/login");
    },
    onError: (error) => {
      
    }
  });

  // ✅ Submit Function \\
  const onSubmit = (data) => {
    console.log("Form Data Submitted:", data);
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

      


      <div className="bg-white border-4 border-gray-200 rounded-3xl shadow-2xl flex w-full max-w-5xl overflow-hidden backdrop-blur-sm scale-95">
        {/* Form Section */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
            Register
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Name
              </label>
              <input
                type="text"
                {...register("name")}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.name ? "border-red-500" : "border-gray-300"
                } focus:outline-pink-600`}
                placeholder="Enter your name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.name.message}
                </p>
              )}
            </div>

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
                <p className="text-red-500 text-sm mt-2">
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
                <p className="text-red-500 text-sm mt-2">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Age */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Age
              </label>
              <input
                type="number"
                {...register("age")}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.age ? "border-red-500" : "border-gray-300"
                } focus:outline-pink-600`}
                placeholder="Enter your age"
              />
              {errors.age && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.age.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Phone
              </label>
              <input
                type="text"
                {...register("phone")}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                } focus:outline-pink-600`}
                placeholder="Enter your phone number"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={mutation.isLoading}
              className="w-full py-3 bg-purple-800 hover:bg-pink-700 text-white rounded-lg font-semibold text-lg transition duration-300"
            >
              {mutation.isLoading ? "Registering..." : "Sign Up"}
            </button>

            {/* Login Link */}
            <p className="text-center text-gray-600 mt-4">
              Already have an account?{" "}
              <Link to="/login" className="text-indigo-600">Login</Link>
            </p>
          </form>
        </div>

        {/* Image Section */}
        <div className="hidden md:block md:w-1/2 bg-gray-100">
          <img
            src={img}
            alt="Register Illustration"
            className="w-full h-full object-cover object-[90%]"
          />
        </div>

      </div>
    </div>
  );
}
