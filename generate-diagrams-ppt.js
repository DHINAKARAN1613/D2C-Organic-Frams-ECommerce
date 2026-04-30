const pptxgen = require("pptxgenjs");

const pptx = new pptxgen();

pptx.author = "Yogam Organic Farms Team";
pptx.title = "Detailed System Diagrams";
pptx.layout = "LAYOUT_16x9"; // 10 x 5.625 inches

// Helper
const titleColor = "0F172A";
const bodyColor = "334155";
const addSlideTitle = (slide, title) => {
    slide.addText(title, {
        x: 0, y: 0.2, w: "100%", h: 0.6,
        align: "center", fontFace: "Arial", fontSize: 24, bold: true, color: titleColor
    });
};

// -------------------------------------------------------------
// Slide 1: Title Slide
// -------------------------------------------------------------
const slide1 = pptx.addSlide();
slide1.background = { color: "F8FAFC" };
slide1.addText("YOGAM ORGANIC FARMS", {
    x: 0, y: 2.0, w: "100%", h: 1.0,
    align: "center", fontFace: "Arial", fontSize: 32, bold: true, color: "166534"
});
slide1.addText("Detailed UML, ER, and Flow Diagrams", {
    x: 0, y: 3.0, w: "100%", h: 0.6,
    align: "center", fontFace: "Arial", fontSize: 22, color: "475569"
});

// -------------------------------------------------------------
// Slide 2: Use Case Diagram
// -------------------------------------------------------------
const slide2 = pptx.addSlide();
slide2.background = { color: "FFFFFF" };
addSlideTitle(slide2, "UML Use Case Diagram");

// System Boundary
slide2.addShape("rect", { x: 3, y: 1.0, w: 4, h: 4.2, fill: { color: "F1F5F9" }, line: { color: "94A3B8" } });
slide2.addText("E-Commerce System", { x: 3, y: 1.0, w: 4, h: 0.3, align: "center", bold: true, fontSize: 12 });

// Actors
slide2.addShape("ellipse", { x: 1, y: 2.5, w: 0.8, h: 0.8, fill: { color: "DBEAFE" } });
slide2.addText("Customer", { x: 1, y: 3.3, w: 0.8, h: 0.3, align: "center", fontSize: 12, bold: true });

slide2.addShape("ellipse", { x: 8.2, y: 2.5, w: 0.8, h: 0.8, fill: { color: "FEF3C7" } });
slide2.addText("Admin", { x: 8.2, y: 3.3, w: 0.8, h: 0.3, align: "center", fontSize: 12, bold: true });

// Use Cases
const useCases = [
    { text: "Sign Up / Login", y: 1.4 },
    { text: "Browse & Search Products", y: 2.1 },
    { text: "Manage Cart & Checkout", y: 2.8 },
    { text: "Track Order History", y: 3.5 },
    { text: "Manage Inventory & Orders", y: 4.2 },
];

useCases.forEach((uc) => {
    slide2.addShape("ellipse", { x: 3.5, y: uc.y, w: 3, h: 0.5, fill: { color: "E0E7FF" }, line: { color: "818CF8" } });
    slide2.addText(uc.text, { x: 3.5, y: uc.y, w: 3, h: 0.5, align: "center", fontSize: 12 });
});

// Customer Lines
slide2.addShape("line", { x: 1.8, y: 2.9, w: 1.7, h: -1.25, line: { color: "64748B" } }); // Login
slide2.addShape("line", { x: 1.8, y: 2.9, w: 1.7, h: -0.55, line: { color: "64748B" } }); // Browse
slide2.addShape("line", { x: 1.8, y: 2.9, w: 1.7, h: 0.15, line: { color: "64748B" } }); // Cart
slide2.addShape("line", { x: 1.8, y: 2.9, w: 1.7, h: 0.85, line: { color: "64748B" } }); // Track

// Admin Lines
slide2.addShape("line", { x: 6.5, y: 1.65, w: 1.7, h: 1.25, line: { color: "64748B" } }); // Login
slide2.addShape("line", { x: 6.5, y: 4.45, w: 1.7, h: -1.55, line: { color: "64748B" } }); // Manage Inv

// -------------------------------------------------------------
// Slide 3: Class Diagram
// -------------------------------------------------------------
const slide3 = pptx.addSlide();
slide3.background = { color: "FFFFFF" };
addSlideTitle(slide3, "UML Class Diagram & Relationships");

const drawClass = (x, y, w, h, title, attrs) => {
    slide3.addShape("rect", { x, y, w, h, fill: { color: "F0FDF4" }, line: { color: "22C55E", width: 2 } });
    slide3.addText(title, { x, y, w, h: 0.4, align: "center", bold: true, fontSize: 14, fill: { color: "DCFCE7" } });
    slide3.addShape("line", { x, y: y + 0.4, w, h: 0, line: { color: "22C55E" } });
    let attrText = attrs.map(a => `+ ${a}`).join("\n");
    slide3.addText(attrText, { x: x + 0.1, y: y + 0.45, w: w - 0.2, h: h - 0.5, fontSize: 11, align: "left", valign: "top" });
};

