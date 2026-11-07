import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Banknote, MessageCircle } from 'lucide-react';
import { useBoutique } from '../context/BoutiqueContext';
import { formatPriceDT } from '../utils/whatsapp';

export default function CartDrawer() {
  const navigate = useNavigate();
  const {
    isCartOpen,
    setIsCartOpen,
    detailedCartItems,
    cartSubtotal,
    updateCartQuantity,
    removeFromCart,
    settings,
  } = useBoutique();

  if (!isCartOpen) return null;

  const freeThreshold = Number(settings.freeDeliveryThreshold) || 0;
  const remainingForFree =
    settings.freeDeliveryEnabled && freeThreshold > 0
      ? Math.max(0, freeThreshold - cartSubtotal)
      : null;

  return (
    <div className="fixed inset-0 z-[90] flex justify-end">
      {/* Smooth Backdrop */}
      <div
        className="fixed inset-0 bg-black/65 backdrop-blur-sm animate-backdrop"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Harmonized Alabaster Drawer */}
      <div className="relative z-10 w-full max-w-md bg-[#FAF7F4] text-[#1C1615] h-full flex flex-col shadow-2xl animate-drawer-right">
        {/* Header */}
        <div className="px-6 py-5 bg-[#231B19] text-[#FAF7F4] flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-4 h-4 text-[#E2C0BC]" strokeWidth={1.6} />
            <h2 className="text-[10.5px] uppercase tracking-[0.28em] font-medium">
              Votre Sélection ({detailedCartItems.length})
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 text-[#FAF7F4]/70 hover:text-[#E2C0BC] transition-colors"
            aria-label="Fermer le panier"
          >
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Free Delivery Progress */}
        {remainingForFree !== null && detailedCartItems.length > 0 && (
          <div className="px-6 py-3 bg-[#F4EDE7] border-b border-[#E6DDD6] text-xs font-light text-[#3A302E]">
            {remainingForFree === 0 ? (
              <p className="font-medium text-[#546E5A]">
                ✦ Vous bénéficiez de la livraison offerte à Jendouba et communes voisines.
              </p>
            ) : (
              <p>
                Ajoutez <strong className="font-medium text-[#8A5A5A]">{formatPriceDT(remainingForFree)}</strong>{' '}
                pour bénéficier de la livraison offerte.
              </p>
            )}
          </div>
        )}

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {detailedCartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 rounded-full bg-[#F4EDE7] border border-[#E6DDD6] flex items-center justify-center text-[#8A5A5A] mb-5">
                <ShoppingBag className="w-6 h-6" strokeWidth={1.4} />
              </div>
              <p className="font-serif text-3xl text-[#1C1615]">Votre panier est vide</p>
              <p className="text-xs font-light text-[#6E5F5C] mt-2.5 max-w-xs leading-[1.8]">
                Découvrez nos sillages pour Elle, pour Lui et Mixtes, livrés avec règlement en
                espèces à la réception.
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/catalogue');
                }}
                className="mt-7 btn-atelier-dark"
              >
                Explorer la collection
              </button>
            </div>
          ) : (
            detailedCartItems.map((item) => (
              <div
                key={item.productId}
                className="flex gap-4 pb-5 border-b border-[#E6DDD6] last:border-b-0"
              >
                <Link
                  to={`/parfum/${item.productId}`}
                  onClick={() => setIsCartOpen(false)}
                  className="w-20 h-20 shrink-0 bg-[#EFE8E1] overflow-hidden border border-[#E6DDD6]"
                >
                  <img
                    src={item.photo}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </Link>

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        to={`/parfum/${item.productId}`}
                        onClick={() => setIsCartOpen(false)}
                        className="font-serif text-xl text-[#1C1615] hover:text-[#8A5A5A] leading-tight transition-colors"
                      >
                        {item.name}
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.productId)}
                        className="text-[#9A8C88] hover:text-[#8A5A5A] p-1 transition-colors"
                        title="Retirer"
                      >
                        <Trash2 className="w-3.5 h-3.5" strokeWidth={1.6} />
                      </button>
                    </div>
                    <p className="text-[9.5px] uppercase tracking-[0.22em] text-[#8A5A5A] mt-0.5">
                      {item.category} {item.volume ? `· ${item.volume}` : ''}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="inline-flex items-center border border-[#DED4CC] bg-[#FCFAF8]">
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                        className="p-1.5 text-[#1C1615] hover:bg-[#F4EDE7] transition-colors"
                        aria-label="Diminuer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3 text-xs font-medium">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className="p-1.5 text-[#1C1615] hover:bg-[#F4EDE7] disabled:opacity-30 transition-colors"
                        aria-label="Augmenter"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="font-serif text-xl font-medium text-[#1C1615]">
                      {formatPriceDT(item.lineTotal)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout CTA */}
        {detailedCartItems.length > 0 && (
          <div className="p-6 bg-[#F4EDE7] border-t border-[#E6DDD6] space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-light text-[#6E5F5C]">
                <span>Livraison (Jendouba & communes)</span>
                <span>Selon commune choisie</span>
              </div>
              <div className="flex items-baseline justify-between pt-1">
                <span className="text-[10.5px] uppercase tracking-[0.24em] font-medium text-[#1C1615]">
                  Sous-total
                </span>
                <span className="font-serif text-2xl font-medium text-[#1C1615]">
                  {formatPriceDT(cartSubtotal)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 text-[11px] font-light text-[#5C4F4C] bg-[#FCFAF8] px-3.5 py-2.5 border border-[#E6DDD6]">
              <Banknote className="w-4 h-4 text-[#8A5A5A] shrink-0" strokeWidth={1.6} />
              <span>Règlement en espèces à la livraison · Suivi direct WhatsApp</span>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsCartOpen(false);
                navigate('/commande');
              }}
              className="btn-atelier-dark w-full"
            >
              <MessageCircle className="w-4 h-4 text-[#E2C0BC]" strokeWidth={1.6} />
              <span>Finaliser la commande</span>
              <ArrowRight className="w-4 h-4" strokeWidth={1.6} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
