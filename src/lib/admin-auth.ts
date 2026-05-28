import prisma from "@/lib/prisma";
import { getDeviceCookie, verifyToken } from "@/lib/device-auth";

export async function isAuthorizedAdminRequest(request: Request) {
  const fingerprint = request.headers.get("x-device-fingerprint");
  if (!fingerprint) {
    return false;
  }

  const deviceToken = await getDeviceCookie();
  if (!deviceToken) {
    return false;
  }

  const adminDevice = await prisma.adminDevice.findUnique({
    where: { deviceId: fingerprint },
  });

  if (!adminDevice) {
    return false;
  }

  const devices = await prisma.registeredDevice.findMany({
    where: {
      fingerprint,
      revokedAt: null,
    },
  });

  for (const device of devices) {
    const isValid = await verifyToken(deviceToken, device.tokenHash);
    if (isValid) {
      await prisma.registeredDevice.update({
        where: { id: device.id },
        data: { lastAccessAt: new Date() },
      });
      return true;
    }
  }

  return false;
}
