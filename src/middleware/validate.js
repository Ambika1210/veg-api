export const validate = (schema) => (req, res, next) => {
    try {
        const parsed = schema.safeParse(req.body);
        if (!parsed.success) {
            const formattedErrors = parsed.error.issues.map((issue) => ({
                field: issue.path.join('.'),
                message: issue.message,
            }));

            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: formattedErrors,
            });
        }

        req.body = parsed.data;
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error during validation',
        });
    }
};

export default validate;
