
export const Status = {
    ACTIVE: "ACTIVE",
    DELETED: "DELETED",
    DISABLED: "DISABLED",
    PENDING: "PENDING",
    APPROVED: "APPROVED",
    AUTHORIZED: "AUTHORIZED",
    UN_AUTHORIZED: "UN AUTHORIZED",
    REJECTED: "REJECTED",
    EXPIRED: "EXPIRED",
    SUCCESSFUL: "SUCCESSFUL",
    FAILED: "FAILED",
    COMPLETED: "COMPLETED",
    CONTINUING: "CONTINUING",
    DEFAULT: "DEFAULT",
    ALL: "ALL",
};

export const Action = {
    Activate: "Activate",
    Delete: "Delete",
    Disable: "Disable",
    Approve: "Approve",
    Authorize: "Authorize",
    Reject: "Reject",
    Un_Authorize: "Un Authorize",
    Reset: "Reset",
    Update: "Update",
    Read: "Read",
};

export const REDUCER_ACTION_TYPE = {
    SET_TITLE: 0,
    SET_ROWS: 1,
    SET_DATA: 2,
    SET_STATUS: 3,
    SET_RECORDS: 4,
    SET_PAGINATION_MODEL: 5,
    TOGGLE_ALERT_MODAL: 6,
    TOGGLE_CREATE_MODAL: 7,
    TOGGLE_CONFIRMATION_MODAL: 8,
    TOGGLE_LOADING: 9,
};

export const DETAIL_REDUCER_ACTION_TYPE = {
    SET_DATA: 0,
    TOGGLE_CONFIRMATION_MODAL: 1,
    TOGGLE_CREATE_MODAL: 2,
    SET_STATUS: 3,
    SET_TITLE: 4,
    TOGGLE_LOADING: 5,
};

export const PAGE_STATE_ACTIONS = {
    SET_ROWS: 0,
    SET_DATA: 1,
    SET_COUNT: 2,
    SET_SELECTED: 3,
    SET_PAGINATION_MODEL: 4,
    SET_RECORDS: 5,
    SET_STATUS: 6,
    SET_MESSAGE: 7,
};

export const DETAILS_PAGE_ACTION = {
    SET_DATA: 0,
    TOGGLE_CONFIRMATION: 1,
    TOGGLE_ALERT: 2,
    SET_TITLE: 3,
    SET_STATUS: 4,
};

export const Role = {
    USER: "USER",
    ADMINISTRATOR: "ADMINISTRATOR",
    COMPANY_ADMINISTRATOR: "COMPANY ADMINISTRATOR",
    COMPANY_OPERATOR: "COMPANY OPERATOR",
};

export const Language = {
    SW: "Swahili",
    EN: "English",
};
