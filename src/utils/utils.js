import { Action, Status } from './enums';
import dayjs from 'dayjs';
import { capitalize } from '@mui/material/utils';

/**
 * Formats a date string to a standard format
 * @param {string} date - The date string to format
 * @returns {string|null} The formatted date string or null if the input is invalid
 */
export const formatDate = (date) => {
  if (!date) return null;
  return dayjs(date).format('YYYY-MM-DDTHH:mm:ss'); 
};



export const permit = (condition, allowed) => {
    return allowed.includes(condition);
};

export const getDetailsRoute = (route, id) => {
    return route.replace(":id", id.toString());
};

export const getRoute = (route, id) => {
    return route.replace(":id", id.toString());
};

export const getStatusColor = (status) => {
    const s = status?.toUpperCase();
    if(s === Status.ACTIVE || s === Status.COMPLETED)
        return "success";
    if(s === Status.PENDING || s === Status.DISABLED)
        return "warning";
    if(s === Status.DELETED || s === Status.REJECTED){
        return "error";
    }

    return "primary";
};

export const getStatusForAction = (action) => {
    switch (action) {
        case Action.Activate:
            return Status.ACTIVE;
        case Action.Delete:
            return Status.DELETED;
        case Action.Disable:
            return Status.DISABLED;
        case Action.Approve:
            return Status.APPROVED;
        case Action.Authorize:
            return Status.AUTHORIZED;
        case Action.Reject:
            return Status.REJECTED;
        case Action.Un_Authorize:
            return Status.UN_AUTHORIZED;
        case Action.Reset:
        case Action.Update:
        case Action.Read:
            return Status.DEFAULT;
        default:
            return Status.DEFAULT;
    }
};


export const toSentenceCase = (text) => {
    if(text == null || text == undefined){
        return "";
    }

    return text.split(" ").map(a => capitalize(a)).join(" ");
};
