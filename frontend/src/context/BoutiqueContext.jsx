import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { boutiqueApi } from '../services/api';
import { INITIAL_ORDERS, INITIAL_PRODUCTS, INITIAL_SETTINGS } from '../data/initialData';
import { generateOrderReference } from '../utils/whatsapp';

const BoutiqueContext = createContext(null);

export function BoutiqueProvider({ children }) {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [settings, setSettings] = useState(INITIAL_SETTINGS);
  const [isHydrated, setIsHydrated] = useState(false);

  // Cart persisted in localStorage
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('jp_cart_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Admin auth session
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return sessionStorage.getItem('jp_admin_auth') === 'true';
  });

  // Global luxury UI drawers/modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [shareModalPayload, setShareModalPayload] = useState(null); // { url, title } or null
  const [directWaProduct, setDirectWaProduct] = useState(null); // { product, quantity } or null
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ id: Date.now(), message, type });
    setTimeout(() => {
      setToast((prev) => (prev && Date.now() - prev.id >= 3400 ? null : prev));
    }, 3500);
  }, []);

  // Load persisted data from IndexedDB / API on mount
  useEffect(() => {
    let mounted = true;
    boutiqueApi
      .loadInitialData()
      .then((data) => {
        if (!mounted) return;
        if (data.products) setProducts(data.products);
        if (data.settings) setSettings(data.settings);
        if (data.orders) setOrders(data.orders);
        setIsHydrated(true);
      })
      .catch(() => {
        if (mounted) setIsHydrated(true);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('jp_cart_v1', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  // Publicly visible products
  const publicProducts = useMemo(() => {
    return products.filter((p) => p.visible !== false);
  }, [products]);

  // Cart operations
  const addToCart = useCallback(
    (product, qty = 1, openDrawer = true) => {
      if (!product.available || Number(product.stock) <= 0) {
        showToast('Ce parfum est momentanément indisponible.', 'error');
        return;
      }
      setCart((prev) => {
        const existing = prev.find((item) => item.productId === product.id);
        const maxStock = Number(product.stock) || 99;
        if (existing) {
          const nextQty = Math.min(maxStock, existing.quantity + qty);
          return prev.map((item) =>
            item.productId === product.id ? { ...item, quantity: nextQty } : item
          );
        }
        return [
          ...prev,
          {
            productId: product.id,
            quantity: Math.min(maxStock, qty),
          },
        ];
      });
      if (openDrawer) {
        setIsCartOpen(true);
      } else {
        showToast(`« ${product.name} » ajouté au panier.`);
      }
    },
    [showToast]
  );

  const updateCartQuantity = useCallback(
    (productId, nextQty) => {
      if (nextQty <= 0) {
        setCart((prev) => prev.filter((item) => item.productId !== productId));
        return;
      }
      const prod = products.find((p) => p.id === productId);
      const maxStock = prod ? Number(prod.stock) || 99 : 99;
      const clamped = Math.min(maxStock, nextQty);
      setCart((prev) =>
        prev.map((item) => (item.productId === productId ? { ...item, quantity: clamped } : item))
      );
    },
    [products]
  );

  const removeFromCart = useCallback((productId) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // Detailed cart items hydrated with latest owner-defined prices & photos
  const detailedCartItems = useMemo(() => {
    return cart
      .map((entry) => {
        const product = products.find((p) => p.id === entry.productId);
        if (!product || product.visible === false) return null;
        return {
          productId: product.id,
          name: product.name,
          subtitle: product.subtitle,
          category: product.category,
          volume: product.volume,
          price: Number(product.price) || 0,
          stock: Number(product.stock) || 0,
          available: product.available,
          photo: product.photos?.[0] || '/images/p1.jpg',
          quantity: entry.quantity,
          lineTotal: (Number(product.price) || 0) * entry.quantity,
        };
      })
      .filter(Boolean);
  }, [cart, products]);

  const cartCount = useMemo(
    () => detailedCartItems.reduce((acc, item) => acc + item.quantity, 0),
    [detailedCartItems]
  );

  const cartSubtotal = useMemo(
    () => detailedCartItems.reduce((acc, item) => acc + item.lineTotal, 0),
    [detailedCartItems]
  );

  const computeDeliveryFee = useCallback(
    (cityId, subtotalAmount) => {
      if (
        settings.freeDeliveryEnabled &&
        Number(settings.freeDeliveryThreshold) > 0 &&
        subtotalAmount >= Number(settings.freeDeliveryThreshold)
      ) {
        return 0;
      }
      const zone = settings.deliveryZones?.find((z) => z.id === cityId);
      return zone ? Number(zone.fee) || 0 : 7;
    },
    [settings]
  );

  // Create order (from Cart Checkout OR from Direct WhatsApp Quick Order modal)
  const createOrder = useCallback(
    async ({ customer, items, paymentMethod = 'Espèces à la livraison', channel = 'WhatsApp & Boutique' }) => {
      const subtotal = items.reduce(
        (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
        0
      );
      const deliveryFee = computeDeliveryFee(customer.cityId, subtotal);
      const total = subtotal + deliveryFee;
      const reference = generateOrderReference();

      const newOrder = {
        id: `ord-${Date.now()}`,
        reference,
        createdAt: new Date().toISOString(),
        status: 'Nouvelle',
        paymentMethod,
        channel,
        customer,
        items: items.map((i) => ({
          productId: i.productId,
          name: i.name,
          category: i.category,
          volume: i.volume || '',
          price: Number(i.price) || 0,
          quantity: Number(i.quantity) || 1,
          photo: i.photo || '/images/p1.jpg',
        })),
        subtotal,
        deliveryFee,
        total,
      };

      const nextOrders = [newOrder, ...orders];
      setOrders(nextOrders);
      await boutiqueApi.saveOrders(nextOrders);

      // Update product stocks automatically
      const nextProducts = products.map((prod) => {
        const orderedItem = items.find((i) => i.productId === prod.id);
        if (!orderedItem) return prod;
        const remaining = Math.max(0, (Number(prod.stock) || 0) - (Number(orderedItem.quantity) || 1));
        return {
          ...prod,
          stock: remaining,
          available: remaining > 0 ? prod.available : false,
        };
      });
      setProducts(nextProducts);
      await boutiqueApi.saveProducts(nextProducts);

      return newOrder;
    },
    [orders, products, computeDeliveryFee]
  );

  // Admin: Product management
  const addProduct = useCallback(
    async (productData) => {
      const newProd = {
        id: `prod-${Date.now()}`,
        name: productData.name.trim(),
        subtitle: productData.subtitle?.trim() || 'Eau de Parfum',
        category: productData.category || 'Mixte',
        volume: productData.volume?.trim() || '100 ml',
        price: Number(productData.price),
        available: Boolean(productData.available) && Number(productData.stock) > 0,
        stock: Number(productData.stock) || 0,
        visible: productData.visible !== false,
        featured: Boolean(productData.featured),
        isNew: Boolean(productData.isNew),
        notes: productData.notes?.trim() || '',
        description: productData.description?.trim() || '',
        photos:
          Array.isArray(productData.photos) && productData.photos.length > 0
            ? productData.photos
            : ['/images/p1.jpg'],
        createdAt: new Date().toISOString(),
      };
      const next = [newProd, ...products];
      setProducts(next);
      await boutiqueApi.saveProducts(next);
      showToast(`Parfum « ${newProd.name} » publié dans le catalogue.`);
      return newProd;
    },
    [products, showToast]
  );

  const updateProduct = useCallback(
    async (id, updates) => {
      const next = products.map((p) => {
        if (p.id !== id) return p;
        const updatedStock = updates.stock !== undefined ? Number(updates.stock) : p.stock;
        const updatedAvail =
          updates.available !== undefined ? Boolean(updates.available) : p.available;
        return {
          ...p,
          ...updates,
          price: updates.price !== undefined ? Number(updates.price) : p.price,
          stock: updatedStock,
          available: updatedStock <= 0 ? false : updatedAvail,
        };
      });
      setProducts(next);
      await boutiqueApi.saveProducts(next);
      showToast('Modifications enregistrées avec succès.');
    },
    [products, showToast]
  );

  const deleteProduct = useCallback(
    async (id) => {
      const target = products.find((p) => p.id === id);
      const next = products.filter((p) => p.id !== id);
      setProducts(next);
      await boutiqueApi.saveProducts(next);
      setCart((prev) => prev.filter((item) => item.productId !== id));
      showToast(`« ${target?.name || 'Parfum'} » supprimé du catalogue.`);
    },
    [products, showToast]
  );

  const toggleProductVisibility = useCallback(
    async (id) => {
      const next = products.map((p) => (p.id === id ? { ...p, visible: !p.visible } : p));
      setProducts(next);
      await boutiqueApi.saveProducts(next);
      const updated = next.find((p) => p.id === id);
      showToast(
        updated?.visible
          ? `« ${updated.name} » est maintenant visible pour les clients.`
          : `« ${updated?.name} » est masqué du catalogue public.`
      );
    },
    [products, showToast]
  );

  // Admin: Order status management
  const updateOrderStatus = useCallback(
    async (orderId, newStatus) => {
      const next = orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
      setOrders(next);
      await boutiqueApi.saveOrders(next);
      showToast(`Statut mis à jour : ${newStatus}`);
    },
    [orders, showToast]
  );

  const deleteOrder = useCallback(
    async (orderId) => {
      const next = orders.filter((o) => o.id !== orderId);
      setOrders(next);
      await boutiqueApi.saveOrders(next);
      showToast('Commande supprimée.');
    },
    [orders, showToast]
  );

  // Admin: Boutique Settings
  const updateSettings = useCallback(
    async (nextSettings) => {
      setSettings(nextSettings);
      await boutiqueApi.saveSettings(nextSettings);
      showToast('Paramètres de la boutique enregistrés.');
    },
    [showToast]
  );

  // Admin: Authentication
  const loginAdmin = useCallback(
    async (password) => {
      const valid = await boutiqueApi.verifyAdminPassword(password);
      if (valid) {
        setIsAdminAuthenticated(true);
        sessionStorage.setItem('jp_admin_auth', 'true');
        showToast('Bienvenue dans votre Espace Vendeur JOSHUA PARFUM.');
        return true;
      }
      return false;
    },
    [showToast]
  );

  const logoutAdmin = useCallback(() => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('jp_admin_auth');
    sessionStorage.removeItem('jp_admin_token');
    showToast('Vous êtes déconnecté de l’Espace Vendeur.');
  }, [showToast]);

  const changeAdminPassword = useCallback(
    async (newPass) => {
      await boutiqueApi.updateAdminPassword(newPass);
      showToast('Mot de passe administrateur mis à jour.');
    },
    [showToast]
  );

  const value = {
    isHydrated,
    products,
    publicProducts,
    orders,
    settings,
    cart,
    detailedCartItems,
    cartCount,
    cartSubtotal,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    computeDeliveryFee,
    createOrder,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductVisibility,
    updateOrderStatus,
    deleteOrder,
    updateSettings,
    isAdminAuthenticated,
    loginAdmin,
    logoutAdmin,
    changeAdminPassword,
    isCartOpen,
    setIsCartOpen,
    isSearchOpen,
    setIsSearchOpen,
    shareModalPayload,
    setShareModalPayload,
    directWaProduct,
    setDirectWaProduct,
    toast,
    showToast,
  };

  return <BoutiqueContext.Provider value={value}>{children}</BoutiqueContext.Provider>;
}

export function useBoutique() {
  const ctx = useContext(BoutiqueContext);
  if (!ctx) throw new Error('useBoutique must be used inside BoutiqueProvider');
  return ctx;
}
