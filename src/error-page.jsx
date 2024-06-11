import React from "react";
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import errorImage from "../public/error-img.png";
function ErrorPage() {
  return (
    <div className="min-h-screen  bg-gray-900 flex flex-col md:flex-row items-center justify-center">
      <div className="flex flex-col item-center px-2 md:w-96 lg:w-[600px] mx-auto">
        <h1 className="text-4xl font-bold mb-10">
          <span className="text-green-500 michroma-bold">404</span>{" "}
          <span className="text-gray-200 montserrat-bold uppercase">Error</span>
        </h1>
        <p className="text-gray-300 work-sans mb-10">
          We believe in delivering tailored solutions that are designed to
          address your unique requirements. We take the time to understand.
        </p>
        <Link to="/" className="inline-block mt-4">
          <button className="flex items-center bg-green-500 text-white px-4 py-3 rounded-sm capitalize">
            <FaHome className="mr-2" />
            <span className="poppins-regular text-sm"> Back to Home</span>
          </button>
        </Link>
      </div>
      <div className="relative">
        <img src={errorImage} />
      </div>
    </div>
  );
}

export default ErrorPage;
