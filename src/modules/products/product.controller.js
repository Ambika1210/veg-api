import productService from './product.service.js';
import logger from '../../utils/logger.js';

class ProductController {
    createProduct = async (req, res) => {
        try {
            const product = await productService.createProduct(req.body);

            logger.info(`ProductController >>>> createProduct >>>> Product ${product.id} created successfully`, {
                productId: product.id,
                name: product.name,
                price: product.price,
            });

            return res.status(201).json({
                success: true,
                message: 'Product created successfully',
                data: product,
            });
        } catch (error) {
            logger.error(`ProductController >>>> createProduct >>>> Failed to create product: ${error.message}`, {
                error: error.message,
            });

            return res.status(500).json({
                success: false,
                message: error.message || 'Failed to create product',
            });
        }
    };

    getProductById = async (req, res) => {
        const { id } = req.params;
        try {
            const product = await productService.getProductById(id);

            logger.info(`ProductController >>>> getProductById >>>> Product ${id} fetched successfully`, {
                productId: id,
            });

            return res.status(200).json({
                success: true,
                message: 'Product fetched successfully',
                data: product,
            });
        } catch (error) {
            logger.error(`ProductController >>>> getProductById >>>> Failed to fetch product ${id}: ${error.message}`, {
                productId: id,
                error: error.message,
            });

            if (error.message.includes('not found')) {
                return res.status(404).json({
                    success: false,
                    message: error.message,
                });
            }

            return res.status(500).json({
                success: false,
                message: error.message || 'Failed to fetch product',
            });
        }
    };

    getAllProducts = async (req, res) => {
        try {
            const { page, limit, search } = req.query;
            const result = await productService.getAllProducts({ page, limit, search });

            logger.info(`ProductController >>>> getAllProducts >>>> Fetched ${result.products.length} products successfully (Page: ${result.pagination.page}/${result.pagination.totalPages}, Total: ${result.pagination.total})`, {
                page: result.pagination.page,
                limit: result.pagination.limit,
                total: result.pagination.total,
            });

            return res.status(200).json({
                success: true,
                message: 'Products fetched successfully',
                data: result.products,
                pagination: result.pagination,
            });
        } catch (error) {
            logger.error(`ProductController >>>> getAllProducts >>>> Failed to fetch products: ${error.message}`, {
                error: error.message,
            });

            return res.status(500).json({
                success: false,
                message: error.message || 'Failed to fetch products',
            });
        }
    };
}

const productController = new ProductController();
export default productController;
