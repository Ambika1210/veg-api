import { z } from 'zod';

export const createUserSchema = z.object({
    name: z.string({ required_error: 'Name is required' }).min(1, 'Name cannot be empty'),
    email: z.string({ required_error: 'Email is required' }).email('Invalid email address'),
    password: z.string({ required_error: 'Password is required' }).min(6, 'Password must be at least 6 characters long'),
    mobile_number: z.string().min(10, 'Mobile number must be at least 10 digits').max(15, 'Mobile number must not exceed 15 digits').optional().nullable(),
    role: z.enum(['ADMIN', 'CUSTOMER']).optional(),
});

export const updateUserSchema = z.object({
    name: z.string().min(1, 'Name cannot be empty').optional(),
    mobile_number: z.string().min(10, 'Mobile number must be at least 10 digits').max(15, 'Mobile number must not exceed 15 digits').optional().nullable(),
    role: z.enum(['ADMIN', 'CUSTOMER']).optional(),
    is_active: z.boolean().optional(),
});
