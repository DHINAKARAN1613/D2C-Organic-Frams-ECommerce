// lib/apriori.ts

export interface Transaction {
    id: string;
    items: string[]; // Array of Product IDs
}

export interface Rule {
    antecedent: string; // The product the user is currently viewing
    consequent: string; // The product to recommend
    support: number; // How often they appear together in total transactions
    confidence: number; // Probability of buying consequent given antecedent
    lift: number; // NEW: Ratio of confidence to expected confidence. >1 means positive correlation.
}

/**
 * An advanced implementation of the Apriori Algorithm for Market Basket Analysis.
 * Generates recommendation rules based on transaction history, utilizing Support, Confidence, and Lift.
 *
 * @param transactions - An array of order transactions containing product IDs.
 * @param minSupport - The minimum frequency percentage (0-1) for an itemset to be considered.
 * @param minConfidence - The minimum probability (0-1) for a rule to be considered.
 * @returns Array of valid association rules sorted by Lift and Confidence.
 */
export function generateAprioriRules(
    transactions: Transaction[],
    minSupport: number = 0.01,
    minConfidence: number = 0.1
): Rule[] {
    const numTransactions = transactions.length;
    if (numTransactions === 0) return [];

    // 1. Calculate Support for individual items (1-itemsets)
    const itemCounts: Record<string, number> = {};
    transactions.forEach((t) => {
        // Ensure unique items per transaction
        const uniqueItems = Array.from(new Set(t.items));
        uniqueItems.forEach((item) => {
            itemCounts[item] = (itemCounts[item] || 0) + 1;
        });
    });

    // 2. Count frequencies of 2-itemsets (Pairs bought together)
    const pairCounts: Record<string, number> = {};
    transactions.forEach((t) => {
        const uniqueItems = Array.from(new Set(t.items));
        // Generate all unique pairs in this transaction
        for (let i = 0; i < uniqueItems.length; i++) {
            for (let j = i + 1; j < uniqueItems.length; j++) {
                // Sort to ensure consistency (A,B is the same as B,A for counting support)
                const pair = [uniqueItems[i], uniqueItems[j]].sort().join('|');
                pairCounts[pair] = (pairCounts[pair] || 0) + 1;
            }
        }
    });

    // 3. Generate Rules based on minimum support and confidence
    const rules: Rule[] = [];

    for (const [pairStr, pairCount] of Object.entries(pairCounts)) {
        const pairSupport = pairCount / numTransactions;

        // Filter by minimum support
        if (pairSupport >= minSupport) {
            const [itemA, itemB] = pairStr.split('|');

            const supportA = itemCounts[itemA] / numTransactions;
            const supportB = itemCounts[itemB] / numTransactions;

            // Calculate confidence A -> B
            // Rule: If customer buys A, will they buy B?
            const confidenceAtoB = pairSupport / supportA;
            const liftAtoB = confidenceAtoB / supportB;

            if (confidenceAtoB >= minConfidence) {
                rules.push({
                    antecedent: itemA,
                    consequent: itemB,
                    support: pairSupport,
                    confidence: confidenceAtoB,
                    lift: liftAtoB,
                });
            }

            // Calculate confidence B -> A
            // Rule: If customer buys B, will they buy A?
            const confidenceBtoA = pairSupport / supportB;
            const liftBtoA = confidenceBtoA / supportA;

            if (confidenceBtoA >= minConfidence) {
                rules.push({
                    antecedent: itemB,
                    consequent: itemA,
                    support: pairSupport,
                    confidence: confidenceBtoA,
                    lift: liftBtoA,
                });
            }
        }
    }

    // Sort rules by composite score (Lift * Confidence), then Support.
    // Lift > 1 indicates strong positive affinity; Confidence indicates likelihood.
    rules.sort((a, b) => (b.lift * b.confidence) - (a.lift * a.confidence) || b.support - a.support);

    return rules;
}

/**
 * Helper function to get top ranked recommendations for a specific product.
 */
export function getRecommendationsForProduct(
    productId: string,
    rules: Rule[],
    maxRecommendations: number = 3
): string[] {
    // Find all rules where the current product is the antecedent
    // Prioritize rules with Lift > 1.0 (positive cross-selling correlation)
    const positiveRules = rules.filter((r) => r.antecedent === productId && r.lift > 1.0);
    
    // Fallback to any matching rules if positive affinity rules are insufficient
    const matchingRules = positiveRules.length > 0 ? positiveRules : rules.filter((r) => r.antecedent === productId);

    // Extract consequents ordered by rule strength
    const recommendedProductIds = matchingRules.map((r) => r.consequent);

    // Ensure uniqueness
    return Array.from(new Set(recommendedProductIds)).slice(0, maxRecommendations);
}
