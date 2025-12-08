import { getAccessToken } from "./apiAuth";

const API_BASE_URL = "https://apikahramani-e8eddtdchububue6.southindia-01.azurewebsites.net/api";

export interface ApiProduct {
    id: string;
    name: string;
    descriptionAr: string;
    listPrice: number;
    accessoryType?: number;
}

export interface ProductImage {
    id: string;
    imageUrl: string;
}

export type CategoryType =
    | "850000008" // Pendant Only
    | "850000000" // Necklace
    | "850000001" // Earring
    | "850000002" // Bracelet
    | "850000003" // Ring
    | "850000004"; // Rosery

export const categoryMapping: Record<string, CategoryType> = {
    pendants: "850000008",
    necklaces: "850000000",
    earrings: "850000001",
    bracelets: "850000002",
    rings: "850000003",
    sets: "850000004", // Rosery mapped to sets
};

export async function fetchProducts(
    page: number = 1,
    pageSize: number = 12,
    accessoryType?: string
): Promise<ApiProduct[]> {
    try {
        const token = await getAccessToken();

        let url = `${API_BASE_URL}/products?page=${page}&pageSize=${pageSize}`;


      //  console.log("Fetching products from API:", url);
        // Add accessoryType filter if provided
        if (accessoryType && categoryMapping[accessoryType]) {
            url += `&accessoryType=${categoryMapping[accessoryType]}`;
        }

        const response = await fetch(url, { 
            headers: {
                Authorization: `Bearer ${token}`,
                "X-Dev-Auth": "admin:testuser",
                "Content-Type": "application/json",
            },
            next: { revalidate: 300 }, // Cache for 5 minutes
        });

        

        if (!response.ok) {
            console.error(`API Error: ${response.status} ${response.statusText}`);
            return [];
        }

        const data = await response.json();

        //console.log("API data:", data.items);
        return data.items || [];
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}

export async function fetchProductImages(productId: string): Promise<string[]> {
    try {
        const token = await getAccessToken();

        const response = await fetch(`${API_BASE_URL}/products/${productId}/images?includeContent=true`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            next: { revalidate: 3600 }, // Cache for 1 hour
        });

        if (!response.ok) {
            console.error(`API Error fetching images: ${response.status}`);
            return ["/images/placeholder.png"]; // Fallback image
        }

        const data = await response.json();

        // Extract image URLs from response
        // Adjust this based on actual API response structure
        if (data.images && Array.isArray(data.images)) {
            return data.images.map((img: ProductImage) => img.imageUrl);
        }

        // If no images, return placeholder
        return ["/images/placeholder.png"];
    } catch (error) {
        console.error(`Error fetching images for product ${productId}:`, error);
        return ["/images/placeholder.png"];
    }
}