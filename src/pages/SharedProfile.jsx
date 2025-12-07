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
import ProfileCard from "../components/ProfileCard";
export default function SharedProfile() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Look up the UID from username
        const usernameRef = doc(db, "usernames", username);
        const usernameSnap = await getDoc(usernameRef);

        if (!usernameSnap.exists()) {
          setProfile(null);
          setLoading(false);
          return;
        }

        const userId = usernameSnap.data().userId;

        // Fetch profile
        const profileDoc = await getDoc(doc(db, "users", userId, "profile", "data"));
        if (profileDoc.exists()) setProfile(profileDoc.data());

        // Fetch links
        const linksSnapshot = await getDocs(collection(db, "users", userId, "links"));
        const linksData = linksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setLinks(linksData.filter(link => link.active));
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

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
        <ProfileCard profile={profile} links={links} handleShare={handleShare} />
      </div>
    </div>
  );
}
