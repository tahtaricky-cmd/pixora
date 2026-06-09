import React, { useState, useRef, useEffect } from 'react';
import { ImageIcon, Wand2, Download, Upload, X, Loader2, Eye, History, Sparkles, ImagePlus, RefreshCcw, Megaphone, Type, LogOut, Mail, Lock, Crown, CreditCard, ArrowLeft, AlertTriangle, CheckSquare, Square } from 'lucide-react';

const API_URL = "https://script.google.com/macros/s/AKfycbyo_fMVgWgKgKkclbISjTzVgvdYGKdLNadp66t7mIy3sz9G0Ym5Jx2z1RCSj5SaqB5NMA/exec";

export default function App() {
  // --- MEMBERSHIP STATES ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userPlan, setUserPlan] = useState('');
  const [userExpiry, setUserExpiry] = useState('');
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');
 
  const [loginEmail, setLoginEmail] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);

  // --- TERMS & CONDITIONS STATES ---
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const [checkedTerms, setTermsChecked] = useState(false);
  const termsScrollRef = useRef(null);

  // --- EXISTING STATES ---
  const [productDescription, setProductDescription] = useState('');
  const [properties, setProperties] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('random');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  const [referenceImages, setReferenceImages] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [showWarning, setShowWarning] = useState(false);

  // --- PROMO STUDIO STATES ---
  const [selectedPromoImage, setSelectedPromoImage] = useState(null);
  const [promoDetails, setPromoDetails] = useState('');
  const [promoStyle, setPromoStyle] = useState('Modern and clean minimalist aesthetic, bold typography');
  const [promoAspectRatio, setPromoAspectRatio] = useState('1:1');
  const [isGeneratingPromo, setIsGeneratingPromo] = useState(false);
  const [generatedPromoImages, setGeneratedPromoImages] = useState([]);
  const [promoError, setPromoError] = useState(null);

  const themes = [
    { id: 'random', name: 'Random', prompt: '' },
    { id: 'clean', name: 'Clean Studio', prompt: 'clean studio setting, high-key lighting, solid neutral background, professional product photography, 8k resolution' },
    { id: 'minimalist', name: 'Minimalist', prompt: 'minimalist aesthetic, soft shadows, clean composition, neutral color palette, hyper-realistic, 8k resolution' },
    { id: 'luxury', name: 'Premium Luxury', prompt: 'premium luxury studio lighting, dramatic shadows, deep elegant colors, gold accents, cinematic quality, 8k resolution' },
    { id: 'natural', name: 'Natural Organic', prompt: 'natural sunlight, soft dappled shadows, wooden textures, organic elements, warm atmosphere, photorealistic, 8k resolution' },
    { id: 'modern', name: 'Modern Lifestyle', prompt: 'modern lifestyle setting, bright apartment background, blurred soft bokeh, trendy home interior, high quality, 8k resolution' },
    { id: 'editorial', name: 'Editorial Magazine', prompt: 'editorial magazine style, sharp high-fashion lighting, bold typography spacing, clean composition, artistic, 8k resolution' },
    { id: 'moody', name: 'Moody Dark', prompt: 'moody dark studio lighting, dramatic low-key shadows, elegant noir atmosphere, premium, 8k resolution' },
    { id: 'botanical', name: 'Botanical Garden', prompt: 'botanical garden setting, lush green foliage, soft natural light, vibrant plants, organic, 8k resolution' },
    { id: 'spa', name: 'Spa & Wellness', prompt: 'spa and wellness center, serene atmosphere, soft warm towels, zen stones, natural bamboo wood, calm, 8k resolution' },
    { id: 'neo', name: 'Neo Deco', prompt: 'neo art deco, geometric patterns, gold metallic accents, lavish interior, sophisticated, 8k resolution' },
    { id: 'celestial', name: 'Celestial', prompt: 'celestial dreamy atmosphere, soft purple and blue nebulas, sparkling dust, mystical, 8k resolution' },
    { id: 'scandinavian', name: 'Scandinavian Home', prompt: 'bright scandinavian home interior, light wood tones, airy, minimalist furniture, soft natural light, 8k resolution' },
    { id: 'coffee', name: 'Coffee Table', prompt: 'aesthetic coffee table setting, lifestyle photography, blurred living room background, inviting atmosphere, 8k resolution' },
    { id: 'architecture', name: 'Modern Architecture', prompt: 'modern architectural background, sleek concrete and glass, geometric lines, dramatic angles, professional quality, 8k resolution' },
    { id: 'glass', name: 'Glass & Reflection', prompt: 'glass and reflection focused shot, sharp refraction, clean studio setup, luxury feel, 8k resolution' },
    { id: 'floating', name: 'Floating Product', prompt: 'floating product shot, anti-gravity effect, suspended in mid-air, studio lighting, clean background, 8k resolution' },
    { id: 'water', name: 'Water Splash', prompt: 'dynamic water splash, high-speed photography, refreshing, crystal clear water droplets, studio lighting, 8k resolution' },
    { id: 'smoke', name: 'Smoke & Mist', prompt: 'mysterious smoke and mist, soft hazy atmosphere, dramatic backlighting, cinematic, 8k resolution' },
    { id: 'golden', name: 'Golden Hour', prompt: 'warm golden hour sunlight, soft glows, long shadows, summer vibe, photorealistic, 8k resolution' },
    { id: 'moonlight', name: 'Moonlight', prompt: 'cool moonlight ambience, soft blue and silver tones, dreamy night atmosphere, cinematic, 8k resolution' },
    { id: 'vintage', name: 'Vintage Film', prompt: 'vintage film aesthetic, retro grain, muted colors, nostalgic, 35mm photography style, 8k resolution' },
    { id: 'futuristic', name: 'Futuristic Neon', prompt: 'futuristic neon lighting, glowing cybernetic lines, dark environment, high contrast, 8k resolution' },
    { id: 'retro', name: 'Retro 90s', prompt: 'retro 90s style, vibrant colors, vintage tech aesthetic, nostalgic, 8k resolution' },
    { id: 'chrome', name: 'Chrome & Metal', prompt: 'chrome and metal surfaces, industrial chic, sharp reflections, high-end studio, 8k resolution' },
    { id: 'desk', name: 'Work Desk Setup', prompt: 'productive work desk setup, organized gadgets, aesthetic stationery, cozy home office, 8k resolution' },
    { id: 'cafe', name: 'Cafe Lifestyle', prompt: 'aesthetic cafe lifestyle, warm wood tones, coffee steam, blurred cafe background, inviting, 8k resolution' }
  ];

  // --- MEMBERSHIP & SESSION LOGIC ---
  useEffect(() => {
    const initAuth = async () => {
      const savedEmail = localStorage.getItem('pixora_email');
      const savedStatus = localStorage.getItem('pixora_logged_in');
      const savedTerms = localStorage.getItem('pixora_terms_accepted') === 'true';
     
      if (savedEmail && savedStatus === 'true') {
        setIsLoggedIn(true);
        setUserEmail(savedEmail);
        setUserPlan(localStorage.getItem('pixora_plan') || '');
        setUserExpiry(localStorage.getItem('pixora_expiry') || '');
        setTermsAccepted(savedTerms);

        try {
          const response = await fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify({ email: savedEmail })
          });
          const data = await response.json();
         
          if (data.success) {
            localStorage.setItem('pixora_plan', data.plan);
            localStorage.setItem('pixora_expiry', data.expiry_date);
            setUserPlan(data.plan);
            setUserExpiry(data.expiry_date);
          } else {
            handleLogout();
          }
        } catch (err) {
          console.error("Gagal memvalidasi ulang sesi:", err);
        }
      }
      setIsCheckingAuth(false);
    };

    initAuth();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginEmail) return;
   
    setLoginLoading(true);
    setLoginError(null);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify({ email: loginEmail })
      });
      const data = await response.json();

      if (data.success) {
        localStorage.setItem('pixora_email', data.email);
        localStorage.setItem('pixora_logged_in', 'true');
        localStorage.setItem('pixora_plan', data.plan);
        localStorage.setItem('pixora_expiry', data.expiry_date);
       
        setUserEmail(data.email);
        setUserPlan(data.plan);
        setUserExpiry(data.expiry_date);
        setIsLoggedIn(true);
        
        // Periksa apakah user sebelumnya pernah menyetujui syarat & ketentuan
        const previouslyAccepted = localStorage.getItem('pixora_terms_accepted') === 'true';
        setTermsAccepted(previouslyAccepted);
      } else {
        setLoginError(data.message || "Email belum terdaftar");
      }
    } catch (err) {
      setLoginError("Terjadi kesalahan jaringan, tidak dapat menghubungi server.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleAcceptTerms = () => {
    if (checkedTerms) {
      localStorage.setItem('pixora_terms_accepted', 'true');
      setTermsAccepted(true);
    }
  };

  const handleTermsScroll = () => {
    const container = termsScrollRef.current;
    if (container) {
      const { scrollTop, scrollHeight, clientHeight } = container;
      // Gunakan toleransi buffer 5px untuk presisi scroll di perangkat seluler
      if (scrollHeight - scrollTop <= clientHeight + 5) {
        setScrolledToBottom(true);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('pixora_email');
    localStorage.removeItem('pixora_logged_in');
    localStorage.removeItem('pixora_plan');
    localStorage.removeItem('pixora_expiry');
    localStorage.removeItem('pixora_terms_accepted');
   
    setIsLoggedIn(false);
    setTermsAccepted(false);
    setTermsChecked(false);
    setScrolledToBottom(false);
    setUserEmail('');
    setUserPlan('');
    setUserExpiry('');
    setLoginEmail('');
    setCurrentView('dashboard');
  };

  const calculateRemainingDays = (expiryString) => {
    if (!expiryString) return 0;
    const expiryDate = new Date(expiryString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    expiryDate.setHours(0, 0, 0, 0);
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // --- APP GENERATION LOGIC ---
  const handleReferenceUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
   
    const newImages = [];
    for (const file of files) {
      if (referenceImages.length + newImages.length < 4) {
        const reader = await new Promise((resolve) => {
          const r = new FileReader();
          r.onloadend = () => resolve(r.result);
          r.readAsDataURL(file);
        });
        newImages.push({
          preview: reader,
          base64: reader.split(',')[1],
          mimeType: file.type
        });
      }
    }
   
    setReferenceImages(prev => [...prev, ...newImages].slice(0, 4));
    setShowWarning(false);
  };

  const removeReferenceImage = (index) => {
    setReferenceImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleDownload = (dataUrl, filename = `pixora-creative-${Date.now()}.png`) => {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const extractBase64Data = (dataUrl) => {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const b64 = arr[1];
    return { mimeType: mime, data: b64 };
  };

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
   
    if (referenceImages.length === 0) {
      setShowWarning(true);
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedImages([]);
    setSelectedPromoImage(null);

    try {
      let themeToUse = themes.find(t => t.id === selectedTheme);
      if (selectedTheme === 'random') {
        themeToUse = { prompt: "Apply a professional, high-quality real-world product photography theme. Choose a realistic setting such as a modern home, a professional studio, a bright kitchen, a retail display, or an elegant lifestyle environment. The setting must be photorealistic, high-end, and suitable for commercial product presentation. 8k resolution." };
      }
     
      const themePrompt = themeToUse?.prompt || '';
      const customPropsPrompt = properties ? ` Additionally, strictly include these specific items in the scene: ${properties}.` : '';
      const userDescPrompt = productDescription ? ` Product context/concept: ${productDescription}.` : '';
     
      const autoPropsInstruction = "Critically analyze the reference product. Automatically add highly relevant, natural-looking contextual props that perfectly match the product's category. Ensure these automatic props enhance the scene organically without overpowering the main product.";

      const scenarios = [
        "Maintain the exact same angle and perspective as the provided reference image",
        "Strict top-down flat lay perspective, captured directly from above at a 90-degree angle, clean background, no overlaps or tilted elements",
        "Lifestyle usage demo: Show a person interacting with or wearing the product from the reference image in a natural, real-life scenario. The product must be clearly visible and the focus of the demo.",
        "Macro close-up shot focusing on material, texture, and intricate details"
      ];

      const generationPromises = scenarios.map(async (scenario) => {
        const payload = {
          contents: [{
            role: 'user',
            parts: [
              { text: `Create a professional high-quality product photo. Theme: ${themePrompt}. ${userDescPrompt} ${autoPropsInstruction} ${customPropsPrompt} Composition/Scenario: ${scenario}. Ensure the main product is perfectly lit, clearly visible, and remains the absolute focus of the image. Generate in high resolution (1080px).` },
              ...referenceImages.map(img => ({ inlineData: { mimeType: img.mimeType, data: img.base64 } }))
            ]
          }],
          generationConfig: {
            responseModalities: ['IMAGE'],
            imageConfig: { aspectRatio: aspectRatio }
          }
        };

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error("Gagal memproses salah satu sudut pandang.");
        const result = await response.json();
        const part = result?.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
        if (!part?.inlineData?.data) throw new Error("Gagal menghasilkan gambar.");
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      });

      const results = await Promise.all(generationPromises);
      setGeneratedImages(results);
      if (results.length > 0) setSelectedPromoImage(results[0]);
      setHistory(prev => [{ id: Date.now(), images: results, prompt: productDescription || "Custom Product" }, ...prev].slice(0, 10));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGeneratePromo = async () => {
    if (!selectedPromoImage) return;
   
    setIsGeneratingPromo(true);
    setPromoError(null);
    setGeneratedPromoImages([]);

    try {
      const { mimeType, data } = extractBase64Data(selectedPromoImage);
      const detailsText = promoDetails ? `Product Details to intelligently incorporate: "${promoDetails}".` : '';
     
      const promoScenarios = [
        "Focus: Main thumbnail image optimized for a marketplace listing in Indonesian language. Eye-catching, highly visible product, with a clear and bold main title.",
        "Focus: Explain the product usage scenario or lifestyle context in Indonesian language. Show or describe how it's used and its benefits.",
        "Focus: Highlight specific details, ingredients, or key features of the product using elegant text callouts or descriptions in Indonesian language.",
        "Focus: DETAIL PRODUK (Rincian teknis). Gunakan tata letak kotak-kotak bersih (clean grid layout) seperti panel infografis untuk menyajikan informasi spesifikasi, ukuran dimensi, material/bahan baku, berat, dan keunggulan fitur secara terstruktur dengan ikon-ikon yang minimalis dan premium dalam bahasa Indonesia yang profesional."
      ];

      const promoPromises = promoScenarios.map(async (scenario, index) => {
        const promptText = `Transform this product photo into a high-quality professional promotional poster or social media ad.
        ${scenario}
        You MUST intelligently incorporate the following product information/details into the design beautifully, logically, and legibly as promotional text (Strictly in Indonesian language): 
        ${detailsText} 
        Overall design style: ${promoStyle}.
        STRICT NEGATIVE CONSTRAINT: Do NOT include any 'buy now', 'shop now', 'checkout', 'add to cart', 'beli sekarang', 'tambah ke keranjang', or any direct transactional sales call-to-action buttons or text.
        Make sure the typography is stunning, fits the product perfectly, creates a compelling advertisement, and highlights the product features provided. Generate in high-resolution.`;

        const payload = {
          contents: [{
            role: 'user',
            parts: [
              { text: promptText },
              { inlineData: { mimeType, data } }
            ]
          }],
          generationConfig: {
            responseModalities: ['IMAGE'],
            imageConfig: { aspectRatio: promoAspectRatio }
          }
        };

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error("Gagal menghasilkan media promosi.");
        const result = await response.json();
        const part = result?.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
        if (!part?.inlineData?.data) throw new Error("Gagal merender teks pada gambar.");
       
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      });

      const results = await Promise.all(promoPromises);
      setGeneratedPromoImages(results);
    } catch (err) {
      setPromoError(err.message);
    } finally {
      setIsGeneratingPromo(false);
    }
  };

  // --- RENDERS ---
 
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-100 via-fuchsia-50 to-cyan-100 flex flex-col items-center justify-center font-sans">
        <Loader2 className="w-16 h-16 animate-spin text-fuchsia-500 mb-6" />
        <h2 className="text-2xl font-bold text-slate-800 animate-pulse">Memvalidasi Sesi...</h2>
      </div>
    );
  }

  // LOGIN SCREEN
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-100 via-fuchsia-50 to-cyan-100 flex items-center justify-center p-4 font-sans selection:bg-fuchsia-200">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl shadow-violet-200/50 border border-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-300 rounded-full mix-blend-multiply filter blur-2xl opacity-50 translate-x-10 -translate-y-10"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-300 rounded-full mix-blend-multiply filter blur-2xl opacity-50 -translate-x-10 translate-y-10"></div>
         
          <div className="relative z-10 text-center mb-8">
            <div className="inline-flex items-center justify-center p-4 bg-white/90 rounded-3xl shadow-xl shadow-fuchsia-100 mb-6 border border-fuchsia-50">
              <Sparkles className="w-8 h-8 text-fuchsia-500 mr-2" />
              <h1 className="text-3xl font-extrabold bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">Pixora</h1>
            </div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center justify-center gap-2">
              <Lock size={18} className="text-slate-500" /> Member Login
            </h2>
            <p className="text-sm text-slate-500 mt-2">Akses studio kreatif khusus pengguna berbayar.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6 relative z-10">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 pl-1">Email Langganan</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-fuchsia-300 focus:bg-white focus:ring-4 focus:ring-fuchsia-100 outline-none transition-all font-medium text-slate-800"
                  placeholder="anda@email.com"
                  required
                />
              </div>
            </div>

            {loginError && (
              <div className="w-full text-center">
                 <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-sm font-bold text-red-500 flex items-center justify-center gap-2 mb-3">
                   <X size={16}/> {loginError}
                 </div>
                 <button type="button" onClick={() => window.open('http://lynk.id/pixora.ai/r287pq2kywql/checkout', '_blank')} className="text-sm font-bold text-indigo-600 hover:text-indigo-800 underline underline-offset-4 decoration-indigo-300">
                   Email belum terdaftar? Beli Paket.
                 </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-500 text-white font-bold py-4 rounded-2xl hover:scale-[1.02] hover:shadow-xl hover:shadow-fuchsia-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:scale-100"
            >
              {loginLoading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Masuk Dashboard'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // TERMS & CONDITIONS VIEW (Presented directly after login if not already accepted)
  if (!termsAccepted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-100 via-fuchsia-50 to-cyan-100 flex items-center justify-center p-4 font-sans selection:bg-fuchsia-200">
        <div className="w-full max-w-2xl bg-white/90 backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl shadow-violet-200/50 border border-white relative overflow-hidden flex flex-col max-h-[90vh]">
          
          <div className="relative z-10 text-center mb-6 shrink-0">
            <div className="inline-flex items-center justify-center p-3 bg-indigo-50 rounded-2xl border border-indigo-100 mb-4">
              <AlertTriangle className="w-6 h-6 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-black text-slate-800">Syarat & Ketentuan Penggunaan</h2>
            <p className="text-sm text-slate-500 mt-1">Harap baca dokumen di bawah ini sampai selesai untuk mengaktifkan akses.</p>
          </div>

          {/* Terms Container with Scroll Event */}
          <div 
            ref={termsScrollRef}
            onScroll={handleTermsScroll}
            className="relative z-10 overflow-y-auto flex-1 p-5 bg-slate-50 rounded-2xl border border-slate-200 text-sm text-slate-700 leading-relaxed custom-scrollbar mb-6"
          >
            <h3 className="font-extrabold text-slate-800 mb-4 text-base border-b pb-2">Syarat & Ketentuan Penggunaan Pixora</h3>
            <p className="mb-4 font-medium text-slate-600">Dengan menggunakan layanan Pixora, Anda dianggap telah membaca, memahami, dan menyetujui seluruh syarat dan ketentuan berikut.</p>
            
            <ol className="space-y-4 list-decimal list-inside">
              <li>
                <strong className="text-slate-800">Penggunaan Layanan</strong>
                <p className="pl-5 mt-1 text-slate-600">Pixora adalah layanan berbasis AI yang membantu pengguna menghasilkan foto produk dan konten visual untuk kebutuhan bisnis, pemasaran, dan marketplace.</p>
                <p className="pl-5 mt-1 text-slate-600">Pengguna bertanggung jawab penuh atas seluruh gambar, produk, dan materi yang diunggah ke dalam sistem.</p>
              </li>
              
              <li>
                <strong className="text-slate-800">Kepemilikan Konten</strong>
                <p className="pl-5 mt-1 text-slate-600">Pengguna tetap memiliki hak atas foto atau materi yang diunggah ke Pixora.</p>
                <p className="pl-5 mt-1 text-slate-600">Hasil gambar yang dihasilkan melalui Pixora dapat digunakan untuk keperluan pribadi maupun komersial oleh pengguna.</p>
              </li>

              <li>
                <strong className="text-slate-800">Larangan Penggunaan</strong>
                <p className="pl-5 mt-1 text-slate-600">Pengguna dilarang menggunakan Pixora untuk:</p>
                <ul className="pl-10 mt-1 list-disc list-inside space-y-1 text-slate-600">
                  <li>Konten yang melanggar hukum.</li>
                  <li>Produk ilegal atau terlarang.</li>
                  <li>Konten pornografi atau eksplisit.</li>
                  <li>Penipuan, pemalsuan, atau penyalahgunaan identitas.</li>
                  <li>Pelanggaran hak cipta pihak lain.</li>
                </ul>
                <p className="pl-5 mt-1 text-slate-600">Pixora berhak menolak atau menghentikan akses pengguna yang melanggar ketentuan ini.</p>
              </li>

              <li>
                <strong className="text-slate-800">Kualitas Hasil AI</strong>
                <p className="pl-5 mt-1 text-slate-600">Pixora menggunakan teknologi kecerdasan buatan untuk menghasilkan gambar.</p>
                <p className="pl-5 mt-1 text-slate-600">Karena sifat AI yang generatif, hasil dapat bervariasi dan tidak selalu identik dengan ekspektasi pengguna. Pixora tidak menjamin hasil yang sempurna pada setiap proses generasi.</p>
              </li>

              <li>
                <strong className="text-slate-800">Ketersediaan Layanan</strong>
                <p className="pl-5 mt-1 text-slate-600">Kami berupaya menjaga layanan tetap tersedia dan berjalan dengan baik. Namun, Pixora tidak bertanggung jawab atas gangguan layanan, pemeliharaan sistem, atau kendala teknis di luar kendali kami.</p>
              </li>

              <li>
                <strong className="text-slate-800">Kebijakan Refund</strong>
                <p className="pl-5 mt-1 text-slate-600">Karena produk yang diberikan berupa layanan digital, seluruh pembelian yang telah berhasil diproses pada umumnya tidak dapat dikembalikan atau direfund.</p>
                <p className="pl-5 mt-1 text-slate-600">Apabila terjadi kendala teknis yang menyebabkan layanan tidak dapat digunakan, pengguna dapat menghubungi tim dukungan untuk peninjauan lebih lanjut.</p>
              </li>

              <li>
                <strong className="text-slate-800">Perubahan Ketentuan</strong>
                <p className="pl-5 mt-1 text-slate-600">Pixora berhak mengubah atau memperbarui syarat dan ketentuan ini sewaktu-waktu. Perubahan akan berlaku sejak dipublikasikan pada platform.</p>
              </li>

              <li>
                <strong className="text-slate-800">Persetujuan</strong>
                <p className="pl-5 mt-1 text-slate-600">Dengan menggunakan Pixora, pengguna menyatakan telah membaca dan menyetujui seluruh syarat dan ketentuan yang berlaku.</p>
              </li>
            </ol>
          </div>

          {/* Accept Area */}
          <div className="relative z-10 shrink-0 border-t pt-4 space-y-4">
            {/* Scroll Assist Helper */}
            {!scrolledToBottom && (
              <div className="text-xs font-bold text-indigo-600 text-center animate-bounce">
                ⬇ Silakan gulir (scroll) ke bawah dokumen untuk menyetujui.
              </div>
            )}

            <div className="flex items-center gap-3">
              <button 
                type="button"
                disabled={!scrolledToBottom}
                onClick={() => setTermsChecked(!checkedTerms)}
                className={`p-1 rounded-lg border transition-all ${!scrolledToBottom ? 'opacity-40 cursor-not-allowed bg-slate-100 border-slate-300' : 'cursor-pointer hover:bg-slate-100'} ${checkedTerms ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-300 text-slate-400'}`}
              >
                {checkedTerms ? <CheckSquare size={20} /> : <Square size={20} />}
              </button>
              <span className={`text-xs sm:text-sm font-medium ${scrolledToBottom ? 'text-slate-700' : 'text-slate-400'}`}>
                Saya telah membaca dan menyetujui seluruh syarat dan ketentuan yang berlaku.
              </span>
            </div>

            <button
              onClick={handleAcceptTerms}
              disabled={!checkedTerms || !scrolledToBottom}
              className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold py-4 rounded-2xl hover:scale-[1.01] hover:shadow-xl hover:shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
              Setujui & Lanjutkan ke Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // MAIN DASHBOARD (Only rendered once logged in AND Terms accepted)
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 via-fuchsia-50 to-cyan-100 p-4 md:p-8 font-sans text-slate-800 selection:bg-fuchsia-200">
      <header className="max-w-6xl mx-auto mb-10 text-center relative z-10">
        <div className="absolute top-0 right-0 flex items-center gap-2 sm:gap-4 bg-white/70 backdrop-blur-xl px-5 py-3 rounded-2xl shadow-sm border border-white/80">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-800 flex items-center justify-end gap-1"><Crown size={14} className="text-amber-500"/> {userEmail}</p>
            <p className="text-xs font-medium text-slate-500">Paket {userPlan} • Exp: {userExpiry}</p>
          </div>
          <button onClick={() => setCurrentView('membership')} className="p-2.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-500 hover:text-white rounded-xl transition-all shadow-sm group relative" title="Status Membership">
             <CreditCard size={18} className="group-hover:scale-110 transition-transform"/>
          </button>
          <button onClick={handleLogout} className="p-2.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-sm group relative" title="Keluar">
             <LogOut size={18} className="group-hover:-translate-x-0.5 transition-transform"/>
          </button>
        </div>

        <div className="inline-flex items-center justify-center p-4 bg-white/60 backdrop-blur-md rounded-3xl shadow-xl shadow-fuchsia-200/50 mb-6 border border-white/80 mt-12 sm:mt-0">
          <Sparkles className="w-8 h-8 text-fuchsia-500 mr-3" />
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
            Pixora Creative
          </h1>
        </div>
        <p className="text-slate-600 font-medium text-lg">Ubah produk menjadi aset visual studio kelas atas dengan keajaiban AI.</p>
      </header>

      {currentView === 'membership' ? (
        <main className="max-w-3xl mx-auto relative z-10">
          <button onClick={() => setCurrentView('dashboard')} className="mb-6 flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-bold transition-colors">
            <ArrowLeft size={20} /> Kembali ke Dashboard
          </button>
         
          <div className="bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-[2rem] shadow-2xl shadow-violet-200/40 border border-white">
            <h2 className="text-3xl font-extrabold mb-8 flex items-center gap-3 text-slate-800">
              <span className="p-3 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl text-white shadow-lg"><CreditCard size={28} /></span>
              Status Membership
            </h2>
           
            {calculateRemainingDays(userExpiry) < 7 && (
              <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
                <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-amber-800">Perhatian</h4>
                  <p className="text-sm text-amber-700">Langganan Anda akan berakhir dalam {calculateRemainingDays(userExpiry)} hari. Silakan lakukan perpanjangan.</p>
                </div>
              </div>
            )}
           
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-slate-500 font-medium mb-1 sm:mb-0">Email Pengguna</span>
                <span className="font-bold text-slate-800 flex items-center gap-2"><Mail size={16} className="text-indigo-500"/> {userEmail}</span>
              </div>
             
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-slate-500 font-medium mb-1 sm:mb-0">Nama Paket</span>
                <span className="font-bold text-slate-800 flex items-center gap-2"><Crown size={16} className="text-amber-500"/> Paket {userPlan}</span>
              </div>
             
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-slate-500 font-medium mb-1 sm:mb-0">Status Membership</span>
                <span className="font-bold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full text-sm">Aktif</span>
              </div>
             
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-slate-500 font-medium mb-1 sm:mb-0">Berakhir Pada</span>
                <span className="font-bold text-slate-800">{userExpiry ? new Date(userExpiry).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}</span>
              </div>
             
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-indigo-50 rounded-2xl border border-indigo-100">
                <span className="text-indigo-800 font-medium mb-1 sm:mb-0">Sisa Hari Langganan</span>
                <span className="font-black text-2xl text-indigo-600">{calculateRemainingDays(userExpiry)} Hari</span>
              </div>
            </div>

            <div className="mt-10">
              <a href="http://lynk.id/pixora.ai/r287pq2kywql/checkout" target="_blank" rel="noopener noreferrer" className="block w-full text-center bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold py-4 rounded-2xl hover:scale-[1.02] hover:shadow-xl hover:shadow-fuchsia-500/30 transition-all">
                Perpanjang Langganan
              </a>
            </div>
          </div>
        </main>
      ) : (
        <>
          <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
            <section className="lg:col-span-5 bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl shadow-violet-200/40 border border-white">
              <form onSubmit={handleGenerate} className="space-y-6">
                <div className="bg-gradient-to-br from-violet-50 to-fuchsia-50 p-5 rounded-3xl border border-violet-100">
                  <div className="flex items-center justify-between mb-3">
                    <label className="flex items-center gap-2 text-sm font-bold text-violet-800 uppercase tracking-wider">
                      <ImagePlus size={18} /> Referensi (Maks 4)
                    </label>
                    {showWarning && <span className="text-xs text-red-500 font-bold bg-red-100 px-2 py-1 rounded-full animate-pulse">Wajib Diisi</span>}
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    {referenceImages.map((img, idx) => (
                      <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden shadow-md group">
                        <img src={img.preview} alt="Ref" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <button type="button" onClick={() => removeReferenceImage(idx)} className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-lg scale-90 group-hover:scale-100"><X size={14} strokeWidth={3} /></button>
                      </div>
                    ))}
                  </div>
                  {referenceImages.length < 4 && (
                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-violet-300 border-dashed rounded-2xl cursor-pointer hover:bg-violet-100/50 hover:border-violet-500 transition-all group">
                      <Upload className="text-violet-400 group-hover:text-violet-600 group-hover:-translate-y-1 transition-all mb-1" size={24} />
                      <span className="text-xs font-semibold text-violet-600">Upload Produk ({referenceImages.length}/4)</span>
                      <input type="file" className="hidden" accept="image/*" multiple onChange={handleReferenceUpload} />
                    </label>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 pl-1">Tuliskan Prompt</label>
                  <textarea
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-fuchsia-300 focus:bg-white focus:ring-4 focus:ring-fuchsia-100 outline-none h-24 transition-all resize-none"
                    placeholder="Contoh: Buat hasil foto bertemakan hotel dengan hiasan bunga..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 pl-1">Tambahkan Properti Foto</label>
                  <input
                    type="text"
                    value={properties}
                    onChange={(e) => setProperties(e.target.value)}
                    className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-cyan-300 focus:bg-white focus:ring-4 focus:ring-cyan-100 outline-none transition-all"
                    placeholder="Contoh: kayu, marmer, secangkir kopi, dll"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 pl-1">Tema</label>
                    <select
                      value={selectedTheme}
                      onChange={(e) => setSelectedTheme(e.target.value)}
                      className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100 outline-none transition-all appearance-none cursor-pointer font-medium text-slate-700"
                    >
                      {themes.map(theme => <option key={theme.id} value={theme.id}>{theme.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 pl-1">Rasio</label>
                    <select
                      value={aspectRatio}
                      onChange={(e) => setAspectRatio(e.target.value)}
                      className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-pink-300 focus:bg-white focus:ring-4 focus:ring-pink-100 outline-none transition-all appearance-none cursor-pointer font-medium text-slate-700"
                    >
                      <option value="1:1">1:1 (Square)</option>
                      <option value="9:16">9:16 (Portrait)</option>
                      <option value="16:9">16:9 (Landscape)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3 pt-4">
                  <button
                    type="submit"
                    disabled={isGenerating}
                    className="w-full bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-500 text-white font-bold py-4 rounded-2xl hover:scale-[1.02] hover:shadow-xl hover:shadow-fuchsia-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:scale-100"
                  >
                    {isGenerating ? <Loader2 className="animate-spin w-6 h-6" /> : <Wand2 className="w-6 h-6" />}
                    {isGenerating ? "Menciptakan Keajaiban..." : "Generate Foto"}
                  </button>

                  <button
                    type="button"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-4 rounded-2xl hover:scale-[1.02] hover:shadow-xl hover:shadow-cyan-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:scale-100"
                  >
                    <RefreshCcw className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
                    Generate Ulang
                  </button>
                </div>
              </form>
            </section>

            <section className="lg:col-span-7 space-y-8">
              <div className="bg-white/80 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] shadow-2xl shadow-cyan-200/40 border border-white flex flex-col min-h-[450px]">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-slate-800">
                  <span className="p-2 bg-gradient-to-tr from-cyan-400 to-blue-500 rounded-xl text-white shadow-lg"><ImageIcon size={20} /></span>
                  Hasil Terbaru
                </h2>
             
                {isGenerating ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-fuchsia-500 bg-fuchsia-50/50 rounded-3xl border-2 border-dashed border-fuchsia-200">
                    <Loader2 className="w-16 h-16 animate-spin mb-6 drop-shadow-lg" />
                    <p className="font-bold text-lg animate-pulse">Menghasilkan 4 Skenario Studio...</p>
                  </div>
                ) : generatedImages.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4 h-full">
                    {generatedImages.map((img, idx) => (
                      <div key={idx} onClick={() => setSelectedPromoImage(img)} className={`relative group w-full aspect-square overflow-hidden rounded-3xl shadow-md border-4 cursor-pointer transition-all duration-300 ${selectedPromoImage === img ? 'border-fuchsia-500 shadow-fuchsia-300/50 scale-[1.02]' : 'border-white hover:border-fuchsia-200'}`}>
                        <img src={img} alt={`Result ${idx}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-violet-900/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4 backdrop-blur-sm">
                          <button onClick={(e) => { e.stopPropagation(); setPreviewImage(img); }} className="p-4 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white hover:text-fuchsia-600 hover:scale-110 transition-all shadow-xl border border-white/30">
                            <Eye size={24} />
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); handleDownload(img); }} className="p-4 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white hover:text-cyan-600 hover:scale-110 transition-all shadow-xl border border-white/30">
                            <Download size={24} />
                          </button>
                        </div>
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-slate-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-2 group-hover:translate-y-0">
                          View {idx + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200">
                    <ImageIcon className="w-20 h-20 mb-4 opacity-20 text-slate-500" />
                    <p className="font-medium text-slate-500">Belum ada foto yang di-generate</p>
                  </div>
                )}
              </div>

              {history.length > 0 && (
                <div className="bg-white/80 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] shadow-2xl shadow-pink-200/40 border border-white">
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-slate-800">
                    <span className="p-2 bg-gradient-to-tr from-pink-400 to-rose-500 rounded-xl text-white shadow-lg"><History size={20} /></span>
                    Riwayat Foto (10 Terakhir)
                  </h2>
               
                  <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                    {history.map((item) => (
                      <div key={item.id} className="p-4 bg-slate-50 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-xs font-bold text-pink-600 bg-pink-100 px-3 py-1 rounded-full inline-block">
                            {new Date(item.id).toLocaleTimeString()}
                          </p>
                          <p className="text-xs text-slate-500 font-medium truncate max-w-[200px]">{item.prompt}</p>
                        </div>
                        <div className="grid grid-cols-4 gap-3">
                          {item.images.map((img, i) => (
                            <div key={i} onClick={() => setSelectedPromoImage(img)} className={`relative group aspect-square rounded-2xl overflow-hidden shadow-sm border-2 cursor-pointer transition-all ${selectedPromoImage === img ? 'border-fuchsia-500 shadow-lg scale-105' : 'border-white hover:border-fuchsia-200'}`}>
                              <img src={img} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="History" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-sm">
                                <button onClick={(e) => { e.stopPropagation(); setPreviewImage(img); }} className="p-2 bg-white/90 rounded-full text-fuchsia-600 shadow-lg hover:scale-110 transition-transform"><Eye size={16} /></button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </main>

          <section className="max-w-6xl mx-auto mt-12 bg-white/80 backdrop-blur-xl p-6 md:p-10 rounded-[2rem] shadow-2xl shadow-indigo-200/40 border border-white relative z-10">
            <h2 className="text-2xl font-extrabold mb-8 flex items-center gap-3 text-slate-800">
              <span className="p-3 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl text-white shadow-lg"><Megaphone size={28} /></span>
              Media Promosi
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div className="bg-indigo-50/50 p-5 rounded-3xl border border-indigo-100">
                  <label className="block text-sm font-bold text-indigo-800 mb-3 uppercase tracking-wider flex items-center gap-2">
                    Foto Pilihan <span className="text-xs font-normal normal-case opacity-70">(Klik dari hasil di atas)</span>
                  </label>
                  {selectedPromoImage ? (
                    <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-indigo-500 shadow-xl relative group">
                      <img src={selectedPromoImage} className="w-full h-full object-cover" alt="Selected" />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white text-xs font-bold px-2 py-1 bg-indigo-500 rounded-lg">Terpilih</span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 border-2 border-dashed border-indigo-300 rounded-2xl text-center text-indigo-500 text-sm font-medium">
                      Silakan generate dan klik foto hasil di atas untuk dijadikan media promosi.
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 pl-1 flex items-center gap-2"><Type size={16}/> Masukkan detail produk</label>
                  <textarea
                    value={promoDetails}
                    onChange={(e) => setPromoDetails(e.target.value)}
                    className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-100 outline-none transition-all resize-none h-32"
                    placeholder="Contoh : Bahan, manfaat, cara pakai, dll"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 pl-1">Gaya Desain</label>
                    <select
                      value={promoStyle}
                      onChange={(e) => setPromoStyle(e.target.value)}
                      className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-fuchsia-300 focus:bg-white focus:ring-4 focus:ring-fuchsia-100 outline-none transition-all appearance-none font-medium text-slate-700"
                    >
                      <option value="Modern and clean minimalist aesthetic, bold typography, ample whitespace">Modern Minimalist</option>
                      <option value="Vibrant flash sale, high energy, colorful, striking discount badge style">Flash Sale / Diskon Besar</option>
                      <option value="Elegant luxury, serif fonts, gold accents, premium cinematic feel">Elegant Luxury</option>
                      <option value="Instagram story style layout, modern social media aesthetic, trendy">Social Media Story</option>
                      <option value="Edgy streetwear style, grunge elements, bold contrasting colors">Streetwear / Edgy</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 pl-1">Rasio</label>
                    <select
                      value={promoAspectRatio}
                      onChange={(e) => setPromoAspectRatio(e.target.value)}
                      className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-fuchsia-300 focus:bg-white focus:ring-4 focus:ring-fuchsia-100 outline-none transition-all appearance-none font-medium text-slate-700"
                    >
                      <option value="1:1">1:1 (Square)</option>
                      <option value="9:16">9:16 (Portrait Story)</option>
                      <option value="16:9">16:9 (Landscape Banner)</option>
                    </select>
                  </div>
                </div>
                <button
                  onClick={handleGeneratePromo}
                  disabled={isGeneratingPromo || !selectedPromoImage}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 rounded-2xl hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:scale-100 mt-4"
                >
                  {isGeneratingPromo ? <Loader2 className="animate-spin w-6 h-6" /> : <Megaphone className="w-6 h-6" />}
                  {isGeneratingPromo ? "Merender Poster..." : "Generate Media Promosi"}
                </button>
                {promoError && <p className="text-red-500 text-sm mt-2 text-center bg-red-50 py-2 rounded-xl border border-red-100">{promoError}</p>}
              </div>

              <div className={`bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col p-6 min-h-[400px] ${generatedPromoImages.length > 0 ? '' : 'items-center justify-center'}`}>
                {isGeneratingPromo ? (
                  <div className="text-center">
                    <Loader2 className="w-16 h-16 animate-spin text-indigo-500 mx-auto mb-4" />
                    <p className="text-indigo-600 font-bold animate-pulse">Merender 4 Media Promosi...</p>
                  </div>
                ) : generatedPromoImages.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4 h-full w-full">
                    {generatedPromoImages.map((img, idx) => {
                      const labels = ["Thumbnail Marketplace", "Skenario Produk", "Detail Produk", "Rincian Produk"];
                      return (
                        <div key={idx} className="relative group w-full aspect-square overflow-hidden rounded-2xl shadow-lg border-2 border-white bg-white">
                          <img src={img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={`Promo Result ${idx}`} />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 rounded-2xl backdrop-blur-sm">
                            <button onClick={() => setPreviewImage(img)} className="p-3 bg-white text-slate-800 rounded-full hover:bg-indigo-50 hover:scale-110 transition-all shadow-xl">
                              <Eye size={20} />
                            </button>
                            <button onClick={() => handleDownload(img, `pixora-promo-${idx}-${Date.now()}.png`)} className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-500 hover:scale-110 transition-all shadow-xl">
                              <Download size={20} />
                            </button>
                          </div>
                          <div className="absolute top-2 left-2 bg-white/90 backdrop-blur text-indigo-800 text-[10px] font-bold px-2 py-1 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-1 group-hover:translate-y-0">
                            {labels[idx]}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center opacity-50">
                    <Megaphone className="w-20 h-20 mx-auto text-slate-400 mb-4" />
                    <p className="font-medium text-slate-500">Poster Promosi Anda akan muncul di sini</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </>
      )}

      {/* Fullscreen Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-sm z-50 flex items-center justify-center p-4 cursor-zoom-out transition-opacity" onClick={() => setPreviewImage(null)}>
          <div className="relative max-w-5xl max-h-[90vh] w-full flex justify-center">
            <img src={previewImage} className="max-w-full max-h-[90vh] rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/20" alt="Preview" />
            <button className="absolute -top-4 -right-4 p-3 bg-white text-slate-900 rounded-full shadow-2xl hover:bg-red-500 hover:text-white transition-colors" onClick={() => setPreviewImage(null)}>
              <X size={24} />
            </button>
          </div>
        </div>
      )}
     
      {/* Error Toast */}
      {error && (
        <div className="fixed bottom-6 right-6 max-w-sm bg-white border-l-4 border-red-500 p-4 rounded-xl shadow-2xl z-50 animate-bounce">
          <p className="text-sm font-bold text-red-600 flex items-center gap-2">
            <X className="bg-red-100 rounded-full p-1 w-6 h-6" /> {error}
          </p>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}} />
    </div>
  );
}