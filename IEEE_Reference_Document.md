# IEEE Base Paper Reference Document
**Project:** Yogam Organic Farms
**Domain:** Data Mining / Machine Learning in E-Commerce
**Algorithm Implemented:** Apriori Algorithm (Association Rule Learning)

---

## 1. IEEE Base Paper Details
If asked by the evaluation staff for the base paper guiding the AI/Algorithm portion of the project, provide the following details:

*   **Recent Application Paper:** *An Application of Apriori Algorithm for Market Basket Analysis in E-Commerce*
    *   **Area:** Data Mining & Knowledge Discovery
    *   **Direct IEEE Xplore Link:** [https://ieeexplore.ieee.org/document/8613959](https://ieeexplore.ieee.org/document/8613959)
    *   **IEEE Xplore Search:** [https://ieeexplore.ieee.org/search/searchresult.jsp?newsearch=true&queryText=Apriori+Market+Basket+Analysis+E-Commerce](https://ieeexplore.ieee.org/search/searchresult.jsp?newsearch=true&queryText=Apriori+Market+Basket+Analysis+E-Commerce)
    *   *(Note: For MCA panels, showing the latest IEEE search matrix for your algorithm proves the domain is active).*

*   **Foundational Algorithm Paper (Must-Cite in Thesis):** *Fast Algorithms for Mining Association Rules* by R. Agrawal and R. Srikant
    *   **Significance:** The original paper that invented the Apriori Algorithm. Evaluators **always** ask for this base paper.
    *   **Direct PDF Link (Open Access via Semantic Scholar):** [https://rakesh.agrawal-family.com/papers/vldb94apriori.pdf](https://rakesh.agrawal-family.com/papers/vldb94apriori.pdf)
    *   **Alternative PDF Link (ResearchGate):** [https://www.researchgate.net/publication/220807096_Fast_Algorithms_for_Mining_Association_Rules](https://www.researchgate.net/publication/220807096_Fast_Algorithms_for_Mining_Association_Rules)
*(Note: The Apriori algorithm is one of the most widely cited and foundational algorithms in IEEE data mining literature for e-commerce. You can map this implementation to any standard IEEE paper on "Market Basket Analysis in E-commerce".)*

## 2. Algorithm Overview: The Apriori Algorithm
The Apriori Algorithm is used for **Market Basket Analysis**. It identifies hidden associations between products that customers frequently buy together. 

### How it works in Yogam Organic Farms:
1.  **Data Collection:** The system continually scans the PostgreSQL database for successful `Orders`.
2.  **Itemset Generation:** It looks at the `OrderItems` inside each order as a "basket" (e.g., User bought: `[Tomatoes, Onions, Spinach]`).
3.  **Support Calculation:** It calculates the frequency of individual items (Support). E.g., How many total orders contain Tomatoes?
4.  **Confidence Calculation:** It calculates the conditional probability (Confidence). E.g., If a user buys Tomatoes, what is the probability they will also buy Onions?
5.  **Recommendation (Output):** When a new user clicks on the "Tomatoes" product page, the system runs the algorithm, finds that "Onions" has a high confidence score, and dynamically displays Onions in a **"Frequently Bought Together"** section.

## 3. Why This Algorithm Was Chosen
1.  **Direct Business Value:** Standard algorithmic approach used by major e-commerce platforms (like Amazon/BigBasket) to increase Average Order Value (AOV).
2.  **Solves a Cold-Start Problem:** Unlike complex deep learning models that require millions of rows of data before they work, Apriori can generate meaningful associations from a standard e-commerce relational database (PostgreSQL + Prisma) natively.
3.  **Academic Relevance:** Perfectly bridges the gap between Database Management Systems (DBMS), Web Development (Next.js), and Artificial Intelligence (Data Mining).
