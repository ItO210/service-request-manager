import React from "react";
import { toast } from "react-hot-toast";
import Toast from "@/components/Toast";

export function showToast(message, type) {
    toast.custom(
        (t) =>
            React.createElement(Toast, {
                t,
                message,
                type,
            }),
        {
            duration: 3500,
            position: "top-right",
        }
    );
};
