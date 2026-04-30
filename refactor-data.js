const fs = require('fs');
const path = require('path');

const filesToClean = [
    path.join(__dirname, 'app', 'shop', 'ShopClient.tsx'),
    path.join(__dirname, 'app', 'product', '[id]', 'page.tsx'),
    path.join(__dirname, 'components', 'shop', 'AnimatedProductGrid.tsx') // JIC
];

filesToClean.forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');

    // Remove PRODUCTS
    content = content.replace(/\/\/ Static Data[\s\S]*?const PRODUCTS = \[\s*\{[\s\S]*?\}\s*\];/g, '');
    content = content.replace(/const PRODUCTS = \[\s*\{[\s\S]*?\}\s*\];/g, '');

    // Remove CATEGORIES
    content = content.replace(/const CATEGORIES = \[\s*"(All|"Fresh Produce)[\s\S]*?\];/g, '');

    // Add import if not exists
    if (content.includes('export function') || content.includes('export default')) {
        if (!content.includes("import { PRODUCTS")) {
            // Find last import
            const importMatches = [...content.matchAll(/^import .*$/gm)];
            const lastImport = importMatches[importMatches.length - 1];
            if (lastImport) {
                const insertPos = lastImport.index + lastImport[0].length;
                const toInsert = `\nimport { PRODUCTS, CATEGORIES } from '@/lib/data';`;
                content = content.slice(0, insertPos) + toInsert + content.slice(insertPos);
            } else {
                content = `import { PRODUCTS, CATEGORIES } from '@/lib/data';\n` + content;
            }
        }
    }

    fs.writeFileSync(file, content, 'utf8');
    console.log(`Cleaned up arrays in: ${file}`);
});
