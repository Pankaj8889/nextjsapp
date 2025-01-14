"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import { useAuthenticator } from "@aws-amplify/ui-react";
import styles from "./Home.module.css";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function App() {

  const [formData, setFormData] = useState({
    productName: '',
    productDescription: '',
    productPrice: 0,
  });

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

    try {
      // Send the product data to the GraphQL API

      const result = await client.models.Products.create({
        ...formData
      });

      console.log('Product created:', result);
      
      // Reset form after submission
      setFormData({ productName: '', productDescription: '', productPrice: 0 });
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };  

  const { signOut } = useAuthenticator();

  return (
    
<main className="flex items-center justify-center min-h-screen bg-gray-100">
  <div className="bg-white p-8 shadow-lg rounded-lg w-full max-w-md">
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
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
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

    <button
      onClick={signOut}
      className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
    >
      Sign Out
    </button>
  </div>
</main>


  );
}
