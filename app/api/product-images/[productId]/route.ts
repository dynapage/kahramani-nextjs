import { NextRequest, NextResponse } from "next/server";
import { fetchProductImages } from "../../../../lib/apiProducts";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;
    
    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const images = await fetchProductImages(productId);

    return NextResponse.json(
      { images },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch (error) {
    console.error("Error in product images API:", error);
    return NextResponse.json(
      { error: "Failed to fetch product images", images: ["/images/placeholder.png"] },
      { status: 500 }
    );
  }
}