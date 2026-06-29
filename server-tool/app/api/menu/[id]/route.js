import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

export async function DELETE(request, { params }) {
  const { id } = await params;
  const client = await clientPromise;
  const db = client.db("cactus_club");
  await db.collection("menu").deleteOne({ _id: new ObjectId(id) });
  return NextResponse.json({ ok: true });
}
