import React from "react";
import { ExternalLink, Instagram, Twitter, Youtube, Mail, Phone, Globe } from "lucide-react";

export default function Preview({ profile }) {
  const getButtonStyle = () => {
    const base =
      "w-full py-3 px-4 flex items-center justify-between text-sm transition-all duration-200 hover:scale-105 hover:shadow-lg";
    return profile.buttonStyle === "pill"
      ? base + " rounded-full"
      : profile.buttonStyle === "square"
      ? base + " rounded-none"
      : base + " rounded-xl";
  };

  const getLinkIcon = (url) => {
    const domain = url.toLowerCase();
    if (domain.includes("instagram")) return <Instagram className="w-5 h-5" />;
    if (domain.includes("twitter") || domain.includes("x.com"))
      return <Twitter className="w-5 h-5" />;
    if (domain.includes("youtube")) return <Youtube className="w-5 h-5" />;
    if (domain.includes("mailto:")) return <Mail className="w-5 h-5" />;
    if (domain.includes("tel:")) return <Phone className="w-5 h-5" />;
    return <Globe className="w-5 h-5" />;
  };

  const getBackgroundStyle = () =>
    profile.background?.startsWith("linear-gradient")
      ? { background: profile.background }
      : { backgroundColor: profile.background };

  return (
    <div className="flex-1 flex flex-col text-white" style={getBackgroundStyle()}>
      {/* Profile Picture */}
      {profile.profilePicture && (
        <img
          src={profile.profilePicture}
          alt="Profile"
          className="w-20 h-20 mx-auto rounded-full mt-8 mb-4 object-cover border-4 border-white/40"
        />
      )}

      {/* Name + Bio */}
      <h2
        className="text-lg font-bold mb-2 text-center"
        style={{
          fontFamily:
            profile.font === "font-poppins" ? "Poppins, sans-serif" : "Inter",
        }}
      >
        {profile.displayName}
      </h2>
      <p
        className="text-sm mb-6 text-white/80 text-center px-4"
        style={{
          fontFamily:
            profile.font === "font-poppins" ? "Poppins, sans-serif" : "Inter",
        }}
      >
        {profile.bio}
      </p>

      {/* Links */}
      <div className="flex-1 overflow-y-auto px-6 space-y-3">
        {profile.links
          .filter((link) => link.active)
          .map((link, i) => (
            <a
              key={i}
              href={link.url}
              className={getButtonStyle()}
              style={{
                backgroundColor: `${profile.buttonColor}e6`,
                color: profile.buttonColor === "#ffffff" ? "#000000" : "#ffffff",
                fontFamily:
                  profile.font === "font-poppins"
                    ? "Poppins, sans-serif"
                    : "Inter",
                border: `1px solid ${profile.buttonColor}33`,
              }}
            >
              <div className="flex items-center">
                <span className="mr-3 opacity-80">{getLinkIcon(link.url)}</span>
                <span className="font-medium">{link.title}</span>
              </div>
              <ExternalLink className="w-5 h-5 opacity-70" />
            </a>
          ))}
      </div>
    </div>
  );
}
