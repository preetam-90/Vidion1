import { NextResponse } from "next/server";
import { stackServerApp } from "../../../stack";

export async function GET() {
  try {
    const users = await stackServerApp.listUsers();
    return NextResponse.json(users);
  } catch (error: any) {
    console.error("Error listing users:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}