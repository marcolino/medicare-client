import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSnackbarContext } from "./SnackbarProvider";
import { OnlineStatusContext } from "./OnlineStatusContext";

const OnlineStatusProvider = (props) => {
  const { t } = useTranslation();
  const [onlineStatus, setOnlineStatus] = useState(navigator.onLine);
  const { showSnackbar } = useSnackbarContext();
  
  // event handler functions defined outside useEffect to prevent double listeners
  const handleOffline = () => {
    console.log("You are offline");
    showSnackbar(t("You are offline"), "warning"); // pass variant as a separate argument
    setOnlineStatus(false);
  };

  const handleOnline = () => {
    console.log("You are online");
    showSnackbar(t("You are online"), "success"); // pass variant as a separate argument
    setOnlineStatus(true);
  };

  useEffect(() => {
    // attach event listeners
    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    // clean up event listeners on unmount
    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  return (
    <OnlineStatusContext.Provider value={onlineStatus}>
      {props.children}
    </OnlineStatusContext.Provider>
  );
};

export { OnlineStatusProvider };
