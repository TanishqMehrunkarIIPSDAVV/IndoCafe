import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ClassicLoader from '@/components/ui/loader';
import { useOutlet } from '../../context/OutletContextValues';
import { useCart } from '../../context/CartContextValues';
import { useTheme } from '../../context/useTheme';
import { useDebounce } from '../../hooks/useDebounce';
import api from '../../lib/axios';
import toast from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import {
  ShoppingBag,
  UtensilsCrossed,
  Clock,
  ChevronRight,
  ChevronDown,
  Search,
  Menu as MenuIcon,
  Sun,
  Moon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import CartDrawer from '../../components/cart/CartDrawer';
import FeaturedItems from '../../features/home/FeaturedItems';
import TrendingItems from '../../features/home/TrendingItems';
// Reusing FeaturedItems for now, but ideally this should be a "MenuSection" component that takes categories.

const OrderSession = () => {
  const { outletId, tableId } = useParams();
  const navigate = useNavigate();
  const { setOutlet, selectedOutlet } = useOutlet();
  const { setTableInfo, tableInfo, setIsCartOpen, cartItems } = useCart();
  const { isDarkMode, toggleTheme } = useTheme();
  const initializationRef = useRef(false);

  const [activeTab, setActiveTab] = useState('menu'); // 'menu' | 'orders' | 'bill'
  const [isLoading, setIsLoading] = useState(true);
  const [showFullMenu, setShowFullMenu] = useState(false);
  const [orders, setOrders] = useState([]);
  const [isOrdersLoading, setIsOrdersLoading] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dietFilter, setDietFilter] = useState('all');

  // Debounced search query
  const debouncedSearch = useDebounce(searchQuery, 500);

  // --- 1. Session Initialization ---
  useEffect(() => {
    const initSession = async () => {
      try {
        setIsLoading(true);
        // Fetch Table Details
        const res = await api.get(`/api/public/table/${tableId}`);

        const table = res.data?.data || res.data;

        if (!table) throw new Error('Table not found');

        // Validate Outlet
        const tableOutletId = typeof table.outletId === 'string' ? table.outletId : table.outletId?._id;

        // Compare as strings to handle ObjectId comparison
        if (String(tableOutletId) !== String(outletId)) {
          throw new Error('Table code mismatch - This table belongs to a different outlet');
        }

        // Set Contexts
        setOutlet({ _id: String(outletId) });
        setTableInfo({
          tableId: table._id,
          tableName: table.label,
          floor: table.floor,
          outletId: String(tableOutletId),
        });

        toast.success(`Welcome to Table ${table.label}!`);
      } catch (err) {
        console.error('Session init error:', err);
        toast.error('Invalid session. Redirecting...');
        navigate('/home');
      } finally {
        setIsLoading(false);
      }
    };

    if (outletId && tableId && !initializationRef.current) {
      initializationRef.current = true;
      initSession();
    }
  }, [outletId, tableId, navigate, setOutlet, setTableInfo]);

  // Fetch orders for this table
  const fetchOrders = useCallback(async () => {
    if (!tableId) return;
    try {
      setIsOrdersLoading(true);
      // Get stored customer token (set after first order)
      const customerToken = localStorage.getItem(`customerToken_${tableId}`);
      const url = customerToken
        ? `/api/public/orders/table/${tableId}?customerToken=${customerToken}`
        : `/api/public/orders/table/${tableId}`;
      const res = await api.get(url);
      if (res.data?.success) {
        const fetched = res.data.data || [];
        setOrders(fetched);
        setExpandedOrders(fetched.map((o) => o._id)); // auto-expand to show items
      }
    } catch (err) {
      console.error('Failed to fetch orders', err);
      toast.error('Could not load orders');
    } finally {
      setIsOrdersLoading(false);
    }
  }, [tableId]);

  useEffect(() => {
    fetchOrders();
    // Set up refresh callback for cart drawer
    window.refreshOrders = fetchOrders;
    return () => {
      delete window.refreshOrders;
    };
  }, [tableId, fetchOrders]);

  const toggleOrder = (orderId) => {
    setExpandedOrders((prev) => (prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]));
  };

  // --- Render Loading ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white p-6">
        <ClassicLoader className="w-12 h-12 border-4 border-amber-500 border-t-transparent mb-4" />
        <p className="font-medium tracking-wide">Setting up your table...</p>
      </div>
    );
  }

  // --- Main UI ---
  return (
    <div className="min-h-screen bg-background relative font-sans pb-[calc(6rem+env(safe-area-inset-bottom,0px))]">
      <div className="max-w-5xl mx-auto w-full px-3 sm:px-4">
        {/* 1. Header (Sticky) */}
        <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-white/5 px-2 sm:px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Popover open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <PopoverTrigger asChild>
                <button
                  className="p-2 rounded-full bg-zinc-200 dark:bg-zinc-900 text-zinc-700 dark:text-white border border-zinc-300 dark:border-white/10"
                  aria-label="Open menu"
                >
                  <MenuIcon size={20} />
                </button>
              </PopoverTrigger>
              <PopoverContent align="start" sideOffset={10} className="w-60 p-2 bg-zinc-950 border border-white/10">
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setActiveTab('menu');
                      setIsMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeTab === 'menu' ? 'bg-primary/20 text-primary' : 'text-zinc-200 hover:bg-zinc-900'
                    }`}
                  >
                    <MenuIcon size={16} />
                    Menu
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('orders');
                      setIsMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeTab === 'orders' ? 'bg-primary/20 text-primary' : 'text-zinc-200 hover:bg-zinc-900'
                    }`}
                  >
                    <Clock size={16} />
                    Past Orders
                  </button>
                  <button
                    onClick={() => {
                      setIsCartOpen(true);
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-sm text-zinc-200 hover:bg-zinc-900"
                  >
                    <span className="flex items-center gap-3">
                      <ShoppingBag size={16} />
                      Cart
                    </span>
                    {cartItems.length > 0 && (
                      <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                        {cartItems.length}
                      </span>
                    )}
                  </button>
                </div>
              </PopoverContent>
            </Popover>
            <div className="flex flex-col">
              <h1 className="text-base sm:text-lg font-bold text-primary tracking-tight">
                {selectedOutlet?.name || 'Indo Cafe'}
              </h1>
              <span className="text-[11px] sm:text-xs text-zinc-400 flex items-center gap-1">
                <UtensilsCrossed size={12} />
                Table {tableInfo?.tableName}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-zinc-200 dark:bg-zinc-900 text-zinc-700 dark:text-white border border-zinc-300 dark:border-white/10"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </header>

        {/* 2. Content */}
        <div className="py-4 space-y-6 sm:space-y-8">
          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'menu' && (
              <motion.div
                key="menu"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-primary/25 via-background to-background p-3 sm:p-6 space-y-3">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-primary/80">Dine-in</p>
                    <h2 className="text-lg sm:text-2xl font-bold text-text">Hungry? Let's find your cravings.</h2>
                    <p className="text-xs sm:text-sm text-secondary">Browse popular picks, then add to your table.</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-1.5 sm:gap-2 bg-zinc-100 dark:bg-zinc-950/70 border border-zinc-300 dark:border-white/10 rounded-xl px-2 py-2 sm:px-3 sm:py-2.5">
                      <Search size={14} className="text-zinc-500 dark:text-zinc-400 flex-shrink-0 sm:w-4 sm:h-4" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search dishes..."
                        className="flex-1 bg-transparent text-xs sm:text-sm text-text placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none min-w-0"
                      />
                      <Button
                        size="sm"
                        className="h-7 px-2.5 sm:h-8 sm:px-4 rounded-lg text-[10px] sm:text-xs flex-shrink-0 whitespace-nowrap"
                      >
                        Search
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="bg-zinc-100 dark:bg-zinc-950/70 border border-zinc-300 dark:border-white/10 rounded-xl px-2 py-2 sm:px-3 sm:py-2.5 text-xs sm:text-sm text-text outline-none truncate"
                      >
                        <option value="all">All Categories</option>
                        <option value="Appetizers">Appetizers</option>
                        <option value="Mains">Mains</option>
                        <option value="Beverages">Beverages</option>
                        <option value="Desserts">Desserts</option>
                      </select>
                      <select
                        value={dietFilter}
                        onChange={(e) => setDietFilter(e.target.value)}
                        className="bg-zinc-100 dark:bg-zinc-950/70 border border-zinc-300 dark:border-white/10 rounded-xl px-2 py-2 sm:px-3 sm:py-2.5 text-xs sm:text-sm text-text outline-none truncate"
                      >
                        <option value="all">Veg & Non-Veg</option>
                        <option value="veg">Veg</option>
                        <option value="non-veg">Non-Veg</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Trending Items Section - only show when not viewing full menu */}
                {!showFullMenu && (
                  <TrendingItems
                    outletId={outletId}
                    searchQuery={debouncedSearch}
                    categoryFilter={categoryFilter}
                    dietFilter={dietFilter}
                  />
                )}

                {/* All Menu Items */}
                <div>
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-text">
                      {showFullMenu ? 'Full Menu' : 'Our Menu'}
                    </h2>
                    <Button
                      onClick={() => setShowFullMenu(!showFullMenu)}
                      variant="outline"
                      size="sm"
                      className="text-xs sm:text-sm px-3 py-2"
                    >
                      {showFullMenu ? 'Show Less' : 'View Full Menu'}
                    </Button>
                  </div>
                  <FeaturedItems
                    outletId={outletId}
                    showAll={showFullMenu}
                    searchQuery={debouncedSearch}
                    categoryFilter={categoryFilter}
                    dietFilter={dietFilter}
                  />
                </div>
              </motion.div>
            )}

            {activeTab === 'orders' && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-text">Past Orders</h2>
                    <p className="text-sm text-secondary">Most recent first</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={fetchOrders} disabled={isOrdersLoading}>
                    {isOrdersLoading ? 'Refreshing...' : 'Refresh'}
                  </Button>
                </div>

                {isOrdersLoading ? (
                  <div className="flex items-center justify-center py-16 text-zinc-400">
                    <ClassicLoader className="w-8 h-8 border-4 border-amber-500 border-t-transparent mr-3" />
                    Loading orders...
                  </div>
                ) : orders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-zinc-500">
                    <Clock size={48} className="mb-4 opacity-50" />
                    <p>No orders yet for this table.</p>
                    <Button
                      onClick={() => setActiveTab('menu')}
                      variant="link"
                      className="mt-4 text-amber-500 font-medium text-sm"
                    >
                      Go to Menu
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.map((order) => {
                      const isOpen = expandedOrders.includes(order._id);
                      return (
                        <div key={order._id} className="bg-zinc-900/60 border border-white/5 rounded-2xl p-4 space-y-3">
                          <button
                            className="w-full text-left flex items-center justify-between gap-3"
                            onClick={() => toggleOrder(order._id)}
                          >
                            <div>
                              <p className="text-xs text-zinc-400">Order #{order._id?.slice(-6)}</p>
                              <p className="text-sm text-zinc-500">{new Date(order.createdAt).toLocaleString()}</p>
                              <p className="text-xs text-zinc-400 mt-1">{(order.items || []).length} item(s)</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400">
                                {order.status}
                              </span>
                              <ChevronDown
                                size={18}
                                className={`transition-transform ${isOpen ? 'rotate-180' : ''} text-zinc-300`}
                              />
                            </div>
                          </button>

                          {!isOpen && (order.items || []).length > 0 && (
                            <div className="mt-2 text-xs text-zinc-400 line-clamp-2">
                              {(order.items || [])
                                .slice(0, 2)
                                .map((item) => item.name || 'Item')
                                .join(', ')}
                              {(order.items || []).length > 2 ? '…' : ''}
                            </div>
                          )}

                          {isOpen && (
                            <div className="space-y-2">
                              {(order.items || []).map((item, idx) => (
                                <div
                                  key={`${order._id}-item-${idx}`}
                                  className="flex justify-between items-start gap-3 bg-zinc-950/70 rounded-xl p-3 border border-white/5"
                                >
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-text line-clamp-2">
                                      {item.name || item.menuItem?.name || 'Item'}
                                    </p>
                                    {Array.isArray(item.modifiers) && item.modifiers.length > 0 && (
                                      <div className="mt-1 text-xs text-secondary space-y-1">
                                        {item.modifiers.map((mod, mIdx) => (
                                          <div key={`${idx}-mod-${mIdx}`} className="flex gap-2 items-center">
                                            <span>{mod}</span>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                  <div className="text-right whitespace-nowrap">
                                    <p className="text-sm font-semibold text-text">x{item.quantity}</p>
                                    {item.price !== undefined && (
                                      <p className="text-xs text-secondary">
                                        ${item.price?.toFixed?.(2) ?? item.price}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="flex items-center justify-between pt-1">
                            <p className="text-sm text-secondary">Total</p>
                            <p className="text-base font-bold text-text">
                              ${order.totalAmount?.toFixed?.(2) ?? order.totalAmount}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 3. Floating Cart Button (FAB) */}
        {cartItems.length > 0 && (
          <motion.div initial={{ y: 100 }} animate={{ y: 0 }} className="fixed inset-x-3 sm:inset-x-4 bottom-4 z-50">
            <Button
              onClick={() => setIsCartOpen(true)}
              size="lg"
              className="w-full py-6 sm:py-7 px-4 sm:px-6 rounded-2xl shadow-xl shadow-amber-500/20 flex items-center justify-between font-bold text-base sm:text-lg"
            >
              <div className="flex items-center gap-3">
                <div className="bg-white/20 px-3 py-1 rounded-full text-sm">{cartItems.length}</div>
                <span>View Cart</span>
              </div>
              <span className="flex items-center gap-2">
                ₹{cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)}
                <ChevronRight size={20} />
              </span>
            </Button>
          </motion.div>
        )}

        {/* Drawers/Modals */}
        <CartDrawer />
      </div>
    </div>
  );
};

export default OrderSession;
