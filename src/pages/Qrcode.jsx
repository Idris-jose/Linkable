import React, { useRef, useState, useEffect } from "react";
import { QRCode } from "react-qrcode-logo";
import { Download, Share2, Copy } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import * as htmlToImage from "html-to-image";

export default function QrCode() {
  const { user } = useAuth();
  const [qrValue, setQrValue] = useState("");
  const [foreground, setForeground] = useState("#000000");
  const [background, setBackground] = useState("#ffffff");
  const [logoUrl, setLogoUrl] = useState("");
  const [image, setImage] = useState(null);

  const nodeRef = useRef(null);

  useEffect(() => {
    if (user) {
      const profileUrl = `${window.location.origin}/profile/${user.uid}`;
      setQrValue(profileUrl);
    }
  }, [user]);

  const handleDownload = async () => {
    if (!nodeRef.current) return;
    const dataUrl = await htmlToImage.toPng(nodeRef.current, {
      pixelRatio: 2,
      backgroundColor: "#ffffff",
    });
    const link = document.createElement("a");
    link.download = "qr-code.png";
    link.href = dataUrl;
    link.click();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Linkable Profile QR Code",
          text: "Scan this QR code to view my profile!",
          url: qrValue,
        });
        toast.success("Link shared successfully!");
      } catch (err) {
        toast.error("Failed to share link");
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(qrValue);
      toast.success("Link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
              Custom QR Code
            </h1>
            <p className="text-gray-600 text-center mb-8">
              Customize and download your personal QR code
            </p>

            {/* Customization Controls */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Foreground
                </label>
                <input
                  type="color"
                  value={foreground}
                  onChange={(e) => setForeground(e.target.value)}
                  className="w-16 h-10 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Background
                </label>
                <input
                  type="color"
                  value={background}
                  onChange={(e) => setBackground(e.target.value)}
                  className="w-16 h-10 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Logo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setLogoUrl(URL.createObjectURL(e.target.files[0]))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Background Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setImage(URL.createObjectURL(e.target.files[0]))
                  }
                />
              </div>
            </div>

            {/* QR Display */}
            <div
              ref={nodeRef}
              className="relative w-full flex justify-center items-center rounded-lg border overflow-hidden"
              style={{
                background: background,
                height: 320,
                position: "relative",
              }}
            >
              {/* Pixelated background image */}
              {image && (
                <img
                  src={image}
                  alt="QR Background"
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{
                    imageRendering: "pixelated",
                    opacity: 0.6,
                    filter: "contrast(1.2) saturate(0.8)",
                  }}
                />
              )}

              <div className="z-10 bg-white/80 p-3 rounded-md shadow-md">
                <QRCode
                  value={qrValue}
                  size={200}
                  fgColor={foreground}
                  bgColor="transparent"
                  logoImage={logoUrl || undefined}
                  logoWidth={40}
                  qrStyle="dots"
                  eyeRadius={5}
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <button
                onClick={handleDownload}
                className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Download className="w-5 h-5" />
                Download
              </button>
              <button
                onClick={handleShare}
                className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Share2 className="w-5 h-5" />
                Share
              </button>
              <button
                onClick={handleCopyLink}
                className="flex items-center justify-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Copy className="w-5 h-5" />
                Copy Link
              </button>
            </div>

            {/* Link Display */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Profile Link:
              </h3>
              <p className="text-xs text-gray-500 break-all">{qrValue}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
