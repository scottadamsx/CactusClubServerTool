import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("cactus_club");
    const items = await db.collection("menu").find({}).toArray();
    return NextResponse.json(items);
  } catch (error) {
    console.error("GET /api/menu failed", error);
    return NextResponse.json(
      { error: "Menu service is unavailable. Check your MongoDB connection." },
      { status: 503 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("cactus_club");
    const result = await db.collection("menu").insertOne(body);
    return NextResponse.json({ insertedId: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error("POST /api/menu failed", error);
    return NextResponse.json(
      { error: "Could not create menu item. Check your MongoDB connection." },
      { status: 503 }
    );
  }
}
