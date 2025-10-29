import React, { useRef,useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { Download, Share2, Copy } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import * as htmlToImage from "html-to-image";

export default function QrCode() {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [qrValue, setQrValue] = useState('');

    const nodeRef = useRef(null);


    useEffect(() => {
        if (user) {
            const profileUrl = `${window.location.origin}/profile/${user.uid}`;
            setQrValue(profileUrl);
        }
    }, [user]);

    async function handleDownload () {
         if (!nodeRef.current) return;
    const dataUrl = await htmlToImage.toPng(nodeRef.current, {
      pixelRatio: 2,
      cacheBust: true,
      filter: (node) =>
        !(node instanceof HTMLElement && node.dataset?.export === "exclude"),
      backgroundColor: "#0b0b0b",
    });

    const link = document.createElement("a");
    link.download = "export.png";
    link.href = dataUrl;
    link.click();
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'My Linkable Profile QR Code',
                    text: 'Scan this QR code to view my profile!',
                    url: qrValue,
                });
                toast.success('Link shared successfully!');
            } catch (err) {
                console.error('Error sharing:', err);
                toast.error('Failed to share link');
            }
        } else {
            // Fallback: copy to clipboard
            try {
                await navigator.clipboard.writeText(qrValue);
                toast.success('Link copied to clipboard!');
            } catch (err) {
                console.error('Failed to copy:', err);
                toast.error('Failed to copy link');
            }
        }
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(qrValue);
            toast.success('Link copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy:', err);
            toast.error('Failed to copy link');
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen p-3 w-full flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Toaster position="top-right" />
            <div className="min-h-screen p-3 w-full bg-gray-50">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Your QR Code</h1>
                        <p className="text-gray-600 text-center mb-8">Share your profile with anyone by scanning this QR code</p>

                        <div className="flex justify-center mb-8">
                            <div className="bg-white p-4 rounded-lg shadow-md border" ref={nodeRef}>
                                <QRCode
                                    value={qrValue}
                                    size={256}
                                    renderAs="canvas"
                                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={handleDownload}
                                className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                <Download className="w-5 h-5" />
                                Download QR Code
                            </button>
                            <button
                                onClick={handleShare}
                                className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                            >
                                <Share2 className="w-5 h-5" />
                                Share Link
                            </button>
                            <button
                                onClick={handleCopyLink}
                                className="flex items-center justify-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                <Copy className="w-5 h-5" />
                                Copy Link
                            </button>
                        </div>

                        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                            <h3 className="text-sm font-medium text-gray-700 mb-2">Profile Link:</h3>
                            <p className="text-xs text-gray-500 break-all">{qrValue}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
