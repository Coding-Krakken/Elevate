import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: 'Token is required',
        },
        { status: 400 }
      );
    }

    // Find the invitation by token
    const invitation = await prisma.invitationLink.findUnique({
      where: { token },
    });

    if (!invitation) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid invitation link',
          errorCode: 'INVALID_TOKEN',
        },
        { status: 404 }
      );
    }

    // Check if already used
    if (invitation.used) {
      return NextResponse.json(
        {
          success: false,
          error: 'This invitation link has already been used',
          errorCode: 'USED_TOKEN',
        },
        { status: 400 }
      );
    }

    // Check if expired
    if (new Date() > invitation.expiresAt) {
      return NextResponse.json(
        {
          success: false,
          error: 'This invitation link has expired',
          errorCode: 'EXPIRED_TOKEN',
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      invitation: {
        id: invitation.id,
        expiresAt: invitation.expiresAt,
      },
    });
  } catch (error) {
    console.error('Error validating invitation:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to validate invitation link',
      },
      { status: 500 }
    );
  }
}
