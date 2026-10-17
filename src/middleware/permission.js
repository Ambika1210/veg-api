import { ADMIN, CUSTOMER, SUPER_ADMIN } from '../constant/enum.js';

const ROLES = {
    [SUPER_ADMIN]: [
        "admin:create",
        "product:create"

    ],
    [ADMIN]: [
        "product:create"
    ],
    [CUSTOMER]: [

    ],
};

export function hasPermission(userRole, permission) {
    return ROLES[userRole]?.includes(permission) || false;
}

export { ROLES };
