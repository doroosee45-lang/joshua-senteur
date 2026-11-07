import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, MessageCircle, ShieldCheck, Share2, Lock, Banknote } from 'lucide-react';
import JoshuaLogo from './JoshuaLogo';
import { useBoutique } from '../context/BoutiqueContext';
import { sanitizePhoneForWhatsApp } from '../utils/whatsapp';

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer() {
  const { settings, setShareModalPayload } = useBoutique();
  const waDigits = sanitizePhoneForWhatsApp(settings.whatsappNumber);

  return (
    <footer className="bg-[#181211] text-[#FAF7F4] border-t border-white/[0.08]">
      {/* Harmonized Maison Engagements Strip */}
      <div className="border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-9 grid grid-cols-1 md:grid-cols-3 gap-7 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="w-11 h-11 rounded-full border border-[#E2C0BC]/25 bg-white/[0.02] flex items-center justify-center text-[#E2C0BC] shrink-0">
              <Banknote className="w-4 h-4" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.26em] text-[#E2C0BC] font-medium">
                Règlement en espèces
              </p>
              <p className="text-xs font-light text-[#FAF7F4]/65 mt-1">
                Payez en Dinars Tunisiens directement à la remise de votre flacon
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="w-11 h-11 rounded-full border border-[#E2C0BC]/25 bg-white/[0.02] flex items-center justify-center text-[#E2C0BC] shrink-0">
              <MessageCircle className="w-4 h-4" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.26em] text-[#E2C0BC] font-medium">
                Commande directe WhatsApp
              </p>
              <p className="text-xs font-light text-[#FAF7F4]/65 mt-1">
                Conseil personnalisé & suivi rapide au {settings.whatsappNumber}
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="w-11 h-11 rounded-full border border-[#E2C0BC]/25 bg-white/[0.02] flex items-center justify-center text-[#E2C0BC] shrink-0">
              <MapPin className="w-4 h-4" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.26em] text-[#E2C0BC] font-medium">
                Jendouba & Régions Voisines
              </p>
              <p className="text-xs font-light text-[#FAF7F4]/65 mt-1">
                Bou Salem, Tabarka, Aïn Draham, Ghardimaou, Fernana, Oued Meliz
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Editorial Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Column 1: Maison Identity */}
        <div className="flex flex-col items-start">
          <JoshuaLogo size="md" subtitle="HAUTE PARFUMERIE" />
          <p className="font-serif italic text-xl text-[#E2C0BC] mt-5">
            « {settings.slogan} »
          </p>
          <p className="text-xs font-light text-[#FAF7F4]/60 leading-[1.8] mt-3">
            Une sélection contemporaine de parfums pour Elle, pour Lui et Mixtes, livrée avec soin
            à Jendouba et dans les communes voisines.
          </p>
        </div>

        {/* Column 2: Collections */}
        <div>
          <h4 className="text-[10px] uppercase tracking-[0.28em] text-[#D4B8AE] mb-5">
            Collections
          </h4>
          <ul className="space-y-3 text-xs font-light text-[#FAF7F4]/72">
            <li>
              <Link to="/catalogue" className="hover:text-[#E2C0BC] transition-colors">
                Toute la Collection
              </Link>
            </li>
            <li>
              <Link
                to="/catalogue?categorie=Femme"
                className="hover:text-[#E2C0BC] transition-colors"
              >
                01 — Pour Elle
              </Link>
            </li>
            <li>
              <Link
                to="/catalogue?categorie=Homme"
                className="hover:text-[#E2C0BC] transition-colors"
              >
                02 — Pour Lui
              </Link>
            </li>
            <li>
              <Link
                to="/catalogue?categorie=Mixte"
                className="hover:text-[#E2C0BC] transition-colors"
              >
                03 — Créations Mixtes
              </Link>
            </li>
            <li>
              <Link to="/commande" className="hover:text-[#E2C0BC] transition-colors">
                Panier & Commande
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Delivery Zones */}
        <div>
          <h4 className="text-[10px] uppercase tracking-[0.28em] text-[#D4B8AE] mb-5">
            Livraison Régionale
          </h4>
          <p className="text-xs font-light text-[#FAF7F4]/70 leading-relaxed mb-3.5">
            {settings.deliveryZoneSummary}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {(settings.deliveryZones || []).slice(0, 7).map((z) => (
              <span
                key={z.id}
                className="text-[10px] px-2.5 py-1 border border-white/[0.08] bg-white/[0.02] text-[#FAF7F4]/70"
              >
                {z.name} · {z.fee} DT
              </span>
            ))}
          </div>
          {settings.freeDeliveryEnabled && (
            <p className="text-[11px] text-[#E2C0BC] mt-4 flex items-center gap-1.5 font-light">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              Livraison offerte dès {settings.freeDeliveryThreshold} DT d’achat
            </p>
          )}
        </div>

        {/* Column 4: Direct Contact & Share */}
        <div>
          <h4 className="text-[10px] uppercase tracking-[0.28em] text-[#D4B8AE] mb-5">
            Contact & Partage
          </h4>
          <a
            href={`https://wa.me/${waDigits}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-atelier-outline-light w-full !h-[42px] !px-4"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#E2C0BC]" strokeWidth={1.6} />
            <span>{settings.whatsappNumber}</span>
          </a>

          <button
            type="button"
            onClick={() =>
              setShareModalPayload({
                url: window.location.origin,
                title: `${settings.boutiqueName} — ${settings.slogan}`,
              })
            }
            className="mt-3 w-full h-[42px] px-4 border border-white/15 text-[#FAF7F4]/75 text-[10px] uppercase tracking-[0.22em] inline-flex items-center justify-center gap-2 hover:border-[#E2C0BC] hover:text-[#E2C0BC] transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" strokeWidth={1.6} />
            <span>WhatsApp · Facebook · TikTok</span>
          </button>

          <div className="mt-6 pt-4 border-t border-white/[0.07]">
            <Link
              to="/vendeur"
              className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-[#D4B8AE]/80 hover:text-[#E2C0BC] transition-colors"
            >
              <Lock className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>Espace Vendeur</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-white/[0.06] py-5 px-4 sm:px-8 text-center text-[10.5px] font-light text-[#FAF7F4]/45 tracking-[0.12em]">
        © {CURRENT_YEAR} {settings.boutiqueName} — {settings.slogan} · Jendouba, Tunisie.
      </div>
    </footer>
  );
}
