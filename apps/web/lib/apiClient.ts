import axios from "axios";

export const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1",
    withCredentials: true, // MANDATORY: Sends secure cookies automatically
    headers: {
        "Content-Type": "application/json",
    },
});