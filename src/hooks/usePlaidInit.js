import { setPlaidState } from "@/store/actions/usePlaid";
import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import apiCall from "@/utils/apiCall";

const usePlaidInit = () => {
    const dispatch = useDispatch();
    const { linkToken, linkSuccess } = useSelector(state => state.plaid);

    const init = useCallback(async () => {
        try {
            console.log("Initializing Plaid link token...");
            const res = await apiCall.get("/api/v1/plaid/create_link_token");
            if (res.status !== 200) {
                console.error("Failed to create link token:", res.data);
                dispatch(
                    setPlaidState({
                        linkToken: null,
                        linkSuccess: false,
                        linkTokenError: res.data,
                    })
                );
                return;
            }
            const data = await res.data;
            console.log("Link token created successfully:", data);
            dispatch(
                setPlaidState({ 
                    linkToken: data.link_token, 
                    linkSuccess: true, 
                    linkTokenError: { error_message: "" } 
                })
            );
        } catch (error) {
            console.error("Error initializing Plaid:", error);
            dispatch(
                setPlaidState({
                    linkToken: null,
                    linkSuccess: false,
                    linkTokenError: { error_message: "Failed to initialize Plaid connection" },
                })
            );
        }
    }, [dispatch]);

    useEffect(() => {
        if (linkToken === null || linkSuccess === false) {
            init();
        }
    }, [init, linkToken, linkSuccess]);
};

export default usePlaidInit;