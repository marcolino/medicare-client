//import React from "react";
import { useState, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Upload as UploadIcon,
  Download as DownloadIcon,
  AccountCircle as ProfileIcon,
  DeleteForever as DeleteIcon,
  PersonOff as PersonOffIcon,
  Drafts as DraftsIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import { AuthContext } from "../providers/AuthContext";
import { CartContext } from "../providers/CartContext";
import { useDialog } from "../providers/DialogContext";
import { useSnackbarContext } from "../providers/SnackbarProvider";
//import { cancelAllRequests } from "../middlewares/Interceptors";
import { apiCall } from "../libs/Network";
import { isAdmin } from "../libs/Validation";
import DialogConfirm from './DialogConfirm';
import { StyledPaper, StyledBox } from './JobStyles';
import { SectionHeader1, useTheme } from 'mui-material-custom';
import packageJson from "../../package.json";

const AdvancedOptions = () => {
  const navigate = useNavigate();
  const { auth, /*signOut,*/ revoke } = useContext(AuthContext);
  const { resetCart } = useContext(CartContext);
  const { showSnackbar } = useSnackbarContext();
  const { t } = useTranslation();
  const theme = useTheme();
  const { showDialog } = useDialog();
  const [showDialogConfirm, setShowDialogConfirm] = useState(false);
  const [buildInfo, setBuildInfo] = useState(null);

  const groupedTools = {
    Administration: [
      {
        label: t("Users Handling"),
        subtitle: t("Manage users"),
        icon: <ProfileIcon fontSize="large" />,
        action: "/handle-users",
      },
    ],
    System: [
      {
        label: t("Export Data"),
        subtitle: t("Export your jobs data to QCode"),
        icon: <DownloadIcon fontSize="large" />,
        action: "/job-data-export",
      },
      {
        label: t("Import Data"),
        subtitle: t("Import job data from QRCode"),
        icon: <UploadIcon fontSize="large" />,
        action: "/job-data-import",
      },
      {
        label: t("Edit Email Template"),
        subtitle: t("Modify the default email template to be sent to the doctor"),
        icon: <DraftsIcon fontSize="large" />,
        action: "/job-email-template-edit",
      },
      {
        label: t("About"),
        subtitle: t("Web app information"),
        icon: <InfoIcon fontSize="large" />,
        action: () => info(),
      }
    ],
    // User: [
    //   {
    //     label: t("User Profile"),
    //     subtitle: t("Manage your personal information"),
    //     icon: <ProfileIcon fontSize="large" />,
    //     action: "/profile",
    //   },
    //   {
    //     label: t("Change Theme"),
    //     subtitle: t("Switch between light and dark modes"),
    //     icon: <ThemeIcon fontSize="large" />,
    //     action: "/theme",
    //   }
    // ],
    // Other: [
    //   {
    //     label: t("Info About App"),
    //     subtitle: t("Learn more about this application"),
    //     icon: <InfoIcon fontSize="large" />,
    //     action: "/about",
    //   }
    // ],
    "Danger Zone": [
      {
        label: t("Remove All Jobs Data"),
        subtitle: t("Permanently delete all your jobs data"),
        icon: <DeleteIcon fontSize="large" sx={{ color: "error.main" }} />,
        action: "/job-data-remove",
      },
      {
        label: t("Completely Remove Your Account"),
        subtitle: t("Delete your account and all associated data"),
        icon: <PersonOffIcon fontSize="large" sx={{ color: "error.main" }} />,
        action: () => setShowDialogConfirm(true),
      }
    ]
  };
  const groupedToolsKeys = {
    "Administration": t("Administration"),
    "System": t("System"),
    "Danger Zone": t("Danger Zone"),
  };

   useEffect(() => { // read build info from file on disk
    if (!buildInfo) {
      fetch("/build-info.json")
        .then((response) => response.json())
        .then((data) => {
          let d = new Date(data.buildTimestamp);
          data.buildDateTime = // convert timestamp to human readable compact date
            d.getFullYear() + "-" +
            ("00" + (d.getMonth() + 1)).slice(-2) + "-" +
            ("00" + d.getDate()).slice(-2) + " " +
            ("00" + d.getHours()).slice(-2) + ":" +
            ("00" + d.getMinutes()).slice(-2) + ":" +
            ("00" + d.getSeconds()).slice(-2)
            ;
          setBuildInfo(data);
          //console.log("data:", data);
        })
        .catch((error) => console.error("Failed to fetch build info:", error))
        ;
    }
  }, []);
  
  const infoTitle = packageJson.name; 
  const infoContents = `\
    v${packageJson.version} © ${new Date().getFullYear()}, \
    ${t("build n.")} ${buildInfo ? buildInfo.buildNumber : "?"} ${t("on date")} ${buildInfo ? buildInfo.buildDateTime : "?"}\
  `;

  const info = () => {
    showDialog({
      title: infoTitle,
      message: infoContents,
      confirmText: t("Ok"),
    })
  };

  const handleRevoke = async () => {
    if (auth.user) {
      const result = await apiCall("post", "/auth/revoke", { userId: auth.user._id });
      console.log("*** revoke user result:", result);
      if (result.err) {
        showSnackbar(result.message, "error");
        console.error("revoke user error:", result);
      } else {
        showSnackbar("Account revoked", "success");
        let ok;
        try {
          //cancelAllRequests(); // cancel all ongoing requests, to avoid "You must be authenticated for this action" warnings
          ok = await revoke();
          console.log("revoke result:", ok);
          ok = await resetCart();
          console.log("resetCart result:", ok);
        } catch (err) {
          console.error("revoke/resetCart error:", err);
        }
        navigate("/", { replace: true });
        showSnackbar(ok ? t("Sign out successful") : t("Sign out completed"), "success");
      }
    } else {
      showSnackbar("Cannot revoke a not authenticated user", "warning");
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <SectionHeader1>
        {t("Advanced Tools")}
      </SectionHeader1>

      {Object.entries(groupedTools).map(([section, tools], idx) => {
        if ((section === "Administration") && !isAdmin(auth.user)) {
          return; // skip Administration section for not admin users
        }
        return (
          <Box key={section} sx={{ mt: idx === 0 ? 3 : 5 }}>
            <StyledPaper>
              <StyledBox sx={{
                ...(section === "Administration" && {
                  backgroundColor: 'gold',
                  color: theme.palette.common.white,
                }),
                ...(section === "Danger Zone" && {
                  backgroundColor: 'error.main',
                  color: theme.palette.common.white,
                }),
              }}>
                <Typography
                  variant="h5"
                  fontWeight="bold"
                >
                  {groupedToolsKeys[section] || section}
                </Typography>
              </StyledBox>

              <List>
                {tools.map(({ label, subtitle, icon, action }) => (
                  <ListItemButton
                    key={label}
                    onClick={() => {
                      switch (typeof action) {
                        case "string":
                          return navigate(action);
                        case "function":
                          return action();
                        default:
                          console.error(`Unsupported action type for ${label}: ${typeof action}`);
                      }
                    }}
                    sx={{
                      borderRadius: 2,
                      m: 1.5,
                      border: "1px solid",                // add solid 1px border for all
                      borderColor: section === "Danger Zone" ? "error.main" : "grey.400", // red for danger, grey otherwise
                      "&:hover": {
                        backgroundColor:
                          section === "Danger Zone"
                            ? "rgba(211, 47, 47, 0.1)"
                            : "action.hover",
                        borderColor:
                          section === "Danger Zone"
                            ? "error.main"
                            : "text.primary"
                      }
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 48,
                        color: section === "Danger Zone" ? "error.main" : "inherit"
                      }}
                    >
                      {icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography
                          variant="subtitle1"
                          color={section === "Danger Zone" ? "error" : "text.primary"}
                        >
                          {label}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          {subtitle}
                        </Typography>
                      }
                    />
                  </ListItemButton>
                ))}
              </List>
            </StyledPaper>
          </Box>
        );
      })}

      <DialogConfirm
        open={showDialogConfirm}
        onClose={() => setShowDialogConfirm(false)}
        onCancel={() => setShowDialogConfirm(false)}
        onConfirm={handleRevoke}
        title={t("Confirm complete revocation of your account")}
        message={t("Are you sure you want to completely remove your account? This action cannot be undone.")}
        confirmText={t("REVOKE YOUR ACCOUNT")}
        confirmColor={"error"}
        cancelText={t("Cancel")}
      />
    </Container>
  );
};

export default AdvancedOptions;
