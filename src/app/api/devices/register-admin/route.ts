import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateDeviceToken, hashToken, setDeviceCookie } from '@/lib/device-auth';

export async function POST(request: NextRequest) {
  try {
    const { fingerprint, email } = await request.json();

    if (!fingerprint) {
      return NextResponse.json(
        {
          success: false,
          error: 'Fingerprint is required',
        },
        { status: 400 }
      );
    }

    // Check if this device is already registered as an admin device
    const existingAdminDevice = await prisma.adminDevice.findUnique({
      where: { deviceId: fingerprint },
    });

    if (existingAdminDevice) {
      // Re-issue a fresh token so the cookie is always valid after login
      const refreshToken = generateDeviceToken();
      const refreshHash = await hashToken(refreshToken);

      // Revoke old tokens for this fingerprint and create a fresh one
      await prisma.registeredDevice.updateMany({
        where: { fingerprint, revokedAt: null },
        data: { revokedAt: new Date() },
      });
      await prisma.registeredDevice.create({
        data: { fingerprint, tokenHash: refreshHash },
      });

      await setDeviceCookie(refreshToken);

      return NextResponse.json({
        success: true,
        alreadyRegistered: true,
      });
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

    // Register as admin device
    await prisma.adminDevice.create({
      data: {
        deviceId: fingerprint,
        email: email || null,
      },
    });

    // Set the device cookie
    await setDeviceCookie(deviceToken);

    return NextResponse.json({
      success: true,
      alreadyRegistered: false,
    });
  } catch (error) {
    console.error('Error registering admin device:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to register admin device',
      },
      { status: 500 }
    );
  }
}
