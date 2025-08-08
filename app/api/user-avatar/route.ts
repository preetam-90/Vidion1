import { NextResponse } from 'next/server';
import { stackServerApp } from '../../../stack';

export async function GET() {
  try {
    const user = await stackServerApp.getUser({ or: "return-null" });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    return NextResponse.json({
      profileImageUrl: user.profileImageUrl,
      displayName: user.displayName,
      primaryEmail: user.primaryEmail
    });
  } catch (error) {
    console.error('Error fetching user avatar:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
