import React, { useEffect, useState } from "react";
import { templates } from "../data/templates";
import { useLocation,useNavigate } from "react-router-dom";
import {
  ExternalLink,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  Phone,
  Globe,
  Link as LinkIcon,
  Share,
  Github,
  Linkedin,
  Heart,
  MessageCircle,
  ArrowLeft
} from "lucide-react";

export default function Preview({ 
  profile: propProfile, 
  isEditing = false, 
  contentRef, 
  isOver = false,
  children 
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState(propProfile || location.state?.profile);

  useEffect(() => {
    // Check if profile is passed via URL query parameter
    const urlParams = new URLSearchParams(location.search);
    const profileParam = urlParams.get('profile');
    if (profileParam) {
      try {
        const decodedProfile = JSON.parse(decodeURIComponent(profileParam));
        setProfile(decodedProfile);
      } catch (error) {
        console.error('Error parsing profile from URL:', error);
        // Try to parse without decodeURIComponent as fallback
        try {
          const fallbackProfile = JSON.parse(profileParam);
          setProfile(fallbackProfile);
        } catch (fallbackError) {
          console.error('Fallback parsing also failed:', fallbackError);
        }
      }
    }
  }, [location.search]);

  // Add null check for profile
  if (!profile) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500 min-h-screen">
        <div className="text-center">
          <LinkIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

 const getButtonStyle = () => {
  const baseStyle =
    "w-full p-4 text-center transition-all duration-200 flex items-center justify-between group";

  let style = "";
  if (profile.templateId) {
    const template = templates.find(t => t.id === profile.templateId);
    if (template?.extraButtonClasses) {
      style += " " + template.extraButtonClasses;
    }
  }

  switch (profile.buttonStyle) {
    case "square":
      return baseStyle + " rounded-none" + style;
    case "pill":
      return baseStyle + " rounded-full" + style;
    default:
      return baseStyle + " rounded-xl" + style;
  }
};


  const getLinkIcon = (url) => {
    const domain = url.toLowerCase();
    if (domain.includes("instagram")) return <Instagram className="w-5 h-5" />;
    if (domain.includes("twitter") || domain.includes("x.com"))
      return <Twitter className="w-5 h-5" />;
    if (domain.includes("youtube")) return <Youtube className="w-5 h-5" />;
    if (domain.includes("mailto:")) return <Mail className="w-5 h-5" />;
    if (domain.includes("tel:")) return <Phone className="w-5 h-5" />;
    if (domain.includes("github")) return <Github className="w-5 h-5" />;
    if (domain.includes("linkedin")) return <Linkedin className="w-5 h-5" />;
    return <Globe className="w-5 h-5" />;
  };

  const getBackgroundStyle = () => {
    if (!profile.background) return { backgroundColor: '#000000' };

    return profile.background.startsWith("linear-gradient")
      ? { background: profile.background }
      : { backgroundColor: profile.background };
  };

  const getFontFamily = () => {
  if (profile.font === "Poppins" || profile.font === "font-poppins")
    return "Poppins, sans-serif";
  if (profile.font === "Zalando Sans Expanded" || profile.font === "font-zalando")
    return "Zalando Sans Expanded, sans-serif";
  return "Inter, sans-serif";
};

  const activeLinks = profile.links ? profile.links.filter(link => link.active) : [];

  const handleShare = async () => {
    const profileUrl = `https://linkbuilder.app/${profile.displayName?.replace(/\s+/g, '').toLowerCase()}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile.displayName}'s Links`,
          text: 'Check out my links!',
          url: profileUrl,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(profileUrl);
        // You could add a toast notification here
        alert('Link copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={getBackgroundStyle()}>
      {!isEditing && (
        <button
          className="absolute top-4 left-4 z-50 text-sm gap-3 flex items-center cursor-pointer text-white bg-white/50 p-3 rounded hover:bg-white/70 hover:text-black transition-colors"
          onClick={() => navigate('/Customize')}
        >
          <ArrowLeft className="w-4 h-4"/> Back to Dashboard
        </button>
      )}

      {/* Profile Content Container */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
         <div 
  ref={contentRef} 
  className={`w-full max-w-md mx-auto relative ${isEditing ? "" : ""}`}
>


          {/* Stickers Layer or Editing Overlay */}
          {!isEditing && profile.stickers && profile.stickers.length > 0 && (
            <div className="absolute inset-0 pointer-events-none z-0">
              {profile.stickers.map((sticker) => (
                <img
                  key={sticker.id}
                  src={sticker.src}
                  alt={sticker.name}
                  className="absolute object-contain"
                  style={{
                    left: `${sticker.x}px`,
                    top: `${sticker.y}px`,
                    width: `${sticker.width}px`,
                    height: `${sticker.height}px`,
                    transform: `rotate(${sticker.rotation || 0}deg)`,
                    pointerEvents: 'none'
                  }}
                />
              ))}
            </div>
          )}
          {isEditing && children}
          
          {/* Drop Indicator for Editing */}
          {isEditing && isOver && (
            <div className="absolute inset-0 bg-indigo-500 bg-opacity-10 pointer-events-none z-50 flex items-center justify-center rounded-xl">
              <div className="bg-white rounded-lg shadow-lg p-4 transform -translate-x-1/2 -translate-y-1/2">
                <p className="text-indigo-600 font-semibold">Drop sticker here</p>
              </div>
            </div>
          )}

          {/* Profile Header */}
          <div className="text-center mb-8 relative z-10">
            {/* Profile Picture */}
            <div className="w-32 h-32 mx-auto mb-6 rounded-full border-4 border-white shadow-2xl overflow-hidden flex items-center justify-center">
              {profile.profilePicture ? (
                <img
                  src={profile.profilePicture}
                  alt={profile.displayName || 'Profile'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white text-3xl font-bold">
                  {profile.displayName?.split(' ').map(n => n[0]).join('') || 'U'}
                </span>
              )}
            </div>

            <h1
              className="text-white text-3xl font-bold mb-3 drop-shadow-lg"
              style={{ fontFamily: getFontFamily() }}
            >
              {profile.displayName || 'Your Name'}
            </h1>

            <p className="text-white/90 text-lg mb-2">
              @{profile.displayName?.replace(/\s+/g, '').toLowerCase() || 'username'}
            </p>

            {profile.bio && (
              <p
                className="text-white/80 text-base leading-relaxed max-w-sm mx-auto drop-shadow-sm"
                style={{ fontFamily: getFontFamily() }}
              >
                {profile.bio}
              </p>
            )}
          </div>

          {/* Links */}
          <div className="space-y-4 mb-8 relative z-10">
            {activeLinks.length === 0 ? (
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8 text-center">
                <LinkIcon className="w-12 h-12 text-white/60 mx-auto mb-3" />
                <p className="text-white/80 text-lg font-medium">No active links</p>
                <p className="text-white/60 text-sm mt-1">Add some links to get started</p>
              </div>
            ) : (
              activeLinks.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${getButtonStyle()}`}
                  style={{
                    backgroundColor: `${profile.buttonColor}e6`, 
                    color: profile.buttonColor === "#ffffff" ? "#000000" : "#ffffff",
                    fontFamily: getFontFamily(),
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${profile.buttonColor}33`
                  }}
                >
                  <div className="flex items-center">
                    <div className="mr-3 opacity-80">
                      {getLinkIcon(link.url)}
                    </div>
                    <span className="font-medium">{link.title}</span>
                  </div>
                  <ExternalLink className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity" />
                </a>
              ))
            )}
          </div>

          {/* Footer */}
          {!isEditing && (
            <div className="text-center relative z-10">
              <div className="flex items-center justify-center space-x-6 mb-6">
                <button
                  onClick={handleShare}
                  className="text-white/60 hover:text-white/80 transition-colors"
                >
                  <Share className="w-6 h-6" />
                </button>
              </div>

              <div className="flex items-center justify-center space-x-2 text-white/40 text-sm">
                <div className="flex items-center space-x-1">
                  <div className="w-4 h-4 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-sm flex items-center justify-center">
                    <LinkIcon className="w-2.5 h-2.5 text-white" />
                  </div>
                  <span>Linkable</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}