
"use client";

import { useCallback, useEffect, useState } from "react";
import { usePlaidLink } from "react-plaid-link";
import { useDispatch, useSelector } from "react-redux";
import { setPlaidState } from "@/store/actions/usePlaid";
import apiCall from "@/utils/apiCall";
import { setUserInfoState } from "@/store/actions/useUser";
import { isEmpty } from "@/utils/util";
import { RootState } from "@/store";
import { AnyAction } from 'redux';
import { Dispatch } from 'redux';
import { toast } from 'sonner'
import { Button } from "./ui/button";

const ConnectButton = ({ children, type, setShowConnectModal }: { children: React.ReactNode, type: string | number, setShowConnectModal: (show: boolean) => void }) => {
    const { linkToken, linkTokenError } = useSelector((state: RootState) => state.plaid);
    const { items: linkInfo } = useSelector((state: RootState) => state.user);

    const dispatch = useDispatch<Dispatch<AnyAction>>();
    const [isLoading, setIsLoading] = useState(false);

    const onSuccess = useCallback(
        (public_token: any, metadata: any) => {
            const exchangePublicTokenForAccessToken = async () => {
                try {
                    setIsLoading(true);
                    const response = await apiCall.post("/api/v1/plaid/set_access_token", { public_token, metadata, type });
                    if (response.status !== 200) {
                        dispatch(setPlaidState({ isItemAccess: false }) as unknown as AnyAction);
                        toast.error("Failed to connect account");
                        return;
                    }
                    const { isItemAccess, item_id, accounts } = response.data;
                    dispatch(setPlaidState({ isItemAccess: isItemAccess }) as unknown as AnyAction);
                    if (!isEmpty(item_id)) {
                        dispatch(
                            setUserInfoState({
                                items: [...linkInfo, { ...metadata, accounts }]
                            })
                        );
                    }
                    toast.success("Account connected successfully!");
                    setShowConnectModal(false);
                } catch (error) {
                    console.error("Error connecting account:", error);
                    toast.error("Failed to connect account");
                } finally {
                    setIsLoading(false);
                }
            };
            exchangePublicTokenForAccessToken();
        },
        [dispatch, linkInfo, setShowConnectModal, type]
    );

    const onExit = useCallback((err: any, metadata: any) => {
        if (err != null) {
            console.error("Plaid Link exited with error:", err);
            toast.error("Connection cancelled or failed");
        }
    }, []);

    const config = {
        token: linkToken && Array.isArray(linkToken) && linkToken[type as number] ? linkToken[type as number].link_token : null,
        onSuccess,
        onExit
    };

    const { open, ready } = usePlaidLink(config);

    useEffect(() => {
        if (linkTokenError && !isEmpty(linkTokenError.error_message)) {
            toast.error(linkTokenError.error_message || 'Failed to create link token');
        }
    }, [linkTokenError]);

    const handleOpenPlaidLink = useCallback(() => {
        if (!ready) {
            toast.error("Plaid Link is not ready yet. Please try again in a moment.");
            return;
        }

        if (!config.token) {
            toast.error("No link token available. Please try again.");
            dispatch(
                setPlaidState({
                    isItemAccess: false,
                    linkToken: null,
                    linkSuccess: false,
                }) as unknown as AnyAction
            );
            return;
        }

        try {
            open();
        } catch (error) {
            console.error("Error opening Plaid Link:", error);
            toast.error("Failed to open account connection");
        }
    }, [ready, config.token, open, dispatch]);

    return (
        <Button
            onClick={handleOpenPlaidLink}
            disabled={!ready || isLoading || !config.token}
            className="w-full"
        >
            {isLoading ? "Connecting..." : children}
        </Button>
    );
};

export default ConnectButton;
