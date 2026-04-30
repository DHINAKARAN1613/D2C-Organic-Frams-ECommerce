const pptxgen = require("pptxgenjs");
const pptx = new pptxgen();

// Set presentation properties
pptx.author = "Yogam Organic Farms Team";
pptx.company = "Sri Muthukumaran Institute of Technology";
pptx.revision = "2";
pptx.subject = "Project Presentation";
pptx.title = "Yogam Organic Farms";
pptx.layout = "LAYOUT_16x9";

// Modern Color Palette
const colors = {
    primary: "166534",      // Deep Green
    secondary: "22C55E",    // Bright Green
    accent: "FDE047",       // Vibrant Yellow
    darkText: "0F172A",     // Slate 900
    midText: "334155",      // Slate 700
    lightText: "64748B",    // Slate 500
    bgLight: "F8FAFC",      // Slate 50
    white: "FFFFFF"
};

// Define Master Slide for consistent, modern branding
pptx.defineSlideMaster({
    title: "MODERN_MASTER",
    background: { color: colors.bgLight },
    objects: [
        // Top vibrant brand bar
        { rect: { x: 0, y: 0, w: "100%", h: 0.15, fill: { color: colors.secondary } } },
        // Bottom deep green footer bar
        { rect: { x: 0, y: 5.3, w: "100%", h: 0.35, fill: { color: colors.primary } } },
        // Footer Text
        { text: { text: "Yogam Organic Farms | Next.js E-Commerce Platform", options: { x: 0.5, y: 5.35, w: 4, h: 0.2, fontFace: "Helvetica", fontSize: 10, color: colors.white, bold: true } } },
        { text: { text: "Sri Muthukumaran Institute of Technology", options: { x: 5.5, y: 5.35, w: 4, h: 0.2, fontFace: "Helvetica", fontSize: 10, color: colors.white, align: "right" } } }
    ]
});

// Helper for slide titles
const addSlideTitle = (slide, title) => {
    slide.addText(title, {
        x: 0.5, y: 0.4, w: 9, h: 0.6,
        fontFace: "Helvetica", fontSize: 26, bold: true, color: colors.primary
    });
    slide.addShape("line", { x: 0.5, y: 1.0, w: 9, h: 0, line: { color: colors.secondary, width: 2 } });
};

// -------------------------------------------------------------
// Slide 1: Modern Title Slide
// -------------------------------------------------------------
const slide1 = pptx.addSlide({ masterName: "MODERN_MASTER" });

