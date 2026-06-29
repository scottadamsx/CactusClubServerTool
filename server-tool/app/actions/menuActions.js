"use server";

import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import clientPromise from "@/lib/mongodb";

export async function updateMenuItem(formData) {
  const id = formData.get("id");
  const name = formData.get("name");
  const price = parseFloat(formData.get("price"));
  
  const client = await clientPromise;
  const db = client.db("cactus_club");
  
  await db.collection("menu").updateOne(
    { _id: new ObjectId(id) },
    { $set: { name, price } }
  );
  
  revalidatePath("/");
}
