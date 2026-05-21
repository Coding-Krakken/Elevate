'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Leaf, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { generateDeviceFingerprint } from '@/lib/fingerprint';
import { DeviceRegistrationResponse } from '@/types';

interface InvitePageProps {
  params: Promise<{ token: string }>;
}

export default function InvitePage({ params }: InvitePageProps) {
  const [token, setToken] = useState<string>('');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    async function resolveParams() {
      const resolvedParams = await params;
      setToken(resolvedParams.token);
    }
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (!token) return;

    async function processInvitation() {
      try {
        // Step 1: Validate the invitation token
        const validateResponse = await fetch('/api/invitations/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        const validateData = await validateResponse.json();

        if (!validateData.success) {
          setStatus('error');
          setErrorMessage(
            validateData.error || 'This invitation link is invalid or has expired.'
          );
          return;
        }

        // Step 2: Generate device fingerprint
        const fingerprint = await generateDeviceFingerprint();

        // Step 3: Register the device
        const registerResponse = await fetch('/api/devices/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fingerprint,
            invitationToken: token,
          }),
        });

        const registerData: DeviceRegistrationResponse = await registerResponse.json();

        if (!registerData.success) {
          setStatus('error');
          setErrorMessage(
            registerData.error || 'Failed to register your device.'
          );
          return;
        }

        // Success! Redirect to home page
        setStatus('success');
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } catch (error) {
        console.error('Error processing invitation:', error);
        setStatus('error');
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
    }

    processInvitation();
  }, [token, router]);

  return (
    <div className="min-h-screen bg-[#02030a] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="group flex items-center gap-2">
            <Leaf className="h-12 w-12 text-lime-300" />
            <div className="text-left">
              <p className="text-2xl font-black leading-none tracking-[0.22em] text-white">
                SYRACUSE
              </p>
              <p className="text-xs tracking-[0.2em] text-slate-400">
                EXOTICZ
              </p>
            </div>
          </div>
        </div>

        {/* Status Icon */}
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-white/5 p-6 border border-white/10">
            {status === 'loading' && (
              <Loader2 className="h-12 w-12 text-lime-300 animate-spin" />
            )}
            {status === 'success' && (
              <CheckCircle className="h-12 w-12 text-lime-300" />
            )}
            {status === 'error' && (
              <XCircle className="h-12 w-12 text-red-400" />
            )}
          </div>
        </div>

        {/* Message */}
        {status === 'loading' && (
          <>
            <h1 className="text-3xl font-bold text-white mb-4">
              Registering Your Device
            </h1>
            <p className="text-slate-300">
              Please wait while we verify your invitation and register your device...
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <h1 className="text-3xl font-bold text-white mb-4">
              Welcome to Syracuse Exoticz!
            </h1>
            <p className="text-slate-300 mb-2">
              Your device has been successfully registered.
            </p>
            <p className="text-slate-400 text-sm">
              Redirecting you to the site...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <h1 className="text-3xl font-bold text-white mb-4">
              Registration Failed
            </h1>
            <p className="text-slate-300 mb-4">{errorMessage}</p>
            <button
              onClick={() => router.push('/access-denied')}
              className="px-6 py-2 rounded-full bg-lime-300 text-black font-semibold hover:bg-lime-400 transition"
            >
              Go Back
            </button>
          </>
        )}
      </div>
    </div>
  );
}
