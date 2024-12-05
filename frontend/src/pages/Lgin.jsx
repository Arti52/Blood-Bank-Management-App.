import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { authActions } from "../store/auth";

export default function Login() {
  const [Data, setData] = useState({ username: "", password: "" });
  const history = useNavigate();  // for navigation
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  // If the user is already logged in, redirect to the home page
  if (isLoggedIn) {
    history("/");
  }

  const dispatch = useDispatch();

  const change = (e) => {
    const { name, value } = e.target;
    setData({ ...Data, [name]: value });
  };

  const submit = async (e) => {
    e.preventDefault();  // Prevent default form submission (important for forms)
    try {
      if (Data.username === "" || Data.password === "") {
        alert("All fields are required");
      } else {
        // Post request to backend for login
        const response = await axios.post("http://localhost:1000/api/v1/log-in", Data);

        // Reset form fields
        setData({ username: "", password: "" });

        // Store token and user ID in local storage
        localStorage.setItem("id", response.data.id);
        localStorage.setItem("token", response.data.token);

        // Dispatch login action to update Redux store
        dispatch(authActions.login());

        // Redirect to the main page after successful login
        history("/");  // Automatically navigate to main page
      }
    } catch (error) {
      alert(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="h-[98vh] flex items-center justify-center">
      <div className="p-4 w-2/6 rounded bg-gray-800">
        <div className="text-2xl font-semibold">Login</div>

        <input
          type="text"
          placeholder="Enter Username"
          className="bg-gray-700 px-3 py-2 my-3 w-full rounded"
          name="username"
          value={Data.username}
          onChange={change}
        />

        <input
          type="password"
          placeholder="Enter Password"
          className="bg-gray-700 px-3 py-2 my-3 w-full rounded"
          name="password"
          value={Data.password}
          onChange={change}
        />

        <div className="w-full flex items-center justify-between">
          <button
            className="bg-blue-500 text-xl font-semibold rounded text-black px-3 py-2"
            onClick={submit}
          >
            Login
          </button>
          <Link to="/signup" className="text-gray-400 hover:text-gray-200">
            Not having an account? SignUp here
          </Link>
        </div>
      </div>
    </div>
  );
}
