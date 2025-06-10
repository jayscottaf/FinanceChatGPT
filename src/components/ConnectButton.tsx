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

    const onSuccess = useCallback(
        (public_token: any, metadata: any) => {
            const exchangePublicTokenForAccessToken = async () => {
                const response = await apiCall.post("/api/v1/plaid/set_access_token", { public_token, metadata, type });
                if (response.status !== 200) {
                    dispatch(setPlaidState({ isItemAccess: false }) as unknown as AnyAction);
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
                setShowConnectModal(false);
            };
            exchangePublicTokenForAccessToken();
        },
        [dispatch, linkInfo, setShowConnectModal, type]
    );

    const config = {
        token: !isEmpty(linkToken) ? linkToken[type].link_token : null,
        onSuccess
    };

    const { open, ready } = usePlaidLink(config);

    const [openAfterFetch, setOpenAfterFetch] = useState(false);

    useEffect(() => {
        if (linkTokenError && !isEmpty(linkTokenError.error_message)) {
            toast.error(linkTokenError.error_message || 'Failed to create link token');
        }
    }, [linkTokenError]);

    useEffect(() => {
        if (openAfterFetch && ready && !isEmpty(linkToken)) {
            open();
            setOpenAfterFetch(false);
        }
    }, [openAfterFetch, ready, linkToken, open]);

    const handleOpenPlaidLink = () => {
        dispatch(
            setPlaidState({
                isItemAccess: false,
                linkToken: null,
                linkSuccess: false,
            }) as unknown as AnyAction
        );
        setOpenAfterFetch(true);
    };

    const setupConfig = {
        token: !isEmpty(linkToken) ? linkToken[type].link_token : "Token not found",
        open: open,
        ready: ready,
        onSuccess: onSuccess,
        linkInfo: linkInfo,
    }

    console.log(setupConfig);

    return (
        <Button
            onClick={handleOpenPlaidLink}
            disabled={!ready}
        >
            {children}
        </Button>
    );
};

export default ConnectButton;
