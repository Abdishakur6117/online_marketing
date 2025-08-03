import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-blue-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-wide text-white hover:text-yellow-300 transition"
        >
          Digital Marketing
        </Link>

        {/* Navigation Links */}
        <div className="space-x-6 text-sm md:text-base font-medium">
          <Link
            to="/"
            className="hover:text-yellow-300 transition duration-200"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="hover:text-yellow-300 transition duration-200"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="hover:text-yellow-300 transition duration-200"
          >
            Contact
          </Link>
          <Link
            to="/login"
            className="bg-yellow-400 text-blue-800 px-4 py-1.5 rounded hover:bg-yellow-500 transition"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
