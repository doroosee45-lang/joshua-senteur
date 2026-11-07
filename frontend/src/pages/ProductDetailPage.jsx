import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ShoppingBag,
  MessageCircle,
  Share2,
  ChevronLeft,
  Plus,
  Minus,
  Banknote,
  MapPin,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useBoutique } from '../context/BoutiqueContext';
import { formatPriceDT } from '../utils/whatsapp';
import ProductCard from '../components/ProductCard';
import { Reveal, LuxuryImage } from '../components/Motion';

export default function ProductDetailPage() {
  const { id } = useParams();
  return <ProductDetailContent key={id} id={id} />;
}

function ProductDetailContent({ id }) {
  const {
    publicProducts,
    addToCart,
    setDirectWaProduct,
    setShareModalPayload,
    settings,
  } = useBoutique();

  const product = publicProducts.find((p) => p.id === id);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FAF7F4] text-[#1C1615] pt-36 px-4 text-center animate-page-enter">
        <h1 className="font-serif text-4xl">Création introuvable</h1>
        <p className="text-xs font-light text-[#6E5F5C] mt-3">
          Ce flacon n’est plus disponible ou a été déplacé dans notre collection.
        </p>
        <Link to="/catalogue" className="mt-7 btn-atelier-dark">
          Retourner à la collection
        </Link>
      </div>
    );
  }

  const photos = product.photos?.length > 0 ? product.photos : ['/images/p1.jpg'];
  const activePhoto = photos[selectedImageIdx] || photos[0];
  const isOut = !product.available || Number(product.stock) <= 0;
  const maxStock = Math.max(1, Number(product.stock) || 1);

  const related = publicProducts
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-[#FAF7F4] text-[#1C1615] pt-[74px] sm:pt-[82px] animate-page-enter">
      {/* Harmonized Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-7 pb-5 flex items-center justify-between text-[10px] uppercase tracking-[0.24em] text-[#6E5F5C]">
        <Link
          to="/catalogue"
          className="inline-flex items-center gap-1.5 hover:text-[#1C1615] transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" strokeWidth={1.6} />
          Retour à la collection
        </Link>
        <span className="hidden sm:inline text-[#8A5A5A]">
          {product.category} · {product.name}
        </span>
      </div>

      {/* Main Product Presentation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left: Modern Square Studio Gallery */}
          <Reveal variant="scale" className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square bg-[#EFE8E1] border border-[#E6DDD6] overflow-hidden group">
              <LuxuryImage
                key={activePhoto}
                src={activePhoto}
                alt={product.name}
                className="w-full h-full"
              />
              {product.isNew && !isOut && (
                <span className="absolute top-4 left-4 z-10 px-3 py-1 bg-[#E2C0BC]/95 text-[#1C1615] text-[9.5px] font-semibold uppercase tracking-[0.24em]">
                  Nouveauté
                </span>
              )}
            </div>

            {/* Harmonized Thumbnails */}
            {photos.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {photos.map((src, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIdx(idx)}
                    className={`w-20 h-20 shrink-0 overflow-hidden border transition-all duration-300 ${
                      idx === selectedImageIdx
                        ? 'border-[#1C1615] opacity-100 scale-100'
                        : 'border-[#E6DDD6] opacity-60 hover:opacity-95'
                    }`}
                  >
                    <img
                      src={src}
                      alt={`${product.name} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </Reveal>

          {/* Right: Editorial Details & Order Controls */}
          <Reveal delay={120} className="lg:col-span-6 lg:sticky lg:top-28 space-y-6">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-[#231B19] text-[#E2C0BC] text-[9.5px] uppercase tracking-[0.26em] font-medium">
                  {product.category}
                </span>
                {product.volume && (
                  <span className="px-3 py-1 border border-[#DED4CC] bg-[#FCFAF8] text-[#6E5F5C] text-[9.5px] uppercase tracking-[0.22em]">
                    {product.volume}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() =>
                  setShareModalPayload({
                    url: window.location.href,
                    title: `${product.name} (${formatPriceDT(product.price)}) — ${settings.boutiqueName}`,
                  })
                }
                className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.22em] text-[#6E5F5C] hover:text-[#1C1615] transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" strokeWidth={1.6} />
                Partager
              </button>
            </div>

            <div>
              <p className="text-[10.5px] uppercase tracking-[0.26em] text-[#8A5A5A] font-medium">
                {product.subtitle || 'Eau de Parfum'}
              </p>
              <h1 className="font-serif text-4xl sm:text-5xl text-[#1C1615] mt-1.5 leading-[1.08]">
                {product.name}
              </h1>
            </div>

            {/* Price & Availability */}
            <div className="flex flex-wrap items-baseline justify-between gap-4 pb-6 border-b border-[#E6DDD6]">
              <div>
                <span className="font-serif text-4xl font-medium text-[#1C1615]">
                  {formatPriceDT(product.price)}
                </span>
                <span className="block text-[11px] font-light text-[#6E5F5C] mt-1">
                  Tarif fixé par la Maison · Règlement en espèces à la livraison
                </span>
              </div>

              <div>
                {isOut ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F4EDE7] border border-[#D4B8AE] text-[#8A5A5A] text-[10.5px] uppercase tracking-[0.18em]">
                    Momentanément épuisé
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#F4EDE7] border border-[#DED4CC] text-[#546E5A] text-[10.5px] uppercase tracking-[0.18em] font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={1.7} />
                    En stock ({product.stock})
                  </span>
                )}
              </div>
            </div>

            {/* Olfactory Notes */}
            {product.notes && (
              <div className="p-5 bg-[#F4EDE7] border border-[#E6DDD6]">
                <p className="text-[9.5px] uppercase tracking-[0.26em] text-[#8A5A5A] flex items-center gap-2 font-medium">
                  <Sparkles className="w-3.5 h-3.5" strokeWidth={1.6} />
                  Architecture Olfactive
                </p>
                <p className="font-serif text-xl text-[#1C1615] mt-1.5">{product.notes}</p>
              </div>
            )}

            {/* Description */}
            <div>
              <h3 className="text-[10px] uppercase tracking-[0.26em] text-[#6E5F5C] mb-2">
                L’Inspiration
              </h3>
              <p className="text-[13.5px] font-light text-[#3A302E] leading-[1.85] whitespace-pre-line">
                {product.description || 'Une création raffinée signée JOSHUA PARFUM.'}
              </p>
            </div>

            {/* Quantity & Harmonized CTAs */}
            {!isOut && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] uppercase tracking-[0.24em] text-[#6E5F5C]">
                    Quantité
                  </span>
                  <div className="inline-flex items-center border border-[#DED4CC] bg-[#FCFAF8]">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="p-2.5 text-[#1C1615] hover:bg-[#F4EDE7] transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-5 text-xs font-medium">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(maxStock, q + 1))}
                      disabled={quantity >= maxStock}
                      className="p-2.5 text-[#1C1615] hover:bg-[#F4EDE7] disabled:opacity-30 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => addToCart(product, quantity, true)}
                    className="btn-atelier-dark w-full"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#E2C0BC]" strokeWidth={1.6} />
                    <span>Ajouter au panier</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDirectWaProduct({ product, quantity })}
                    className="btn-atelier-outline-dark w-full !bg-[#FCFAF8] hover:!bg-[#231B19] hover:!border-[#231B19] hover:!text-[#E2C0BC]"
                  >
                    <MessageCircle className="w-4 h-4 text-[#7A9A82]" strokeWidth={1.7} />
                    <span>Commande WhatsApp</span>
                  </button>
                </div>
              </div>
            )}

            {/* Reassurance Card */}
            <div className="p-5 bg-[#FCFAF8] border border-[#E6DDD6] space-y-3.5 text-xs font-light text-[#5C4F4C]">
              <div className="flex items-start gap-3">
                <Banknote className="w-4 h-4 text-[#8A5A5A] shrink-0 mt-0.5" strokeWidth={1.6} />
                <div>
                  <strong className="text-[#1C1615] font-medium block text-[11px] uppercase tracking-[0.16em]">
                    Règlement en espèces à la réception
                  </strong>
                  <span className="mt-0.5 block leading-relaxed">
                    Aucun paiement anticipé requis. Vous réglez en Dinars Tunisiens à la livraison.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-[#F4EDE7]">
                <MapPin className="w-4 h-4 text-[#8A5A5A] shrink-0 mt-0.5" strokeWidth={1.6} />
                <div>
                  <strong className="text-[#1C1615] font-medium block text-[11px] uppercase tracking-[0.16em]">
                    Livraison Jendouba & régions voisines
                  </strong>
                  <span className="mt-0.5 block leading-relaxed">
                    Jendouba Centre, Bou Salem, Tabarka, Aïn Draham, Ghardimaou, Fernana et
                    alentours · {settings.whatsappNumber}.
                  </span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Related Fragrances */}
        {related.length > 0 && (
          <div className="mt-24 pt-16 border-t border-[#E6DDD6]">
            <Reveal className="mb-10">
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#8A5A5A]">
                Dans le même esprit
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#1C1615] mt-1">
                Autres créations <em className="italic font-light text-[#8A5A5A]">{product.category}</em>
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7">
              {related.map((item, idx) => (
                <Reveal key={item.id} delay={idx * 90}>
                  <ProductCard key={item.id} product={item} variant="light" />
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
