import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "../../../../lib/apiAuth";

const API_BASE_URL = "https://apikahramani-e8eddtdchububue6.southindia-01.azurewebsites.net/api";

interface AzureImageResponse {
  id: string;
  imageContentBase64?: string; // The actual base64 image data
  name?: string;
  imageUrl?: string; // Azure Blob Storage URL
  imageThumbnail?: string | null;
  productId?: string | null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;
    
    if (!productId) {
      console.error("[API] Missing productId");
      return NextResponse.json(
        { error: "Product ID is required", images: [] },
        { status: 400 }
      );
    }

    // Get authentication token
    const token = await getAccessToken();

    // Call Azure API with includeContent=true
    const azureApiUrl = `${API_BASE_URL}/products/${productId}/images?includeContent=true`;
    
   // console.log(`[API] Fetching images for product: ${productId}`);

    const response = await fetch(azureApiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Dev-Auth": "admin:testuser",
        "Content-Type": "application/json",
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error(`[API] Azure API error ${response.status} for product ${productId}`);
      return NextResponse.json(
        { error: "Failed to fetch images from Azure", images: [] },
        { status: response.status }
      );
    }

    const data: AzureImageResponse[] = await response.json();
    
    if (!Array.isArray(data)) {
      console.error(`[API] Unexpected response format for ${productId}`);
      return NextResponse.json(
        { error: "Invalid response format", images: [] },
        { status: 500 }
      );
    }

   // console.log(`[API] Received ${data.length} image records for product ${productId}`);

    // Process images: prefer base64, fallback to imageUrl
    const processedImages = data
      .map((img, index) => {
        // Priority 1: Use base64 data if available
        if (img.imageContentBase64 && img.imageContentBase64.length > 0) {
          // Azure returns raw base64 without data URI prefix
          const base64Data = img.imageContentBase64;
        //  console.log(`[API] Image ${index}: Using base64 (${base64Data.length} chars)`);
          return `data:image/jpeg;base64,${base64Data}`;
        }
        
        // Priority 2: Use Azure Blob Storage URL as fallback
        if (img.imageUrl && img.imageUrl.startsWith('http')) {
         // console.log(`[API] Image ${index}: Using imageUrl from Azure Blob`);
          return img.imageUrl;
        }

       // console.warn(`[API] Image ${index}: No valid image data`);
        return null;
      })
      .filter((url): url is string => url !== null);

   //`[API] Processed ${processedImages.length} valid images for product ${productId}`);

    // Return empty array instead of placeholder - let client handle it
    if (processedImages.length === 0) {
      console.warn(`[API] No valid images found for product ${productId}`);
      return NextResponse.json(
        { images: [] },
        {
          headers: {
            "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
          },
        }
      );
    }

    return NextResponse.json(
      { images: processedImages },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch (error) {
    console.error("[API] Exception in product-images route:", error);
    return NextResponse.json(
      { 
        error: "Internal server error", 
        images: [],
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}