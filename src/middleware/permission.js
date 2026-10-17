import { ADMIN, CUSTOMER, SUPER_ADMIN } from '../constant/enum.js';

const ROLES = {
    [SUPER_ADMIN]: [
        "admin:create"

    ],
    [ADMIN]: [

    ],
    [CUSTOMER]: [

    ],
};

export function hasPermission(userRole, permission) {
    return ROLES[userRole]?.includes(permission) || false;
}

export { ROLES };
