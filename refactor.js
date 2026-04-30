const fs = require('fs');
const path = require('path');

const dirsToScan = [
    path.join(__dirname, 'app'),
    path.join(__dirname, 'components'),
    path.join(__dirname, 'context')
];

function processDirectory(directory) {
    if (!fs.existsSync(directory)) return;

    const files = fs.readdirSync(directory);

    for (const file of files) {
        const fullPath = path.join(directory, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let originalContent = content;

            // Global Replacements
            content = content.replace(/@\/app\/components/g, '@/components');
            content = content.replace(/@\/app\/context/g, '@/context');

            // Catch weird relative imports
            content = content.replace(/from\s+['"](?:\.\.\/)+components\/(.*)['"]/g, "from '@/components/$1'");
            content = content.replace(/from\s+['"](?:\.\.\/)+context\/(.*)['"]/g, "from '@/context/$1'");

            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated imports in: ${fullPath}`);
            }
        }
    }
}

// Safer Directory Moving for Windows (Copy then Delete)
function safeMove(src, dest) {
    if (fs.existsSync(src) && !fs.existsSync(dest)) {
        console.log(`Copying ${src} to ${dest}...`);
        fs.cpSync(src, dest, { recursive: true });
        console.log(`Deleting original ${src}...`);
        try {
            fs.rmSync(src, { recursive: true, force: true });
        } catch (e) {
            console.warn(`Failed to delete ${src}. Windows lock might be active. Ensure IDE isn't holding it.`);
        }
    }
}

const appComponents = path.join(__dirname, 'app', 'components');
const rootComponents = path.join(__dirname, 'components');
safeMove(appComponents, rootComponents);

const appContext = path.join(__dirname, 'app', 'context');
const rootContext = path.join(__dirname, 'context');
safeMove(appContext, rootContext);

// Then process files
dirsToScan.forEach(dir => processDirectory(dir));

// Destroy loader-test and order-confirmation
const toDelete = [
    path.join(__dirname, 'app', 'loader-test'),
    path.join(__dirname, 'app', 'order-confirmation')
];

toDelete.forEach(p => {
    if (fs.existsSync(p)) {
        try {
            fs.rmSync(p, { recursive: true, force: true });
            console.log(`Deleted ${p}`);
        } catch (e) {
            console.warn(`Failed to delete ${p}.`);
        }
    }
});
