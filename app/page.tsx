import React, { useState, useEffect } from 'react';
import { 
  Camera, Instagram, Facebook, Youtube, 
  MessageSquare, X as CloseIcon, Image as ImageIcon, PlayCircle, 
  Trash2, Settings, UploadCloud, Link as LinkIcon, Plus
} from 'lucide-react';

// --- Firebase Integration ---
import { initializeApp } from "firebase/app";
import { 
  getFirestore, doc, setDoc, collection, addDoc, deleteDoc, onSnapshot 
} from "firebase/firestore";

// Your exact Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCMn1VnxDRkg6sAnUa3O5cVqy-tP7nb5g8",
  authDomain: "dimogo-e8f31.firebaseapp.com",
  projectId: "dimogo-e8f31",
  storageBucket: "dimogo-e8f31.firebasestorage.app",
  messagingSenderId: "626377862780",
  appId: "1:626377862780:web:2cdba3dfb2ada4e9d5a3f9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Helper to extract YouTube ID
const getYouTubeId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// Helper to get YouTube Thumbnail
const getYouTubeThumbnail = (url) => {
  const id = getYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : '';
};

// Custom X (Twitter) Logo SVG
const XLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);


// ==========================================
// MAIN APP COMPONENT
// ==========================================
export default function StudioAxisApp() {
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const [settings, setSettings] = useState({
    heroImageUrl: "https://images.unsplash.com/photo-1517825738774-7de9363ef735?q=80&w=2000&auto=format&fit=crop",
    latestText: "My latest Cinematic Shot, 'Urban Jungle...', shows a leopard in the wild.",
    whatsapp: "0786088109",
    x: "https://x.com/",
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/"
  });
  const [portfolio, setPortfolio] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Hidden trigger for Admin Panel (in case URL routing is tricky in preview)
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    // 1. URL Based Routing
    if (window.location.href.includes('site123')) {
      setIsAdminRoute(true);
    }

    // 2. Real-time Firebase Listeners
    const unsubSettings = onSnapshot(doc(db, "settings", "main"), (docSnap) => {
      if (docSnap.exists()) {
        setSettings(prev => ({ ...prev, ...docSnap.data() }));
      }
    });

    const unsubPortfolio = onSnapshot(collection(db, "portfolio"), (snapshot) => {
      const items = [];
      snapshot.forEach(doc => items.push({ id: doc.id, ...doc.data() }));
      // Sort by newest first
      setPortfolio(items.sort((a, b) => b.timestamp - a.timestamp));
      setIsLoading(false);
    });

    return () => {
      unsubSettings();
      unsubPortfolio();
    };
  }, []);

  const handleSecretAdminTrigger = () => {
    setClickCount(prev => prev + 1);
    if (clickCount >= 4) {
      setIsAdminRoute(true);
      setClickCount(0);
    }
  };

  if (isAdminRoute) {
    return <AdminPanel settings={settings} portfolio={portfolio} onExit={() => setIsAdminRoute(false)} />;
  }

  return <HomePage settings={settings} portfolio={portfolio} onSecretClick={handleSecretAdminTrigger} />;
}

