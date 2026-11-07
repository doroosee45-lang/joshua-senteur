import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  CheckCircle2,
  MessageCircle,
  Copy,
  Check,
  ArrowRight,
  Banknote,
  MapPin,
  Phone,
} from 'lucide-react';
import { useBoutique } from '../context/BoutiqueContext';
import {
  buildOrderWhatsAppMessage,
  buildOrderWhatsAppUrl,
  formatPriceDT,
} from '../utils/whatsapp';
import { Reveal } from '../components/Motion';

export default function OrderConfirmationPage() {
  const { ref } = useParams();
  const { orders, settings, showToast } = useBoutique();
  const [copied, setCopied] = useState(false);

  const order = orders.find((o) => o.reference === ref);

  if (!order) {
    return (
      <div className="min-h-screen bg-[#FAF7F4] text-[#1C1615] pt-36 px-4 text-center animate-page-enter">
        <h1 className="font-serif text-4xl">Commande introuvable</h1>
        <p className="text-xs font-light text-[#6E5F5C] mt-3">
          Cette référence de commande n’a pas été retrouvée sur votre navigateur.
        </p>
        <Link to="/catalogue" className="mt-7 btn-atelier-dark">
          Retourner à la boutique
        </Link>
      </div>
    );
  }

  const waUrl = buildOrderWhatsAppUrl(order, settings.whatsappNumber, settings.boutiqueName);
  const waMessage = buildOrderWhatsAppMessage(order, settings.boutiqueName);

  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(waMessage);
      setCopied(true);
      showToast('Récapitulatif copié dans le presse-papiers.');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      showToast('Référence : ' + order.reference);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F4] text-[#1C1615] pt-[74px] sm:pt-[82px] pb-24 animate-page-enter">
      <div className="max-w-3xl mx-auto px-4 sm:px-8 pt-12">
        <Reveal className="bg-[#FCFAF8] border border-[#DED4CC] p-7 sm:p-11 shadow-[0_20px_50px_-24px_rgba(28,22,21,0.12)]">
          <div className="flex flex-col items-center text-center pb-9 border-b border-[#E6DDD6]">
            <div className="w-16 h-16 rounded-full bg-[#F4EDE7] border border-[#D4B8AE] flex items-center justify-center text-[#546E5A] mb-5">
              <CheckCircle2 className="w-7 h-7" strokeWidth={1.5} />
            </div>
            <p className="text-[10px] uppercase tracking-[0.32em] text-[#8A5A5A] font-medium">
              Confirmation de commande
            </p>
            <h1 className="font-serif text-3xl sm:text-5xl text-[#1C1615] mt-1.5">
              Merci, <em className="italic font-light text-[#8A5A5A]">{order.customer.fullName}</em>
            </h1>
            <p className="text-xs sm:text-[13.5px] font-light text-[#5C4F4C] mt-3.5 max-w-lg leading-[1.8]">
              Votre commande est enregistrée auprès de <strong>{settings.boutiqueName}</strong>.
              Pour accélérer la préparation et l’expédition vers {order.customer.cityName},
              transmettez le récapitulatif ci-dessous sur notre WhatsApp.
            </p>

            <div className="mt-6 px-6 py-2.5 bg-[#231B19] text-[#FAF7F4] text-[10.5px] uppercase tracking-[0.28em]">
              Référence · <strong className="text-[#E2C0BC] font-medium">{order.reference}</strong>
            </div>
          </div>

          {/* Primary WhatsApp CTA */}
          <div className="py-6 border-b border-[#E6DDD6] flex flex-col sm:flex-row gap-3">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-atelier-dark flex-1"
            >
              <MessageCircle className="w-4 h-4 text-[#E2C0BC]" strokeWidth={1.6} />
              <span>Envoyer sur WhatsApp ({settings.whatsappNumber})</span>
            </a>

            <button
              type="button"
              onClick={handleCopySummary}
              className="btn-atelier-outline-dark"
            >
              {copied ? <Check className="w-4 h-4 text-[#546E5A]" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copié' : 'Copier le résumé'}</span>
            </button>
          </div>

          {/* Order Items & Totals */}
          <div className="py-6 border-b border-[#E6DDD6] space-y-4">
            <h2 className="text-[10px] uppercase tracking-[0.26em] text-[#8A5A5A] font-medium">
              Détail des créations
            </h2>
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-3.5">
                  <img
                    src={item.photo}
                    alt={item.name}
                    className="w-13 h-13 w-12 h-12 object-cover bg-[#EFE8E1]"
                  />
                  <div>
                    <p className="font-serif text-xl text-[#1C1615]">{item.name}</p>
                    <p className="text-xs font-light text-[#6E5F5C]">
                      Quantité : {item.quantity} × {formatPriceDT(item.price)}
                    </p>
                  </div>
                </div>
                <span className="font-serif text-lg font-medium text-[#1C1615]">
                  {formatPriceDT(item.price * item.quantity)}
                </span>
              </div>
            ))}

            <div className="pt-4 border-t border-[#EFE8E1] space-y-1.5 text-xs">
              <div className="flex justify-between font-light text-[#6E5F5C]">
                <span>Sous-total</span>
                <span>{formatPriceDT(order.subtotal)}</span>
              </div>
              <div className="flex justify-between font-light text-[#6E5F5C]">
                <span>Livraison ({order.customer.cityName})</span>
                <span>{order.deliveryFee === 0 ? 'Offerte' : formatPriceDT(order.deliveryFee)}</span>
              </div>
              <div className="flex justify-between items-baseline pt-2.5 font-medium text-sm text-[#1C1615]">
                <span>Total à régler ({order.paymentMethod})</span>
                <span className="font-serif text-2xl">{formatPriceDT(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Delivery Coordinates & Next Steps */}
          <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-light text-[#3A302E]">
            <div className="space-y-2.5">
              <h3 className="text-[10px] uppercase tracking-[0.24em] text-[#8A5A5A] font-medium">
                Lieu de livraison
              </h3>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#8A5A5A]" strokeWidth={1.6} />
                <span>{order.customer.phone}</span>
              </p>
              <p className="flex items-start gap-2 leading-relaxed">
                <MapPin className="w-3.5 h-3.5 text-[#8A5A5A] shrink-0 mt-0.5" strokeWidth={1.6} />
                <span>
                  {order.customer.cityName}
                  {order.customer.neighborhood ? ` — ${order.customer.neighborhood}` : ''}
                  <br />
                  {order.customer.address}
                </span>
              </p>
              <p className="flex items-center gap-2">
                <Banknote className="w-3.5 h-3.5 text-[#6B8070]" strokeWidth={1.6} />
                <span>{order.paymentMethod}</span>
              </p>
            </div>

            <div className="space-y-2 bg-[#F4EDE7] p-5 border border-[#E6DDD6]">
              <h3 className="text-[10px] uppercase tracking-[0.24em] text-[#1C1615] font-medium">
                Prochaines étapes
              </h3>
              <ol className="list-decimal list-inside space-y-1.5 text-[#5C4F4C] leading-[1.75]">
                <li>Vérification de votre commande ({order.reference}).</li>
                <li>Confirmation téléphonique ou WhatsApp du créneau.</li>
                <li>Règlement de {formatPriceDT(order.total)} en espèces à la remise.</li>
              </ol>
            </div>
          </div>

          <div className="mt-9 pt-6 border-t border-[#E6DDD6] text-center">
            <Link
              to="/catalogue"
              className="inline-flex items-center gap-2 text-[10.5px] uppercase tracking-[0.24em] text-[#1C1615] hover:text-[#8A5A5A] font-medium transition-colors"
            >
              <span>Poursuivre ma visite</span>
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
