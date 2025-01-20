"use client";

import { useState } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import { useAuthenticator } from "@aws-amplify/ui-react";
import Link from "next/link";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function App() {
  const [formData, setFormData] = useState({
    productName: '',
    productDescription: '',
    productPrice: 0,
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // State for the loader

  // Handle form field changes
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true); // Show loader

    try {
      // Send the product data to the GraphQL API
      const result = await client.models.Products.create({
        ...formData,
      });

      console.log("Product created:", result);

      // Show success message
      setIsSubmitted(true);

      // Reset form data
      setFormData({ productName: '', productDescription: '', productPrice: 0 });
    } catch (error) {
      console.error("Error creating product:", error);
    } finally {
      setIsLoading(false); // Hide loader
    }
  };

  // Handle reset for creating a new product
  const handleReset = () => {
    setIsSubmitted(false);
  };

  const { signOut } = useAuthenticator();

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100 relative">
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="text-white text-xl font-semibold">Loading...</div>
        </div>
      )}
      <div className="bg-white p-8 shadow-lg rounded-lg w-full max-w-md">
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="productName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Product Name
              </label>
              <input
                type="text"
                id="productName"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">This field is required.</p>
            </div>
            <div>
              <label
                htmlFor="productDescription"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Product Description
              </label>
              <textarea
                id="productDescription"
                name="productDescription"
                value={formData.productDescription}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
            <div>
              <label
                htmlFor="productPrice"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Product Price
              </label>
              <input
                type="number"
                id="productPrice"
                name="productPrice"
                value={formData.productPrice}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
            >
              Create Product
            </button>
          </form>
        ) : (
          <div className="text-center">
            <h2 className="text-xl font-semibold text-green-600">
              Product Created Successfully!
            </h2>
            <button
              onClick={handleReset}
              className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
            >
              Create Another Product
            </button>
          </div>
        )}

        <button
          onClick={signOut}
          className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
        >
          Sign Out
        </button>

     
      <Link
        href="/products"
        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
      >
        Go to Products Page
      </Link>   
      </div>
    </main>
  );
}
