import { useState, FormEvent } from 'react';
import { useApp } from '../context/AppContext';
import { Product, User } from '../types';
import { 
  ShoppingBag, 
  Search, 
  Plus, 
  X, 
  MapPin, 
  ShieldCheck, 
  Heart, 
  MessageSquare, 
  Tag, 
  Flag, 
  ArrowLeft, 
  Sparkles, 
  Trash2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageCarousel } from './ImageCarousel';

export function MarketplaceView() {
  const { 
    currentUser, 
    products, 
    users, 
    addProduct, 
    toggleFavoriteProduct, 
    reportProduct, 
    startOrGetChatThread, 
    sendChatMessage, 
    setAppTab,
    triggerToast
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCondition, setSelectedCondition] = useState<string>('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  
  // Create Modal State
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState<Product['category']>('Books');
  const [newCondition, setNewCondition] = useState<Product['condition']>('Used');
  const [newDescription, setNewDescription] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [imageInput, setImageInput] = useState('');
  const [imageList, setImageList] = useState<string[]>([]);

  // DM flow inside details
  const [dmText, setDmText] = useState('');

  if (!currentUser) return null;

  const categories: string[] = ['All', 'Books', 'Electronics', 'Hostel Items', 'Furniture', 'Study Material', 'Other'];
  const conditions: string[] = ['All', 'New', 'Like New', 'Good', 'Fair', 'Used'];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.campusLocation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesCondition = selectedCondition === 'All' || p.condition === selectedCondition;
    
    // Hide reported products unless owned by me
    const isReported = p.isReported && p.reportedBy?.includes(currentUser.id);
    return matchesSearch && matchesCategory && matchesCondition && !isReported;
  });

  const getSeller = (sellerId: string): User => {
    return users.find(u => u.id === sellerId) || {
      id: 'deleted',
      name: 'Former Student',
      username: 'former_student',
      email: '',
      bio: '',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      coverUrl: '',
      universityStatus: 'Student',
      universityName: 'Verified University',
      degree: '',
      city: '',
      interests: [],
      followersCount: 0,
      followingCount: 0,
      joinedAt: ''
    } as User;
  };

  const handleAddImage = () => {
    if (!imageInput.trim()) return;
    if (!imageInput.startsWith('http://') && !imageInput.startsWith('https://')) {
      triggerToast('Please provide a valid image URL 🌐');
      return;
    }
    setImageList([...imageList, imageInput.trim()]);
    setImageInput('');
  };

  const handleRemoveImage = (index: number) => {
    setImageList(imageList.filter((_, i) => i !== index));
  };

  const handleCreateListing = (e: FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newPrice || !newDescription.trim() || !newLocation.trim()) {
      triggerToast('Please fill in all required fields.');
      return;
    }

    const priceNum = parseFloat(newPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      triggerToast('Please enter a valid price.');
      return;
    }

    const finalImages = imageList.length > 0 ? imageList : ['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80'];

    addProduct({
      title: newTitle.trim(),
      description: newDescription.trim(),
      price: priceNum,
      category: newCategory,
      condition: newCondition,
      campusLocation: newLocation.trim(),
      images: finalImages
    });

    // Reset values
    setNewTitle('');
    setNewPrice('');
    setNewDescription('');
    setNewLocation('');
    setImageList([]);
    setImageInput('');
    setIsSellModalOpen(false);
  };

  const handleSendDM = (e: FormEvent) => {
    e.preventDefault();
    if (!dmText.trim() || !selectedProduct) return;

    // Use AppContext chat flow
    const threadId = startOrGetChatThread(selectedProduct.id, selectedProduct.sellerId);
    if (threadId) {
      sendChatMessage(threadId, dmText.trim());
      setDmText('');
      triggerToast('Message sent to seller! 💬');
      setAppTab('messages'); // navigate to messages
    }
  };

  const formatPKR = (amount: number) => {
    return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(amount);
  };

  const formatTime = (isoString: string) => {
    const diff = Date.now() - new Date(isoString).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="space-y-6 text-left animate-fade-in font-sans">
      
      {/* HEADER SECTION */}
      {!selectedProduct && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-[var(--brand-blue)] font-mono text-xs font-bold uppercase tracking-wider mb-1">
              <ShoppingBag className="w-4 h-4 shrink-0" />
              PakSpace Exchange
            </div>
            <h1 className="text-2xl md:text-3xl font-bold font-display tracking-tight text-[var(--text-secondary)]">
              Campus Marketplace
            </h1>
            <p className="text-xs text-gray-400 mt-1 max-w-xl leading-relaxed">
              Buy or sell textbooks, gadgets, hostel gear, and study materials safely within verified university circles.
            </p>
          </div>

          <button
            id="sell-item-btn"
            onClick={() => {
              setNewLocation(currentUser.universityName || '');
              setIsSellModalOpen(true);
            }}
            className="px-4 py-2.5 bg-[var(--brand-blue)] hover:bg-[var(--brand-blue-hover)] border border-[var(--border-color)] text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Sell Item
          </button>
        </div>
      )}

      {/* FILTER AND GRID OR DETAILED VIEW */}
      <AnimatePresence mode="wait">
        {!selectedProduct ? (
          <motion.div
            key="list-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* SEARCH AND FILTER BAR */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-[var(--bg-surface)] border border-[var(--border-color)] p-4 rounded-2xl shadow-xl">
              <div className="relative md:col-span-6">
                <input
                  type="text"
                  placeholder="Search listings, campuses, or books..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-app)]/55 border border-[var(--border-color)] rounded-xl text-xs focus:outline-none focus:border-[var(--brand-blue)] text-[var(--text-secondary)]"
                />
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
              </div>

              {/* Condition Filter */}
              <div className="md:col-span-6 flex gap-2 overflow-x-auto no-scrollbar py-0.5">
                {conditions.map(cond => (
                  <button
                    key={cond}
                    onClick={() => setSelectedCondition(cond)}
                    className={`px-3 py-2 rounded-xl text-[10px] font-mono uppercase tracking-wider border transition-all cursor-pointer whitespace-nowrap ${
                      selectedCondition === cond
                        ? 'bg-[var(--brand-blue)] border-[var(--brand-blue)] text-[var(--text-secondary)] font-bold'
                        : 'bg-[var(--bg-app)]/30 border-[var(--border-color)] text-gray-400 hover:text-[var(--text-secondary)]'
                    }`}
                  >
                    {cond === 'All' ? 'All Conditions' : cond}
                  </button>
                ))}
              </div>
            </div>

            {/* CATEGORY FILTER CHIPS */}
            <div className="flex gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar select-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium transition-all border cursor-pointer shrink-0 ${
                    selectedCategory === cat
                      ? 'bg-[var(--brand-blue)]/15 border-[var(--brand-blue)] text-blue-400 font-bold'
                      : 'bg-[var(--bg-surface)] border-[var(--border-color)] text-gray-400 hover:text-[var(--text-secondary)] hover:border-gray-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* PRODUCT GRID */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 px-6 space-y-4 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-3xl">
                <ShoppingBag className="w-10 h-10 text-gray-600 mx-auto" />
                <h3 className="text-base font-bold text-[var(--text-secondary)] font-display">No listings found</h3>
                <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
                  Try adjusting your search query, selecting another category, or launching the first listing in this circle!
                </p>
                <button
                  onClick={() => {
                    setNewLocation(currentUser.universityName || '');
                    setIsSellModalOpen(true);
                  }}
                  className="px-5 py-2.5 bg-[var(--brand-blue)] text-white text-xs font-bold rounded-xl hover:bg-[var(--brand-blue-hover)] transition-all cursor-pointer"
                >
                  Be the First to Sell
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => {
                  const seller = getSeller(product.sellerId);
                  const isFavorited = product.favoritedBy?.includes(currentUser.id);
                  const isMyListing = product.sellerId === currentUser.id;

                  return (
                    <div
                      key={product.id}
                      className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl overflow-hidden hover:border-[var(--brand-blue)]/45 transition-all duration-300 flex flex-col justify-between shadow-xl group relative"
                    >
                      {/* Image Slide/Thumbnail */}
                      <div 
                        onClick={() => setSelectedProduct(product)}
                        className="h-44 bg-[var(--bg-app)] relative overflow-hidden cursor-pointer"
                      >
                        <img 
                          src={product.images[0]} 
                          alt={product.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-3 left-3 bg-[var(--bg-app)]/85 backdrop-blur-xs text-blue-400 font-mono text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider border border-[var(--border-color)]">
                          {product.condition}
                        </div>
                      </div>

                      {/* Info Panel */}
                      <div className="p-4 flex-grow flex flex-col justify-between space-y-4">
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-start gap-2">
                            <span className="text-[10px] text-gray-500 font-mono tracking-wider uppercase">{product.category}</span>
                            <span className="text-xs font-mono font-bold text-[var(--text-secondary)]">{formatPKR(product.price)}</span>
                          </div>
                          
                          <h3 
                            onClick={() => setSelectedProduct(product)}
                            className="font-bold text-[var(--text-secondary)] text-sm hover:underline cursor-pointer tracking-tight line-clamp-1 text-left"
                          >
                            {product.title}
                          </h3>
                          <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed text-left">{product.description}</p>
                        </div>

                        {/* Location and Verification footer */}
                        <div className="pt-3 border-t border-[var(--border-color)] space-y-2 select-none">
                          <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                            <MapPin className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                            <span className="truncate">{product.campusLocation.split(',')[0]}</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                              <span className="text-[9px] font-mono tracking-wider text-blue-500 font-bold uppercase">
                                {seller.id === currentUser.id ? 'My Listing' : 'Verified Student'}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => toggleFavoriteProduct(product.id)}
                                className={`p-1.5 rounded-lg border border-[var(--border-color)] hover:bg-white/5 transition-all cursor-pointer ${
                                  isFavorited ? 'text-red-400 bg-red-950/20 border-red-900/40' : 'text-gray-500'
                                }`}
                              >
                                <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-red-500' : ''}`} />
                              </button>
                              <button
                                onClick={() => setSelectedProduct(product)}
                                className="px-3 py-1.5 bg-[var(--brand-blue)]/15 border border-[var(--brand-blue)]/30 text-blue-400 rounded-lg text-[10px] font-semibold hover:bg-[var(--brand-blue)]/30 transition-all cursor-pointer"
                              >
                                View Details
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        ) : (
          /* PRODUCT DETAILS PAGE SUBVIEW */
          <motion.div
            key="details-view"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <button
              onClick={() => { setSelectedProduct(null); setActiveImageIdx(0); }}
              className="flex items-center gap-1.5 text-xs font-mono font-bold text-gray-400 hover:text-[var(--text-secondary)] cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              BACK TO MARKETPLACE
            </button>

            {/* MAIN TWO-COLUMN CONTAINER */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Images & Desc */}
              <div className="md:col-span-7 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl overflow-hidden p-5 space-y-6">
                
                {/* Image Showcase */}
                <div className="space-y-3">
                  <div className="relative">
                    <ImageCarousel
                      images={selectedProduct.images}
                      index={activeImageIdx}
                      onIndexChange={setActiveImageIdx}
                      aspectClassName="aspect-[4/3] md:aspect-[4/3]"
                      rounded="rounded-xl"
                      showDots={false}
                      showCounter={selectedProduct.images.length > 1}
                      imgClassName="object-contain bg-[var(--bg-app)]"
                      alt={selectedProduct.title}
                    />
                    <div className="absolute top-4 left-4 bg-[var(--bg-app)]/90 text-blue-400 font-mono text-[10px] font-bold px-3 py-1 rounded-md uppercase tracking-wider border border-[var(--border-color)] pointer-events-none">
                      {selectedProduct.condition}
                    </div>
                  </div>

                  {/* Thumbnail gallery */}
                  {selectedProduct.images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                      {selectedProduct.images.map((img, idx) => (
                        <div 
                          key={idx} 
                          onClick={() => setActiveImageIdx(idx)}
                          className={`w-16 h-16 shrink-0 rounded-lg overflow-hidden border cursor-pointer transition-all ${
                            activeImageIdx === idx 
                              ? 'border-blue-500 scale-105' 
                              : 'border-[var(--border-color)] hover:border-gray-500 opacity-80'
                          } bg-[var(--bg-app)]`}
                        >
                          <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" loading="lazy" decoding="async" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Details text */}
                <div className="space-y-4 text-left">
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <span className="text-[10px] font-mono text-[var(--brand-blue)] tracking-widest uppercase font-bold">{selectedProduct.category}</span>
                      <h2 className="text-xl md:text-2xl font-bold font-display text-[var(--text-secondary)] tracking-tight mt-1">{selectedProduct.title}</h2>
                    </div>
                    <span className="text-base md:text-lg font-mono font-bold text-blue-400 bg-blue-950/20 px-3.5 py-1 rounded-xl border border-blue-900/30">
                      {formatPKR(selectedProduct.price)}
                    </span>
                  </div>

                  <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-wrap pt-2">
                    {selectedProduct.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[var(--border-color)] text-xs">
                    <div>
                      <span className="text-gray-500 font-mono uppercase tracking-wider text-[10px]">Campus Location</span>
                      <p className="text-[var(--text-secondary)] font-medium mt-1 flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        {selectedProduct.campusLocation}
                      </p>
                    </div>

                    <div>
                      <span className="text-gray-500 font-mono uppercase tracking-wider text-[10px]">Listed Date</span>
                      <p className="text-[var(--text-secondary)] font-mono mt-1">
                        {formatTime(selectedProduct.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Seller & Negotiation Chat */}
              <div className="md:col-span-5 space-y-6">
                
                {/* Seller Box */}
                {(() => {
                  const seller = getSeller(selectedProduct.sellerId);
                  const isMyListing = seller.id === currentUser.id;
                  
                  return (
                    <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-5 text-left space-y-4 shadow-xl">
                      <h3 className="text-xs font-mono font-bold text-gray-500 uppercase tracking-wider">Seller Information</h3>
                      
                      <div className="flex items-center gap-3">
                        <img 
                          src={seller.avatarUrl} 
                          alt={seller.name} 
                          className="w-12 h-12 rounded-full object-cover border border-white/10"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <h4 className="text-sm font-bold text-[var(--text-secondary)]">{seller.name}</h4>
                          <p className="text-[10px] text-gray-500">@{seller.username}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                            <span className="text-[9px] font-mono font-bold text-blue-500 uppercase tracking-wider">Verified Student Seller</span>
                          </div>
                        </div>
                      </div>

                      {seller.universityName && (
                        <p className="text-xs text-gray-400">
                          {seller.universityName} • {seller.degree}
                        </p>
                      )}

                      {/* Social Actions / Report */}
                      <div className="flex justify-between items-center pt-3 border-t border-[var(--border-color)]">
                        <button
                          onClick={() => {
                            reportProduct(selectedProduct.id);
                          }}
                          className="text-[10px] text-red-400 hover:underline flex items-center gap-1 font-mono cursor-pointer"
                        >
                          <Flag className="w-3.5 h-3.5" />
                          REPORT SUSPICIOUS LISTING
                        </button>

                        <button
                          onClick={() => toggleFavoriteProduct(selectedProduct.id)}
                          className="text-[10px] text-blue-400 hover:underline flex items-center gap-1 font-mono cursor-pointer"
                        >
                          <Heart className="w-3.5 h-3.5" />
                          {selectedProduct.favoritedBy?.includes(currentUser.id) ? 'FAVORITED' : 'ADD TO SAVED'}
                        </button>
                      </div>
                    </div>
                  );
                })()}

                {/* Offer Negotiation / DM Form */}
                {selectedProduct.sellerId !== currentUser.id && (
                  <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-5 text-left space-y-4 shadow-xl">
                    <h3 className="text-xs font-mono font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                      <MessageSquare className="w-4 h-4 text-blue-400" />
                      Campus Negotiation
                    </h3>

                    <p className="text-xs text-gray-400 leading-relaxed">
                      Send a message directly to the seller to negotiate price, ask questions, or arrange a secure meetup on campus.
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        const prefilledMsg = `Hi! I would like to buy your "${selectedProduct.title}" for ${formatPKR(selectedProduct.price)}. Let me know when and where we can meet on campus!`;
                        const threadId = startOrGetChatThread(selectedProduct.id, selectedProduct.sellerId);
                        if (threadId) {
                          sendChatMessage(threadId, prefilledMsg);
                          triggerToast('Purchase request sent! Redirecting to chat...');
                          setAppTab('messages');
                        }
                      }}
                      className="w-full py-4 md:py-3 bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white font-mono font-bold rounded-xl text-sm md:text-xs transition-all cursor-pointer shadow-lg shadow-blue-600/20 flex items-center justify-center gap-1.5"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      BUY THIS ITEM (QUICK CHAT)
                    </button>

                    {/* Pre-filled offer buttons */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-mono text-gray-500 block">Offer Suggestions:</span>
                      <div className="flex flex-wrap gap-1.5 select-none">
                        {[
                          'Is this still available?',
                          `Would you take ${formatPKR(selectedProduct.price * 0.9)}?`,
                          'Can we meet on campus tomorrow?',
                          'What is the current condition of the battery?'
                        ].map((suggestion) => (
                          <button
                            key={suggestion}
                            type="button"
                            onClick={() => setDmText(suggestion)}
                            className="px-2.5 py-1.5 bg-[var(--bg-app)]/60 border border-[var(--border-color)] hover:border-[var(--brand-blue)]/40 rounded-lg text-[10px] text-gray-300 hover:text-[var(--text-primary)] transition-all text-left truncate max-w-full cursor-pointer"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>

                    <form onSubmit={handleSendDM} className="space-y-3 pt-2">
                      <textarea
                        required
                        placeholder="Write your custom offer message..."
                        rows={3}
                        value={dmText}
                        onChange={(e) => setDmText(e.target.value)}
                        className="w-full px-3 py-2 border border-[var(--border-color)] rounded-xl bg-[var(--bg-app)]/50 focus:outline-none focus:border-[var(--brand-blue)] text-xs text-[var(--text-secondary)] resize-none"
                      />

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-[var(--brand-blue)] hover:bg-[var(--brand-blue-hover)] text-white font-mono font-bold rounded-xl text-xs transition-all cursor-pointer shadow-lg"
                      >
                        SEND OFFER MESSAGE
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CREATE LISTING MODAL / DIALOG */}
      <AnimatePresence>
        {isSellModalOpen && (
          <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-3xl p-6 shadow-2xl relative space-y-4 my-8"
            >
              <div className="flex justify-between items-center pb-2 border-b border-[var(--border-color)]">
                <h3 className="text-base font-bold text-[var(--text-secondary)] flex items-center gap-1.5 font-display">
                  <Tag className="w-4.5 h-4.5 text-blue-500" />
                  List Campus Item
                </h3>
                <button
                  onClick={() => setIsSellModalOpen(false)}
                  className="p-1 rounded-lg hover:bg-white/5 text-gray-400 hover:text-[var(--text-primary)] transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateListing} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1 text-left">
                
                {/* Title */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500">Item Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CASIO Scientific Calculator fx-991EX"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-[var(--border-color)] rounded-xl bg-[var(--bg-app)]/50 text-xs focus:outline-none focus:border-[var(--brand-blue)] text-[var(--text-secondary)]"
                  />
                </div>

                {/* Price and Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500">Price (PKR) *</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 2500"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      className="w-full px-3 py-2 border border-[var(--border-color)] rounded-xl bg-[var(--bg-app)]/50 text-xs focus:outline-none focus:border-[var(--brand-blue)] text-[var(--text-secondary)]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500">Category *</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as Product['category'])}
                      className="w-full px-3 py-2 border border-[var(--border-color)] rounded-xl bg-[var(--bg-app)]/50 text-xs focus:outline-none focus:border-[var(--brand-blue)] text-[var(--text-secondary)]"
                    >
                      <option value="Books">Books</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Hostel Items">Hostel Items</option>
                      <option value="Furniture">Furniture</option>
                      <option value="Study Material">Study Material</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Condition and Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500">Condition *</label>
                    <select
                      value={newCondition}
                      onChange={(e) => setNewCondition(e.target.value as Product['condition'])}
                      className="w-full px-3 py-2 border border-[var(--border-color)] rounded-xl bg-[var(--bg-app)]/50 text-xs focus:outline-none focus:border-[var(--brand-blue)] text-[var(--text-secondary)]"
                    >
                      <option value="New">New</option>
                      <option value="Like New">Like New</option>
                      <option value="Good">Good</option>
                      <option value="Fair">Fair</option>
                      <option value="Used">Used</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500">Campus Location *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. NUST Sector H-12, Islamabad"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      className="w-full px-3 py-2 border border-[var(--border-color)] rounded-xl bg-[var(--bg-app)]/50 text-xs focus:outline-none focus:border-[var(--brand-blue)] text-[var(--text-secondary)]"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500">Item Details / Description *</label>
                  <textarea
                    required
                    placeholder="Provide condition details, battery life, edition (for books), reason for selling..."
                    rows={4}
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-[var(--border-color)] rounded-xl bg-[var(--bg-app)]/50 focus:outline-none focus:border-[var(--brand-blue)] text-xs text-[var(--text-secondary)] resize-none"
                  />
                </div>

                {/* Images Upload from Gallery */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block">Add Product Images from Gallery</label>
                  <div className="flex flex-col gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        const files = e.target.files;
                        if (files) {
                          for (let i = 0; i < files.length; i++) {
                            const file = files[i];
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setImageList(prev => [...prev, reader.result as string]);
                            };
                            reader.readAsDataURL(file);
                          }
                        }
                      }}
                      className="text-xs text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-500/10 file:text-blue-400 hover:file:bg-blue-500/20 file:cursor-pointer"
                    />
                  </div>

                  {/* Added Image list */}
                  {imageList.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 pt-2">
                      {imageList.map((img, idx) => (
                        <div key={idx} className="relative aspect-square border border-[var(--border-color)] rounded-lg overflow-hidden group">
                          <img src={img} alt="" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-1 right-1 p-1 bg-red-950/80 hover:bg-red-900 border border-red-800/50 rounded-full text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    className="w-full py-3 bg-[var(--brand-blue)] hover:bg-[var(--brand-blue-hover)] border border-[var(--border-color)] text-white font-mono font-bold rounded-xl text-sm transition-all cursor-pointer shadow-lg"
                  >
                    LAUNCH LISTING
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
