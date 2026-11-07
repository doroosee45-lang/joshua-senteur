import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Banknote,
  Building2,
  MessageCircle,
  MapPin,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { useBoutique } from '../context/BoutiqueContext';
import { buildOrderWhatsAppUrl, formatPriceDT } from '../utils/whatsapp';
import { Reveal } from '../components/Motion';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const {
    detailedCartItems,
    cartSubtotal,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    settings,
    computeDeliveryFee,
    createOrder,
  } = useBoutique();

  const zones = settings.deliveryZones || [];
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [cityId, setCityId] = useState(zones[0]?.id || 'jendouba-centre');
  const [neighborhood, setNeighborhood] = useState('');
  const [address, setAddress] = useState('');
  const [instructions, setInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Espèces à la livraison');
  const [sendViaWhatsApp, setSendViaWhatsApp] = useState(true);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const selectedZone = zones.find((z) => z.id === cityId) || {
    id: 'jendouba-centre',
    name: 'Jendouba',
    fee: 5,
    delay: 'Sous 24h',
  };

  const deliveryFee =
    detailedCartItems.length > 0 ? computeDeliveryFee(cityId, cartSubtotal) : 0;
  const orderTotal = cartSubtotal + deliveryFee;

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (detailedCartItems.length === 0) return;

    if (!fullName.trim() || fullName.trim().length < 2) {
      setFormError('Veuillez indiquer votre nom complet.');
      return;
    }
    const digits = phone.replace(/[^\d]/g, '');
    if (digits.length < 8) {
      setFormError('Veuillez saisir un numéro de téléphone valide (au moins 8 chiffres).');
      return;
    }
    if (!address.trim()) {
      setFormError('Veuillez renseigner votre adresse précise de livraison.');
      return;
    }

    setFormError('');
    setSubmitting(true);

    try {
      const createdOrder = await createOrder({
        customer: {
          fullName: fullName.trim(),
          phone: phone.trim(),
          cityId,
          cityName: selectedZone.name,
          neighborhood: neighborhood.trim(),
          address: address.trim(),
          instructions: instructions.trim(),
        },
        items: detailedCartItems,
        paymentMethod,
        channel: sendViaWhatsApp ? 'Commande directe WhatsApp' : 'Boutique en ligne',
      });

      clearCart();

      if (sendViaWhatsApp) {
        const waUrl = buildOrderWhatsAppUrl(
          createdOrder,
          settings.whatsappNumber,
          settings.boutiqueName
        );
        window.open(waUrl, '_blank', 'noopener,noreferrer');
      }

      navigate(`/confirmation/${createdOrder.reference}`);
    } catch {
      setFormError('Une erreur est survenue lors de l’enregistrement. Veuillez réessayer.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F4] text-[#1C1615] pt-[74px] sm:pt-[82px] animate-page-enter">
      {/* Harmonized Header */}
      <div className="bg-[#231B19] text-[#FAF7F4] py-14 sm:py-18 px-4 sm:px-8 border-b border-white/[0.08]">
        <Reveal className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-3 mb-2.5">
            <span className="w-6 h-[1px] bg-[#E2C0BC]/55" />
            <span className="text-[10px] uppercase tracking-[0.32em] text-[#E2C0BC] font-medium">
              PANIER & COMMANDE PRIVÉE
            </span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-normal">
            Finaliser votre <em className="italic font-light text-[#E2C0BC]">commande</em>
          </h1>
          <p className="text-xs sm:text-[13.5px] font-light text-[#FAF7F4]/70 mt-2.5">
            Règlement en espèces à la livraison · Validation directe sur WhatsApp (
            {settings.whatsappNumber})
          </p>
        </Reveal>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
        {detailedCartItems.length === 0 ? (
          <Reveal className="bg-[#FCFAF8] border border-[#E6DDD6] p-14 text-center max-w-xl mx-auto">
            <ShoppingBag className="w-9 h-9 text-[#8A5A5A] mx-auto mb-4" strokeWidth={1.4} />
            <h2 className="font-serif text-3xl text-[#1C1615]">Votre sélection est vide</h2>
            <p className="text-xs font-light text-[#6E5F5C] mt-2.5 leading-[1.8]">
              Explorez nos créations pour Elle, pour Lui et Mixtes afin de composer votre commande.
            </p>
            <Link to="/catalogue" className="mt-7 btn-atelier-dark">
              Découvrir la collection
            </Link>
          </Reveal>
        ) : (
          <form
            onSubmit={handleSubmitOrder}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start"
          >
            {/* Left Column: Customer Coordinates & Payment */}
            <div className="lg:col-span-7 space-y-8">
              {/* Step 01 */}
              <Reveal className="bg-[#FCFAF8] border border-[#E6DDD6] p-6 sm:p-9 space-y-5">
                <div className="border-b border-[#EFE8E1] pb-4">
                  <span className="text-[9.5px] uppercase tracking-[0.28em] text-[#8A5A5A] font-medium">
                    01 — Livraison
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl text-[#1C1615] mt-1">
                    Vos coordonnées & adresse
                  </h2>
                </div>

                {formError && (
                  <div className="p-3.5 bg-[#F4EDE7] border border-[#9E6B6B] text-[#8A5A5A] text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label-atelier">Nom et prénom *</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ex: Sarra Gharbi"
                      className="input-atelier"
                    />
                  </div>

                  <div>
                    <label className="label-atelier">Téléphone (WhatsApp / Appel) *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Ex: +216 56 123 456"
                      className="input-atelier"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label-atelier">Commune de livraison *</label>
                    <select
                      value={cityId}
                      onChange={(e) => setCityId(e.target.value)}
                      className="input-atelier"
                    >
                      {zones.map((z) => (
                        <option key={z.id} value={z.id}>
                          {z.name} — {z.fee} DT ({z.delay})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="label-atelier">Quartier / Localité</label>
                    <input
                      type="text"
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      placeholder="Ex: Centre-ville, Cité Ezzouhour..."
                      className="input-atelier"
                    />
                  </div>
                </div>

                <div>
                  <label className="label-atelier">Adresse précise *</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Rue, immeuble ou point de repère..."
                    className="input-atelier"
                  />
                </div>

                <div>
                  <label className="label-atelier">Instructions pour le livreur (facultatif)</label>
                  <textarea
                    rows={2}
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="Ex: Appeler avant d’arriver, horaire souhaité..."
                    className="input-atelier"
                  />
                </div>
              </Reveal>

              {/* Step 02 */}
              <Reveal delay={100} className="bg-[#FCFAF8] border border-[#E6DDD6] p-6 sm:p-9 space-y-5">
                <div className="border-b border-[#EFE8E1] pb-4">
                  <span className="text-[9.5px] uppercase tracking-[0.28em] text-[#8A5A5A] font-medium">
                    02 — Règlement & Confirmation
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl text-[#1C1615] mt-1">
                    Paiement en espèces & WhatsApp
                  </h2>
                </div>

                <div className="space-y-3">
                  <label
                    className={`flex items-start gap-3.5 p-4 border cursor-pointer transition-colors ${
                      paymentMethod === 'Espèces à la livraison'
                        ? 'border-[#1C1615] bg-[#F4EDE7]/70'
                        : 'border-[#E6DDD6] bg-[#FCFAF8]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'Espèces à la livraison'}
                      onChange={() => setPaymentMethod('Espèces à la livraison')}
                      className="mt-1 accent-[#1C1615]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 font-medium text-xs uppercase tracking-[0.18em] text-[#1C1615]">
                        <Banknote className="w-4 h-4 text-[#6B8070]" strokeWidth={1.6} />
                        <span>Règlement en espèces à la livraison</span>
                      </div>
                      <p className="text-xs font-light text-[#5C4F4C] mt-1.5 leading-[1.75]">
                        Réglez le montant total de <strong>{formatPriceDT(orderTotal)}</strong> en
                        Dinars Tunisiens lors de la réception de votre flacon.
                      </p>
                    </div>
                  </label>

                  {settings.enableBankTransfer && (
                    <label
                      className={`flex items-start gap-3.5 p-4 border cursor-pointer transition-colors ${
                        paymentMethod === 'Virement bancaire'
                          ? 'border-[#1C1615] bg-[#F4EDE7]/70'
                          : 'border-[#E6DDD6] bg-[#FCFAF8]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'Virement bancaire'}
                        onChange={() => setPaymentMethod('Virement bancaire')}
                        className="mt-1 accent-[#1C1615]"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 font-medium text-xs uppercase tracking-[0.18em] text-[#1C1615]">
                          <Building2 className="w-4 h-4 text-[#8A5A5A]" strokeWidth={1.6} />
                          <span>Virement bancaire (confirmé manuellement)</span>
                        </div>
                        <p className="text-xs font-light text-[#5C4F4C] mt-1.5 leading-[1.75]">
                          {settings.bankDetails ||
                            'Les coordonnées de virement vous seront communiquées sur WhatsApp.'}
                        </p>
                      </div>
                    </label>
                  )}
                </div>

                {/* Direct WhatsApp Dispatch Toggle */}
                <label className="flex items-start gap-3.5 p-4 bg-[#F4EDE7] border border-[#DED4CC] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sendViaWhatsApp}
                    onChange={(e) => setSendViaWhatsApp(e.target.checked)}
                    className="mt-1 accent-[#1C1615]"
                  />
                  <div className="text-xs">
                    <span className="font-medium text-[#1C1615] block">
                      Transmettre également mon récapitulatif sur WhatsApp ({settings.whatsappNumber})
                    </span>
                    <span className="font-light text-[#6E5F5C] mt-1 block leading-relaxed">
                      Votre commande est enregistrée dans notre Espace Vendeur sous une référence
                      unique et préparée immédiatement.
                    </span>
                  </div>
                </label>

                <div className="p-4 bg-[#FAF7F4] border border-[#E6DDD6] text-xs font-light text-[#5C4F4C] space-y-1.5 leading-[1.75]">
                  <p className="font-medium text-[#1C1615] flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em]">
                    <ShieldCheck className="w-4 h-4 text-[#8A5A5A]" strokeWidth={1.6} />
                    Engagements de la Maison
                  </p>
                  <p>{settings.paymentConditions}</p>
                  {settings.returnPolicy && <p>{settings.returnPolicy}</p>}
                </div>
              </Reveal>
            </div>

            {/* Right Column: Order Summary */}
            <Reveal
              delay={150}
              className="lg:col-span-5 lg:sticky lg:top-28 bg-[#FCFAF8] border border-[#E6DDD6] p-6 sm:p-9 space-y-6"
            >
              <h2 className="font-serif text-2xl sm:text-3xl text-[#1C1615] pb-4 border-b border-[#EFE8E1]">
                Votre Sélection
              </h2>

              <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
                {detailedCartItems.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center gap-3.5 pb-4 border-b border-[#EFE8E1] last:border-b-0"
                  >
                    <img
                      src={item.photo}
                      alt={item.name}
                      className="w-16 h-16 object-cover bg-[#EFE8E1] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-serif text-lg text-[#1C1615] truncate">{item.name}</p>
                      <p className="text-[9.5px] uppercase tracking-[0.2em] text-[#8A5A5A]">
                        {item.category} · {formatPriceDT(item.price)}
                      </p>
                      <div className="inline-flex items-center border border-[#DED4CC] bg-white mt-2">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                          className="p-1 hover:bg-[#F4EDE7]"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-medium">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="p-1 hover:bg-[#F4EDE7] disabled:opacity-30"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-serif text-lg font-medium text-[#1C1615]">
                        {formatPriceDT(item.lineTotal)}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.productId)}
                        className="text-[#9A8C88] hover:text-[#8A5A5A] mt-2 p-1 transition-colors"
                        title="Retirer"
                      >
                        <Trash2 className="w-3.5 h-3.5" strokeWidth={1.6} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-[#E6DDD6] space-y-2.5 text-xs">
                <div className="flex justify-between font-light text-[#6E5F5C]">
                  <span>Sous-total parfums</span>
                  <span>{formatPriceDT(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between font-light text-[#6E5F5C]">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#8A5A5A]" strokeWidth={1.6} />
                    Livraison ({selectedZone.name})
                  </span>
                  <span>
                    {deliveryFee === 0 ? (
                      <strong className="font-medium text-[#546E5A]">Offerte (0 DT)</strong>
                    ) : (
                      formatPriceDT(deliveryFee)
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-baseline pt-3 border-t border-[#DED4CC] text-[#1C1615]">
                  <span className="text-[10.5px] uppercase tracking-[0.24em] font-medium">
                    Total à régler
                  </span>
                  <span className="font-serif text-3xl font-medium">
                    {formatPriceDT(orderTotal)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-atelier-dark w-full !h-[50px] disabled:opacity-50"
              >
                <MessageCircle className="w-4 h-4 text-[#E2C0BC]" strokeWidth={1.6} />
                <span>
                  {submitting ? 'Validation en cours...' : 'Confirmer & Commander via WhatsApp'}
                </span>
              </button>
            </Reveal>
          </form>
        )}
      </div>
    </div>
  );
}
