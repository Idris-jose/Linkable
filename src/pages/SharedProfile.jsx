import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { templates } from "../data/templates";
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
export default function SharedProfile() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileDoc = await getDoc(doc(db, "users", userId, "profile", "data"));
        if (profileDoc.exists()) {
          setProfile(profileDoc.data());
        }

        const linksSnapshot = await getDocs(collection(db, "users", userId, "links"));
        const linksData = linksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setLinks(linksData.filter(link => link.active));
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        <div className="text-center">
          <LinkIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        <div className="text-center">
          <LinkIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg">Profile not found</p>
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

  const handleShare = async () => {
    const profileUrl = `${window.location.origin}/profile/${userId}`;

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
        alert('Link copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  return (
    <div className="min-h-screen" style={getBackgroundStyle()}>
      {/* Profile Content */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto">
          {/* Profile Header */}
          <div className="text-center mb-8">
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
          <div className="space-y-4 mb-8">
            {links.length === 0 ? (
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8 text-center">
                <LinkIcon className="w-12 h-12 text-white/60 mx-auto mb-3" />
                <p className="text-white/80 text-lg font-medium">No active links</p>
                <p className="text-white/60 text-sm mt-1">Add some links to get started</p>
              </div>
            ) : (
              links.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={getButtonStyle()}
                  style={{
                    backgroundColor: `${profile.buttonColor}e6`, // Add transparency
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
          <div className="text-center">
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
        </div>
      </div>
    </div>
  );
}
