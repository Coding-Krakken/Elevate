import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateDeviceToken, hashToken, setDeviceCookie } from '@/lib/device-auth';

export async function POST(request: NextRequest) {
  try {
    const { fingerprint, invitationToken } = await request.json();

    if (!fingerprint || !invitationToken) {
      return NextResponse.json(
        {
          success: false,
          error: 'Fingerprint and invitation token are required',
        },
        { status: 400 }
      );
    }

    // Validate the invitation token
    const invitation = await prisma.invitationLink.findUnique({
      where: { token: invitationToken },
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

    // Generate a secure device token
    const deviceToken = generateDeviceToken();
    const tokenHash = await hashToken(deviceToken);

    // Register the device
    const registeredDevice = await prisma.registeredDevice.create({
      data: {
        fingerprint,
        tokenHash,
      },
    });

    // Mark invitation as used
    await prisma.invitationLink.update({
      where: { id: invitation.id },
      data: {
        used: true,
        usedAt: new Date(),
        deviceId: registeredDevice.id,
      },
    });

    // Set the device cookie
    await setDeviceCookie(deviceToken);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('Error registering device:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to register device',
        errorCode: 'REGISTRATION_FAILED',
      },
      { status: 500 }
    );
  }
}
