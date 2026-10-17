import { z } from 'zod';

export const createProductSchema = z.object({
    name: z.string({ required_error: 'Product name is required' }).min(1, 'Product name cannot be empty'),
    image: z.string().optional().nullable(),
    price: z.coerce.number({ required_error: 'Product price is required' }).min(0, 'Price must be greater than or equal to 0'),
});
