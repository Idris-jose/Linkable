import { useState } from "react";
import CustomizeSidebar from "../Navigation/CustomizeSidebar"
import  Preview from "./Preview"
import PhoneFrame from "./PhoneFrame"

export default function Customize() {
  const [profile, setProfile] = useState({
    displayName: "John Doe",
    bio: "Digital creator, coffee lover, and tech enthusiast. Sharing my journey through life and work.",
    profilePicture: "",
    background: "bg-green-900",
    font: "font-sans",
    buttonStyle: "rounded", // "rounded", "square", "pill"
    buttonColor: "bg-green-500",
    links: [
      { title: "Instagram", url: "#", active: true },
      { title: "Twitter", url: "#", active: true },
      { title: "YouTube", url: "#", active: true },
      { title: "LinkedIn", url: "#", active: false }
    ]
  });

  return (
    <div className="flex">
      {/* Sidebar */}
      <CustomizeSidebar profile={profile} setProfile={setProfile} />

      {/* Live Preview */}
      <PhoneFrame>
      <Preview profile={profile} />
      </PhoneFrame>
    </div>
  );
}
