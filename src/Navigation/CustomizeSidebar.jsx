import { useNavigate } from "react-router-dom";
import { ArrowLeft, Palette, Type, User, Upload } from "lucide-react";
import { templates } from "../data/templates";

export default function CustomizeSidebar({ profile, setProfile }) {
    const navigate = useNavigate();

    const backgroundOptions = [
        { id: 'gradient', name: 'Gradient', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
        { id: 'gradient2', name: 'Ocean', value: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)' },
        { id: 'gradient3', name: 'Sunset', value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
        { id: 'gradient4', name: 'Forest', value: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
        { id: 'gradient5', name: 'Purple', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
        { id: 'gradient6', name: 'Pink', value: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)' },
        { id: 'solid1', name: 'Navy', value: '#1a365d' },
        { id: 'solid2', name: 'Purple', value: '#553c9a' },
        { id: 'solid3', name: 'Green', value: '#22543d' },
        { id: 'solid4', name: 'Pink', value: '#97266d' },
    ];

    const buttonColors = [
        '#000000', '#ffffff', '#ef4444', '#f97316', '#eab308', 
        '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'
    ];

    const handlePreviewNavigation = () => {
        navigate('/Preview', { state: { profile } });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setProfile({
                    ...profile,
                    profilePicture: event.target.result
                });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="w-96 bg-white shadow-lg border-r border-gray-200 overflow-y-auto">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
                <button 
                    className="text-sm gap-3 flex items-center cursor-pointer hover:text-indigo-600 transition-colors mb-4"
                    onClick={() => navigate('/Mylinks')}
                >
                    <ArrowLeft className="w-4 h-4"/> Back to Dashboard
                </button>
                
                <h1 className="font-bold text-2xl text-gray-900 mb-1">Customize Profile</h1>
                <p className="text-gray-600">Personalize your link hub</p>
            </div>

            <div className="p-6 space-y-6">
                {/* Profile Information Card */}
                <div className="border border-gray-200 rounded-lg shadow-sm">
                    <div className="p-4 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-900 flex items-center">
                            <User className="w-5 h-5 mr-2 text-gray-600" />
                            Profile Information
                        </h3>
                    </div>
                    <div className="p-4 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Display Name
                            </label>
                            <input
                                type="text"
                                value={profile.displayName || ''}
                                onChange={(e) =>
                                    setProfile({ ...profile, displayName: e.target.value })
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="Enter your display name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Bio
                            </label>
                            <textarea
                                value={profile.bio || ''}
                                onChange={(e) =>
                                    setProfile({ ...profile, bio: e.target.value })
                                }
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                                placeholder="Tell people about yourself..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Profile Picture
                            </label>
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold overflow-hidden">
                                    {profile.profilePicture ? (
                                        <img 
                                            src={profile.profilePicture} 
                                            alt="Profile" 
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        profile.displayName?.split(' ').map(n => n[0]).join('') || 'U'
                                    )}
                                </div>
                                <label className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                    <Upload className="w-4 h-4 mr-2" />
                                    Upload
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageUpload}
                                    />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Background Card */}
                <div className="border border-gray-200 rounded-lg shadow-sm">
                    <div className="p-4 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-900 flex items-center">
                            <Palette className="w-5 h-5 mr-2 text-gray-600" />
                            Background
                        </h3>
                    </div>
                    <div className="p-4">
                        <div className="grid grid-cols-4 gap-2">
                            {backgroundOptions.map((bg) => (
                                <button
                                    key={bg.id}
                                    onClick={() => setProfile({ ...profile, background: bg.value })}
                                    style={bg.value.startsWith('linear-gradient') 
                                        ? { background: bg.value }
                                        : { backgroundColor: bg.value }
                                    }
                                    className={`w-12 h-12 rounded-lg border-2 transition-all hover:scale-105 ${
                                        profile.background === bg.value 
                                            ? "border-indigo-600 ring-2 ring-indigo-200" 
                                            : "border-gray-200 hover:border-gray-300"
                                    }`}
                                    title={bg.name}
                                />
                            ))}
                            {/* Custom Color Picker */}
                            <label className="w-12 h-12 rounded-lg border-2 border-gray-200 cursor-pointer flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
                                <Palette className="w-5 h-5 text-gray-600" />
                                <input
                                    type="color"
                                    className="hidden"
                                    onChange={(e) =>
                                        setProfile({ ...profile, background: e.target.value })
                                    }
                                />
                            </label>
                        </div>
                    </div>
                </div>
                   
                   {/* Template Presets */}
<div className="border border-gray-200 rounded-lg shadow-sm">
  <div className="p-4 border-b border-gray-100">
    <h3 className="font-semibold text-gray-900">Templates</h3>
  </div>
  <div className="p-4 grid grid-cols-2 gap-3">
    {templates.map((t) => (
      <button
        key={t.id}
        onClick={() =>
          setProfile({
            ...profile,
            templateId: t.id,
            background: t.background,
            buttonStyle: t.buttonStyle,
            buttonColor: t.buttonColor,
          })
        }
        className={`p-3 rounded-lg border-2 transition-all ${
          profile.templateId === t.id
            ? "border-indigo-600 bg-indigo-50"
            : "border-gray-200 hover:border-gray-300"
        }`}
      >
        <div
          className="h-12 rounded-lg"
          style={{
            background: t.background,
          }}
        />
        <p className="mt-2 text-xs font-medium">{t.name}</p>
      </button>
    ))}
  </div>
</div>

                {/* Font Family Card */}
                <div className="border border-gray-200 rounded-lg shadow-sm">
                    <div className="p-4 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-900 flex items-center">
                            <Type className="w-5 h-5 mr-2 text-gray-600" />
                            Font Family
                        </h3>
                    </div>
                    <div className="p-4">
                        <div className="space-y-2">
                            <label className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                                <input
                                    type="radio"
                                    name="fontFamily"
                                    value="Inter"
                                    checked={profile.font === 'font-sans' || profile.font === 'Inter'}
                                    onChange={() => setProfile({ ...profile, font: 'Inter' })}
                                    className="text-indigo-600 focus:ring-indigo-500"
                                />
                                <span className="text-sm font-medium text-gray-700 font-sans">Inter</span>
                            </label>
                            <label className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                                <input
                                    type="radio"
                                    name="fontFamily"
                                    value="Poppins"
                                    checked={profile.font === 'font-poppins' || profile.font === 'Poppins'}
                                    onChange={() => setProfile({ ...profile, font: 'Poppins' })}
                                    className="text-indigo-600 focus:ring-indigo-500"
                                />
                                <span className="text-sm font-medium text-gray-700" style={{fontFamily: 'Poppins'}}>Poppins</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Button Style Card */}
                <div className="border border-gray-200 rounded-lg shadow-sm">
                    <div className="p-4 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-900">Button Style</h3>
                    </div>
                    <div className="p-4 space-y-4">
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                onClick={() => setProfile({ ...profile, buttonStyle: "rounded" })}
                                className={`p-3 border-2 rounded-lg flex flex-col items-center space-y-1 transition-all hover:bg-gray-50 ${
                                    profile.buttonStyle === "rounded" 
                                        ? "border-indigo-600 bg-indigo-50" 
                                        : "border-gray-200"
                                }`}
                            >
                                <div className="w-6 h-6 bg-gray-400 rounded-lg" />
                                <span className="text-xs font-medium">Rounded</span>
                            </button>

                            <button
                                onClick={() => setProfile({ ...profile, buttonStyle: "square" })}
                                className={`p-3 border-2 rounded-lg flex flex-col items-center space-y-1 transition-all hover:bg-gray-50 ${
                                    profile.buttonStyle === "square" 
                                        ? "border-indigo-600 bg-indigo-50" 
                                        : "border-gray-200"
                                }`}
                            >
                                <div className="w-6 h-6 bg-gray-400 rounded-none" />
                                <span className="text-xs font-medium">Square</span>
                            </button>

                            <button
                                onClick={() => setProfile({ ...profile, buttonStyle: "pill" })}
                                className={`p-3 border-2 rounded-lg flex flex-col items-center space-y-1 transition-all hover:bg-gray-50 ${
                                    profile.buttonStyle === "pill" 
                                        ? "border-indigo-600 bg-indigo-50" 
                                        : "border-gray-200"
                                }`}
                            >
                                <div className="w-6 h-6 bg-gray-400 rounded-full" />
                                <span className="text-xs font-medium">Pill</span>
                            </button>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Button Color
                            </label>
                            <div className="grid grid-cols-5 gap-2">
                                {buttonColors.map((color, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setProfile({ ...profile, buttonColor: color })}
                                        style={{ backgroundColor: color }}
                                        className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                                            profile.buttonColor === color 
                                                ? "border-indigo-600 ring-2 ring-indigo-200" 
                                                : "border-gray-200"
                                        }`}
                                    />
                                ))}
                                {/* Custom Color Picker */}
                                <label className="w-8 h-8 rounded-full border-2 border-gray-200 cursor-pointer flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
                                    <Palette className="w-3 h-3 text-gray-600" />
                                    <input
                                        type="color"
                                        className="hidden"
                                        onChange={(e) =>
                                            setProfile({ ...profile, buttonColor: e.target.value })
                                        }
                                    />
                                </label>
                            </div>
                        </div>

                        <button 
                            onClick={handlePreviewNavigation} 
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 hover:shadow-lg"
                        >
                            View Full Preview
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}