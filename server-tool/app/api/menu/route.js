import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("cactus_club");
  const items = await db.collection("menu").find({}).toArray();
  return NextResponse.json(items);
}
