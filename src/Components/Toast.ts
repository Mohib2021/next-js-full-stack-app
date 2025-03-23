// utils/toast.ts
import { toast, ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type ToastType = "success" | "error" | "info" | "warning";

const defaultOptions: ToastOptions = {
  position: "top-center",
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "dark",
};

export const showToast = (
  type: ToastType,
  message: string,
  options?: ToastOptions
) => {
  switch (type) {
    case "success":
      toast.success(message, { ...defaultOptions, ...options });
      break;
    case "error":
      toast.error(message, { ...defaultOptions, ...options });
      break;
    case "info":
      toast.info(message, { ...defaultOptions, ...options });
      break;
    case "warning":
      toast.warning(message, { ...defaultOptions, ...options });
      break;
    default:
      toast(message, { ...defaultOptions, ...options });
  }
};
