'use client';

import { useState } from 'react';
import { Share2, Copy, Check, MessageSquare, X, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

interface InvitationData {
  inviteUrl: string;
  smsMessage: string;
  expiresAt: string;
}

export default function ShareButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [copied, setCopied] = useState(false);

  const generateInvite = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/admin/generate-invite', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        setInvitation({
          inviteUrl: data.inviteUrl,
          smsMessage: data.smsMessage,
          expiresAt: data.expiresAt,
        });
      } else {
        alert('Failed to generate invitation link');
      }
    } catch (error) {
      console.error('Error generating invite:', error);
      alert('An error occurred while generating the invitation link');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    if (!invitation) return;

    try {
      await navigator.clipboard.writeText(invitation.inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const shareViaSMS = () => {
    if (!invitation) return;

    // Create SMS link (works on both mobile and desktop)
    const smsLink = `sms:?body=${encodeURIComponent(invitation.smsMessage)}`;
    window.location.href = smsLink;
  };

  const handleOpen = () => {
    setIsOpen(true);
    setInvitation(null);
    setCopied(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    setInvitation(null);
    setCopied(false);
  };

  return (
    <>
      {/* Share Button */}
      <button
        onClick={handleOpen}
        className="rounded-full border border-white/15 p-2 text-slate-200 transition hover:border-lime-300/60 hover:text-lime-300"
        aria-label="Share invitation"
      >
        <Share2 className="h-4 w-4" />
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#060a0e] p-6 shadow-2xl">
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 text-slate-400 hover:text-white transition"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <h2 className="text-2xl font-bold text-white mb-2">
              Share Invitation
            </h2>
            <p className="text-sm text-slate-400 mb-6">
              Generate a secure, one-time invitation link to share with new users.
            </p>

            {!invitation ? (
              /* Generate Button */
              <button
                onClick={generateInvite}
                disabled={isGenerating}
                className="w-full rounded-full bg-lime-300 px-6 py-3 font-semibold text-black transition hover:bg-lime-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Share2 className="h-5 w-5" />
                    Generate Invite Link
                  </>
                )}
              </button>
            ) : (
              /* Invitation Details */
              <div className="space-y-4">
                {/* URL Display */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Invitation Link
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={invitation.inviteUrl}
                      readOnly
                      className="flex-1 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-slate-200"
                    />
                    <button
                      onClick={copyToClipboard}
                      className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-slate-200 transition hover:border-lime-300/60 hover:text-lime-300 flex items-center gap-2"
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Expiration Notice */}
                <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-3">
                  <p className="text-xs text-yellow-200">
                    <strong>Note:</strong> This link expires at{' '}
                    {format(new Date(invitation.expiresAt), 'h:mm a')} and can only be
                    used once.
                  </p>
                </div>

                {/* Share via SMS Button */}
                <button
                  onClick={shareViaSMS}
                  className="w-full rounded-full border border-lime-300/60 bg-lime-300/10 px-6 py-3 font-semibold text-lime-300 transition hover:bg-lime-300/20 flex items-center justify-center gap-2"
                >
                  <MessageSquare className="h-5 w-5" />
                  Share via SMS
                </button>

                {/* Generate Another */}
                <button
                  onClick={() => setInvitation(null)}
                  className="w-full text-sm text-slate-400 hover:text-white transition"
                >
                  Generate another link
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
