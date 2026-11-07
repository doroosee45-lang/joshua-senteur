import React, { useMemo, useRef, useState } from 'react';
import {
  Lock,
  LogOut,
  Package,
  ShoppingBag,
  Settings,
  Plus,
  ImagePlus,
  Trash2,
  Edit3,
  Eye,
  EyeOff,
  Phone,
  MessageCircle,
  CheckCircle2,
  AlertTriangle,
  Search,
  Calendar,
  Share2,
  Save,
  X,
  ArrowUpLeft,
  Download,
} from 'lucide-react';
import JoshuaLogo from '../components/JoshuaLogo';
import { useBoutique } from '../context/BoutiqueContext';
import { ORDER_STATUSES } from '../data/initialData';
import { processUploadedImageFile } from '../services/storageDb';
import { buildAdminToClientWhatsAppUrl, formatPriceDT } from '../utils/whatsapp';
import { Reveal } from '../components/Motion';

const STATUS_BADGE_STYLES = {
  Nouvelle: 'bg-[#F4EDE7] text-[#8A5A5A] border-[#D4B8AE]',
  Confirmée: 'bg-[#EDF1EE] text-[#4E6753] border-[#B8CBBF]',
  'En préparation': 'bg-[#EFECE8] text-[#5C4F4C] border-[#D5CBC2]',
  'En livraison': 'bg-[#231B19] text-[#E2C0BC] border-[#231B19]',
  Livrée: 'bg-[#E6EFE8] text-[#3B5941] border-[#9BB8A2]',
  Annulée: 'bg-[#F5EBEB] text-[#8A4F4F] border-[#D9B8B8]',
};

const EMPTY_FORM = {
  name: '',
  subtitle: 'Eau de Parfum',
  category: 'Femme',
  volume: '100 ml',
  price: '',
  stock: '10',
  available: true,
  visible: true,
  isNew: true,
  notes: '',
  description: '',
  photos: [],
};

