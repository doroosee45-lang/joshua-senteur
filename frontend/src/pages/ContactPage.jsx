import React, { useState } from 'react';
import { MessageCircle, MapPin, Banknote, Share2, Send, Phone } from 'lucide-react';
import JoshuaLogo from '../components/JoshuaLogo';
import { useBoutique } from '../context/BoutiqueContext';
import { formatPriceDT, sanitizePhoneForWhatsApp } from '../utils/whatsapp';
import { Reveal } from '../components/Motion';

export default function ContactPage() {
  const { settings, setShareModalPayload } = useBoutique();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const waDigits = sanitizePhoneForWhatsApp(settings.whatsappNumber);

  const handleSendWhatsApp = (e) => {
    e.preventDefault();
    const text = [
      `Bonjour *${settings.boutiqueName}* ✨`,
      name ? `Nom : ${name}` : '',
      phone ? `Téléphone : ${phone}` : '',
      ``,
      message || 'Je souhaite obtenir un conseil sur vos parfums et vos modalités de livraison.',
    ]
      .filter(Boolean)
      .join('\n');

    window.open(
      `https://wa.me/${waDigits}?text=${encodeURIComponent(text)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <div className="min-h-screen bg-[#FAF7F4] text-[#1C1615] pt-[74px] sm:pt-[82px] animate-page-enter">
      {/* Editorial Header inspired by La Roselle Contact */}
      <div className="relative bg-[#231B19] text-[#FAF7F4] py-18 sm:py-26 px-4 sm:px-8 overflow-hidden border-b border-white/[0.08]">
        <img
          src="/images/floral-mural.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-28 pointer-events-none"
        />
        <Reveal className="relative z-10 max-w-3xl mx-auto text-center py-4">
          <JoshuaLogo size="lg" subtitle="JENDOUBA · TUNISIE" />
          <p className="font-serif italic text-2xl sm:text-3xl text-[#E2C0BC] mt-6">
            « {settings.slogan} »
          </p>
          <p className="text-xs sm:text-[13.5px] font-light text-[#FAF7F4]/72 mt-3.5 max-w-xl mx-auto leading-[1.85]">
            Conseil olfactif personnalisé, commande directe sur WhatsApp et livraison dédiée à
            Jendouba et dans toutes les communes voisines.
          </p>
        </Reveal>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Direct Channels & Delivery Zones */}
        <div className="lg:col-span-6 space-y-8">
          <Reveal className="bg-[#FCFAF8] border border-[#E6DDD6] p-7 sm:p-9 space-y-5">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#8A5A5A] font-medium">
              Ligne Privée
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#1C1615]">
              Commander ou nous joindre
            </h2>

            <div className="space-y-3.5 text-sm text-[#3A302E]">
              <a
                href={`https://wa.me/${waDigits}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-[#F4EDE7] border border-[#DED4CC] hover:border-[#8A5A5A] transition-colors"
              >
                <MessageCircle className="w-5 h-5 text-[#6B8070] shrink-0" strokeWidth={1.6} />
                <div>
                  <span className="text-[9.5px] uppercase tracking-[0.24em] text-[#6B8070] font-medium block">
                    WhatsApp Officiel
                  </span>
                  <strong className="font-serif text-xl text-[#1C1615] font-medium">
                    {settings.whatsappNumber}
                  </strong>
                </div>
              </a>

              <a
                href={`tel:${settings.whatsappNumber.replace(/\s+/g, '')}`}
                className="flex items-center gap-4 p-4 bg-[#FAF7F4] border border-[#E6DDD6] hover:border-[#8A5A5A] transition-colors"
              >
                <Phone className="w-5 h-5 text-[#8A5A5A] shrink-0" strokeWidth={1.6} />
                <div>
                  <span className="text-[9.5px] uppercase tracking-[0.24em] text-[#8A5A5A] font-medium block">
                    Appel Direct
                  </span>
                  <strong className="font-serif text-xl text-[#1C1615] font-medium">
                    {settings.whatsappNumber}
                  </strong>
                </div>
              </a>
            </div>

            <button
              type="button"
              onClick={() =>
                setShareModalPayload({
                  url: window.location.origin,
                  title: `${settings.boutiqueName} — ${settings.slogan}`,
                })
              }
              className="btn-atelier-dark w-full"
            >
              <Share2 className="w-4 h-4 text-[#E2C0BC]" strokeWidth={1.6} />
              <span>Partager sur WhatsApp, Facebook & TikTok</span>
            </button>
          </Reveal>

          {/* Delivery Zones Table */}
          <Reveal delay={120} className="bg-[#FCFAF8] border border-[#E6DDD6] p-7 sm:p-9">
            <div className="flex items-center gap-2 text-[#8A5A5A] mb-2">
              <MapPin className="w-4 h-4" strokeWidth={1.6} />
              <span className="text-[10px] uppercase tracking-[0.28em] font-medium">
                Zones & Frais de Livraison
              </span>
            </div>
            <h3 className="font-serif text-3xl text-[#1C1615] mb-5">
              Jendouba & communes voisines
            </h3>

            <div className="divide-y divide-[#EFE8E1] text-xs sm:text-[13px]">
              {(settings.deliveryZones || []).map((z) => (
                <div key={z.id} className="py-3.5 flex items-center justify-between">
                  <div>
                    <span className="font-medium text-[#1C1615]">{z.name}</span>
                    <span className="block text-[11px] font-light text-[#6E5F5C]">{z.delay}</span>
                  </div>
                  <span className="font-serif text-lg font-medium text-[#8A5A5A]">
                    {formatPriceDT(z.fee)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 p-4 bg-[#F4EDE7] border border-[#E6DDD6] text-xs font-light text-[#3A302E] flex items-center gap-2.5">
              <Banknote className="w-4 h-4 text-[#6B8070] shrink-0" strokeWidth={1.6} />
              <span>Règlement en espèces à la livraison pour l’ensemble des communes desservies.</span>
            </div>
          </Reveal>
        </div>

        {/* Right: Direct WhatsApp Message Composer */}
        <Reveal delay={160} className="lg:col-span-6">
          <form
            onSubmit={handleSendWhatsApp}
            className="bg-[#FCFAF8] border border-[#E6DDD6] p-7 sm:p-11 space-y-5"
          >
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#8A5A5A] font-medium">
              Écrivez-nous
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#1C1615]">
              Conseil personnalisé
            </h2>
            <p className="text-xs font-light text-[#5C4F4C] leading-[1.8]">
              À la recherche d’un sillage particulier ou d’une idée cadeau ? Rédigez votre message
              ci-dessous pour l’adresser directement à notre équipe sur WhatsApp.
            </p>

            <div>
              <label className="label-atelier">Nom complet *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Votre nom"
                className="input-atelier"
              />
            </div>

            <div>
              <label className="label-atelier">Téléphone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ex: +216 56 45 49 46"
                className="input-atelier"
              />
            </div>

            <div>
              <label className="label-atelier">Votre message *</label>
              <textarea
                rows={5}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Indiquez le parfum recherché, votre commune ou votre demande..."
                className="input-atelier"
              />
            </div>

            <button type="submit" className="btn-atelier-dark w-full">
              <Send className="w-4 h-4 text-[#E2C0BC]" strokeWidth={1.6} />
              <span>Transmettre sur WhatsApp</span>
            </button>
          </form>
        </Reveal>
      </div>
    </div>
  );
}