drawClass(0.5, 1.2, 2.5, 1.8, "User", ["id: String", "name: String", "email: String", "role: Role (ADMIN|USER)"]);
drawClass(0.5, 3.5, 2.5, 1.5, "Address", ["id: String", "street: String", "city: String", "zip: String"]);
drawClass(4.0, 1.2, 2.5, 2.0, "Order", ["id: String", "total: Float", "status: String", "createdAt: Date", "updateStatus()", "calculateTotal()"]);
drawClass(7.5, 1.2, 2.0, 1.8, "OrderItem", ["id: String", "quantity: Int", "price: Float"]);
drawClass(7.5, 3.5, 2.0, 1.8, "Product", ["id: String", "name: String", "price: Float", "stock: Int"]);

// Relationships
// User -> Address (1 to N)
slide3.addShape("line", { x: 1.75, y: 3.0, w: 0, h: 0.5, line: { color: "64748B", width: 2 } });
slide3.addText("1", { x: 1.85, y: 3.0, w: 0.3, h: 0.2, fontSize: 10 });
slide3.addText("0..*", { x: 1.85, y: 3.3, w: 0.3, h: 0.2, fontSize: 10 });

// User -> Order (1 to N)
slide3.addShape("line", { x: 3.0, y: 2.1, w: 1.0, h: 0, line: { color: "64748B", width: 2 } });
slide3.addText("1", { x: 3.1, y: 1.9, w: 0.3, h: 0.2, fontSize: 10 });
slide3.addText("0..*", { x: 3.7, y: 1.9, w: 0.3, h: 0.2, fontSize: 10 });

// Order -> OrderItem (1 to N)
slide3.addShape("line", { x: 6.5, y: 2.1, w: 1.0, h: 0, line: { color: "64748B", width: 2 } });
slide3.addText("1", { x: 6.6, y: 1.9, w: 0.3, h: 0.2, fontSize: 10 });
slide3.addText("1..*", { x: 7.2, y: 1.9, w: 0.3, h: 0.2, fontSize: 10 });

// OrderItem -> Product (1 to 1)
slide3.addShape("line", { x: 8.5, y: 3.0, w: 0, h: 0.5, line: { color: "64748B", width: 2 } });
slide3.addText("*", { x: 8.6, y: 3.0, w: 0.3, h: 0.2, fontSize: 10 });
slide3.addText("1", { x: 8.6, y: 3.3, w: 0.3, h: 0.2, fontSize: 10 });

// -------------------------------------------------------------
// Slide 4: ER Diagram (Database Schema)
// -------------------------------------------------------------
const slide4 = pptx.addSlide();
slide4.background = { color: "ECFEFF" }; // Cyan 50
addSlideTitle(slide4, "Entity-Relationship (ER) Diagram");

const drawEntity = (x, y, w, h, title, pk, fks, fields) => {
    slide4.addShape("rect", { x, y, w, h, fill: { color: "FFFFFF" }, line: { color: "0891B2", width: 2 } });
    slide4.addShape("rect", { x, y, w, h: 0.4, fill: { color: "A5F3FC" } });
    slide4.addText(title, { x, y, w, h: 0.4, align: "center", bold: true, fontSize: 14, color: "164E63" });

    let content = `PK: ${pk}\n`;
    if (fks.length > 0) content += `FK: ${fks.join(", ")}\n`;
    content += `-----\n` + fields.join("\n");

    slide4.addText(content, { x: x + 0.1, y: y + 0.5, w: w - 0.2, h: h - 0.6, fontSize: 11, align: "left", valign: "top", color: "334155" });
};

drawEntity(0.5, 1.2, 2.5, 1.8, "users", "id", [], ["name (VARCHAR)", "email (VARCHAR)", "password (VARCHAR)", "role (ENUM)"]);
drawEntity(0.5, 3.5, 2.5, 1.5, "addresses", "id", ["userId"], ["street (VARCHAR)", "city (VARCHAR)", "zip (VARCHAR)"]);
drawEntity(3.8, 1.2, 2.5, 2.2, "orders", "id", ["userId"], ["totalAmount (DECIMAL)", "status (ENUM)", "createdAt (TIMESTAMP)", "shippingCity (VARCHAR)"]);
drawEntity(7.1, 1.2, 2.4, 2.0, "order_items", "id", ["orderId", "productId"], ["quantity (INT)", "price (DECIMAL)"]);
drawEntity(7.1, 3.6, 2.4, 1.6, "products", "id", ["categoryId"], ["name (VARCHAR)", "price (DECIMAL)", "stock (INT)", "images (JSON)"]);
drawEntity(3.8, 4.0, 2.5, 1.2, "categories", "id", [], ["name (VARCHAR)", "slug (VARCHAR)"]);