export default function AdminPage() {
  const {
    isAdminAuthenticated,
    loginAdmin,
    logoutAdmin,
    changeAdminPassword,
    products,
    orders,
    settings,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductVisibility,
    updateOrderStatus,
    deleteOrder,
    updateSettings,
    setShareModalPayload,
    showToast,
  } = useBoutique();

  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('orders');

  // Orders filter state
  const [statusFilter, setStatusFilter] = useState('Toutes');
  const [dateFilter, setDateFilter] = useState('');
  const [orderSearch, setOrderSearch] = useState('');

  // Product Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [productForm, setProductForm] = useState(EMPTY_FORM);
  const [photoError, setPhotoError] = useState('');
  const [formError, setFormError] = useState('');
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const fileInputRef = useRef(null);

  const [inlinePrices, setInlinePrices] = useState({});

  const [settingsDraft, setSettingsDraft] = useState(settings);
  const [newZoneName, setNewZoneName] = useState('');
  const [newZoneFee, setNewZoneFee] = useState('7');
  const [newZoneDelay, setNewZoneDelay] = useState('24h à 48h');
  const [newAdminPass, setNewAdminPass] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    const ok = await loginAdmin(passwordInput);
    if (!ok) {
      setLoginError('Mot de passe incorrect. Veuillez réessayer.');
    } else {
      setLoginError('');
      setPasswordInput('');
      setSettingsDraft(settings);
    }
  };

  const stats = useMemo(() => {
    const validOrders = orders.filter((o) => o.status !== 'Annulée');
    const revenue = validOrders.reduce((acc, o) => acc + (Number(o.total) || 0), 0);
    const newCount = orders.filter((o) => o.status === 'Nouvelle').length;
    const lowStockCount = products.filter((p) => Number(p.stock) <= 3).length;
    return {
      totalOrders: orders.length,
      newCount,
      revenue,
      totalProducts: products.length,
      lowStockCount,
    };
  }, [orders, products]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (statusFilter !== 'Toutes' && order.status !== statusFilter) return false;
      if (dateFilter) {
        const orderDay = (order.createdAt || '').slice(0, 10);
        if (orderDay !== dateFilter) return false;
      }
      if (orderSearch.trim()) {
        const q = orderSearch.trim().toLowerCase();
        const matchRef = order.reference.toLowerCase().includes(q);
        const matchName = (order.customer?.fullName || '').toLowerCase().includes(q);
        const matchPhone = (order.customer?.phone || '').toLowerCase().includes(q);
        const matchCity = (order.customer?.cityName || '').toLowerCase().includes(q);
        if (!matchRef && !matchName && !matchPhone && !matchCity) return false;
      }
      return true;
    });
  }, [orders, statusFilter, dateFilter, orderSearch]);

  const openAddProduct = () => {
    setEditingProductId(null);
    setProductForm(EMPTY_FORM);
    setPhotoError('');
    setFormError('');
    setIsFormOpen(true);
  };

  const openEditProduct = (prod) => {
    setEditingProductId(prod.id);
    setProductForm({
      name: prod.name || '',
      subtitle: prod.subtitle || 'Eau de Parfum',
      category: prod.category || 'Femme',
      volume: prod.volume || '100 ml',
      price: String(prod.price ?? ''),
      stock: String(prod.stock ?? 0),
      available: Boolean(prod.available),
      visible: prod.visible !== false,
      isNew: Boolean(prod.isNew),
      notes: prod.notes || '',
      description: prod.description || '',
      photos: Array.isArray(prod.photos) ? [...prod.photos] : [],
    });
    setPhotoError('');
    setFormError('');
    setIsFormOpen(true);
  };

  const handleChoosePhotos = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setPhotoError('');
    setUploadingPhotos(true);

    const addedPhotos = [];
    for (const file of files) {
      const res = await processUploadedImageFile(file);
      if (!res.ok) {
        setPhotoError(res.error);
      } else {
        addedPhotos.push(res.dataUrl);
      }
    }

    if (addedPhotos.length > 0) {
      setProductForm((prev) => ({
        ...prev,
        photos: [...prev.photos, ...addedPhotos],
      }));
    }

    setUploadingPhotos(false);
    e.target.value = '';
  };

  const removePhotoFromForm = (index) => {
    setProductForm((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, idx) => idx !== index),
    }));
  };

  const setPrimaryPhoto = (index) => {
    setProductForm((prev) => {
      const arr = [...prev.photos];
      const [chosen] = arr.splice(index, 1);
      return { ...prev, photos: [chosen, ...arr] };
    });
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!productForm.name.trim()) {
      setFormError('Veuillez saisir le nom du parfum.');
      return;
    }

    const numericPrice = Number(String(productForm.price).replace(',', '.'));
    if (productForm.price === '' || Number.isNaN(numericPrice) || numericPrice <= 0) {
      setFormError(
        'Veuillez saisir un prix de vente valide en Dinars Tunisiens (fixé exclusivement par le propriétaire).'
      );
      return;
    }

    if (productForm.photos.length === 0) {
      setFormError(
        'Veuillez ajouter au moins une image via le bouton « Choisir une photo ».'
      );
      return;
    }

    const payload = {
      ...productForm,
      price: numericPrice,
      stock: Math.max(0, Number(productForm.stock) || 0),
    };

    if (editingProductId) {
      await updateProduct(editingProductId, payload);
    } else {
      await addProduct(payload);
    }

    setIsFormOpen(false);
    setEditingProductId(null);
  };

  const handleQuickPriceSave = async (prod) => {
    const raw = inlinePrices[prod.id];
    if (raw === undefined) return;
    const val = Number(String(raw).replace(',', '.'));
    if (Number.isNaN(val) || val <= 0) {
      showToast('Veuillez saisir un prix valide en DT.', 'error');
      return;
    }
    await updateProduct(prod.id, { price: val });
    setInlinePrices((prev) => {
      const copy = { ...prev };
      delete copy[prod.id];
      return copy;
    });
  };

  const handleExportBackup = () => {
    const backup = {
      exportedAt: new Date().toISOString(),
      boutique: settings.boutiqueName,
      products,
      orders,
      settings,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `joshua-parfum-sauvegarde-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Sauvegarde téléchargée avec succès.');
  };

  // 1. PROTECTED LOGIN SCREEN
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-[#1C1615] text-[#FAF7F4] pt-[82px] flex items-center justify-center px-4 py-16 animate-page-enter">
        <div className="w-full max-w-md bg-[#231B19] border border-[#E2C0BC]/25 p-8 sm:p-11 shadow-2xl">
          <div className="text-center mb-8">
            <JoshuaLogo size="md" subtitle="ESPACE VENDEUR" />
            <h1 className="font-serif text-3xl mt-5">Administration Privée</h1>
            <p className="text-xs font-light text-[#FAF7F4]/65 mt-2.5 leading-[1.8]">
              Accès réservé au propriétaire de {settings.boutiqueName} pour piloter les créations,
              photos, tarifs et commandes.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="p-3 bg-[#3A2424] border border-[#9E6B6B]/50 text-[#E2C0BC] text-xs">
                {loginError}
              </div>
            )}

            <div>
              <label className="block text-[10px] uppercase tracking-[0.24em] text-[#D4B8AE] mb-2">
                Mot de passe propriétaire *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#E2C0BC] absolute left-3.5 top-1/2 -translate-y-1/2" strokeWidth={1.6} />
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Entrez votre mot de passe..."
                  className="w-full bg-[#1C1615] border border-white/15 pl-10 pr-4 py-3 text-sm text-[#FAF7F4] focus:border-[#E2C0BC] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button type="submit" className="btn-atelier-blush w-full">
              Accéder à l’Espace Vendeur
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            <p className="text-[11px] font-light text-[#D4B8AE]/80">
              Accès initial :{' '}
              <code className="px-2 py-0.5 bg-[#1C1615] text-[#E2C0BC] font-mono">joshua2026</code>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 2. AUTHENTICATED DASHBOARD
  return (
    <div className="min-h-screen bg-[#FAF7F4] text-[#1C1615] pt-[74px] sm:pt-[82px] pb-24 animate-page-enter">
      {/* Top Vendor Header */}
      <div className="bg-[#231B19] text-[#FAF7F4] py-10 px-4 sm:px-8 border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#E2C0BC]">
              ESPACE VENDEUR · PROPRIÉTAIRE
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl mt-1">
              Maison <em className="italic font-light text-[#E2C0BC]">{settings.boutiqueName}</em>
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() =>
                setShareModalPayload({
                  url: window.location.origin,
                  title: `${settings.boutiqueName} — ${settings.slogan}`,
                })
              }
              className="px-4 py-2.5 border border-white/20 text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 hover:border-[#E2C0BC] hover:text-[#E2C0BC] transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" strokeWidth={1.6} />
              Partager
            </button>

            <button
              type="button"
              onClick={handleExportBackup}
              className="px-4 py-2.5 border border-white/20 text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 hover:border-[#E2C0BC] hover:text-[#E2C0BC] transition-colors"
            >
              <Download className="w-3.5 h-3.5" strokeWidth={1.6} />
              Sauvegarde
            </button>

            <button
              type="button"
              onClick={logoutAdmin}
              className="px-4 py-2.5 bg-white/[0.08] text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 hover:bg-[#8A5A5A] transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" strokeWidth={1.6} />
              Déconnexion
            </button>
          </div>
        </div>

        {/* Harmonized KPI Strip */}
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          <div className="bg-[#1C1615] border border-white/[0.08] p-5">
            <p className="text-[9.5px] uppercase tracking-[0.24em] text-[#D4B8AE]">
              Nouvelles commandes
            </p>
            <p className="font-serif text-3xl text-[#E2C0BC] mt-1.5">{stats.newCount}</p>
          </div>

          <div className="bg-[#1C1615] border border-white/[0.08] p-5">
            <p className="text-[9.5px] uppercase tracking-[0.24em] text-[#D4B8AE]">
              Commandes totales
            </p>
            <p className="font-serif text-3xl text-[#FAF7F4] mt-1.5">{stats.totalOrders}</p>
          </div>

          <div className="bg-[#1C1615] border border-white/[0.08] p-5">
            <p className="text-[9.5px] uppercase tracking-[0.24em] text-[#D4B8AE]">
              Chiffre d’affaires
            </p>
            <p className="font-serif text-3xl text-[#E2C0BC] mt-1.5">
              {formatPriceDT(stats.revenue)}
            </p>
          </div>

          <div className="bg-[#1C1615] border border-white/[0.08] p-5">
            <p className="text-[9.5px] uppercase tracking-[0.24em] text-[#D4B8AE]">
              Catalogue actif
            </p>
            <p className="font-serif text-3xl text-[#FAF7F4] mt-1.5">
              {stats.totalProducts}
              {stats.lowStockCount > 0 && (
                <span className="text-[11px] font-sans font-light text-[#D4B8AE] ml-2">
                  ({stats.lowStockCount} stock bas)
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-[#FCFAF8] border-b border-[#E6DDD6] sticky top-[74px] sm:top-[82px] z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center gap-2 overflow-x-auto scrollbar-hide">
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`py-4 px-5 text-[10.5px] uppercase tracking-[0.22em] font-medium border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'orders'
                ? 'border-[#1C1615] text-[#1C1615]'
                : 'border-transparent text-[#6E5F5C] hover:text-[#1C1615]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" strokeWidth={1.6} />
            Commandes ({orders.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('products')}
            className={`py-4 px-5 text-[10.5px] uppercase tracking-[0.22em] font-medium border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'products'
                ? 'border-[#1C1615] text-[#1C1615]'
                : 'border-transparent text-[#6E5F5C] hover:text-[#1C1615]'
            }`}
          >
            <Package className="w-4 h-4" strokeWidth={1.6} />
            Parfums, Photos & Prix ({products.length})
          </button>

          <button
            type="button"
            onClick={() => {
              setSettingsDraft(settings);
              setActiveTab('settings');
            }}
            className={`py-4 px-5 text-[10.5px] uppercase tracking-[0.22em] font-medium border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'settings'
                ? 'border-[#1C1615] text-[#1C1615]'
                : 'border-transparent text-[#6E5F5C] hover:text-[#1C1615]'
            }`}
          >
            <Settings className="w-4 h-4" strokeWidth={1.6} />
            Livraison Jendouba & Paramètres
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-9">
        {/* TAB 1: ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="bg-[#FCFAF8] border border-[#E6DDD6] p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                {['Toutes', ...ORDER_STATUSES].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatusFilter(st)}
                    className={`px-3.5 py-1.5 text-[10px] uppercase tracking-[0.18em] border transition-colors ${
                      statusFilter === st
                        ? 'bg-[#1C1615] text-[#FAF7F4] border-[#1C1615]'
                        : 'bg-[#FAF7F4] text-[#6E5F5C] border-[#E6DDD6] hover:border-[#8A5A5A]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 sm:w-56">
                  <Search className="w-3.5 h-3.5 text-[#8A7A77] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Réf, client, téléphone..."
                    className="w-full border border-[#DED4CC] bg-white pl-8 pr-3 py-2 text-xs focus:outline-none focus:border-[#8A5A5A]"
                  />
                </div>

                <div className="inline-flex items-center gap-1.5 border border-[#DED4CC] bg-white px-3 py-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#8A5A5A]" />
                  <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="bg-transparent text-xs focus:outline-none"
                  />
                  {dateFilter && (
                    <button
                      type="button"
                      onClick={() => setDateFilter('')}
                      className="text-xs text-[#8A5A5A] hover:text-black ml-1"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="bg-[#FCFAF8] border border-[#E6DDD6] p-14 text-center">
                <p className="font-serif text-3xl text-[#1C1615]">Aucune commande trouvée</p>
                <p className="text-xs font-light text-[#6E5F5C] mt-2">
                  Modifiez vos filtres de statut ou de date pour consulter l’historique complet.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order, idx) => {
                  const dateFormatted = new Date(order.createdAt).toLocaleString('fr-FR', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <Reveal
                      key={order.id}
                      delay={(idx % 4) * 60}
                      className="bg-[#FCFAF8] border border-[#E6DDD6] p-5 sm:p-7 space-y-5"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EFE8E1]">
                        <div>
                          <div className="flex flex-wrap items-center gap-2.5">
                            <span className="px-3 py-1 bg-[#231B19] text-[#E2C0BC] text-xs font-mono">
                              {order.reference}
                            </span>
                            <span
                              className={`px-3 py-1 text-[10.5px] uppercase tracking-[0.16em] font-medium border ${
                                STATUS_BADGE_STYLES[order.status] || 'bg-[#F4EDE7]'
                              }`}
                            >
                              {order.status}
                            </span>
                            <span className="text-xs font-light text-[#6E5F5C]">
                              {dateFormatted}
                            </span>
                          </div>
                          <p className="text-xs font-light text-[#8A5A5A] mt-1.5">
                            {order.paymentMethod} · {order.channel || 'Boutique'}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <label className="text-[10px] uppercase tracking-[0.2em] text-[#6E5F5C]">
                            Statut
                          </label>
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className="border border-[#1C1615] bg-white px-3 py-2 text-xs font-medium focus:outline-none"
                          >
                            {ORDER_STATUSES.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>

                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Supprimer la commande ${order.reference} ?`)) {
                                deleteOrder(order.id);
                              }
                            }}
                            className="p-2 text-[#9A8C88] hover:text-[#8A5A5A] transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" strokeWidth={1.6} />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        <div className="lg:col-span-5 bg-[#F4EDE7]/70 p-5 border border-[#E6DDD6] space-y-2 text-xs">
                          <p className="text-[9.5px] uppercase tracking-[0.24em] text-[#8A5A5A] font-medium">
                            Client & Livraison
                          </p>
                          <p className="font-serif text-xl text-[#1C1615]">
                            {order.customer?.fullName}
                          </p>
                          <p className="font-light text-[#3A302E]">
                            <strong className="font-medium">Tél :</strong> {order.customer?.phone}
                          </p>
                          <p className="font-light text-[#3A302E]">
                            <strong className="font-medium">Commune :</strong>{' '}
                            {order.customer?.cityName}
                            {order.customer?.neighborhood
                              ? ` (${order.customer.neighborhood})`
                              : ''}
                          </p>
                          <p className="font-light text-[#3A302E]">
                            <strong className="font-medium">Adresse :</strong>{' '}
                            {order.customer?.address}
                          </p>
                          {order.customer?.instructions && (
                            <p className="text-[#8A5A5A] italic">
                              « {order.customer.instructions} »
                            </p>
                          )}

                          <div className="pt-3 flex flex-wrap gap-2">
                            <a
                              href={buildAdminToClientWhatsAppUrl(order)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 py-2.5 px-3 bg-[#231B19] text-[#FAF7F4] text-[10px] uppercase tracking-[0.2em] font-medium flex items-center justify-center gap-1.5 hover:bg-[#8A5A5A] transition-colors"
                            >
                              <MessageCircle className="w-3.5 h-3.5 text-[#E2C0BC]" strokeWidth={1.6} />
                              WhatsApp Client
                            </a>
                            <a
                              href={`tel:${(order.customer?.phone || '').replace(/\s+/g, '')}`}
                              className="py-2.5 px-3.5 border border-[#DED4CC] bg-white text-[#1C1615] text-[10px] uppercase tracking-[0.2em] font-medium flex items-center justify-center gap-1.5 hover:bg-[#F4EDE7] transition-colors"
                            >
                              <Phone className="w-3.5 h-3.5" strokeWidth={1.6} />
                              Appeler
                            </a>
                          </div>
                        </div>

                        <div className="lg:col-span-7 flex flex-col justify-between">
                          <div className="space-y-3">
                            {order.items.map((item, i) => (
                              <div
                                key={i}
                                className="flex items-center justify-between gap-3 py-2 border-b border-[#EFE8E1] last:border-b-0 text-xs"
                              >
                                <div className="flex items-center gap-3.5">
                                  <img
                                    src={item.photo || '/images/p1.jpg'}
                                    alt={item.name}
                                    className="w-12 h-12 object-cover bg-[#EFE8E1]"
                                  />
                                  <div>
                                    <p className="font-serif text-lg text-[#1C1615]">{item.name}</p>
                                    <p className="text-[11px] font-light text-[#6E5F5C]">
                                      {item.category} · Qté : <strong>{item.quantity}</strong> ×{' '}
                                      {formatPriceDT(item.price)}
                                    </p>
                                  </div>
                                </div>
                                <span className="font-serif text-lg font-medium text-[#1C1615]">
                                  {formatPriceDT(item.price * item.quantity)}
                                </span>
                              </div>
                            ))}
                          </div>

                          <div className="mt-4 pt-3 border-t border-[#E6DDD6] flex flex-wrap items-baseline justify-between gap-2">
                            <span className="text-xs font-light text-[#6E5F5C]">
                              Sous-total : {formatPriceDT(order.subtotal)} · Livraison :{' '}
                              {formatPriceDT(order.deliveryFee)}
                            </span>
                            <span className="font-serif text-2xl font-medium text-[#1C1615]">
                              Total : {formatPriceDT(order.total)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CATALOGUE, PHOTOS & OWNER PRICING */}
        {activeTab === 'products' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FCFAF8] border border-[#E6DDD6] p-6">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#1C1615]">
                  Catalogue & Contrôle Exclusif des Tarifs
                </h2>
                <p className="text-xs font-light text-[#6E5F5C] mt-1">
                  Importez vos visuels depuis la photothèque de votre iPhone ou smartphone, fixez
                  vos prix en Dinars Tunisiens et pilotez vos stocks.
                </p>
              </div>
              <button type="button" onClick={openAddProduct} className="btn-atelier-dark shrink-0">
                <Plus className="w-4 h-4 text-[#E2C0BC]" strokeWidth={1.6} />
                <span>Ajouter un parfum</span>
              </button>
            </div>

            {isFormOpen && (
              <form
                onSubmit={handleSaveProduct}
                className="bg-[#FCFAF8] border border-[#1C1615] p-6 sm:p-9 shadow-xl space-y-6 animate-modal-up"
              >
                <div className="flex items-center justify-between pb-4 border-b border-[#E6DDD6]">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.28em] text-[#8A5A5A] font-medium">
                      {editingProductId ? 'ÉDITION DE CRÉATION' : 'NOUVELLE CRÉATION'}
                    </span>
                    <h3 className="font-serif text-3xl text-[#1C1615] mt-0.5">
                      {editingProductId ? 'Modifier la fiche produit' : 'Ajouter un parfum'}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="p-2 text-[#6E5F5C] hover:text-[#1C1615]"
                  >
                    <X className="w-5 h-5" strokeWidth={1.5} />
                  </button>
                </div>

                {formError && (
                  <div className="p-4 bg-[#F4EDE7] border border-[#9E6B6B] text-[#8A5A5A] text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Native iPhone / Smartphone Photo Picker */}
                <div className="p-5 bg-[#F4EDE7]/70 border border-[#DED4CC] space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <label className="block text-[10.5px] uppercase tracking-[0.22em] font-medium text-[#1C1615]">
                        Photographies du flacon *
                      </label>
                      <p className="text-xs font-light text-[#6E5F5C] mt-1">
                        Sur iPhone ou Android, appuyez sur « Choisir une photo » pour ouvrir votre
                        Photothèque, l’Appareil photo ou Fichiers.
                      </p>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleChoosePhotos}
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingPhotos}
                      className="btn-atelier-dark shrink-0"
                    >
                      <ImagePlus className="w-4 h-4 text-[#E2C0BC]" strokeWidth={1.6} />
                      <span>{uploadingPhotos ? 'Optimisation...' : 'Choisir une photo'}</span>
                    </button>
                  </div>

                  {photoError && (
                    <div className="p-3 bg-[#FCFAF8] border border-[#9E6B6B] text-[#8A5A5A] text-xs flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>{photoError}</span>
                    </div>
                  )}

                  {productForm.photos.length > 0 ? (
                    <div>
                      <p className="text-[11px] font-light text-[#6E5F5C] mb-2.5">
                        Aperçu avant publication ({productForm.photos.length} image
                        {productForm.photos.length > 1 ? 's' : ''}) :
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                        {productForm.photos.map((photoSrc, idx) => (
                          <div
                            key={idx}
                            className="relative group aspect-square bg-white border border-[#DED4CC] overflow-hidden"
                          >
                            <img
                              src={photoSrc}
                              alt={`Aperçu ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                            {idx === 0 ? (
                              <span className="absolute top-1.5 left-1.5 px-2 py-0.5 bg-[#231B19] text-[#E2C0BC] text-[8.5px] uppercase tracking-wider">
                                Principale
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setPrimaryPhoto(idx)}
                                className="absolute bottom-1.5 left-1.5 px-2 py-0.5 bg-white/90 text-[#1C1615] text-[8.5px] uppercase tracking-wider flex items-center gap-1 shadow"
                              >
                                <ArrowUpLeft className="w-2.5 h-2.5" />
                                Principale
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => removePhotoFromForm(idx)}
                              className="absolute top-1.5 right-1.5 p-1 bg-[#231B19] text-[#FAF7F4] rounded-full shadow"
                              title="Retirer cette photo"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="border border-dashed border-[#D4B8AE] bg-[#FCFAF8] p-6 text-center text-xs font-light text-[#6E5F5C]">
                      Aucune image sélectionnée. Appuyez sur <strong>« Choisir une photo »</strong>{' '}
                      pour afficher l’aperçu avant d’enregistrer.
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="sm:col-span-2">
                    <label className="label-atelier">Nom du parfum *</label>
                    <input
                      type="text"
                      required
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      placeholder="Ex: Oud Royal Intense"
                      className="input-atelier"
                    />
                  </div>

                  <div>
                    <label className="label-atelier">Catégorie *</label>
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      className="input-atelier"
                    >
                      <option value="Femme">Femme</option>
                      <option value="Homme">Homme</option>
                      <option value="Mixte">Mixte</option>
                    </select>
                  </div>

                  <div>
                    <label className="label-atelier !text-[#8A5A5A]">Prix de vente (DT) *</label>
                    <input
                      type="number"
                      step="0.5"
                      min="1"
                      required
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      placeholder="Prix en DT"
                      className="input-atelier !border-[#8A5A5A] font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="label-atelier">Famille / Sous-titre</label>
                    <input
                      type="text"
                      value={productForm.subtitle}
                      onChange={(e) => setProductForm({ ...productForm, subtitle: e.target.value })}
                      placeholder="Ex: Eau de Parfum · Floral"
                      className="input-atelier"
                    />
                  </div>

                  <div>
                    <label className="label-atelier">Contenance</label>
                    <input
                      type="text"
                      value={productForm.volume}
                      onChange={(e) => setProductForm({ ...productForm, volume: e.target.value })}
                      placeholder="Ex: 100 ml"
                      className="input-atelier"
                    />
                  </div>

                  <div>
                    <label className="label-atelier">Stock disponible *</label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={productForm.stock}
                      onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                      className="input-atelier"
                    />
                  </div>
                </div>

                <div>
                  <label className="label-atelier">Notes olfactives</label>
                  <input
                    type="text"
                    value={productForm.notes}
                    onChange={(e) => setProductForm({ ...productForm, notes: e.target.value })}
                    placeholder="Ex: Bergamote · Rose de Damas · Oud & Vanille"
                    className="input-atelier"
                  />
                </div>

                <div>
                  <label className="label-atelier">Description éditoriale</label>
                  <textarea
                    rows={3}
                    value={productForm.description}
                    onChange={(e) =>
                      setProductForm({ ...productForm, description: e.target.value })
                    }
                    placeholder="Décrivez le sillage, la tenue et l’inspiration du parfum..."
                    className="input-atelier"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-6 pt-1 text-xs font-light">
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.available}
                      onChange={(e) =>
                        setProductForm({ ...productForm, available: e.target.checked })
                      }
                      className="accent-[#1C1615]"
                    />
                    <span>Disponible à la vente</span>
                  </label>

                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.visible}
                      onChange={(e) =>
                        setProductForm({ ...productForm, visible: e.target.checked })
                      }
                      className="accent-[#1C1615]"
                    />
                    <span>Visible dans le catalogue public</span>
                  </label>

                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.isNew}
                      onChange={(e) => setProductForm({ ...productForm, isNew: e.target.checked })}
                      className="accent-[#1C1615]"
                    />
                    <span>Mention « Nouveau »</span>
                  </label>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-[#E6DDD6]">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="btn-atelier-outline-dark"
                  >
                    Annuler
                  </button>
                  <button type="submit" className="btn-atelier-dark">
                    <CheckCircle2 className="w-4 h-4 text-[#E2C0BC]" strokeWidth={1.6} />
                    <span>Enregistrer le parfum</span>
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {products.map((prod) => {
                const draftPrice = inlinePrices[prod.id];
                return (
                  <div
                    key={prod.id}
                    className={`bg-[#FCFAF8] border p-4 sm:p-5 flex gap-4 transition-opacity ${
                      prod.visible === false
                        ? 'border-dashed border-[#B8ABA7] opacity-70'
                        : 'border-[#E6DDD6]'
                    }`}
                  >
                    <img
                      src={prod.photos?.[0] || '/images/p1.jpg'}
                      alt={prod.name}
                      className="w-24 h-24 object-cover bg-[#EFE8E1] shrink-0"
                    />

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[9.5px] uppercase tracking-[0.22em] text-[#8A5A5A] font-medium">
                              {prod.category} · {prod.volume}
                            </span>
                            <h4 className="font-serif text-xl text-[#1C1615] leading-tight">
                              {prod.name}
                            </h4>
                          </div>
                          {prod.visible === false && (
                            <span className="px-2 py-0.5 bg-[#F4EDE7] text-[#6E5F5C] text-[9px] uppercase tracking-wider">
                              Masqué
                            </span>
                          )}
                        </div>

                        <div className="mt-2.5 flex flex-wrap items-center gap-2">
                          <label className="text-[11px] font-light text-[#6E5F5C]">
                            Prix (DT) :
                          </label>
                          <input
                            type="number"
                            step="0.5"
                            min="1"
                            value={draftPrice !== undefined ? draftPrice : prod.price}
                            onChange={(e) =>
                              setInlinePrices({ ...inlinePrices, [prod.id]: e.target.value })
                            }
                            className="w-24 border border-[#DED4CC] bg-white px-2.5 py-1 text-xs font-medium focus:border-[#8A5A5A] focus:outline-none"
                          />
                          {draftPrice !== undefined && Number(draftPrice) !== Number(prod.price) && (
                            <button
                              type="button"
                              onClick={() => handleQuickPriceSave(prod)}
                              className="px-2.5 py-1 bg-[#1C1615] text-[#FAF7F4] text-[9.5px] uppercase tracking-wider"
                            >
                              Valider
                            </button>
                          )}
                          <span className="text-xs font-light text-[#6E5F5C] ml-auto">
                            Stock : <strong className="font-medium text-[#1C1615]">{prod.stock}</strong>
                          </span>
                        </div>
                      </div>

                      <div className="mt-3.5 pt-2.5 border-t border-[#EFE8E1] flex items-center justify-between gap-2 text-[11px]">
                        <button
                          type="button"
                          onClick={() => openEditProduct(prod)}
                          className="inline-flex items-center gap-1 text-[#1C1615] hover:text-[#8A5A5A] font-medium transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" strokeWidth={1.6} />
                          Modifier
                        </button>

                        <button
                          type="button"
                          onClick={() => toggleProductVisibility(prod.id)}
                          className="inline-flex items-center gap-1 text-[#6E5F5C] hover:text-[#1C1615] transition-colors"
                        >
                          {prod.visible === false ? (
                            <>
                              <Eye className="w-3.5 h-3.5" strokeWidth={1.6} />
                              Afficher
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3.5 h-3.5" strokeWidth={1.6} />
                              Masquer
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Supprimer définitivement « ${prod.name} » ?`)) {
                              deleteProduct(prod.id);
                            }
                          }}
                          className="inline-flex items-center gap-1 text-[#8A5A5A] hover:text-[#1C1615] transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" strokeWidth={1.6} />
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: SETTINGS & JENDOUBA DELIVERY */}
        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 bg-[#FCFAF8] border border-[#E6DDD6] p-6 sm:p-9 space-y-6">
              <h2 className="font-serif text-3xl text-[#1C1615] pb-3 border-b border-[#EFE8E1]">
                WhatsApp, Livraison & Modalités
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-atelier">Numéro WhatsApp des commandes</label>
                  <input
                    type="text"
                    value={settingsDraft.whatsappNumber}
                    onChange={(e) =>
                      setSettingsDraft({ ...settingsDraft, whatsappNumber: e.target.value })
                    }
                    className="input-atelier"
                  />
                </div>

                <div>
                  <label className="label-atelier">Slogan de la Maison</label>
                  <input
                    type="text"
                    value={settingsDraft.slogan}
                    onChange={(e) => setSettingsDraft({ ...settingsDraft, slogan: e.target.value })}
                    className="input-atelier"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center bg-[#F4EDE7]/70 p-4 border border-[#E6DDD6]">
                <label className="inline-flex items-center gap-2.5 text-xs font-light cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settingsDraft.freeDeliveryEnabled}
                    onChange={(e) =>
                      setSettingsDraft({
                        ...settingsDraft,
                        freeDeliveryEnabled: e.target.checked,
                      })
                    }
                    className="accent-[#1C1615]"
                  />
                  <span>Offrir la livraison au-delà d’un montant défini</span>
                </label>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-light text-[#6E5F5C]">Seuil (DT) :</span>
                  <input
                    type="number"
                    min="0"
                    value={settingsDraft.freeDeliveryThreshold}
                    onChange={(e) =>
                      setSettingsDraft({
                        ...settingsDraft,
                        freeDeliveryThreshold: Number(e.target.value),
                      })
                    }
                    className="w-28 border border-[#DED4CC] bg-white px-3 py-1.5 text-xs font-medium"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-[10px] uppercase tracking-[0.26em] text-[#8A5A5A] font-medium">
                  Communes desservies & Frais de livraison (DT)
                </h3>

                <div className="divide-y divide-[#EFE8E1] border border-[#E6DDD6] bg-white">
                  {(settingsDraft.deliveryZones || []).map((zone, idx) => (
                    <div
                      key={zone.id}
                      className="p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs"
                    >
                      <span className="font-medium text-[#1C1615] min-w-[160px]">{zone.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-light text-[#6E5F5C]">Tarif (DT) :</span>
                        <input
                          type="number"
                          min="0"
                          step="0.5"
                          value={zone.fee}
                          onChange={(e) => {
                            const updated = [...settingsDraft.deliveryZones];
                            updated[idx] = { ...zone, fee: Number(e.target.value) };
                            setSettingsDraft({ ...settingsDraft, deliveryZones: updated });
                          }}
                          className="w-20 border border-[#DED4CC] px-2.5 py-1 text-xs font-medium"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = settingsDraft.deliveryZones.filter(
                              (z) => z.id !== zone.id
                            );
                            setSettingsDraft({ ...settingsDraft, deliveryZones: updated });
                          }}
                          className="p-1 text-[#9A8C88] hover:text-[#8A5A5A]"
                          title="Supprimer cette zone"
                        >
                          <Trash2 className="w-3.5 h-3.5" strokeWidth={1.6} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <input
                    type="text"
                    value={newZoneName}
                    onChange={(e) => setNewZoneName(e.target.value)}
                    placeholder="Nouvelle commune..."
                    className="flex-1 min-w-[160px] input-atelier !py-2"
                  />
                  <input
                    type="number"
                    min="0"
                    value={newZoneFee}
                    onChange={(e) => setNewZoneFee(e.target.value)}
                    placeholder="DT"
                    className="w-20 input-atelier !py-2"
                  />
                  <input
                    type="text"
                    value={newZoneDelay}
                    onChange={(e) => setNewZoneDelay(e.target.value)}
                    placeholder="Délai"
                    className="w-36 input-atelier !py-2"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newZoneName.trim()) return;
                      const id = newZoneName
                        .trim()
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-');
                      setSettingsDraft({
                        ...settingsDraft,
                        deliveryZones: [
                          ...(settingsDraft.deliveryZones || []),
                          {
                            id: `${id}-${Date.now()}`,
                            name: newZoneName.trim(),
                            fee: Number(newZoneFee) || 0,
                            delay: newZoneDelay.trim() || '24h à 48h',
                          },
                        ],
                      });
                      setNewZoneName('');
                    }}
                    className="px-4 py-2 bg-[#231B19] text-[#FAF7F4] text-[10px] uppercase tracking-[0.2em]"
                  >
                    + Ajouter
                  </button>
                </div>
              </div>

              <div>
                <label className="label-atelier">
                  Conditions de paiement & de livraison affichées aux clients
                </label>
                <textarea
                  rows={3}
                  value={settingsDraft.paymentConditions}
                  onChange={(e) =>
                    setSettingsDraft({ ...settingsDraft, paymentConditions: e.target.value })
                  }
                  className="input-atelier"
                />
              </div>

              <label className="inline-flex items-center gap-2.5 text-xs font-light cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(settingsDraft.enableBankTransfer)}
                  onChange={(e) =>
                    setSettingsDraft({ ...settingsDraft, enableBankTransfer: e.target.checked })
                  }
                  className="accent-[#1C1615]"
                />
                <span>
                  Proposer également l’option « Virement bancaire » en complément du règlement en
                  espèces
                </span>
              </label>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => updateSettings(settingsDraft)}
                  className="btn-atelier-dark"
                >
                  <Save className="w-4 h-4 text-[#E2C0BC]" strokeWidth={1.6} />
                  <span>Enregistrer les paramètres</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
              <div className="bg-[#FCFAF8] border border-[#E6DDD6] p-7 space-y-4">
                <h3 className="font-serif text-2xl text-[#1C1615]">Sécurité Propriétaire</h3>
                <p className="text-xs font-light text-[#6E5F5C] leading-relaxed">
                  Personnalisez le mot de passe d’accès à votre Espace Vendeur.
                </p>
                <input
                  type="password"
                  value={newAdminPass}
                  onChange={(e) => setNewAdminPass(e.target.value)}
                  placeholder="Nouveau mot de passe..."
                  className="input-atelier"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newAdminPass.trim().length < 4) {
                      showToast('Choisissez au moins 4 caractères.', 'error');
                      return;
                    }
                    changeAdminPassword(newAdminPass.trim());
                    setNewAdminPass('');
                  }}
                  className="btn-atelier-dark w-full"
                >
                  Mettre à jour le mot de passe
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
