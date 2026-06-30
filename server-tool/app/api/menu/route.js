import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("cactus_club");
  const items = await db.collection("menu").find({}).toArray();
  return NextResponse.json(items);
}

export async function POST(request) {
  const body = await request.json();
  const client = await clientPromise;
  const db = client.db("cactus_club");
  const result = await db.collection("menu").insertOne(body);
  return NextResponse.json({ insertedId: result.insertedId }, { status: 201 });
}
