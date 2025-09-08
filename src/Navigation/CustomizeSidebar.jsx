import { useNavigate } from "react-router-dom";
import { ArrowLeft,Palette } from "lucide-react";

export default function CustomizeSidebar({ profile, setProfile }) {
    const navigate = useNavigate();


    const backgroundOptions = [
  { id: 'gradient', name: 'Gradient', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { id: 'gradient2', name: 'Ocean', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { id: 'gradient3', name: 'Sunset', value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { id: 'gradient4', name: 'Forest', value: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  { id: 'solid1', name: 'Navy', value: '#1a365d' },
  { id: 'solid2', name: 'Purple', value: '#553c9a' },
  { id: 'solid3', name: 'Green', value: '#22543d' },
  { id: 'solid4', name: 'Pink', value: '#97266d' },
];

const buttonColors = [
  '#000000', '#ffffff', '#ef4444', '#f97316', '#eab308', 
  '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'
];

  return (
    <div className="md:block w-70 h-full bg-white shadow-2xl shadow-black/30  p-3 transition-all duration-300 ">
     <h1 className="text-sm gap-3 flex items-center cursor-pointer hover:text-blue-700 transition-colors" onClick={ () => navigate('/Mylinks')}><ArrowLeft className="w-5"/> Back to dashboard</h1>
         
    <div className="mt-3">
      <h2 className="text-xl font-semibold">Customize Profile</h2>
      <p className="text-gray-700 text-sm">Personalize your link hub</p>
    </div>

     <div className="border-gray-300 border mt-5 mb-5 " />

     <div className="border border-gray-100 rounded p-3 shadow">
      {/* Profile Info */}
      <div>
        <label className="block text-sm font-medium">Display Name</label>
        <input
          value={profile.displayName}
          onChange={(e) =>
            setProfile({ ...profile, displayName: e.target.value })
          }
          className="w-full bg-gray-200 text-sm p-2 rounded mt-1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mt-4">Bio</label>
        <textarea
          value={profile.bio}
          onChange={(e) =>
            setProfile({ ...profile, bio: e.target.value })
          }
          className="w-full bg-gray-200 text-sm p-2 rounded mt-1"
        />
      </div>

      <div>
  <label className="block text-sm font-medium mb-1">Profile Picture</label>
  <label className="inline-flex items-center px-4 py-2  text-black border border-gray-500 rounded cursor-pointer  transition">
    Upload Picture
    <input
      type="file"
      accept="image/*"
      className="hidden"
      onChange={(e) =>
        setProfile({
          ...profile,
          profilePicture: URL.createObjectURL(e.target.files[0]),
        })
      }
    />
  </label>
</div>

      </div>
     
<div className="border border-gray-100 rounded mt-5 p-3 shadow">
  <label className="block text-sm font-medium">Background</label>
  <div className="grid grid-cols-4 gap-2 mt-4">
    {backgroundOptions.map((bg) => (
      <button
        key={bg.id}
        onClick={() => setProfile({ ...profile, background: bg.value })}
        style={{ background: bg.value }}
        className={`w-8 h-8 rounded ${
          profile.background === bg.value ? "ring-2 ring-black" : ""
        }`}
        title={bg.name}
      />
    ))}
    {/* Custom Color Picker */}
    <label className="w-8 h-8 rounded border cursor-pointer flex items-center justify-center bg-gray-100">
      <Palette className="w-4 h-4 text-gray-600" />
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


    <div className="border border-gray-100 rounded mt-5 p-3 shadow">
      {/* Font Family */}
      <div>
        <label className="block text-sm font-medium">Font Family</label>
        <select
  value={profile.font}
  onChange={(e) => setProfile({ ...profile, font: e.target.value })}
  className="w-full border p-2 rounded"
>
  <option value="font-sans">Inter</option>
  <option value="font-serif">Serif</option>
  <option value="font-mono">Monospace</option>
  <option value="font-poppins">Poppins</option> 
</select>

      </div>
      </div>

    <div className="border border-gray-100 rounded mt-5 p-3 shadow">
      <div>
  <label className="block text-sm font-medium">Button Style</label>
  <div className="flex gap-3 mt-2">
    {/* Rounded */}
    <button
      onClick={() => setProfile({ ...profile, buttonStyle: "rounded" })}
      className={`w-16 h-8 bg-gray-300 ${
        profile.buttonStyle === "rounded" ? "ring-1 ring-black" : ""
      } rounded-md`}
    ></button>

    {/* Square */}
    <button
      onClick={() => setProfile({ ...profile, buttonStyle: "square" })}
      className={`w-16 h-8 bg-gray-300 ${
        profile.buttonStyle === "square" ? "ring-2 ring-black" : ""
      } rounded-none`}
    ></button>

    {/* Pill */}
    <button
      onClick={() => setProfile({ ...profile, buttonStyle: "pill" })}
      className={`w-16 h-8 bg-gray-300 ${
        profile.buttonStyle === "pill" ? "ring-2 ring-black" : ""
      } rounded-full`}
    ></button>
  </div>
</div>

   
<div className="border border-gray-100 rounded mt-5 p-3 shadow">
  <label className="text-sm font-medium flex gap-1 items-center">
    Button Color
  </label>
  <div className="grid grid-cols-4 gap-2 mt-4">
    {buttonColors.map((color, idx) => (
      <button
        key={idx}
        onClick={() => setProfile({ ...profile, buttonColor: color })}
        style={{ background: color }}
        className={`w-8 h-8 rounded-full ${
          profile.buttonColor === color ? "ring-2 ring-black" : ""
        }`}
      />
    ))}
    {/* Custom Color Picker */}
    <label className="w-8 h-8 rounded-full border cursor-pointer flex items-center justify-center bg-gray-100">
      <Palette className="w-4 h-4 text-gray-600" />
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

       <button onClick={() => navigate('/Preview')} className="bg-gradient-to-r from-blue-700 to-purple-500 via-blue-700 hover:bg-purple-700 p-2 rounded mt-5 text-white">View Preview</button>
      </div>
    </div>
  );
}