import { ADMIN, CUSTOMER } from '../constant/enum.js';

const ROLES = {
    [ADMIN]: [
        'CREATE_ADMIN',
        'GET_ALL_USERS',
        'GET_USER_BY_ID',
        'UPDATE_USER',
        'DELETE_USER',
    ],
    [CUSTOMER]: [
        'GET_MY_PROFILE',
        'UPDATE_MY_PROFILE',
    ],
};

export function hasPermission(userRole, permission) {
    return ROLES[userRole]?.includes(permission) || false;
}

export { ROLES };
