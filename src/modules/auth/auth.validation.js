import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().email('Invalid email address').optional(),
    mobile_number: z.string().min(10, 'Mobile number must be at least 10 digits').max(15, 'Mobile number must not exceed 15 digits').optional(),
    password: z.string({ required_error: 'Password is required' }).min(1, 'Password cannot be empty'),
}).refine((data) => data.email || data.mobile_number, {
    message: 'Either email or mobile_number is required',
    path: ['email'],
});
