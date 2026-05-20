import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getDeviceCookie, verifyToken } from '@/lib/device-auth';

export async function POST(request: NextRequest) {
  try {
    const { fingerprint } = await request.json();

    if (!fingerprint) {
      return NextResponse.json(
        {
          success: true,
          isRegistered: false,
          error: 'Fingerprint is required',
        },
        { status: 200 }
      );
    }

    // Get the device token from cookies
    const deviceToken = await getDeviceCookie();

    if (!deviceToken) {
      return NextResponse.json({
        success: true,
        isRegistered: false,
      });
    }

    // Find devices matching the fingerprint
    const devices = await prisma.registeredDevice.findMany({
      where: {
        fingerprint,
        revokedAt: null, // Only non-revoked devices
      },
    });

    if (devices.length === 0) {
      return NextResponse.json({
        success: true,
        isRegistered: false,
      });
    }

    // Verify the token against any of the matching devices
    for (const device of devices) {
      const isValid = await verifyToken(deviceToken, device.tokenHash);
      if (isValid) {
        // Update last access time
        await prisma.registeredDevice.update({
          where: { id: device.id },
          data: { lastAccessAt: new Date() },
        });

        return NextResponse.json({
          success: true,
          isRegistered: true,
        });
      }
    }

    // Token didn't match any device
    return NextResponse.json({
      success: true,
      isRegistered: false,
    });
  } catch (error) {
    console.error('Error verifying device:', error);
    return NextResponse.json(
      {
        success: false,
        isRegistered: false,
        error: 'Failed to verify device',
      },
      { status: 500 }
    );
  }
}
