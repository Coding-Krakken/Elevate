import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateInvitationToken } from '@/lib/device-auth';
import { buildUrl } from '@/lib/url-helper';
import { addHours, format } from 'date-fns';

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

    // Format the SMS message
    const expirationTime = format(expiresAt, 'h:mm a');
    const smsMessage = `You've been invited to Elevate Cannabis Co!\n\nClick here to access: ${inviteUrl}\n\nThis link expires at ${expirationTime} and can only be used once.`;

    return NextResponse.json({
      success: true,
      inviteUrl,
      token: invitation.token,
      expiresAt: invitation.expiresAt,
      smsMessage,
    });
  } catch (error) {
    console.error('Error generating admin invitation:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate invitation link',
      },
      { status: 500 }
    );
  }
}
