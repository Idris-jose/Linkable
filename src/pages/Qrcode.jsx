import React, { useRef, useState, useEffect } from "react";
import { QRCode } from "react-qrcode-logo";
import { Download, Share2, Copy, Sparkles } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import * as htmlToImage from "html-to-image";
import { useParams } from "react-router-dom";

export default function QrCode() {
  const { user } = useAuth();
  const [qrValue, setQrValue] = useState("");
  const [foreground, setForeground] = useState("#000000");
  const [background, setBackground] = useState("#ffffff");
  const [logoUrl, setLogoUrl] = useState("");
  const [image, setImage] = useState(null);

  const { name } = useParams();
  const decodedName = decodeURIComponent(name);
  const nodeRef = useRef(null);

  useEffect(() => {
    if (user) {
      const profileUrl = `${window.location.origin}/profile/${user.uid}`;
      setQrValue(profileUrl);
    }
  }, [user]);

  const handleDownload = async () => {
    if (!nodeRef.current) return;
    try {
      const dataUrl = await htmlToImage.toPng(nodeRef.current, {
        pixelRatio: 4, // Increased from 2 to 4 for better quality
        backgroundColor: "#ffffff",
        quality: 1.0,
        cacheBust: true,
      });
      const link = document.createElement("a");
      link.download = "linkable-qr-code.png";
      link.href = dataUrl;
      link.click();
      toast.success("QR code downloaded successfully!");
    } catch (err) {
      toast.error("Failed to download QR code");
    }
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-14 w-14 border-4 border-indigo-200 border-t-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your QR code...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster 
        position="top-right"
      />
      <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 sm:p-8">
              {/* Customization Controls */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                
                  Customize Your QR Code
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Foreground Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={foreground}
                        onChange={(e) => setForeground(e.target.value)}
                        className="w-14 h-14 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-indigo-400 transition-colors"
                      />
                      <span className="text-xs text-gray-500 font-mono">{foreground}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Background Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={background}
                        onChange={(e) => setBackground(e.target.value)}
                        className="w-14 h-14 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-indigo-400 transition-colors"
                      />
                      <span className="text-xs text-gray-500 font-mono">{background}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Center Logo
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files[0]) {
                          setLogoUrl(URL.createObjectURL(e.target.files[0]));
                        }
                      }}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Background Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files[0]) {
                          setImage(URL.createObjectURL(e.target.files[0]));
                        }
                      }}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* QR Display */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  Preview
                </h2>
                <div
                  ref={nodeRef}
                  className="relative w-full flex flex-col justify-center items-center rounded-xl border-2 border-gray-200 overflow-hidden shadow-lg"
                  style={{
                    background: background,
                    minHeight: 420,
                  }}
                >
                  {/* Background image */}
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

                  {/* QR Code */}
                  <div className="z-10 bg-white/95 p-4 rounded-xl shadow-2xl backdrop-blur-sm">
                    <QRCode
                      value={qrValue}
                      size={240}
                      fgColor={foreground}
                      bgColor="transparent"
                      logoImage={logoUrl || undefined}
                      logoWidth={50}
                      logoHeight={50}
                      qrStyle="dots"
                      eyeRadius={8}
                      enableCORS={true}
                    />
                  </div>

                  {/* Branding Footer */}
                  <div className="z-10 w-full bg-gradient-to-r from-indigo-600 to-indigo-700 py-4 mt-6">
                    <p className="text-white text-center font-semibold text-lg tracking-wide">
                      Made with Linkable
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={handleDownload}
                    className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3.5 rounded-xl hover:bg-indigo-700 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    <Download className="w-5 h-5" />
                    Download
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3.5 rounded-xl hover:bg-green-700 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    <Share2 className="w-5 h-5" />
                    Share
                  </button>
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center justify-center gap-2 bg-gray-700 text-white px-6 py-3.5 rounded-xl hover:bg-gray-800 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    <Copy className="w-5 h-5" />
                    Copy Link
                  </button>
                </div>
              </div>

              {/* Link Display */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  Your Profile Link
                </h3>
                <p className="text-sm text-gray-600 break-all font-mono bg-white px-4 py-3 rounded-lg border border-gray-200">
                  {qrValue}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}