// Relationship Connectors (simplified as lines)
slide4.addShape("line", { x: 1.75, y: 3.0, w: 0, h: 0.5, line: { color: "0891B2", width: 2 } }); // user-addr
slide4.addShape("line", { x: 3.0, y: 2.1, w: 0.8, h: 0, line: { color: "0891B2", width: 2 } }); // user-order
slide4.addShape("line", { x: 6.3, y: 2.1, w: 0.8, h: 0, line: { color: "0891B2", width: 2 } }); // order-orderitem
slide4.addShape("line", { x: 8.3, y: 3.2, w: 0, h: 0.4, line: { color: "0891B2", width: 2 } }); // item-prod
slide4.addShape("line", { x: 6.3, y: 4.4, w: 0.8, h: 0, line: { color: "0891B2", width: 2 } }); // cat-prod

// -------------------------------------------------------------
// Slide 5: Sequence Diagram (Checkout Flow)
// -------------------------------------------------------------
const slide5 = pptx.addSlide();
slide5.background = { color: "FFFFFF" };
addSlideTitle(slide5, "Sequence Diagram: Order Checkout Flow");

const drawLifeline = (x, title) => {
    slide5.addShape("rect", { x: x - 0.75, y: 1.0, w: 1.5, h: 0.5, fill: { color: "FEF3C7" }, line: { color: "D97706" } });
    slide5.addText(title, { x: x - 0.75, y: 1.0, w: 1.5, h: 0.5, align: "center", bold: true, fontSize: 12 });
    slide5.addShape("line", { x: x, y: 1.5, w: 0, h: 3.5, line: { color: "94A3B8", dashType: "dash" } });
};

drawLifeline(1.5, "Customer (Browser)");
drawLifeline(4.5, "Next.js API Route");
drawLifeline(7.5, "Database (Prisma)");

const drawMessage = (y, x1, x2, text, isReturn = false) => {
    const w = x2 - x1;
    slide5.addShape(isReturn ? "leftArrow" : "rightArrow", {
        x: w > 0 ? x1 : x2,
        y: y,
        w: Math.abs(w),
        h: 0.05,
        fill: { color: "334155" },
        line: isReturn ? { dashType: "dash" } : {}
    });
    slide5.addText(text, {
        x: Math.min(x1, x2),
        y: y - 0.25,
        w: Math.abs(w),
        h: 0.2,
        align: "center",
        fontSize: 10
    });
};

drawMessage(1.8, 1.5, 4.5, "1. POST /api/orders (cart items)");
drawMessage(2.3, 4.5, 7.5, "2. Check Stock & Decrement Qty");
drawMessage(2.8, 7.5, 4.5, "3. Stock Confirmed", true);
drawMessage(3.3, 4.5, 7.5, "4. Insert Order & OrderItems");
drawMessage(3.8, 7.5, 4.5, "5. Order ID returned", true);
drawMessage(4.3, 4.5, 1.5, "6. Res 200 JSON (Order SUCCESS)", true);

// -------------------------------------------------------------
// Slide 6: Activity Flowchart (Order Delivery)
// -------------------------------------------------------------
const slide6 = pptx.addSlide();
slide6.background = { color: "FDF4FF" }; // Fuchsia 50
addSlideTitle(slide6, "Process Flow: Order to Delivery");

const drawNode = (x, y, w, h, text, shape = "rect") => {
    slide6.addShape(shape, { x, y, w, h, fill: { color: "C026D3" }, line: { color: "86198F" } });
    slide6.addText(text, { x, y, w, h, align: "center", bold: true, fontSize: 12, color: "FFFFFF" });
};

const drawFlowArrow = (x, y, w, h) => {
    slide6.addShape("rightArrow", { x, y, w, h, fill: { color: "94A3B8" } });
};

drawNode(0.5, 2.5, 1.5, 0.8, "Start:\nCustomer Adds to Cart", "ellipse");
drawFlowArrow(2.0, 2.8, 0.4, 0.2);

drawNode(2.4, 2.5, 1.5, 0.8, "Checkout &\nPayment Confirmed");
drawFlowArrow(3.9, 2.8, 0.4, 0.2);

drawNode(4.3, 2.5, 1.5, 0.8, "Admin Dashboard:\nStatus PENDING");
drawFlowArrow(5.8, 2.8, 0.4, 0.2);

drawNode(6.2, 1.8, 1.5, 0.8, "Status Updated:\nPROCESSING"); // Branch UP
drawNode(6.2, 3.2, 1.5, 0.8, "Status Updated:\nSHIPPED");   // Branch DOWN

slide6.addShape("line", { x: 5.0, y: 1.5, w: 0, h: 0.5, line: { color: "86198F", width: 2 } });

// Manual lines for flow
slide6.addShape("line", { x: 6.95, y: 2.6, w: 0, h: 0.6, line: { color: "94A3B8" } });

drawFlowArrow(7.7, 3.5, 0.4, 0.2);
drawNode(8.1, 3.1, 1.5, 0.8, "End:\nOrder DELIVERED", "ellipse");

// Save
pptx.writeFile({ fileName: "Yogam_Organic_Farms_UML_ER_Flow.pptx" }).then(fileName => {
    console.log(`Successfully generated PowerPoint file: ${fileName}`);
});
