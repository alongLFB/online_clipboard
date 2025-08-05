import { NextRequest, NextResponse } from "next/server";
import { ClipboardService } from "@/lib/clipboard-service";

const clipboardService = new ClipboardService();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { error: "Invalid clipboard ID", code: "INVALID_ID" },
        { status: 400 }
      );
    }

    const clipboard = await clipboardService.get(id);

    if (!clipboard) {
      return NextResponse.json(
        { error: "Content not found or expired", code: "NOT_FOUND" },
        { status: 404 }
      );
    }

    return NextResponse.json(clipboard);
  } catch (error) {
    console.error("Error fetching clipboard:", error);
    return NextResponse.json(
      { error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
