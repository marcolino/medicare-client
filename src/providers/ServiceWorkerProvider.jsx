import { useEffect } from "react";
import { useSnackbarContext } from "./SnackbarProvider";

const ServiceWorkerProvider = ({ children }) => {
  const { showSnackbar } = useSnackbarContext();

  useEffect(() => {
    const handleServiceWorkerEvents = () => {
      if (navigator.serviceWorker) {
        navigator.serviceWorker.addEventListener("message", event => {
          console.log("ServiceWorkerProvider - message event received with data:", event.data);
          showSnackbar("... event.data ..." + event.data.toString(), "info");
        });
      }
    };

    handleServiceWorkerEvents();

    return () => {
      if (navigator.serviceWorker) {
        navigator.serviceWorker.removeEventListener("message", handleServiceWorkerEvents);
      }
    };
  }, [showSnackbar]);

  return <>{children}</>;
};

export default ServiceWorkerProvider;
