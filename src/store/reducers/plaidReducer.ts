"use client";
import {
    SET_PLAID_ASSETS_STATE,
    SET_PLAID_AUTH_STATE,
    SET_PLAID_BALANCE_STATE,
    SET_PLAID_HOLDING_STATE,
    SET_PLAID_IDENTITY_STATE,
    SET_PLAID_INVEST_TRANSACTIONS_STATE,
    SET_PLAID_LIABILITIES_STATE,
    SET_PLAID_PAYMENT_STATE,
    SET_PLAID_STATE,
    SET_PLAID_TRANSACTIONS_STATE,
    SET_PLAID_TRANSFER_STATE,
    SET_PLAID_ACCOUNTS_STATE,
    SET_PLAID_CATEGORY_STATE
} from "../constants/plaidConstants";

const initialState = {
    linkSuccess: false,
    isItemAccess: false,
    linkToken: null,
    isTransactionsLoaded: true,
    transactionsInfo: {},
    isAccountsLoaded: true,
    accountsInfo: {},
    institutions: {},
    categories: [],
    personalFinanceCategories: [],
    categoriesLoaded: false,
    linkTokenError: {
        error_type: "",
        error_code: "",
        error_message: ""
    },
    payments: {},
    auth: {},
    assets: {},
    balance: {},
    holdings: {},
    identity: {},
    investTransactions: {},
    liabilities: {},
    transfer: {}
};

interface Action {
    type: string;
    payload?: any;
}

export const plaidReducer = (state = initialState, { type, payload }: Action) => {
    switch (type) {
        case SET_PLAID_STATE:
        case SET_PLAID_PAYMENT_STATE:
        case SET_PLAID_AUTH_STATE:
        case SET_PLAID_TRANSACTIONS_STATE:
        case SET_PLAID_IDENTITY_STATE:
        case SET_PLAID_ASSETS_STATE:
        case SET_PLAID_BALANCE_STATE:
        case SET_PLAID_HOLDING_STATE:
        case SET_PLAID_INVEST_TRANSACTIONS_STATE:
        case SET_PLAID_LIABILITIES_STATE:
        case SET_PLAID_TRANSFER_STATE:
        case SET_PLAID_ACCOUNTS_STATE:
        case SET_PLAID_CATEGORY_STATE:
            return { ...state, ...payload };
        default:
            return { ...state };
    }
};
