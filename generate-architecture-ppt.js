const pptxgen = require("pptxgenjs");

const pptx = new pptxgen();

// Set presentation properties
pptx.author = "Yogam Organic Farms Team";
pptx.title = "Perfect Architecture Diagram";
pptx.layout = "LAYOUT_16x9"; // 10 x 5.625 inches

const slide = pptx.addSlide();
slide.background = { color: "F8FAFC" }; // Slate 50 background

// Title
slide.addText("YOGAM ORGANIC FARMS - SYSTEM ARCHITECTURE", {
    x: 0, y: 0.3, w: "100%", h: 0.6,
    align: "center", fontFace: "Inter", fontSize: 24, bold: true, color: "0F172A" // Slate 900
});

// Helper for drawing a professional box with a shadow
function drawBox(x, y, w, h, title, items, colorTheme) {
    // Shadow
    slide.addShape("rect", {
        x: x + 0.05, y: y + 0.05, w: w, h: h,
        fill: { color: "000000", transparency: 80 }
    });

    // Main Container
    slide.addShape("rect", {
        x: x, y: y, w: w, h: h,
        fill: { color: colorTheme.bg },
        line: { color: colorTheme.border, width: 2 }
    });

    // Box Title
    slide.addText(title, {
        x: x, y: y + 0.1, w: w, h: 0.4,
        align: "center", fontFace: "Inter", fontSize: 16, bold: true, color: colorTheme.text
    });

    // Sub-items
    if (items && items.length > 0) {
        let itemY = y + 0.7;
        for (const item of items) {
            slide.addShape("rect", {
                x: x + 0.2, y: itemY, w: w - 0.4, h: 0.4,
                fill: { color: colorTheme.itemBg },
                line: { color: colorTheme.border, width: 1 }
            });
            slide.addText(item, {
                x: x + 0.2, y: itemY, w: w - 0.4, h: 0.4,
                align: "center", fontFace: "Inter", fontSize: 12, bold: true, color: colorTheme.itemText
            });
            itemY += 0.55;
        }
    }
}

// -------------------------------------------------------------
// Theming
// -------------------------------------------------------------
const uiTheme = { bg: "EFF6FF", border: "3B82F6", text: "1E3A8A", itemBg: "FFFFFF", itemText: "2563EB" }; // Blue
const apiTheme = { bg: "ECFDF5", border: "10B981", text: "064E3B", itemBg: "FFFFFF", itemText: "059669" }; // Green
const dbTheme = { bg: "FFFBEB", border: "F59E0B", text: "78350F", itemBg: "FFFFFF", itemText: "D97706" }; // Amber
const authTheme = { bg: "F3E8FF", border: "A855F7", text: "4C1D95", itemBg: "FFFFFF", itemText: "7E22CE" }; // Purple
const deployTheme = { bg: "F1F5F9", border: "64748B", text: "0F172A", itemBg: "FFFFFF", itemText: "334155" }; // Slate

// -------------------------------------------------------------
// Layout (Left to Right)
// -------------------------------------------------------------
const yStart = 1.3;

// 1. Client Layer (Frontend)
drawBox(0.8, yStart, 2.2, 2.5, "Client Layer", ["React.js UI", "Tailwind CSS", "Framer Motion"], uiTheme);

// Arrow 1
slide.addShape("rightArrow", { x: 3.1, y: 2.3, w: 0.6, h: 0.3, fill: { color: "94A3B8" }, line: { color: "64748B" } });
slide.addText("HTTP/JSON", { x: 3.0, y: 2.0, w: 0.8, h: 0.3, align: "center", fontSize: 10, color: "64748B" });

// 2. Server Layer (API)
drawBox(3.8, yStart, 2.2, 2.5, "Server Layer (API)", ["Next.js Server", "Edge Runtime", "API Routes"], apiTheme);

// Auth Module (Hooks into Server Layer)
slide.addShape("rightArrow", { x: 4.6, y: 3.9, w: 0.6, h: 0.5, fill: { color: "94A3B8" }, rotate: 90 });
drawBox(3.8, 4.4, 2.2, 1.0, "Security Layer", ["NextAuth.js (JWT)"], authTheme);

// Arrow 2
slide.addShape("rightArrow", { x: 6.1, y: 2.3, w: 0.6, h: 0.3, fill: { color: "94A3B8" }, line: { color: "64748B" } });
slide.addText("Prisma Client", { x: 6.0, y: 2.0, w: 0.8, h: 0.3, align: "center", fontSize: 10, color: "64748B" });

// 3. Database Layer
drawBox(6.8, yStart, 2.2, 2.5, "Data Layer", ["PostgreSQL Database", "Prisma Schema", "Seed Data"], dbTheme);

// -------------------------------------------------------------
// Bottom Cross-Cutting (Infrastructure/Deployment)
// -------------------------------------------------------------
drawBox(0.8, 4.4, 2.2, 1.0, "Deployment", ["Vercel Hosting"], deployTheme);
drawBox(6.8, 4.4, 2.2, 1.0, "Storage", ["Cloudinary / S3", "(Image Assets)"], deployTheme);

// Connect Deployment to Client & Server
slide.addShape("line", { x: 1.9, y: 3.8, w: 0, h: 0.6, line: { color: "94A3B8", width: 2, dashType: "dash" } });
slide.addShape("line", { x: 7.9, y: 3.8, w: 0, h: 0.6, line: { color: "94A3B8", width: 2, dashType: "dash" } });

// Save
pptx.writeFile({ fileName: "Professional_Architecture_Diagram.pptx" }).then(fileName => {
    console.log(`Successfully generated PowerPoint file: ${fileName}`);
});
