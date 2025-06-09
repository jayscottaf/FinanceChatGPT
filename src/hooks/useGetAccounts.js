// Retrieve transactions or incremental updates for credit and depository accounts.

import { setAccounts } from "@/store/actions/usePlaid";
import { setUserInfoState } from "@/store/actions/useUser";
import apiCall from "@/utils/apiCall";
import { handleError, isEmpty } from "@/utils/util";
import { useEffect, useContext, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetAccounts = () => {
	const { isItemAccess, linkSuccess } = useSelector((state) => state.plaid);
	const dispatch = useDispatch();

	const fetchData = useCallback(async () => {
		try {
			dispatch(setUserInfoState({ isAccountsLoaded: false }));

			const response = await apiCall.get("/api/v1/plaid/accounts");
			const data = await response.data;
			dispatch(setUserInfoState({ items: data, isAccountsLoaded: true }));
		} catch (err) {
			dispatch(setUserInfoState({ isAccountsLoaded: true }));
			handleError(err);
		}
	}, [dispatch]);

        useEffect(() => {
                fetchData();
        }, [fetchData]);
}; 

export default useGetAccounts;