import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ word: string }> }
) {
  const { word: rawWord = "" } = await params;
  const word = rawWord.trim().toLowerCase();

  if (!word) {
    return NextResponse.json({ error: "Word is required." }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`,
      { cache: "no-store" }
    );

    if (response.status === 404) {
      return NextResponse.json({ error: "Word not found." }, { status: 404 });
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: "Upstream dictionary service failed." },
        { status: 502 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Dictionary API Error:", error);
    return NextResponse.json(
      { error: "Dictionary service unavailable." },
      { status: 502 }
    );
  }
}
