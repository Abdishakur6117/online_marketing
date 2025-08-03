import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify"; // ← Add this
import "react-toastify/dist/ReactToastify.css"; // ← And this

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // const handleLogin = async (e) => {
  //   e.preventDefault();

  //   try {
  //     const res = await axios.post("http://localhost:5000/api/auth/login", {
  //       email,
  //       password,
  //     });
  //     console.log("Sending login:", { email, password });

  //     const { token, user } = res.data;

  //     if (!user || !user.role) {
  //       toast.error("Ma helin role. Fadlan la xiriir admin.");
  //       return;
  //     }

  //     const role = user.role;

  //     localStorage.setItem("token", token);
  //     localStorage.setItem("role", role);
  //     // localStorage.setItem("userId", res.data.user.id);
  //     // // optionally store other info like role or username
  //     // localStorage.setItem("username", res.data.user.username);
  //     toast.success("Login successful!");

  //     setTimeout(() => {
  //       if (role === "admin") navigate("/admin");
  //       else if (role === "marketer") navigate("/marketer");
  //       else if (role === "customer") navigate("/customer");
  //       else navigate("/login");
  //     }, 1500);
  //   } catch (err) {
  //     toast.error(
  //       err?.response?.data?.message ||
  //         "Login failed. Check email and password."
  //     );
  //   }
    
  // };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });
      console.log("Sending login:", { email, password });

      const { token, user } = res.data;

      if (!user || !user.role) {
        toast.error("Ma helin role. Fadlan la xiriir admin.");
        return;
      }

      const role = user.role;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("userId", user.id); // ✅ Save userId here!

      toast.success("Login successful!");

      setTimeout(() => {
        if (role === "admin") navigate("/admin");
        else if (role === "marketer") navigate("/marketer");
        else if (role === "customer") navigate("/customer");
        else navigate("/login");
      }, 1500);
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          "Login failed. Check email and password."
      );
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <ToastContainer position="top-center" /> {/* ← ToastContainer */}
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-lg shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Login
        </button>

        <p className="text-sm text-center mt-4">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign up here
          </Link>
        </p>
      </form>
    </div>
  );
}
