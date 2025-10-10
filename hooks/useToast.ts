import { useCallback, useState } from "react";

export type ToastType = "success" | "error" | "info";

interface ToastState {
  visible: boolean;
  message: string;
  type: ToastType;
}

export const useToast = () => {
  const [toast, setToast] = useState<ToastState>({
    visible: false,
    message: "",
    type: "info",
  });

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    setToast({
      visible: true,
      message,
      type,
    });
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({
      ...prev,
      visible: false,
    }));
  }, []);

  const showSuccess = useCallback(
    (message: string) => {
      showToast(message, "success");
    },
    [showToast],
  );

  const showError = useCallback(
    (message: string) => {
      showToast(message, "error");
    },
    [showToast],
  );

  const showInfo = useCallback(
    (message: string) => {
      showToast(message, "info");
    },
    [showToast],
  );

  return {
    toast,
    showToast,
    hideToast,
    showSuccess,
    showError,
    showInfo,
  };
};
