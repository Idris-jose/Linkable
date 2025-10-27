import { templates} from '../data/templates';
import React, { useState, useEffect } from 'react';
import CustomizeSidebar from "../Navigation/CustomizeSidebar";
import Preview from "./Preview";
import { Link as LinkIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { doc, setDoc, getDoc, collection, getDocs } from "firebase/firestore";

function LivePreview({ profile }) {
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


  const getBackgroundStyle = () => {
    if (!profile.background) return { backgroundColor: '#000000' };
    
    return profile.background.startsWith("linear-gradient")
      ? { background: profile.background }
      : { backgroundColor: profile.background };
  };

  const getFontFamily = () => {
    return profile.font === "Poppins" || profile.font === "font-poppins" 
      ? "Poppins, sans-serif" 
      : "Inter, sans-serif";
  };

  const activeLinks = profile.links ? profile.links.filter(link => link.active) : [];

  return (
    <div 
      className="h-full rounded-2xl p-6 overflow-y-auto"
      style={getBackgroundStyle()}
    >
      <div className="text-center mb-8">
        {/* Profile Picture */}
        <div className="w-24 h-24 mx-auto mb-4 rounded-full border-4 border-white/20 overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
          {profile.profilePicture ? (
            <img 
              src={profile.profilePicture} 
              alt={profile.displayName || 'Profile'} 
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-white text-xl font-bold">
              {profile.displayName?.split(' ').map(n => n[0]).join('') || 'U'}
            </span>
          )}
        </div>
        
        <h1 
          className="text-white text-xl font-bold mb-2"
          style={{ fontFamily: getFontFamily() }}
        >
          {profile.displayName || 'Your Name'}
        </h1>
        
        {profile.bio && (
          <p 
            className="text-white/80 text-sm leading-relaxed"
            style={{ fontFamily: getFontFamily() }}
          >
            {profile.bio}
          </p>
        )}
      </div>

      <div className="space-y-3">
        {activeLinks.length === 0 ? (
          <div className="text-center py-8">
            <LinkIcon className="w-12 h-12 text-white/40 mx-auto mb-3" />
            <p className="text-white/60 text-sm">No active links</p>
          </div>
        ) : (
          activeLinks.map((link, i) => (
            <div
              key={i}
              className={getButtonStyle()}
              style={{ 
                backgroundColor: profile.buttonColor,
                color: profile.buttonColor === "#ffffff" ? "#000000" : "#ffffff",
                fontFamily: getFontFamily()
              }}
            >
              {link.title}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function Customize() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    displayName: "John Doe",
    bio: "Digital creator, coffee lover, and tech enthusiast. Sharing my journey through life and work.",
    profilePicture: "",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    font: "Inter",
    buttonStyle: "rounded",
    buttonColor: "#000000",
    templateId: null,
    links: []
  });

  // Load profile and links from Firestore on component mount
  useEffect(() => {
    if (user) {
      const loadProfile = async () => {
        try {
          const profileDoc = await getDoc(doc(db, "users", user.uid, "profile", "data"));
          if (profileDoc.exists()) {
            setProfile(prevProfile => ({ ...prevProfile, ...profileDoc.data() }));
          }
        } catch (error) {
          console.error('Error loading profile:', error);
        }
      };

      const loadLinks = async () => {
        try {
          const linksSnapshot = await getDocs(collection(db, "users", user.uid, "links"));
          const linksData = linksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setProfile(prevProfile => ({ ...prevProfile, links: linksData }));
        } catch (error) {
          console.error('Error loading links:', error);
        }
      };

      loadProfile();
      loadLinks();
    }
  }, [user]);

  // Save profile to Firestore whenever it changes
  useEffect(() => {
    if (user) {
      const saveProfile = async () => {
        try {
          await setDoc(doc(db, "users", user.uid, "profile", "data"), profile);
        } catch (error) {
          console.error('Error saving profile:', error);
        }
      };
      saveProfile();
    }
  }, [profile, user]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Panel - Controls */}
      <CustomizeSidebar profile={profile} setProfile={setProfile} />

      {/* Right Panel - Live Preview */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-md mx-auto">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Live Preview</h2>
            <p className="text-gray-600">See how your profile will look to visitors</p>
          </div>

          {/* Phone Mockup */}
          <div className="mx-auto" style={{ width: '320px' }}>
            <div className="bg-black rounded-3xl p-2 shadow-2xl">
              <div className="h-[640px] rounded-2xl overflow-hidden">
                <LivePreview profile={profile} />
              </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}
