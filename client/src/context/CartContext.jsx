import { useState, useEffect, useRef, useCallback } from 'react';
import { CartContext } from './CartContextValues';

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cartItems');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (e) {
      console.error('Failed to load cart', e);
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [tableInfo, setTableInfo] = useState(() => {
    try {
      const savedTable = localStorage.getItem('tableInfo');
      return savedTable ? JSON.parse(savedTable) : null;
    } catch {
      return null;
    }
  });

  // Save cart to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Save table info to local storage whenever it changes
  useEffect(() => {
    if (tableInfo) {
      localStorage.setItem('tableInfo', JSON.stringify(tableInfo));
    } else {
      localStorage.removeItem('tableInfo');
    }
  }, [tableInfo]);

  const addGuardRef = useRef(new Map());
  const timeoutRef = useRef(null);

  const addToCart = useCallback((item, quantity = 1, modifiers = []) => {
    if (!item?._id) {
      return;
    }

    const normalizedModifiers = Array.isArray(modifiers) ? modifiers : [];
    const guardKey = `${item._id}-${JSON.stringify(normalizedModifiers)}`;

    // Check if this exact item+modifiers combo is already being added
    const lastAddTime = addGuardRef.current.get(guardKey);
    if (lastAddTime && Date.now() - lastAddTime < 1000) {
      return;
    }

    // Record this add attempt
    addGuardRef.current.set(guardKey, Date.now());

    setCartItems((prevItems) => {
      const normalizedImage = typeof item.image === 'string' && item.image.trim() ? item.image.trim() : null;
      const safeQuantity = Math.max(1, quantity);
      const existingItemIndex = prevItems.findIndex(
        (i) => i._id === item._id && JSON.stringify(i.modifiers) === JSON.stringify(normalizedModifiers)
      );

      if (existingItemIndex > -1) {
        const newItems = [...prevItems];
        newItems[existingItemIndex].quantity += safeQuantity;
        return newItems;
      }

      return [
        ...prevItems,
        { ...item, image: normalizedImage, quantity: safeQuantity, modifiers: normalizedModifiers },
      ];
    });

    // Open cart drawer
    setTimeout(() => setIsCartOpen(true), 0);

    // Clear guard after 1 second to allow new adds
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      addGuardRef.current.delete(guardKey);
    }, 1000);
  }, []);

  const removeFromCart = (itemId, modifiers = []) => {
    setCartItems((prevItems) =>
      prevItems.filter((i) => !(i._id === itemId && JSON.stringify(i.modifiers) === JSON.stringify(modifiers)))
    );
  };

  const updateQuantity = (itemId, quantity, modifiers = []) => {
    if (quantity < 1) {
      removeFromCart(itemId, modifiers);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((i) =>
        i._id === itemId && JSON.stringify(i.modifiers) === JSON.stringify(modifiers) ? { ...i, quantity } : i
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const clearTableInfo = () => {
    setTableInfo(null);
  };

  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    cartCount,
    isCartOpen,
    setIsCartOpen,
    tableInfo,
    setTableInfo,
    clearTableInfo,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
