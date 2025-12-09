import { getAccessToken } from "./apiAuth";

const API_BASE_URL = "https://apikahramani-e8eddtdchububue6.southindia-01.azurewebsites.net/api";

export interface ApiProduct {
    id: string;
    name: string;
    titleEn?: string;
    descriptionAr: string;
    descriptionEn?: string;
    productCode?: string;
    listPrice: number;
    accessoryType?: number;
    quantityInStock?: number;
}

export interface ProductsResponse {
    items: ApiProduct[];
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
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

export const categoryMapping: Record<string, CategoryType | CategoryType[]> = {
    necklaces: ["850000008", "850000000"], // Combined: Pendants + Necklaces
    earrings: "850000001",
    bracelets: "850000002",
    rings: "850000003",
    sets: "850000004", // Rosery mapped to sets
};

export async function fetchProducts(
    page: number = 1,
    pageSize: number = 12,
    accessoryType?: string
): Promise<ProductsResponse> {
    try {
        const token = await getAccessToken();

        let url = `${API_BASE_URL}/products?page=${page}&pageSize=${pageSize}`;

        // Add accessoryType filter if provided
        if (accessoryType && categoryMapping[accessoryType]) {
            const mapping = categoryMapping[accessoryType];
            if (Array.isArray(mapping)) {
                // For combined categories (necklaces = pendants + necklaces)
                url += `&accessoryType=${mapping.join(',')}`;
            } else {
                url += `&accessoryType=${mapping}`;
            }
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
            return {
                items: [],
                page: 1,
                pageSize: 12,
                totalCount: 0,
                totalPages: 0,
                hasNextPage: false,
                hasPreviousPage: false
            };
        }

        const data = await response.json();

        return {
            items: data.items || [],
            page: data.page || 1,
            pageSize: data.pageSize || 12,
            totalCount: data.totalCount || 0,
            totalPages: data.totalPages || 0,
            hasNextPage: data.hasNextPage || false,
            hasPreviousPage: data.hasPreviousPage || false
        };
    } catch (error) {
        console.error("Error fetching products:", error);
        return {
            items: [],
            page: 1,
            pageSize: 12,
            totalCount: 0,
            totalPages: 0,
            hasNextPage: false,
            hasPreviousPage: false
        };
    }
}

export async function fetchProductImages(productId: string): Promise<string[]> {
    try {
        const token = await getAccessToken();

        const response = await fetch(`${API_BASE_URL}/products/${productId}/images?includeContent=true`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "X-Dev-Auth": "admin:testuser",
                "Content-Type": "application/json",
            },
            next: { revalidate: 3600 }, // Cache for 1 hour
        });

        if (!response.ok) {
            console.error(`API Error fetching images: ${response.status}`);
            return ["/images/placeholder.png"];
        }

        const data = await response.json();

        if (data.images && Array.isArray(data.images)) {
            return data.images.map((img: ProductImage) => img.imageUrl);
        }

        return ["/images/placeholder.png"];
    } catch (error) {
        console.error(`Error fetching images for product ${productId}:`, error);
        return ["/images/placeholder.png"];
    }
}