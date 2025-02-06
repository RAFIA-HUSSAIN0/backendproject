"use client"
import ProtectedRoute from "@/app/components/protected/page";
import { client } from "@/sanity/lib/client";
import React, { useEffect, useState } from "react";
import Image from 'next/image';
import { urlFor } from "@/sanity/lib/image";
import Swal from "sweetalert2";




interface Order {
    _id: string;
    firstName: string;
    lastName: string;
    phone: number;
    email: string;
    address: string;
    zipCode: string;
    city: string;
    total: number;
    discount: number;
    orderDate: string;
    status: string | null;
    cartItems: { name: string, image: string }[]; // Fix: This should be an array
}

export default function AdminDashboard() {
    const [orders, setOrders] = useState<Order[]>([])
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
    const [filter, setFilter] = useState("All")

    useEffect(() => {
        client.fetch(
            `*[_type == "order"]{
            _id,
            firstName,
            lastName,
            phone,
            email,
            address,
            city,
            zipCode,
            total,
            discount,
            orderDate,
            status,
            cartItems[] -> {
            name,
            imag
            }
            }`
        )
            .then((data) => setOrders(data))
            .catch((error) => console.log("error fetching products", error));
    }, [])
    const filteredOrders =
        filter === " All"
            ? orders
            : orders.filter((order) => order.status === filter);
    const toggleOrderDetails = (orderId: string) => {
        setSelectedOrderId((prev) => (prev === orderId ? null : orderId));
        const handleDelete = async (orderId: string) => {
            const result = await Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!"
            });
            if (!result.isConfirmed) return;
            try {
                await client.delete(orderId);
                setOrders((prevOrder) => prevOrder.filter((order) => order._id !== orderId));
                Swal.fire("Deleted", "Your order has been deleted", "success")
            } catch (error) {
                Swal.fire("Error", "Failed to delete order", "error");
            }

        };
        const handleStatusChange = async (orderId: string, newStatus: string) => {
            try {
                await client.patch(orderId).set({ status: newStatus }).commit();

                setOrders((prevOrder) => prevOrder.map((order) => order._id === orderId ? {
                    ...order,
                    status: newStatus,
                }
                    : order
                )
                );
                if (newStatus === "dispatch") {
                    Swal.fire("Order Dispatched",
                        "Your order has been dispatched",
                        "success");

                } else if (newStatus === "success") {
                    Swal.fire("success", "Your order has been completed", "success")
                }


            } catch (error) {
                Swal.fire("Error", "Failed to change status", "error");
            }
        };
    };
    function handleStatus(_id: string, value: string): void {
        throw new Error("Function not implemented");
    }
    function handleDelete(_id: string) {
        throw new Error("Function not implemented.");
    }

    return (
        <ProtectedRoute>
            <div className="flex flex-col h-screen bg-gray-100">
                <nav className="bg-red-600 text-white p-4 shadow-lg flex justify-between ">
                    <h2 className="text-2xl font-bold">
                        Admin Dashboard
                    </h2>
                    <div className="flex space-x-4">
                        {["All", "pending", "success", "dispatch"].map((status) => (
                            <button key={status}
                                className={`px-4 py-2 rounded-lg transition-all ${filter == status ? " bg-white text-red-600 font-bold" : "text-white"
                                    }`}
                                onClick={() => setFilter(status)}
                            >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                        ))}
                    </div>
                    <div></div>
                </nav>
                <div className="flex-1 p-6 overflow-y-auto">
                    <h2 className="text-2xl font-bold text-center">
                        Orders
                    </h2>
                    <div className="overflow-y-auto bg-white rounded-lg shadow-sm">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Customer</th>
                                    <th>Address</th>
                                    <th>Date</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredOrders.map((order) => (
                                    <React.Fragment key={order._id}>
                                        <tr className="cursor.pointer hover:bg-red-100 transition-all" onClick={() => toggleOrderDetails(order._id)}>
                                            <td> {order._id}</td>
                                            <td>{order.firstName}{order.lastName}</td>
                                            <td>{order.address}</td>
                                            <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                                            <td>o{order.total}</td>
                                        </tr>
                                        <td>
                                            <select value={order.status || ""} onChange={(e) => handleStatus(order._id, e.target.value)}
                                                className="bg-gray-100 p-1 rounded ">
                                                <option value="pending">Pending</option>
                                                <option value="success">Success</option>
                                                <option value="dispatch">Dispatched</option>

                                            </select>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button onClick={(e) => {
                                                e.stopPropagation()
                                                handleDelete(order._id)

                                            }} className="bg-red-500 text-white px-3 rounded hover:bg-red-700 transition"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                        {selectedOrderId === order._id && (
                                            <tr>
                                                <td colSpan={7} className="bg-gray-50 p-4 transition-all">
                                                    <h3 className="font-bold">
                                                        Order Details
                                                    </h3>1
                                                    <p>Phone: <strong>{order.phone}</strong></p>
                                                    <p>Email: <strong>{order.email}</strong></p>
                                                    <p>City: <strong>{order.city}</strong></p>
                                                    <ul>
                                                        {order.cartItems.map((item: { name: string; image: string }) => (
                                                            <li className="flex items-center gap-2" key={item.name}>
                                                                {item.name}
                                                                {item.image && (
                                                                    <Image
                                                                        src={urlFor(item.image).url()}
                                                                        alt="image"
                                                                        width={100}
                                                                        height={100}
                                                                    />
                                                                )}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </td>
                                            </tr>
                                        )}

                                    </React.Fragment>
                                ))}

                            </tbody>
                        </table>

                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
};