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
    Linkedin
} from "lucide-react";
import { templates } from "../data/templates";

// Helper for icons (copied from SharedProfile)
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

export default function ProfileCard({ profile, links, handleShare, isPreview = false, showFooter = true }) {
    if (!profile) return null;

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

    const getFontFamily = () => {
        if (profile.font === "Poppins" || profile.font === "font-poppins")
            return "Poppins, sans-serif";
        if (profile.font === "Zalando Sans Expanded" || profile.font === "font-zalando")
            return "Zalando Sans Expanded, sans-serif";
        return "Inter, sans-serif";
    };

    // In preview mode, preventing actual navigation might be desired, but for now we keep <a> tags
    // For Preview, we might want to disable clicks or target="_self" if inside iframe? 
    // Usually Previews are just visual.

    return (
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
                    className="text-2xl sm:text-3xl text-white font-bold mb-3 drop-shadow-lg break-words px-2"
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
                                border: `1px solid ${profile.buttonColor}33`,
                                pointerEvents: isPreview ? 'none' : 'auto' // Optional: disable clicks in preview
                            }}
                        >
                            <div className="flex items-center">
                                <div className="mr-3 opacity-80">
                                    {getLinkIcon(link.url)}
                                </div>
                                <span className="font-medium truncate">{link.title}</span>
                            </div>
                            <ExternalLink className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity" />
                        </a>
                    ))
                )}
            </div>

            {/* Footer */}
            <div className="text-center">
                {!isPreview && (
                    <div className="flex items-center justify-center space-x-6 mb-6">
                        <button
                            onClick={handleShare}
                            className="text-white/60 hover:text-white/80 transition-colors"
                        >
                            <Share className="w-6 h-6" />
                        </button>
                    </div>
                )}


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
    )
}
