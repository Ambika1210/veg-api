import {
    createProductInDb,
    getProductByIdFromDb,
    getAllProductsFromDb,
} from './product.repository.js';
import logger from '../../utils/logger.js';

class ProductService {
    createProduct = async (productData) => {
        try {
            const { name, image, price } = productData;

            const product = await createProductInDb({
                name,
                image,
                price: parseFloat(price),
            });

            return product;
        } catch (error) {
            logger.error(`ProductService >>>> createProduct >>>> Error: ${error.message}`, {
                error: error.message,
            });
            throw error;
        }
    };

    getProductById = async (id) => {
        try {
            const product = await getProductByIdFromDb(id);
            if (!product) {
                throw new Error('Product not found');
            }
            return product;
        } catch (error) {
            logger.error(`ProductService >>>> getProductById >>>> Error: ${error.message}`, {
                productId: id,
                error: error.message,
            });
            throw error;
        }
    };

    getAllProducts = async ({ page = 1, limit = 10, search }) => {
        try {
            const pageNum = Math.max(1, parseInt(page, 10) || 1);
            const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
            const offset = (pageNum - 1) * limitNum;

            const { products, total } = await getAllProductsFromDb({
                limit: limitNum,
                offset,
                search,
            });

            const totalPages = Math.ceil(total / limitNum);

            return {
                products,
                pagination: {
                    total,
                    page: pageNum,
                    limit: limitNum,
                    totalPages,
                    hasNextPage: pageNum < totalPages,
                    hasPrevPage: pageNum > 1,
                },
            };
        } catch (error) {
            logger.error(`ProductService >>>> getAllProducts >>>> Error: ${error.message}`, {
                error: error.message,
            });
            throw error;
        }
    };
}

const productService = new ProductService();
export default productService;
