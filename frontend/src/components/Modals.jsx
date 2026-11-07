import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Search,
  MessageCircle,
  Copy,
  Check,
  Share2,
  Banknote,
  MapPin,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { useBoutique } from '../context/BoutiqueContext';
import {
  buildOrderWhatsAppUrl,
  buildQuickProductWhatsAppUrl,
  formatPriceDT,
  getSocialShareLinks,
  sanitizePhoneForWhatsApp,
} from '../utils/whatsapp';

export function SearchModal() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { isSearchOpen, setIsSearchOpen, publicProducts } = useBoutique();

  if (!isSearchOpen) return null;

  const q = query.trim().toLowerCase();
  const results = q
    ? publicProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.notes || '').toLowerCase().includes(q) ||
          (p.description || '').toLowerCase().includes(q)
      )
    : publicProducts.slice(0, 4);

  return (
    <div className="fixed inset-0 z-[95] flex items-start justify-center pt-16 sm:pt-24 px-4">
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-md animate-backdrop"
        onClick={() => setIsSearchOpen(false)}
      />
      <div className="relative z-10 w-full max-w-2xl bg-[#231B19] border border-[#E2C0BC]/25 text-[#FAF7F4] shadow-2xl overflow-hidden animate-modal-up">
        <div className="p-5 border-b border-white/10 flex items-center gap-3.5">
          <Search className="w-5 h-5 text-[#E2C0BC] shrink-0" strokeWidth={1.5} />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un parfum, une note (oud, rose, jasmin), pour elle, pour lui..."
            className="w-full bg-transparent text-sm text-[#FAF7F4] placeholder:text-white/35 focus:outline-none font-light"
          />
          <button
            type="button"
            onClick={() => setIsSearchOpen(false)}
            className="p-1.5 text-white/60 hover:text-[#E2C0BC] transition-colors"
          >
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        <div className="p-6 max-h-[65vh] overflow-y-auto">
          <p className="text-[10px] uppercase tracking-[0.28em] text-[#D4B8AE] mb-4">
            {q ? `Créations trouvées (${results.length})` : 'Signatures de la Maison'}
          </p>

          {results.length === 0 ? (
            <p className="text-xs font-light text-white/60 py-8 text-center">
              Aucune création ne correspond à « {query} ».
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {results.map((prod) => (
                <button
                  key={prod.id}
                  type="button"
                  onClick={() => {
                    setIsSearchOpen(false);
                    setQuery('');
                    navigate(`/parfum/${prod.id}`);
                  }}
                  className="flex items-center gap-3.5 p-3 bg-white/[0.03] border border-white/[0.08] hover:border-[#E2C0BC]/50 text-left transition-all duration-300"
                >
                  <img
                    src={prod.photos?.[0] || '/images/p1.jpg'}
                    alt={prod.name}
                    className="w-14 h-14 object-cover shrink-0 bg-[#1C1615]"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-[9px] uppercase tracking-[0.24em] text-[#E2C0BC]">
                      {prod.category}
                    </span>
                    <p className="font-serif text-lg text-[#FAF7F4] truncate">{prod.name}</p>
                    <p className="text-xs text-[#D4B8AE] font-light">
                      {formatPriceDT(prod.price)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ShareModal() {
  const [copied, setCopied] = useState(false);
  const { shareModalPayload, setShareModalPayload, showToast } = useBoutique();

  if (!shareModalPayload) return null;

  const links = getSocialShareLinks(shareModalPayload.url, shareModalPayload.title);

  const handleCopy = async (textToCopy, toastText = 'Lien copié avec succès.') => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      showToast(toastText);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      showToast('Copiez le lien affiché ci-dessous.');
    }
  };

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm animate-backdrop"
        onClick={() => setShareModalPayload(null)}
      />
      <div className="relative z-10 w-full max-w-md bg-[#231B19] border border-[#E2C0BC]/30 text-[#FAF7F4] p-7 sm:p-8 shadow-2xl animate-modal-up">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#E2C0BC]">
              Partager l’adresse
            </p>
            <h3 className="font-serif text-3xl mt-1">Joshua Parfum</h3>
          </div>
          <button
            type="button"
            onClick={() => setShareModalPayload(null)}
            className="p-1 text-white/60 hover:text-[#E2C0BC] transition-colors"
          >
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        <p className="text-xs font-light text-white/70 leading-[1.75] mb-6">
          Invitez vos proches à découvrir la collection sur <strong>WhatsApp</strong>,{' '}
          <strong>Facebook</strong> ou <strong>TikTok</strong> :
        </p>

        <div className="space-y-2.5">
          <a
            href={links.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 bg-white/[0.04] border border-[#7A9A82]/45 text-[#FAF7F4] text-[10.5px] uppercase tracking-[0.22em] flex items-center justify-between hover:bg-[#7A9A82]/20 transition-colors"
          >
            <span className="flex items-center gap-2.5">
              <MessageCircle className="w-4 h-4 text-[#7A9A82]" strokeWidth={1.6} />
              Partager sur WhatsApp
            </span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
          </a>

          <a
            href={links.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 bg-white/[0.04] border border-white/15 text-[#FAF7F4] text-[10.5px] uppercase tracking-[0.22em] flex items-center justify-between hover:border-[#E2C0BC] transition-colors"
          >
            <span className="flex items-center gap-2.5">
              <Share2 className="w-4 h-4 text-[#D4B8AE]" strokeWidth={1.6} />
              Partager sur Facebook
            </span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
          </a>

          <button
            type="button"
            onClick={() =>
              handleCopy(
                links.tiktokText,
                'Présentation & lien copiés pour TikTok (Bio ou Story).'
              )
            }
            className="w-full py-3.5 px-4 bg-white/[0.04] border border-white/15 text-[#FAF7F4] text-[10.5px] uppercase tracking-[0.22em] flex items-center justify-between hover:border-[#E2C0BC] transition-colors"
          >
            <span className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-[#E2C0BC]" strokeWidth={1.6} />
              Copier pour TikTok (Bio · Story)
            </span>
            <Copy className="w-3.5 h-3.5 opacity-60" />
          </button>
        </div>

        {/* Direct Link Copy Box */}
        <div className="mt-6 pt-5 border-t border-white/10">
          <label className="block text-[9.5px] uppercase tracking-[0.26em] text-[#D4B8AE] mb-2">
            Lien public de la boutique
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={links.rawUrl}
              className="flex-1 bg-[#1C1615] border border-white/15 px-3.5 py-2.5 text-xs text-white/80 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => handleCopy(links.rawUrl)}
              className="px-4 py-2.5 bg-[#E2C0BC] text-[#1C1615] text-[10px] uppercase tracking-[0.2em] font-medium flex items-center gap-1.5 hover:bg-[#FAF7F4] transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copié' : 'Copier'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Harmonized Direct WhatsApp Express Order Modal
 */
export function DirectWhatsAppModal() {
  const navigate = useNavigate();
  const { directWaProduct, setDirectWaProduct, settings, computeDeliveryFee, createOrder } =
    useBoutique();

  const zones = settings.deliveryZones || [];
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [cityId, setCityId] = useState(zones[0]?.id || 'jendouba-centre');
  const [address, setAddress] = useState('');
  const [quantity, setQuantity] = useState(directWaProduct?.quantity || 1);
  const [error, setError] = useState('');

  if (!directWaProduct?.product) return null;

  const { product } = directWaProduct;
  const maxQty = Math.max(1, Number(product.stock) || 1);
  const activeQty = Math.min(maxQty, Math.max(1, quantity));
  const subtotal = (Number(product.price) || 0) * activeQty;
  const deliveryFee = computeDeliveryFee(cityId, subtotal);
  const total = subtotal + deliveryFee;
  const selectedZone = zones.find((z) => z.id === cityId) || { name: 'Jendouba' };

  const handleExpressOrder = async (e) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !address.trim()) {
      setError('Veuillez indiquer votre nom, téléphone et adresse de livraison.');
      return;
    }
    setError('');

    const created = await createOrder({
      customer: {
        fullName: fullName.trim(),
        phone: phone.trim(),
        cityId,
        cityName: selectedZone.name,
        neighborhood: '',
        address: address.trim(),
        instructions: 'Commande directe express via WhatsApp',
      },
      items: [
        {
          productId: product.id,
          name: product.name,
          category: product.category,
          volume: product.volume,
          price: Number(product.price) || 0,
          quantity: activeQty,
          photo: product.photos?.[0] || '/images/p1.jpg',
        },
      ],
      paymentMethod: 'Espèces à la livraison',
      channel: 'Commande directe WhatsApp',
    });

    const waUrl = buildOrderWhatsAppUrl(created, settings.whatsappNumber, settings.boutiqueName);
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    setDirectWaProduct(null);
    navigate(`/confirmation/${created.reference}`);
  };

  const quickChatUrl = buildQuickProductWhatsAppUrl(product, activeQty, settings.whatsappNumber);

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center p-4 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm animate-backdrop"
        onClick={() => setDirectWaProduct(null)}
      />
      <div className="relative z-10 w-full max-w-lg bg-[#FAF7F4] text-[#1C1615] border border-[#D4B8AE] shadow-2xl overflow-hidden my-8 animate-modal-up">
        {/* Top Espresso Header */}
        <div className="px-6 py-4 bg-[#231B19] text-[#FAF7F4] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <MessageCircle className="w-4 h-4 text-[#E2C0BC]" strokeWidth={1.6} />
            <span className="text-[10.5px] uppercase tracking-[0.26em] font-medium">
              Commande Directe WhatsApp
            </span>
          </div>
          <button
            type="button"
            onClick={() => setDirectWaProduct(null)}
            className="p-1 text-white/70 hover:text-[#E2C0BC] transition-colors"
          >
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        <form onSubmit={handleExpressOrder} className="p-6 sm:p-7 space-y-4">
          {/* Selected Perfume Summary */}
          <div className="flex items-center gap-4 p-3.5 bg-[#F4EDE7] border border-[#E6DDD6]">
            <img
              src={product.photos?.[0] || '/images/p1.jpg'}
              alt={product.name}
              className="w-16 h-16 object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[9.5px] uppercase tracking-[0.22em] text-[#8A5A5A]">
                {product.category} · {product.volume}
              </span>
              <h4 className="font-serif text-xl text-[#1C1615] truncate">{product.name}</h4>
              <p className="text-xs font-medium text-[#5C4F4C]">
                {formatPriceDT(product.price)} / flacon
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <label className="text-[9.5px] uppercase tracking-[0.2em] text-[#6E5F5C]">Qté</label>
              <select
                value={activeQty}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="border border-[#DED4CC] bg-[#FCFAF8] px-2.5 py-1.5 text-xs font-medium focus:outline-none"
              >
                {Array.from({ length: Math.min(10, maxQty) }, (_, idx) => idx + 1).map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-[#F4EDE7] border border-[#9E6B6B] text-xs text-[#8A5A5A]">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="label-atelier">Nom complet *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Votre nom et prénom"
                className="input-atelier !py-2.5"
              />
            </div>

            <div>
              <label className="label-atelier">Téléphone *</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ex: 56 123 456"
                className="input-atelier !py-2.5"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="label-atelier">Commune *</label>
              <select
                value={cityId}
                onChange={(e) => setCityId(e.target.value)}
                className="input-atelier !py-2.5"
              >
                {zones.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.name} ({z.fee} DT)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label-atelier">Adresse / Quartier *</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Rue, quartier ou repère"
                className="input-atelier !py-2.5"
              />
            </div>
          </div>

          {/* Price & Cash on Delivery Summary */}
          <div className="p-4 bg-[#F4EDE7] border border-[#E6DDD6] space-y-1.5 text-xs">
            <div className="flex justify-between text-[#6E5F5C] font-light">
              <span>Sous-total flacon</span>
              <span>{formatPriceDT(subtotal)}</span>
            </div>
            <div className="flex justify-between text-[#6E5F5C] font-light">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#8A5A5A]" strokeWidth={1.6} />
                Livraison ({selectedZone.name})
              </span>
              <span>{deliveryFee === 0 ? 'Offerte' : formatPriceDT(deliveryFee)}</span>
            </div>
            <div className="flex justify-between items-baseline pt-2.5 border-t border-[#DED4CC] font-medium text-[#1C1615]">
              <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em]">
                <Banknote className="w-4 h-4 text-[#6B8070]" strokeWidth={1.6} />
                Espèces à la réception
              </span>
              <span className="font-serif text-2xl">{formatPriceDT(total)}</span>
            </div>
          </div>

          <button type="submit" className="btn-atelier-dark w-full">
            <MessageCircle className="w-4 h-4 text-[#E2C0BC]" strokeWidth={1.6} />
            <span>Valider & envoyer sur WhatsApp</span>
          </button>

          <div className="text-center pt-0.5">
            <a
              href={quickChatUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-light text-[#6E5F5C] underline hover:text-[#1C1615] transition-colors"
            >
              Ou échanger directement sur WhatsApp ({settings.whatsappNumber})
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export function ToastBanner() {
  const { toast } = useBoutique();
  if (!toast) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] px-6 py-3.5 bg-[#231B19] border border-[#E2C0BC]/45 text-[#FAF7F4] shadow-2xl flex items-center gap-3 text-xs font-light tracking-wide animate-modal-up max-w-[92vw]">
      <span
        className={`w-2 h-2 rounded-full shrink-0 ${
          toast.type === 'error' ? 'bg-[#9E6B6B]' : 'bg-[#E2C0BC]'
        }`}
      />
      <span>{toast.message}</span>
    </div>
  );
}

export function FloatingWhatsAppButton() {
  const { settings } = useBoutique();
  const waDigits = sanitizePhoneForWhatsApp(settings.whatsappNumber);
  const message = encodeURIComponent(
    `Bonjour ${settings.boutiqueName} ✨ Je souhaite être conseillé ou passer une commande.`
  );

  return (
    <a
      href={`https://wa.me/${waDigits}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp Direct"
      title={`Commande directe WhatsApp : ${settings.whatsappNumber}`}
      className="fixed bottom-5 right-5 z-40 group flex items-center gap-2.5 bg-[#231B19]/95 backdrop-blur-md hover:bg-[#1C1615] text-[#FAF7F4] border border-[#E2C0BC]/40 hover:border-[#E2C0BC] px-4 py-3 shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5"
    >
      <MessageCircle
        className="w-4 h-4 text-[#E2C0BC] group-hover:scale-110 transition-transform duration-300"
        strokeWidth={1.6}
      />
      <span className="hidden sm:inline text-[10px] uppercase tracking-[0.24em] font-medium text-[#FAF7F4]">
        WhatsApp Direct
      </span>
    </a>
  );
}
