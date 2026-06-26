const PptxGenJS = require("pptxgenjs");

async function createPresentation() {
    let pres = new PptxGenJS();
    
    // Presentation setup
    pres.author = "Yogam Organic Farms";
    pres.company = "Yogam Organic Farms";
    pres.revision = "1";
    pres.subject = "Final Viva Voce Presentation";
    pres.title = "Yogam Organic Farms Project Presentation";
    pres.layout = "LAYOUT_16x9";

    // Master slide definition for consistent styling
    pres.defineSlideMaster({
        title: "MASTER_SLIDE",
        background: { color: "FFFFFF" },
        objects: [
            { line: { x: 0.5, y: 0.8, w: "90%", h: 0, line: "4CAF50", lineSize: 2 } },
            { text: { text: "Yogam Organic Farms - Final Viva Voce", options: { x: 0.5, y: 7.0, w: 4, h: 0.3, fontSize: 10, color: "888888" } } },
            { text: { text: "", options: { x: 12.0, y: 7.0, w: 1, h: 0.3, fontSize: 10, color: "888888" } } } // Placeholder for slide number if needed
        ],
        slideNumber: { x: 12.5, y: 7.0, fontSize: 10, color: "888888" }
    });

    // Helper function to add standard slide
    const addSlide = (title, contentLines) => {
        let slide = pres.addSlide({ masterName: "MASTER_SLIDE" });
        slide.addText(title, { x: 0.5, y: 0.3, w: "90%", h: 0.6, fontSize: 28, bold: true, color: "2E7D32" });
        
        let yOffset = 1.2;
        contentLines.forEach(line => {
            let isSubItem = line.startsWith("  ");
            slide.addText(line.trim(), {
                x: isSubItem ? 1.0 : 0.5,
                y: yOffset,
                w: "90%",
                h: 0.5,
                fontSize: 18,
                color: "333333",
                bullet: isSubItem ? { type: "square" } : true
            });
            yOffset += 0.5;
        });
    };

    // --- Slide 1: Title Slide ---
    let slide1 = pres.addSlide();
    slide1.background = { color: "E8F5E9" };
    slide1.addText("YOGAM ORGANIC FARMS", { x: "10%", y: "40%", w: "80%", h: 1, fontSize: 44, bold: true, color: "2E7D32", align: "center" });
    slide1.addText("A Direct-to-Consumer Organic E-Commerce Platform\nwith Apriori-Based Recommendations", { x: "10%", y: "55%", w: "80%", h: 1, fontSize: 24, color: "555555", align: "center" });
    slide1.addText("Final Viva Voce Presentation", { x: "10%", y: "80%", w: "80%", h: 0.5, fontSize: 18, color: "777777", align: "center" });

    // --- Slide 2: Introduction ---
    addSlide("Introduction", [
        "What is Yogam Organic Farms?",
        "  An e-commerce marketplace dedicated strictly to verified organic produce.",
        "Connecting farmers directly to health-conscious consumers.",
        "Promotes sustainable agriculture and healthy living.",
        "Aimed at eliminating middlemen in the agricultural supply chain."
    ]);

    // --- Slide 3: Problem Statement ---
    addSlide("Problem Statement", [
        "Traditional supply chains heavily involve middlemen, reducing farmer profits.",
        "Consumers pay inflated prices for organic produce.",
        "Lack of verification leads to counterfeit 'organic' products.",
        "Farmers struggle to find premium direct-to-consumer markets.",
        "Users lack intelligent recommendations tailored to organic shopping."
    ]);

    // --- Slide 4: Proposed Solution ---
    addSlide("Proposed Solution", [
        "Direct-to-Consumer (D2C) marketplace specifically for organic goods.",
        "Stringent farmer KYC (Know Your Customer) and certificate verification.",
        "Intelligent product recommendations using the Apriori algorithm.",
        "Multilingual interface (English and Tamil) to support regional farmers.",
        "Integrated chat and review systems to build community trust."
    ]);

    // --- Slide 5: Project Objectives ---
    addSlide("Project Objectives", [
        "To build a scalable, responsive, and robust web application.",
        "To establish a transparent platform ensuring organic authenticity.",
        "To improve cross-selling via Apriori association rules.",
        "To enhance accessibility for farmers through regional language support.",
        "To provide a seamless, modern User Experience (UX)."
    ]);

    // --- Slide 6: Target Audience ---
    addSlide("Target Audience", [
        "Organic Farmers:",
        "  Seeking a platform to sell directly at fair prices.",
        "  Looking for easy-to-use digital tools to manage inventory.",
        "Health-Conscious Consumers:",
        "  Willing to pay a premium for verified organic food.",
        "  Desiring transparent sourcing and direct communication."
    ]);

    // --- Slide 7: Key Features Overview ---
    addSlide("Key Features Overview", [
        "Verified Organic Marketplace with advanced filtering.",
        "Dedicated Farmer Dashboard for inventory & sales management.",
        "Apriori-powered 'Frequently Bought Together' recommendations.",
        "Multilingual interface toggle (English / Tamil).",
        "Real-time Chat Support & Verified Purchase Reviews."
    ]);

    // --- Slide 8: Technology Stack ---
    addSlide("Technology Stack", [
        "Frontend:",
        "  React.js, Next.js (App Router), Tailwind CSS",
        "Backend:",
        "  Node.js, Next.js Serverless API Routes",
        "Database & ORM:",
        "  Prisma ORM, SQLite / PostgreSQL",
        "Machine Learning:",
        "  Custom Apriori algorithm implementation in TypeScript"
    ]);

    // --- Slide 9: System Architecture ---
    addSlide("System Architecture", [
        "Client Layer: Responsive UI built with React & Tailwind.",
        "Routing Layer: Next.js handling SSR and client-side routing.",
        "API Layer: Next.js API routes handling business logic.",
        "Data Layer: Prisma ORM interfacing with the relational database.",
        "Security Layer: Role-based access control (Admin, Farmer, User)."
    ]);

    // --- Slide 10: Farmer KYC & Verification ---
    addSlide("Farmer KYC & Verification", [
        "Crucial for maintaining the integrity of the 'organic' label.",
        "Farmers must submit government ID and organic certificates.",
        "Admin reviews and approves farmer applications before they can sell.",
        "Prevents unverified sellers from entering the marketplace.",
        "Builds high consumer trust in the platform."
    ]);

    // --- Slide 11: The Apriori Engine ---
    addSlide("The Apriori Engine", [
        "A classic algorithm for Association Rule Learning.",
        "Analyzes past transaction data (market basket analysis).",
        "Identifies sets of products that frequently appear together.",
        "Used to generate rules like: 'If User buys A, they will likely buy B'.",
        "Runs efficiently on the backend to update recommendations."
    ]);

    // --- Slide 12: Apriori Metrics Used ---
    addSlide("Apriori Metrics Used", [
        "Support: Frequency of itemsets in all transactions.",
        "Confidence: Likelihood of buying B when A is bought.",
        "Lift: The ratio of observed support to expected support.",
        "  Lift > 1 implies a positive association.",
        "Yogam platform filters rules based on high Confidence and Lift."
    ]);

    // --- Slide 13: Multilingual Support ---
    addSlide("Multilingual Support", [
        "Developed to bridge the digital divide for rural farmers.",
        "Supports English and Tamil (local regional language).",
        "Context-based translation dictionaries implemented.",
        "Seamless toggle available in navigation and farmer dashboard.",
        "Increases adoption rate among non-English speaking demographics."
    ]);

    // --- Slide 14: Real-time Chat & Support ---
    addSlide("Real-time Chat & Support", [
        "Floating chat widget accessible across the customer site.",
        "Allows users to ask questions directly regarding products.",
        "Admin inbox interface to manage and respond to multiple chats.",
        "Reduces friction in the buying process.",
        "Enhances user engagement and customer service."
    ]);

    // --- Slide 15: Ratings & Reviews ---
    addSlide("Ratings & Reviews", [
        "Integrated 5-star rating system on product pages.",
        "Users can leave detailed text reviews.",
        "'Verified Purchase' badges for authentic reviews.",
        "Provides social proof and assists new buyers in decision making.",
        "Farmers receive direct feedback on their produce quality."
    ]);

    // --- Slide 16: The Shopping Experience ---
    addSlide("The Shopping Experience", [
        "Dynamic filtering by category, price, and farm.",
        "High-quality product imagery and detailed descriptions.",
        "Responsive cart management system.",
        "Optimized checkout flow for higher conversion rates.",
        "Cross-selling features strategically placed during browsing."
    ]);

    // --- Slide 17: The Farmer Dashboard ---
    addSlide("The Farmer Dashboard", [
        "Centralized hub for farmers to manage their online business.",
        "CRUD operations for product listings (Create, Read, Update, Delete).",
        "Order management: Track pending, shipped, and delivered orders.",
        "Sales analytics: Visualizing revenue and popular products.",
        "Designed to be intuitive and accessible on mobile devices."
    ]);

    // --- Slide 18: Results & Achievements ---
    addSlide("Results & Achievements", [
        "Successfully developed a fully functional D2C marketplace.",
        "Apriori engine successfully identifies logical product groupings.",
        "UI is highly responsive, achieving fast load times via Next.js.",
        "Multilingual interface operates smoothly without page reloads.",
        "Secure, scalable architecture ready for production deployment."
    ]);

    // --- Slide 19: Future Scope ---
    addSlide("Future Scope", [
        "Integration of live payment gateways (Stripe, Razorpay).",
        "AI-based automated image verification for organic certificates.",
        "Development of a dedicated cross-platform mobile application.",
        "Real-time GPS tracking integration for delivery logistics.",
        "Expanding language support to additional regional languages."
    ]);

    // --- Slide 20: Conclusion ---
    let slide20 = pres.addSlide();
    slide20.background = { color: "E8F5E9" };
    slide20.addText("CONCLUSION & THANK YOU", { x: "10%", y: "40%", w: "80%", h: 1, fontSize: 44, bold: true, color: "2E7D32", align: "center" });
    slide20.addText("Yogam Organic Farms empowers farmers and nourishes consumers\nthrough technology and transparency.", { x: "10%", y: "55%", w: "80%", h: 1, fontSize: 22, color: "555555", align: "center" });
    slide20.addText("Questions?", { x: "10%", y: "75%", w: "80%", h: 0.5, fontSize: 24, bold: true, color: "2E7D32", align: "center" });

    // Save the presentation
    let fileName = "Yogam_Organic_Farms_Presentation.pptx";
    await pres.writeFile({ fileName: fileName });
    console.log(`Presentation generated successfully: ${fileName}`);
}

createPresentation().catch(err => {
    console.error("Error creating presentation:", err);
});
