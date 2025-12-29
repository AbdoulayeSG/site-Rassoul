const fs = require('fs');
const path = require('path');

// Directories
const productsDir = path.join(__dirname, 'products');
const outputFile = path.join(productsDir, 'products.json');

console.log('🔨 Building products database...');

try {
    // Ensure products directory exists
    if (!fs.existsSync(productsDir)) {
        fs.mkdirSync(productsDir, { recursive: true });
    }

    // Read all JSON files in products directory (excluding products.json)
    const files = fs.readdirSync(productsDir)
        .filter(file => file.endsWith('.json') && file !== 'products.json');

    const products = [];

    // Read each product file
    files.forEach(file => {
        try {
            const filePath = path.join(productsDir, file);
            const content = fs.readFileSync(filePath, 'utf8');
            const product = JSON.parse(content);
            products.push(product);
            console.log(`✅ Loaded: ${product.name || file}`);
        } catch (error) {
            console.error(`❌ Error reading ${file}:`, error.message);
        }
    });

    // Create aggregated products.json
    const output = {
        products: products,
        lastUpdated: new Date().toISOString(),
        count: products.length
    };

    fs.writeFileSync(outputFile, JSON.stringify(output, null, 2));
    console.log(`\n✨ Build complete! ${products.length} products generated.`);
    console.log(`📄 Output: ${outputFile}`);

} catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
}