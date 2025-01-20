"use client";

import { useState,useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import { useAuthenticator } from "@aws-amplify/ui-react";
import Link from "next/link";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function ProductList() {
    
    type Product = {
        productName: string | null;
        productDescription: string | null;
        productPrice: number | null;
        id: string;
        createdAt: string;
        updatedAt: string;
      };
      
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
        try {
            const result = await client.models.Products.list();
            console.log("Fetch result:", result);

            // Use result.data directly since the response structure contains the array at data.
            if (result && result.data) {
            setProducts(result.data); 
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
        };

        fetchProducts();
    }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-xl font-semibold text-gray-700">Loading products...</p>
      </div>
    );
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100">
      <ul role="list" className="divide-y divide-gray-100">
        {products.map((product) => (
          <li key={product.id} className="flex justify-between gap-x-6 py-5">
            <div className="min-w-0 flex-auto">
              <p className="text-sm font-semibold text-gray-900">{product.productName}</p>
              <p className="mt-1 text-sm text-gray-500">{product.productDescription}</p>
              <p className="mt-1 text-sm font-semibold text-gray-700">${product.productPrice}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Created at: {product.createdAt}</p>
              <p className="text-sm text-gray-500">Updated at: {product.updatedAt}</p>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