// ==========================================
// HOME PAGE COMPONENT
// ==========================================
function HomePage({ settings, portfolio, onSecretClick }) {
  const [showTopBar, setShowTopBar] = useState(true);

  // Format WhatsApp Link
  const waNumber = settings.whatsapp ? settings.whatsapp.replace(/[^0-9]/g, '') : '';
  const waLink = `https://wa.me/${waNumber.startsWith('0') ? '94' + waNumber.slice(1) : waNumber}`;

  return (
    <div className="bg-black text-white font-sans selection:bg-gray-800 selection:text-white scroll-smooth w-full min-h-screen overflow-x-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full h-screen overflow-hidden flex flex-col justify-between">
        <img
          src={settings.heroImageUrl}
          alt="Studio Axis Hero"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/90 pointer-events-none"></div>

        {/* Top Alert Bar */}
        {showTopBar && settings.latestText && (
          <div className="relative w-full bg-black/60 backdrop-blur-md text-gray-200 text-xs sm:text-sm py-2.5 text-center flex justify-center items-center px-4 z-10 border-b border-white/10">
             <span className="font-light tracking-wide">{settings.latestText}</span>
             <button onClick={() => setShowTopBar(false)} className="absolute right-4 text-gray-400 hover:text-white transition-colors">
               <CloseIcon className="w-4 h-4" />
             </button>
          </div>
        )}

        {/* Center Title */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 mt-10">
          <Camera className="w-10 h-10 text-white mb-6 opacity-90" strokeWidth={1.2} />
          <p className="text-white text-xs sm:text-sm tracking-[0.4em] mb-4 font-light uppercase opacity-80">
            Studio Axis
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-[6rem] text-white font-serif tracking-wider drop-shadow-2xl text-center leading-none">
            Digital<br className="hidden md:block"/> Perfection
          </h1>
        </div>

        {/* Bottom Navigation */}
        <div className="relative z-10 w-full flex flex-col items-center gap-8 pb-12 px-4">
          <a href="#gallery" className="bg-white text-black px-10 py-3.5 rounded-full text-xs font-bold tracking-widest hover:bg-gray-200 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.15)]">
            EXPLORE
          </a>
        </div>
      </section>

      {/* 2. GALLERY SECTION */}
      <section id="gallery" className="py-24 px-4 sm:px-8 md:px-12 max-w-7xl mx-auto min-h-screen">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-serif mb-4 text-gray-100">Our Portfolio</h2>
          <p className="text-gray-400 font-light tracking-wide max-w-2xl mx-auto">
            A curated selection of our finest photography and cinematic productions.
          </p>
        </div>
        
        {portfolio.length === 0 ? (
          <div className="text-center text-gray-600 font-light py-20">
            No items in portfolio yet. Visit /site123 to add some.
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {portfolio.map((item) => (
              <div key={item.id} className="relative group overflow-hidden bg-gray-900 rounded-lg break-inside-avoid shadow-lg">
                {item.type === 'video' ? (
                  <>
                    <img 
                      src={getYouTubeThumbnail(item.mediaUrl)} 
                      alt="Video Thumbnail" 
                      className="w-full h-auto object-cover opacity-80 group-hover:opacity-50 group-hover:scale-105 transition-all duration-700"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <PlayCircle className="w-16 h-16 text-white opacity-90 group-hover:scale-110 transition-all duration-300 drop-shadow-2xl" strokeWidth={1} />
                    </div>
                  </>
                ) : (
                  <>
                    <img 
                      src={item.mediaUrl} 
                      alt="Portfolio" 
                      className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
                    />
                  </>
                )}
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-lg pointer-events-none"></div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 3. FOOTER */}
      <footer className="bg-zinc-950 py-20 px-4 sm:px-8 border-t border-white/5 text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          
          <div className="flex items-center gap-6 mb-12">
            {/* Social Links from Firebase */}
            {settings.instagram && (
              <a href={settings.instagram} target="_blank" rel="noreferrer" className="bg-zinc-900 p-3 rounded-full text-gray-400 hover:text-white hover:bg-zinc-800 transition-all duration-300">
                <Instagram className="w-5 h-5" />
              </a>
            )}
            {settings.facebook && (
              <a href={settings.facebook} target="_blank" rel="noreferrer" className="bg-zinc-900 p-3 rounded-full text-gray-400 hover:text-white hover:bg-zinc-800 transition-all duration-300">
                <Facebook className="w-5 h-5" />
              </a>
            )}
            {settings.x && (
              <a href={settings.x} target="_blank" rel="noreferrer" className="bg-zinc-900 p-3 rounded-full text-gray-400 hover:text-white hover:bg-zinc-800 transition-all duration-300">
                <XLogo />
              </a>
            )}
            {settings.whatsapp && (
              <a href={waLink} target="_blank" rel="noreferrer" className="bg-zinc-900 p-3 rounded-full text-gray-400 hover:text-white hover:bg-zinc-800 transition-all duration-300">
                <MessageSquare className="w-5 h-5" />
              </a>
            )}
          </div>

          <h2 
            onClick={onSecretClick} // Secret admin trigger
            className="text-2xl font-serif mb-2 text-white/80 cursor-default select-none"
          >
            Studio Axis.
          </h2>
          <p className="text-gray-600 text-xs tracking-widest uppercase font-light">
            © {new Date().getFullYear()} Studio Axis. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

// ==========================================
// ADMIN PANEL COMPONENT
// ==========================================
function AdminPanel({ settings, portfolio, onExit }) {
  // Settings Form State
  const [formSettings, setFormSettings] = useState(settings);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Portfolio Form State
  const [mediaType, setMediaType] = useState('image');
  const [mediaUrl, setMediaUrl] = useState('');
  const [isAddingMedia, setIsAddingMedia] = useState(false);

  // Keep local form settings in sync if remote changes
  useEffect(() => {
    setFormSettings(settings);
  }, [settings]);

  // Handle Settings Save
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      await setDoc(doc(db, "settings", "main"), formSettings);
      // Show success briefly (no alerts)
      setTimeout(() => setIsSavingSettings(false), 1000);
    } catch (error) {
      console.error("Error saving settings: ", error);
      setIsSavingSettings(false);
    }
  };

  // Handle Portfolio Add
  const handleAddPortfolio = async (e) => {
    e.preventDefault();
    if (!mediaUrl.trim()) return;
    setIsAddingMedia(true);
    try {
      await addDoc(collection(db, "portfolio"), {
        type: mediaType,
        mediaUrl: mediaUrl.trim(),
        timestamp: Date.now()
      });
      setMediaUrl('');
    } catch (error) {
      console.error("Error adding portfolio item: ", error);
    }
    setIsAddingMedia(false);
  };

  // Handle Portfolio Delete
  const handleDeletePortfolio = async (id) => {
    try {
      await deleteDoc(doc(db, "portfolio", id));
    } catch (error) {
      console.error("Error deleting portfolio item: ", error);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-gray-200 font-sans p-6 md:p-10">
      
      {/* Admin Header */}
      <div className="max-w-5xl mx-auto flex items-center justify-between border-b border-zinc-800 pb-6 mb-10">
        <div className="flex items-center gap-4">
          <div className="bg-cyan-500/20 p-3 rounded-lg">
            <Settings className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Studio Axis Admin</h1>
            <p className="text-sm text-zinc-400">Dashboard & Content Manager</p>
          </div>
        </div>
        <button 
          onClick={onExit}
          className="text-sm bg-zinc-800 hover:bg-zinc-700 text-white px-5 py-2.5 rounded-lg transition-colors flex items-center gap-2"
        >
          View Site
        </button>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* LEFT COLUMN: Site Settings */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-cyan-400" /> Site Settings
            </h2>
            <form onSubmit={handleSaveSettings} className="space-y-4">
              
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Hero Image URL</label>
                <input 
                  type="text" 
                  value={formSettings.heroImageUrl || ''} 
                  onChange={e => setFormSettings({...formSettings, heroImageUrl: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Latest Alert Text</label>
                <textarea 
                  value={formSettings.latestText || ''} 
                  onChange={e => setFormSettings({...formSettings, latestText: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors resize-none h-20"
                  placeholder="My latest Cinematic Shot..."
                />
              </div>

              <div className="pt-4 border-t border-zinc-800">
                <h3 className="text-sm font-semibold text-white mb-4">Social Links</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-5 h-5 text-green-500" />
                    <input 
                      type="text" 
                      value={formSettings.whatsapp || ''} 
                      onChange={e => setFormSettings({...formSettings, whatsapp: e.target.value})}
                      className="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:border-cyan-500"
                      placeholder="0786088109"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <XLogo />
                    <input 
                      type="text" 
                      value={formSettings.x || ''} 
                      onChange={e => setFormSettings({...formSettings, x: e.target.value})}
                      className="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:border-cyan-500"
                      placeholder="X (Twitter) URL"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <Instagram className="w-5 h-5 text-pink-500" />
                    <input 
                      type="text" 
                      value={formSettings.instagram || ''} 
                      onChange={e => setFormSettings({...formSettings, instagram: e.target.value})}
                      className="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:border-cyan-500"
                      placeholder="Instagram URL"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <Facebook className="w-5 h-5 text-blue-500" />
                    <input 
                      type="text" 
                      value={formSettings.facebook || ''} 
                      onChange={e => setFormSettings({...formSettings, facebook: e.target.value})}
                      className="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:border-cyan-500"
                      placeholder="Facebook URL"
                    />
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSavingSettings}
                className="w-full mt-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center"
              >
                {isSavingSettings ? 'Saving...' : 'Save Settings'}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: Portfolio Manager */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Add New Item */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-cyan-400" /> Add to Portfolio
            </h2>
            
            <form onSubmit={handleAddPortfolio} className="flex flex-col sm:flex-row gap-4">
              <select 
                value={mediaType}
                onChange={(e) => setMediaType(e.target.value)}
                className="bg-zinc-950 border border-zinc-700 text-white text-sm rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500 w-full sm:w-40"
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
              
              <div className="flex-1">
                <input 
                  type="text" 
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  placeholder={mediaType === 'video' ? "Paste YouTube URL here..." : "Paste Image URL here..."}
                  className="w-full bg-zinc-950 border border-zinc-700 text-white text-sm rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <button 
                type="submit"
                disabled={isAddingMedia}
                className="bg-white text-black hover:bg-gray-200 font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2 justify-center"
              >
                <Plus className="w-4 h-4" /> {isAddingMedia ? 'Adding...' : 'Add'}
              </button>
            </form>
            {mediaType === 'video' && (
              <p className="text-xs text-zinc-500 mt-3 font-light">
                * Just paste the YouTube link (e.g., https://youtube.com/watch?v=...). We will automatically generate the thumbnail.
              </p>
            )}
          </div>

          {/* Manage Existing Items */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-lg font-bold text-white mb-6">Manage Portfolio ({portfolio.length})</h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {portfolio.map(item => (
                <div key={item.id} className="group relative rounded-xl overflow-hidden bg-black aspect-square border border-zinc-800">
                  {item.type === 'video' ? (
                    <>
                      <img src={getYouTubeThumbnail(item.mediaUrl)} alt="Video Preview" className="w-full h-full object-cover opacity-60" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Youtube className="w-10 h-10 text-white opacity-80" />
                      </div>
                    </>
                  ) : (
                    <img src={item.mediaUrl} alt="Image Preview" className="w-full h-full object-cover" />
                  )}
                  
                  {/* Delete Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={() => handleDeletePortfolio(item.id)}
                      className="bg-red-600 hover:bg-red-500 text-white p-3 rounded-full transform scale-75 group-hover:scale-100 transition-all shadow-lg"
                      title="Delete Item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="absolute top-2 left-2 bg-black/80 px-2 py-1 rounded text-[10px] uppercase font-bold text-zinc-400">
                    {item.type}
                  </div>
                </div>
              ))}
            </div>
            
            {portfolio.length === 0 && (
              <div className="text-center py-10 text-zinc-500 text-sm">
                No items uploaded yet.
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
