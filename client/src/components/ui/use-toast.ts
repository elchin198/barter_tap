
import { toast as reactHotToast } from "react-hot-toast";

type ToastType = "success" | "error" | "loading" | "default";

export interface ToastProps {
  title?: string;
  description?: string;
  type?: ToastType;
  duration?: number;
}

export const toast = ({
  title,
  description,
  type = "default",
  duration = 4000,
}: ToastProps) => {
  // Map our types to react-hot-toast types
  const message = title ? (description ? `${title}: ${description}` : title) : description;

  if (!message) return;

  switch (type) {
    case "success":
      return reactHotToast.success(message, { duration });
    case "error":
      return reactHotToast.error(message, { duration });
    case "loading":
      return reactHotToast.loading(message, { duration });
    default:
      return reactHotToast(message, { duration });
  }
};
