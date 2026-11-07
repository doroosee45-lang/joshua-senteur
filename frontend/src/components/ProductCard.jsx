import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, MessageCircle, ArrowUpRight } from 'lucide-react';
import { formatPriceDT } from '../utils/whatsapp';
import { useBoutique } from '../context/BoutiqueContext';
import { LuxuryImage } from './Motion';

export default function ProductCard({ product, variant = 'light' }) {
  const { addToCart, setDirectWaProduct } = useBoutique();

  const mainPhoto = product.photos?.[0] || '/images/p1.jpg';
  const hoverPhoto = product.photos?.[1] || mainPhoto;
  const isOut = !product.available || Number(product.stock) <= 0;
  const isLowStock = !isOut && Number(product.stock) <= 3;

  const isDark = variant === 'dark';

  return (
    <article
      className={`group flex flex-col transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isDark
          ? 'bg-[#231B19] border border-white/[0.08] hover:border-[#E2C0BC]/45'
          : 'bg-[#FCFAF8] border border-[#E6DDD6] hover:border-[#9E6B6B]/55 hover:shadow-[0_18px_42px_-18px_rgba(28,22,21,0.14)]'
      }`}
    >
      {/* Modern Square Architectural Studio Frame */}
      <Link
        to={`/parfum/${product.id}`}
        className="relative aspect-square w-full overflow-hidden block"
      >
        <LuxuryImage
          src={mainPhoto}
          hoverSrc={hoverPhoto}
          alt={product.name}
          darkPlaceholder={isDark}
          className="w-full h-full"
        />

        {/* Minimalist Editorial Badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-start justify-between gap-2 pointer-events-none z-10">
          <div className="flex flex-col gap-1.5">
            <span className="px-2.5 py-1 bg-[#1C1615]/80 backdrop-blur-md text-[#FAF7F4] text-[9px] uppercase tracking-[0.26em] font-medium">
              {product.category}
            </span>
            {product.isNew && !isOut && (
              <span className="px-2.5 py-0.5 bg-[#E2C0BC]/95 text-[#1C1615] text-[8.5px] font-semibold uppercase tracking-[0.24em] w-fit">
                Nouveau
              </span>
            )}
          </div>

          {isOut ? (
            <span className="px-2.5 py-1 bg-[#3A2424]/90 backdrop-blur-sm text-[#E2C0BC] text-[9px] uppercase tracking-[0.22em]">
              Épuisé
            </span>
          ) : isLowStock ? (
            <span className="px-2.5 py-1 bg-[#2C2423]/85 backdrop-blur-sm text-[#D4B8AE] text-[9px] uppercase tracking-[0.2em]">
              Édition limitée ({product.stock})
            </span>
          ) : null}
        </div>

        {/* Subtle Editorial Discover Pill on Hover */}
        <div className="absolute right-3.5 bottom-3.5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hidden sm:flex pointer-events-none z-10">
          <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#1C1615]/85 backdrop-blur-md text-[#FAF7F4] text-[9.5px] uppercase tracking-[0.22em]">
            Découvrir
            <ArrowUpRight className="w-3 h-3 text-[#E2C0BC]" />
          </span>
        </div>
      </Link>

      {/* Harmonized Typography & Controls */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 text-[9.5px] uppercase tracking-[0.24em]">
            <span className={isDark ? 'text-[#D4B8AE]' : 'text-[#8A5A5A]'}>
              {product.subtitle || 'Eau de Parfum'}
            </span>
            {product.volume && (
              <span className={isDark ? 'text-[#FAF7F4]/45' : 'text-[#7A6B67]'}>
                {product.volume}
              </span>
            )}
          </div>

          <Link to={`/parfum/${product.id}`} className="block mt-2">
            <h3
              className={`font-serif text-[22px] sm:text-2xl font-normal leading-snug transition-colors duration-300 ${
                isDark
                  ? 'text-[#FAF7F4] group-hover:text-[#E2C0BC]'
                  : 'text-[#1C1615] group-hover:text-[#8A5A5A]'
              }`}
            >
              {product.name}
            </h3>
          </Link>

          {product.notes && (
            <p
              className={`text-[11.5px] font-light mt-1.5 line-clamp-1 leading-relaxed ${
                isDark ? 'text-[#FAF7F4]/55' : 'text-[#6E5F5C]'
              }`}
            >
              {product.notes}
            </p>
          )}
        </div>

        <div className="mt-5 pt-4 border-t border-[#E6DDD6]/70">
          {/* Price & Availability */}
          <div className="flex items-baseline justify-between mb-3.5">
            <span
              className={`font-serif text-2xl font-medium tracking-tight ${
                isDark ? 'text-[#E2C0BC]' : 'text-[#1C1615]'
              }`}
            >
              {formatPriceDT(product.price)}
            </span>
            <span
              className={`text-[9.5px] uppercase tracking-[0.2em] font-medium ${
                isOut
                  ? 'text-[#9E6B6B]'
                  : isDark
                  ? 'text-[#D4B8AE]'
                  : 'text-[#6B8070]'
              }`}
            >
              {isOut ? 'Indisponible' : `En stock · ${product.stock}`}
            </span>
          </div>

          {/* Harmonized Action Duo */}
          <div className="grid grid-cols-[1fr_auto] gap-2">
            <button
              type="button"
              disabled={isOut}
              onClick={() => addToCart(product, 1, true)}
              className={`h-[40px] px-3.5 text-[9.5px] uppercase tracking-[0.22em] font-medium flex items-center justify-center gap-2 transition-all duration-400 ${
                isOut
                  ? 'bg-[#EAE4E1] text-[#9A8C88] cursor-not-allowed'
                  : isDark
                  ? 'bg-[#FAF7F4] text-[#1C1615] hover:bg-[#E2C0BC]'
                  : 'bg-[#1C1615] text-[#FAF7F4] hover:bg-[#8A5A5A]'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 shrink-0" strokeWidth={1.6} />
              <span>Ajouter</span>
            </button>

            <button
              type="button"
              disabled={isOut}
              onClick={() => setDirectWaProduct({ product, quantity: 1 })}
              title="Commande directe par WhatsApp (Règlement en espèces)"
              className={`h-[40px] px-3.5 border flex items-center justify-center gap-1.5 text-[9.5px] uppercase tracking-[0.2em] font-medium transition-all duration-400 ${
                isOut
                  ? 'border-[#E6DDD6] text-[#B8ABA7] cursor-not-allowed'
                  : isDark
                  ? 'border-[#D4B8AE]/40 text-[#E2C0BC] hover:bg-[#E2C0BC] hover:text-[#1C1615]'
                  : 'border-[#D4B8AE] text-[#3A302E] bg-[#F4EDE7]/60 hover:bg-[#231B19] hover:border-[#231B19] hover:text-[#E2C0BC]'
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5 shrink-0 text-[#7A9A82]" strokeWidth={1.7} />
              <span className="hidden xl:inline">WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
