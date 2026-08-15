import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid menu item id." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("cactus_club");
    await db.collection("menu").deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/menu/[id] failed", error);
    return NextResponse.json(
      { error: "Could not delete menu item. Check your MongoDB connection." },
      { status: 503 }
    );
  }
}
