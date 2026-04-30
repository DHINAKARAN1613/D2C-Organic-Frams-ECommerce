export function getImageUrl(imageString: string | null | undefined): string | null {
    if (!imageString) return null;

    try {
        // Try parsing as JSON first (handles ["url", "url2"])
        const parsed = JSON.parse(imageString);
        if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed[0];
        } else if (typeof parsed === 'string') {
            return parsed;
        }
    } catch (e) {
        // Not JSON, fall back to other methods
    }

    // Try splitting by comma if it's a CSV string
    if (imageString.includes(',')) {
        return imageString.split(',')[0].trim();
    }

    // Clean up potentially dirty strings (e.g. starting with [ or ")
    let clean = imageString.trim();
    if (clean.startsWith('["') && clean.endsWith('"]')) {
        clean = clean.slice(2, -2);
    } else if (clean.startsWith('[') && clean.endsWith(']')) {
        clean = clean.slice(1, -1);
    }

    // Remove surrounding quotes if present
    if (clean.startsWith('"') && clean.endsWith('"')) {
        clean = clean.slice(1, -1);
    }

    return clean;
}
