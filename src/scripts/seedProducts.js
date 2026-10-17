import pool from '../database/db.js';
import logger from '../utils/logger.js';
import chalk from '../utils/chalk.js';

const productsList = [
    { name: 'Fresh Hybrid Tomato', price: 38.00, image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80' },
    { name: 'Desi Red Tomato', price: 45.00, image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=600&auto=format&fit=crop&q=80' },
    { name: 'Nashik Red Onions', price: 35.00, image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80' },
    { name: 'White Sweet Onions', price: 48.00, image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&auto=format&fit=crop&q=80' },
    { name: 'Fresh Spring Onion', price: 25.00, image: 'https://images.unsplash.com/photo-1580201092675-a0a6a6cafbb1?w=600&auto=format&fit=crop&q=80' },
    { name: 'Farm Fresh Potato (Aloo)', price: 30.00, image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80' },
    { name: 'Baby Potatoes (Dum Aloo)', price: 42.00, image: 'https://images.unsplash.com/photo-1508313880080-c4bef0730395?w=600&auto=format&fit=crop&q=80' },
    { name: 'Sweet Potato (Shakarkandi)', price: 55.00, image: 'https://images.unsplash.com/photo-1596097635121-14b63b7a0c19?w=600&auto=format&fit=crop&q=80' },
    { name: 'Green Bell Pepper (Capsicum)', price: 60.00, image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=600&auto=format&fit=crop&q=80' },
    { name: 'Red Bell Pepper', price: 120.00, image: 'https://images.unsplash.com/photo-1525607551316-4a8e16d1f9ba?w=600&auto=format&fit=crop&q=80' },
    { name: 'Yellow Bell Pepper', price: 130.00, image: 'https://images.unsplash.com/photo-1557844352-761f2565b576?w=600&auto=format&fit=crop&q=80' },
    { name: 'Spicy Green Chilli (Hari Mirch)', price: 20.00, image: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=600&auto=format&fit=crop&q=80' },
    { name: 'Fresh Ginger (Adrak)', price: 90.00, image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop&q=80' },
    { name: 'Garlic Bulbs (Lahsun)', price: 180.00, image: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?w=600&auto=format&fit=crop&q=80' },
    { name: 'Fresh Coriander (Dhaniya)', price: 15.00, image: 'https://images.unsplash.com/photo-1599818816945-8851410d517c?w=600&auto=format&fit=crop&q=80' },
    { name: 'Aromatic Mint (Pudina)', price: 18.00, image: 'https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?w=600&auto=format&fit=crop&q=80' },
    { name: 'Organic Curry Leaves', price: 12.00, image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=600&auto=format&fit=crop&q=80' },
    { name: 'Farm Fresh Spinach (Palak)', price: 28.00, image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&auto=format&fit=crop&q=80' },
    { name: 'Fresh Methi Leaves', price: 25.00, image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80' },
    { name: 'Mustard Greens (Sarson)', price: 30.00, image: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=600&auto=format&fit=crop&q=80' },
    { name: 'Crisp Green Cabbage', price: 35.00, image: 'https://images.unsplash.com/photo-1611105637889-3ca532f503fd?w=600&auto=format&fit=crop&q=80' },
    { name: 'Red Purple Cabbage', price: 65.00, image: 'https://images.unsplash.com/photo-1598030304671-5aa1d6f21128?w=600&auto=format&fit=crop&q=80' },
    { name: 'Fresh Cauliflower (Phool Gobhi)', price: 45.00, image: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=600&auto=format&fit=crop&q=80' },
    { name: 'Fresh Green Broccoli', price: 95.00, image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=600&auto=format&fit=crop&q=80' },
    { name: 'Sweet Green Peas (Matar)', price: 75.00, image: 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=600&auto=format&fit=crop&q=80' },
    { name: 'Tender Ladyfinger (Bhindi)', price: 50.00, image: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=600&auto=format&fit=crop&q=80' },
    { name: 'Fresh Bottle Gourd (Lauki)', price: 35.00, image: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=600&auto=format&fit=crop&q=80' },
    { name: 'Bitter Gourd (Karela)', price: 55.00, image: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=600&auto=format&fit=crop&q=80' },
    { name: 'Ridge Gourd (Turai)', price: 45.00, image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=600&auto=format&fit=crop&q=80' },
    { name: 'Sponge Gourd (Ghilki)', price: 42.00, image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&auto=format&fit=crop&q=80' },
    { name: 'Pointed Gourd (Parwal)', price: 65.00, image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&auto=format&fit=crop&q=80' },
    { name: 'Ivy Gourd (Kundru)', price: 40.00, image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=600&auto=format&fit=crop&q=80' },
    { name: 'Fresh Yellow Pumpkin', price: 30.00, image: 'https://images.unsplash.com/photo-1506917728037-b6fb01c42813?w=600&auto=format&fit=crop&q=80' },
    { name: 'Juicy Green Cucumber (Kheera)', price: 35.00, image: 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=600&auto=format&fit=crop&q=80' },
    { name: 'English Cucumber', price: 50.00, image: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=600&auto=format&fit=crop&q=80' },
    { name: 'Farm Fresh Beetroot', price: 40.00, image: 'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?w=600&auto=format&fit=crop&q=80' },
    { name: 'Sweet Red Carrot (Delhi Gajar)', price: 45.00, image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&auto=format&fit=crop&q=80' },
    { name: 'Crunchy Orange Carrot', price: 55.00, image: 'https://images.unsplash.com/photo-1447175008436-054170c2e979?w=600&auto=format&fit=crop&q=80' },
    { name: 'White Radish (Mooli)', price: 30.00, image: 'https://images.unsplash.com/photo-1593105544559-ecb03bf76f82?w=600&auto=format&fit=crop&q=80' },
    { name: 'Red Radish Bunch', price: 45.00, image: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=600&auto=format&fit=crop&q=80' },
    { name: 'Fresh Purple Brinjal (Bharta)', price: 40.00, image: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=600&auto=format&fit=crop&q=80' },
    { name: 'Small Round Brinjal (Baingan)', price: 45.00, image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop&q=80' },
    { name: 'Drumsticks (Sahjan)', price: 70.00, image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80' },
    { name: 'Raw Banana (Kacha Kela)', price: 35.00, image: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=600&auto=format&fit=crop&q=80' },
    { name: 'Raw Green Papaya', price: 40.00, image: 'https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?w=600&auto=format&fit=crop&q=80' },
    { name: 'Sour Green Mango (Keri)', price: 60.00, image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&auto=format&fit=crop&q=80' },
    { name: 'Fresh Juicy Lemon (Nimbu)', price: 60.00, image: 'https://images.unsplash.com/photo-1533082695507-6a4a496291a2?w=600&auto=format&fit=crop&q=80' },
    { name: 'Fresh Button Mushrooms', price: 55.00, image: 'https://images.unsplash.com/photo-1504544750208-dc0358e5397c?w=600&auto=format&fit=crop&q=80' },
    { name: 'Fresh Sweet Corn Cob', price: 25.00, image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&auto=format&fit=crop&q=80' },
    { name: 'Tender Baby Corn', price: 60.00, image: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=600&auto=format&fit=crop&q=80' },
    { name: 'French Beans', price: 65.00, image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&auto=format&fit=crop&q=80' },
    { name: 'Cluster Beans (Gawar Phali)', price: 50.00, image: 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=600&auto=format&fit=crop&q=80' },
    { name: 'Green Zucchini', price: 80.00, image: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=600&auto=format&fit=crop&q=80' },
    { name: 'Yellow Zucchini', price: 90.00, image: 'https://images.unsplash.com/photo-1557844352-761f2565b576?w=600&auto=format&fit=crop&q=80' },
    { name: 'Iceberg Lettuce', price: 65.00, image: 'https://images.unsplash.com/photo-1556801712-76c8eb07bbc9?w=600&auto=format&fit=crop&q=80' },
    { name: 'Fresh Colocasia (Arbi)', price: 55.00, image: 'https://images.unsplash.com/photo-1596097635121-14b63b7a0c19?w=600&auto=format&fit=crop&q=80' },
    { name: 'Elephant Yam (Suran)', price: 60.00, image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80' },
    { name: 'Raw Turmeric (Kachi Haldi)', price: 70.00, image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop&q=80' },
    { name: 'Crisp Green Apple', price: 180.00, image: 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=600&auto=format&fit=crop&q=80' },
    { name: 'Red Royal Delicious Apple', price: 160.00, image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80' },
    { name: 'Kashmir Sweet Apple', price: 150.00, image: 'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=600&auto=format&fit=crop&q=80' },
    { name: 'Cavendish Robusta Banana', price: 50.00, image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80' },
    { name: 'Yellaki Mini Banana', price: 70.00, image: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=600&auto=format&fit=crop&q=80' },
    { name: 'Ratnagiri Alphonso Mango', price: 450.00, image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&auto=format&fit=crop&q=80' },
    { name: 'Sweet Kesar Mango', price: 300.00, image: 'https://images.unsplash.com/photo-1591073113125-e46713c829ed?w=600&auto=format&fit=crop&q=80' },
    { name: 'Mosambi (Sweet Lime)', price: 80.00, image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=600&auto=format&fit=crop&q=80' },
    { name: 'Nagpur Sweet Orange (Santra)', price: 90.00, image: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=600&auto=format&fit=crop&q=80' },
    { name: 'Red Ruby Pomegranate (Anar)', price: 160.00, image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop&q=80' },
    { name: 'Ripe Sweet Papaya', price: 55.00, image: 'https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?w=600&auto=format&fit=crop&q=80' },
    { name: 'Fresh Tropical Pineapple', price: 75.00, image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=600&auto=format&fit=crop&q=80' },
    { name: 'Juicy Striped Watermelon', price: 40.00, image: 'https://images.unsplash.com/photo-1587049352847-4a222e784d38?w=600&auto=format&fit=crop&q=80' },
    { name: 'Sweet Muskmelon (Kharbuja)', price: 50.00, image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80' },
    { name: 'Allahabad Sweet Guava (Amrood)', price: 65.00, image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&auto=format&fit=crop&q=80' },
    { name: 'Seedless Green Grapes', price: 90.00, image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=600&auto=format&fit=crop&q=80' },
    { name: 'Sharad Seedless Black Grapes', price: 110.00, image: 'https://images.unsplash.com/photo-1596363505729-4190a9506133?w=600&auto=format&fit=crop&q=80' },
    { name: 'Imported Red Globe Grapes', price: 190.00, image: 'https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=600&auto=format&fit=crop&q=80' },
    { name: 'Zespri Green Kiwi (Pack of 3)', price: 99.00, image: 'https://images.unsplash.com/photo-1585059895524-72359e06133a?w=600&auto=format&fit=crop&q=80' },
    { name: 'Mahabaleshwar Fresh Strawberries', price: 140.00, image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=600&auto=format&fit=crop&q=80' },
    { name: 'Fresh Blueberries (125g)', price: 210.00, image: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=600&auto=format&fit=crop&q=80' },
    { name: 'Red Dragon Fruit', price: 110.00, image: 'https://images.unsplash.com/photo-1527324688151-0e627063f2b1?w=600&auto=format&fit=crop&q=80' },
    { name: 'Sweet Custard Apple (Sitaphal)', price: 120.00, image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=600&auto=format&fit=crop&q=80' },
    { name: 'Fresh Sapodilla (Chiku)', price: 60.00, image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop&q=80' },
    { name: 'Dry Coconut (Nariyal)', price: 35.00, image: 'https://images.unsplash.com/photo-1544378730-8b5104b18790?w=600&auto=format&fit=crop&q=80' },
    { name: 'Tender Coconut (Nariyal Pani)', price: 60.00, image: 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=600&auto=format&fit=crop&q=80' },
    { name: 'Organic A2 Cow Milk (1 Litre)', price: 78.00, image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80' },
    { name: 'Pure Buffalo Fresh Milk (1 Litre)', price: 82.00, image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&auto=format&fit=crop&q=80' },
    { name: 'Fresh Malai Paneer (200g)', price: 90.00, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80' },
    { name: 'Pure Desi Cow Ghee (500ml)', price: 399.00, image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600&auto=format&fit=crop&q=80' },
    { name: 'Fresh Farm Curd / Dahi (400g)', price: 40.00, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80' },
    { name: 'Salted Farm Butter (100g)', price: 56.00, image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600&auto=format&fit=crop&q=80' },
    { name: 'Unsalted White Butter (Makhan)', price: 110.00, image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80' },
    { name: 'Fresh Tofu (Soy Paneer 200g)', price: 65.00, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80' },
    { name: 'Organic Sprouted Moong (250g)', price: 45.00, image: 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=600&auto=format&fit=crop&q=80' },
    { name: 'Fresh Amla (Indian Gooseberry)', price: 50.00, image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=600&auto=format&fit=crop&q=80' },
    { name: 'Organic Lemon Grass Bunch', price: 25.00, image: 'https://images.unsplash.com/photo-1599818816945-8851410d517c?w=600&auto=format&fit=crop&q=80' },
    { name: 'Fresh Italian Basil Leaves', price: 35.00, image: 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=600&auto=format&fit=crop&q=80' },
    { name: 'Rosemary Fresh Herb', price: 40.00, image: 'https://images.unsplash.com/photo-1599818816945-8851410d517c?w=600&auto=format&fit=crop&q=80' },
    { name: 'Fresh Thyme Leaves', price: 40.00, image: 'https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?w=600&auto=format&fit=crop&q=80' },
    { name: 'Organic Parsley Bunch', price: 35.00, image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&auto=format&fit=crop&q=80' },
    { name: 'Green Avocados (Hass 1 Pc)', price: 140.00, image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=600&auto=format&fit=crop&q=80' },
];

const seedProducts = async () => {
    try {
        console.log(chalk.getReq('========================================'));
        console.log(chalk.getReq('      SEEDING 100 FRESH PRODUCTS        '));
        console.log(chalk.getReq('========================================'));

        // 1. Ensure columns exist
        await pool.query('ALTER TABLE products ADD COLUMN IF NOT EXISTS name VARCHAR(150);');
        await pool.query('ALTER TABLE products ADD COLUMN IF NOT EXISTS image TEXT;');
        await pool.query('ALTER TABLE products ALTER COLUMN category DROP NOT NULL;');

        let insertedCount = 0;
        let skippedCount = 0;

        for (const item of productsList) {
            // Check if product already exists by name
            const checkQuery = `
                SELECT id FROM products 
                WHERE name = $1 OR product_name = $1;
            `;
            const checkResult = await pool.query(checkQuery, [item.name]);

            if (checkResult.rows.length === 0) {
                const insertQuery = `
                    INSERT INTO products (name, product_name, image, image_url, price, is_available)
                    VALUES ($1, $1, $2, $2, $3, true);
                `;
                await pool.query(insertQuery, [item.name, item.image, item.price]);
                insertedCount++;
            } else {
                // Update image and price if missing
                const updateQuery = `
                    UPDATE products 
                    SET image = COALESCE(image, $1), 
                        image_url = COALESCE(image_url, $1), 
                        name = COALESCE(name, $2),
                        price = $3
                    WHERE id = $4;
                `;
                await pool.query(updateQuery, [item.image, item.name, item.price, checkResult.rows[0].id]);
                skippedCount++;
            }
        }

        const totalRes = await pool.query('SELECT COUNT(*) FROM products;');
        const total = totalRes.rows[0].count;

        logger.info(`seedProducts >>>> Inserted ${insertedCount} new products. Total in DB: ${total}`);

        console.log(chalk.success(`✔ Newly Inserted : ${insertedCount}`));
        console.log(chalk.postReq(`✔ Updated/Skipped : ${skippedCount}`));
        console.log(chalk.success(`✔ Total Products in DB : ${total}`));
        console.log(chalk.getReq('========================================'));

        process.exit(0);
    } catch (error) {
        logger.error(`seedProducts >>>> Error: ${error.message}`, {
            error: error.message,
            stack: error.stack,
        });
        console.error(chalk.error(`✖ Seeding failed: ${error.message}`));
        process.exit(1);
    }
};

seedProducts();
