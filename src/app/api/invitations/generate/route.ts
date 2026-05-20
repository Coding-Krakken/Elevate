import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateInvitationToken } from '@/lib/device-auth';
import { buildUrl } from '@/lib/url-helper';
import { addHours } from 'date-fns';

export async function POST(request: NextRequest) {
  try {
    // Generate a cryptographically secure token
    const token = generateInvitationToken();

    // Set expiration to 2 hours from now
    const expiresAt = addHours(new Date(), 2);

    // Create the invitation link in the database
    const invitation = await prisma.invitationLink.create({
      data: {
        token,
        expiresAt,
      },
    });

    // Build the full invitation URL
    const inviteUrl = buildUrl(`/invite/${token}`);

    return NextResponse.json({
      success: true,
      inviteUrl,
      token: invitation.token,
      expiresAt: invitation.expiresAt,
    });
  } catch (error) {
    console.error('Error generating invitation:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate invitation link',
      },
      { status: 500 }
    );
  }
}
