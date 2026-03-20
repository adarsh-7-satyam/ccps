import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useAuthContext } from "../../context/AuthContext";

const TokenValidator = () => {
    const { setAuthUser } = useAuthContext();
    const location = useLocation();

    useEffect(() => {
        const checkTokenValidity = () => {
            const token = localStorage.getItem("ccps-token");

            // If no token exists, we don't force navigation here.
            // App.jsx handles route protection based on authUser state.
            if (!token) return;

            try {
                const { exp } = jwtDecode(token);
                // If the token is expired, clear auth state and storage
                if (Date.now() >= exp * 1000) {
                    localStorage.removeItem("ccps-token");
                    localStorage.removeItem("ccps-user");
                    setAuthUser(null);
                }
            } catch (err) {
                // Invalid token format - clear auth state and storage
                localStorage.removeItem("ccps-token");
                localStorage.removeItem("ccps-user");
                setAuthUser(null);
            }
        };

        checkTokenValidity();
    }, [location.pathname, setAuthUser]);

    return null;
};

export default TokenValidator;