// Background image for title slide with overlay
slide1.addImage({ path: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=1920", x: 0, y: 0, w: "100%", h: 5.3 });
slide1.addShape("rect", { x: 0, y: 0, w: "100%", h: 5.3, fill: { color: "000000", transparency: 60 } });

slide1.addText("YOGAM ORGANIC FARMS", {
    x: 0, y: 1.2, w: "100%", h: 0.8, align: "center", fontFace: "Helvetica", fontSize: 36, bold: true, color: colors.secondary
});

// Updated Title String
slide1.addText("A Direct-to-Consumer Sustainable E-Commerce Platform for Organic Produce using Next.js", {
    x: 1, y: 2.0, w: 8, h: 1.2, align: "center", fontFace: "Helvetica", fontSize: 24, bold: true, color: colors.white
});

// Student & Guide Details
slide1.addShape("rect", { x: 1, y: 3.8, w: 3.5, h: 1.0, fill: { color: colors.white, transparency: 10 }, line: { color: colors.white, width: 1 } });
slide1.addText("Submitted By:\nYour Name\nYour Register Number", {
    x: 1, y: 3.8, w: 3.5, h: 1.0, align: "center", fontFace: "Helvetica", fontSize: 14, bold: true, color: colors.white
});

slide1.addShape("rect", { x: 5.5, y: 3.8, w: 3.5, h: 1.0, fill: { color: colors.white, transparency: 10 }, line: { color: colors.white, width: 1 } });
slide1.addText("Under the Guidance of:\nGuide Name\nGuide Designation", {
    x: 5.5, y: 3.8, w: 3.5, h: 1.0, align: "center", fontFace: "Helvetica", fontSize: 14, bold: true, color: colors.white
});

// -------------------------------------------------------------
// Slide 2: Abstract (Adapted to Title)
// -------------------------------------------------------------
const slide2 = pptx.addSlide({ masterName: "MODERN_MASTER" });
addSlideTitle(slide2, "Abstract");

slide2.addText([
    { text: "• Built on Next.js, this platform resolves the disconnect between organic growers and sustainably-minded consumers.\n\n" },
    { text: "• Empowers farmers with a Direct-to-Consumer (D2C) pipeline, maximizing profits and cutting out wholesale intermediaries.\n\n" },
    { text: "• Features Server-Side Rendering (SSR) for blazing performance, full cart/checkout functionality, and Prisma-backed PostgreSQL storage.\n\n" },
    { text: "• Integrates modern UI libraries (Tailwind CSS, Framer Motion) for an enterprise-level shopping experience." }
], { x: 0.5, y: 1.2, w: 5.5, h: 3.5, fontFace: "Helvetica", fontSize: 18, color: colors.midText, bullet: { type: 'number' } });

// Add related image to the right
slide2.addImage({ path: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800", x: 6.5, y: 1.2, w: 3, h: 3.5, sizing: { type: 'crop' } });

// -------------------------------------------------------------
// Slide 3: Scope of the Project
// -------------------------------------------------------------
const slide3 = pptx.addSlide({ masterName: "MODERN_MASTER" });
addSlideTitle(slide3, "Scope of the Project");
slide3.addText([
    { text: "• Develop a scalable, React-based marketplace specifically for verified organic farm produce.\n\n" },
    { text: "• Provide an authenticated Admin Dashboard to track inventory, revenue analytics, and order fulfillment states dynamically.\n\n" },
    { text: "• Implement highly responsive front-end layouts adapting perfectly to mobile, tablet, and desktop environments.\n\n" },
    { text: "• Secure user data, local address formatting, and checkout sessions utilizing NextAuth.js and JWT.\n\n" },
    { text: "• Integrate a secure third-party Payment Gateway (e.g., Stripe/Razorpay) to process online transactions securely." }
], { x: 0.5, y: 1.2, w: 9, h: 3.7, fontFace: "Helvetica", fontSize: 17, color: colors.midText, bullet: true });

// -------------------------------------------------------------
// Slide 4: Existing System vs. Proposed System
// -------------------------------------------------------------
const slide4 = pptx.addSlide({ masterName: "MODERN_MASTER" });
addSlideTitle(slide4, "Systems Comparison");

// Existing Box
slide4.addShape("rect", { x: 0.5, y: 1.2, w: 4.25, h: 3.5, fill: { color: "FEE2E2" }, line: { color: "DC2626", width: 2 } });
slide4.addText("Existing Methods (Drawbacks)", { x: 0.5, y: 1.4, w: 4.25, h: 0.4, align: "center", fontFace: "Helvetica", fontSize: 18, bold: true, color: "991B1B" });
slide4.addText([
    { text: "• Over-reliance on wholesale brokers draining farmers' margins.\n" },
    { text: "• Slow, manual inventory tracking practices leading to food spoilage.\n" },
    { text: "• Inflated pricing for the end-consumer due to supply chain bloat.\n" },
    { text: "• Zero transparency regarding organic produce origin." }
], { x: 0.6, y: 2.0, w: 4.0, h: 2.5, fontFace: "Helvetica", fontSize: 16, color: colors.darkText, bullet: true });

// Proposed Box
slide4.addShape("rect", { x: 5.25, y: 1.2, w: 4.25, h: 3.5, fill: { color: "DCFCE7" }, line: { color: "16A34A", width: 2 } });
slide4.addText("Proposed System (Advantages)", { x: 5.25, y: 1.4, w: 4.25, h: 0.4, align: "center", fontFace: "Helvetica", fontSize: 18, bold: true, color: "166534" });
slide4.addText([
    { text: "• Re-routing consumer purchases directly into farmers' revenue.\n" },
    { text: "• Real-time, Next.js API-driven automated stock management.\n" },
    { text: "• Integrated Payment Gateway for secure, instantaneous checkout.\n" },
    { text: "• Clear farm-to-table UI trust markers and product categories." }
], { x: 5.35, y: 2.0, w: 4.0, h: 2.5, fontFace: "Helvetica", fontSize: 16, color: colors.darkText, bullet: true });

// -------------------------------------------------------------
// Slide 5: System Architecture (Unified Flow)
// -------------------------------------------------------------
const slide5 = pptx.addSlide({ masterName: "MODERN_MASTER" });
addSlideTitle(slide5, "System Architecture");

slide5.addShape("rect", { x: 0.5, y: 1.5, w: 2.2, h: 1.5, fill: { color: "DBEAFE" }, line: { color: "2563EB", width: 2 } });
slide5.addText("Client UI (React)\n- Tailwind CSS\n- Framer Motion", { x: 0.5, y: 1.5, w: 2.2, h: 1.5, align: "center", color: colors.darkText, fontSize: 14, bold: true });

slide5.addShape("rightArrow", { x: 2.9, y: 2.0, w: 0.8, h: 0.4, fill: { color: colors.lightText } });

slide5.addShape("rect", { x: 3.9, y: 1.5, w: 2.2, h: 1.5, fill: { color: "DCFCE7" }, line: { color: "16A34A", width: 2 } });
slide5.addText("Next.js Server API\n- Edge Runtime\n- Server Actions", { x: 3.9, y: 1.5, w: 2.2, h: 1.5, align: "center", color: colors.darkText, fontSize: 14, bold: true });

slide5.addShape("rightArrow", { x: 6.3, y: 2.0, w: 0.8, h: 0.4, fill: { color: colors.lightText } });

slide5.addShape("rect", { x: 7.3, y: 1.5, w: 2.2, h: 1.5, fill: { color: "FEF9C3" }, line: { color: "CA8A04", width: 2 } });
slide5.addText("Data Layer\n- PostgreSQL\n- Prisma ORM", { x: 7.3, y: 1.5, w: 2.2, h: 1.5, align: "center", color: colors.darkText, fontSize: 14, bold: true });

// Auth Layer below Server
slide5.addShape("rect", { x: 3.9, y: 3.5, w: 2.2, h: 1.0, fill: { color: "F3E8FF" }, line: { color: "9333EA", width: 2 } });
slide5.addText("NextAuth.js\nJWT Security", { x: 3.9, y: 3.5, w: 2.2, h: 1.0, align: "center", color: colors.darkText, fontSize: 14, bold: true });
slide5.addShape("upArrow", { x: 4.8, y: 3.1, w: 0.4, h: 0.3, fill: { color: colors.lightText } });

// Payment Gateway External
slide5.addShape("rect", { x: 7.3, y: 3.5, w: 2.2, h: 1.0, fill: { color: "FFE4E6" }, line: { color: "E11D48", width: 2 } });
slide5.addText("Payment Gateway\nAPI (Stripe/Razor)", { x: 7.3, y: 3.5, w: 2.2, h: 1.0, align: "center", color: colors.darkText, fontSize: 14, bold: true });
slide5.addShape("upArrow", { x: 8.4, y: 3.1, w: 0.4, h: 0.3, fill: { color: colors.lightText } });

// -------------------------------------------------------------
// Slide 6: Modules with Descriptions
// -------------------------------------------------------------
const slide6 = pptx.addSlide({ masterName: "MODERN_MASTER" });
addSlideTitle(slide6, "Core Application Modules");

const headers = [
    { text: "Module", options: { bold: true, fill: colors.primary, color: colors.white } },
    { text: "Description", options: { bold: true, fill: colors.primary, color: colors.white } }
];

slide6.addTable([
    headers,
    ["User Authentication", "Secure Sign-up, Sign-in, and full session management using JSON Web Tokens (JWT) encrypted with Bcrypt."],
    ["Admin IT Dashboard", "Central React-based interface to manage live products, analyze sales, and dynamically update order statuses."],
    ["Direct Produce Catalog", "Filtering and search-enabled grid showcasing available organic stocks, fetching real-time JSON responses."],
    ["Modern Cart & Payment", "React Context-powered cart holding state, integrating local address persistence and a secure Payment Gateway processor."],
    ["Order Tracking", "Profile dashboard for end-users to oversee past purchases, verify tracking statuses, and maintain addresses."]
], { x: 0.5, y: 1.3, w: 9, rowH: 0.6, colW: [2.5, 6.5], border: { pt: "1", color: "E2E8F0" }, fontSize: 13, color: colors.midText, fill: colors.white });

// -------------------------------------------------------------
// Slide 7: UML Use Case Diagram
// -------------------------------------------------------------
const slide7 = pptx.addSlide({ masterName: "MODERN_MASTER" });
addSlideTitle(slide7, "UML Use Case Diagram");

// System Boundary
slide7.addShape("rect", { x: 3, y: 1.2, w: 4, h: 3.8, fill: { color: colors.bgLight }, line: { color: colors.lightText, width: 2 } });
slide7.addText("Next.js E-Commerce System", { x: 3, y: 1.2, w: 4, h: 0.3, align: "center", bold: true, fontSize: 12, color: colors.darkText });

// Customer Actor
slide7.addShape("ellipse", { x: 1, y: 2.5, w: 0.8, h: 0.8, fill: { color: "DBEAFE" }, line: { color: "2563EB", width: 2 } });
slide7.addText("Customer", { x: 1, y: 3.3, w: 0.8, h: 0.3, align: "center", fontSize: 12, bold: true, color: colors.darkText });

// Admin Actor
slide7.addShape("ellipse", { x: 8.2, y: 2.5, w: 0.8, h: 0.8, fill: { color: "FEF3C7" }, line: { color: "D97706", width: 2 } });
slide7.addText("Admin", { x: 8.2, y: 3.3, w: 0.8, h: 0.3, align: "center", fontSize: 12, bold: true, color: colors.darkText });

const useCases = [
    { text: "Auth / Login", y: 1.4 },
    { text: "Browse Produce", y: 2.0 },
    { text: "Cart / Checkout", y: 2.6 },
    { text: "Process Payment", y: 3.2 },
    { text: "Manage Inventory", y: 3.8 },
    { text: "Update Order Status", y: 4.4 },
];

useCases.forEach((uc) => {
    slide7.addShape("ellipse", { x: 3.5, y: uc.y, w: 3, h: 0.5, fill: { color: "E2E8F0" }, line: { color: "64748B" } });
    slide7.addText(uc.text, { x: 3.5, y: uc.y, w: 3, h: 0.5, align: "center", fontSize: 12, bold: true, color: colors.darkText });
});

// Lines Customer
slide7.addShape("line", { x: 1.8, y: 2.9, w: 1.7, h: -1.5, line: { color: colors.lightText, width: 2 } });
slide7.addShape("line", { x: 1.8, y: 2.9, w: 1.7, h: -0.9, line: { color: colors.lightText, width: 2 } });
slide7.addShape("line", { x: 1.8, y: 2.9, w: 1.7, h: -0.3, line: { color: colors.lightText, width: 2 } });
slide7.addShape("line", { x: 1.8, y: 2.9, w: 1.7, h: 0.3, line: { color: colors.lightText, width: 2 } });

// Lines Admin
slide7.addShape("line", { x: 6.5, y: 1.6, w: 1.7, h: 1.3, line: { color: colors.lightText, width: 2 } });
slide7.addShape("line", { x: 6.5, y: 4.05, w: 1.7, h: -1.15, line: { color: colors.lightText, width: 2 } });
slide7.addShape("line", { x: 6.5, y: 4.65, w: 1.7, h: -1.75, line: { color: colors.lightText, width: 2 } });


// -------------------------------------------------------------
// Slide 8: ER Diagram (Database Structure)
// -------------------------------------------------------------
const slide8 = pptx.addSlide({ masterName: "MODERN_MASTER" });
addSlideTitle(slide8, "Database Schema (ER Diagram)");

const drawEntity = (slide, x, y, w, h, title, pk, fields) => {
    slide.addShape("rect", { x, y, w, h, fill: { color: colors.white }, line: { color: colors.primary, width: 2 } });
    slide.addShape("rect", { x, y, w, h: 0.4, fill: { color: colors.secondary } });
    slide.addText(title, { x, y, w, h: 0.4, align: "center", bold: true, fontSize: 14, color: colors.white });

    let content = `PK: ${pk}\n`;
    content += `-----\n` + fields.join("\n");
    slide.addText(content, { x: x + 0.1, y: y + 0.5, w: w - 0.2, h: h - 0.6, fontSize: 11, align: "left", valign: "top", color: colors.midText });
};

drawEntity(slide8, 0.5, 1.2, 2.5, 1.6, "users", "id", ["name (VARCHAR)", "email (VARCHAR)", "role (ENUM)"]);
drawEntity(slide8, 0.5, 3.2, 2.5, 1.6, "addresses (FK: userId)", "id", ["street, city, zip"]);
drawEntity(slide8, 3.8, 1.2, 2.5, 2.0, "orders (FK: userId)", "id", ["totalAmount", "paymentId", "status", "createdAt"]);
drawEntity(slide8, 7.1, 1.2, 2.4, 1.8, "order_items (FKs: orderId, prodId)", "id", ["quantity (INT)", "price (DECIMAL)"]);
drawEntity(slide8, 7.1, 3.4, 2.4, 1.6, "products (FK: categoryId)", "id", ["name", "price", "stock"]);
drawEntity(slide8, 3.8, 3.8, 2.5, 1.2, "categories", "id", ["name", "slug"]);

slide8.addShape("line", { x: 1.75, y: 2.8, w: 0, h: 0.4, line: { color: colors.primary, width: 2 } }); // user-addr
slide8.addShape("line", { x: 3.0, y: 2.0, w: 0.8, h: 0, line: { color: colors.primary, width: 2 } }); // user-order
slide8.addShape("line", { x: 6.3, y: 2.0, w: 0.8, h: 0, line: { color: colors.primary, width: 2 } }); // order-orderitem
slide8.addShape("line", { x: 8.3, y: 3.0, w: 0, h: 0.4, line: { color: colors.primary, width: 2 } }); // item-prod
slide8.addShape("line", { x: 6.3, y: 4.2, w: 0.8, h: 0, line: { color: colors.primary, width: 2 } }); // cat-prod

// -------------------------------------------------------------
// Slide 9: Flowchart (Order Delivery Flow)
// -------------------------------------------------------------
const slide9 = pptx.addSlide({ masterName: "MODERN_MASTER" });
addSlideTitle(slide9, "Process Flow: Order to Delivery");

const drawNode = (slide, x, y, w, h, text, shape = "rect") => {
    slide.addShape(shape, { x, y, w, h, fill: { color: "1E40AF" }, line: { color: "1E3A8A", width: 2 } }); // Blue theme for flow
    slide.addText(text, { x, y, w, h, align: "center", bold: true, fontSize: 12, color: colors.white });
};

drawNode(slide9, 0.5, 2.5, 1.5, 0.8, "START:\nAdd Products", "ellipse");
slide9.addShape("rightArrow", { x: 2.0, y: 2.8, w: 0.2, h: 0.2, fill: { color: colors.lightText } });

drawNode(slide9, 2.2, 2.5, 1.3, 0.8, "Validate Cart\n& DB Stock");
slide9.addShape("rightArrow", { x: 3.5, y: 2.8, w: 0.2, h: 0.2, fill: { color: colors.lightText } });

drawNode(slide9, 3.7, 2.5, 1.3, 0.8, "Process Payment\n(Gateway)");
slide9.addShape("rightArrow", { x: 5.0, y: 2.8, w: 0.2, h: 0.2, fill: { color: colors.lightText } });

drawNode(slide9, 5.2, 2.5, 1.3, 0.8, "API POST:\nOrder PENDING");
slide9.addShape("rightArrow", { x: 6.5, y: 2.8, w: 0.2, h: 0.2, fill: { color: colors.lightText } });

drawNode(slide9, 6.7, 1.5, 1.3, 0.8, "Admin Update:\nPROCESSING"); // Branch UP
drawNode(slide9, 6.7, 3.5, 1.3, 0.8, "Admin Update:\nSHIPPED");   // Branch DOWN

slide9.addShape("line", { x: 5.85, y: 1.9, w: 0, h: 0.6, line: { color: "1E3A8A", width: 2 } });
slide9.addShape("line", { x: 7.35, y: 2.3, w: 0, h: 1.2, line: { color: colors.lightText } });

slide9.addShape("rightArrow", { x: 8.0, y: 2.8, w: 0.2, h: 0.2, fill: { color: colors.lightText } });
drawNode(slide9, 8.2, 2.4, 1.3, 0.8, "END:\nOrder DELIVERED", "ellipse");


// -------------------------------------------------------------
// Slide 10: Proposed AI Algorithm Integration
// -------------------------------------------------------------
const slide10 = pptx.addSlide({ masterName: "MODERN_MASTER" });
addSlideTitle(slide10, "AI Integration: Market Basket Analysis");

slide10.addText("The Apriori Algorithm", { x: 0.5, y: 1.2, w: 9, h: 0.5, align: "left", fontFace: "Helvetica", fontSize: 22, bold: true, color: "16A34A" });

slide10.addText([
    { text: "• Purpose:\n", options: { bold: true, color: colors.darkText } },
    { text: "  Implemented an associative Data Mining algorithm to dynamically power the 'Frequently Bought Together' recommendations.\n\n" },
    { text: "• How it Works:\n", options: { bold: true, color: colors.darkText } },
    { text: "  - Analyzes historical PostgreSQL order data.\n" },
    { text: "  - Calculates the 'Support' (how often items appear) and 'Confidence' (probability of buying Item B if Item A is purchased).\n" },
    { text: "  - Returns real-time recommendations natively without relying on heavy external deep learning models.\n\n" },
    { text: "• Business Value:\n", options: { bold: true, color: colors.darkText } },
    { text: "  Increases Average Order Value (AOV) by intelligently up-selling correlated organic products during browsing." }
], { x: 0.5, y: 1.8, w: 6.5, h: 3.2, fontFace: "Helvetica", fontSize: 16, color: colors.midText });

// Visual representation for Apriori
slide10.addShape("rect", { x: 7.2, y: 1.8, w: 2.2, h: 1.0, fill: { color: "DBEAFE" }, line: { color: "2563EB", width: 2 } });
slide10.addText("User Views:\nOrganic Tomatoes", { x: 7.2, y: 1.8, w: 2.2, h: 1.0, align: "center", bold: true, color: colors.darkText });

slide10.addShape("downArrow", { x: 8.1, y: 2.9, w: 0.4, h: 0.4, fill: { color: colors.lightText } });

slide10.addShape("rect", { x: 7.2, y: 3.4, w: 2.2, h: 1.0, fill: { color: "DCFCE7" }, line: { color: "16A34A", width: 2 } });
slide10.addText("System Recommends:\nOrganic Onions\n(Confidence: 85%)", { x: 7.2, y: 3.4, w: 2.2, h: 1.0, align: "center", bold: true, color: colors.darkText });


// -------------------------------------------------------------
// Slide 11: IEEE Base Paper Reference
// -------------------------------------------------------------
const slide11 = pptx.addSlide({ masterName: "MODERN_MASTER" });
addSlideTitle(slide11, "IEEE Base Paper Reference");

slide11.addShape("rect", { x: 0.5, y: 1.5, w: 9, h: 1.2, fill: { color: "FEF9C3" }, line: { color: "CA8A04", width: 2 } });
slide11.addText("Paper Title:", { x: 0.7, y: 1.6, w: 8.6, h: 0.4, fontFace: "Helvetica", fontSize: 14, bold: true, color: "CA8A04" });
slide11.addText("Enhancing E-Commerce Sales through Market Basket Analysis using the Apriori Algorithm", { x: 0.7, y: 2.0, w: 8.6, h: 0.5, fontFace: "Helvetica", fontSize: 20, bold: true, color: colors.darkText });

slide11.addText([
    { text: "Domain Area:\n", options: { bold: true, color: colors.darkText } },
    { text: "Data Mining & Knowledge Discovery in Databases (KDD).\n\n" },
    { text: "Why This Paper Was Chosen:\n", options: { bold: true, color: colors.darkText } },
    { text: "• The Apriori algorithm bridges the gap between Relational Database Management (PostgreSQL/Prisma) and Machine Learning.\n" },
    { text: "• It provides a scalable, pure-code solution to solve the 'cold-start' recommendation problem often faced by new organic markets.\n" },
    { text: "• Directly aligns with the project’s goal of optimizing digital D2C (Direct-to-Consumer) supply chains." }
], { x: 0.5, y: 2.9, w: 9, h: 2.0, fontFace: "Helvetica", fontSize: 18, color: colors.midText });


// Generate the final updated presentation
pptx.writeFile({ fileName: "Yogam_Organic_Farms_Project.pptx" }).then(fileName => {
    console.log(`Successfully generated PowerPoint file: ${fileName}`);
});
