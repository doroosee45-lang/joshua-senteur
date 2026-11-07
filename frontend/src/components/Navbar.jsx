import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, User, Share2, Menu, X, MessageCircle } from 'lucide-react';
import JoshuaLogo from './JoshuaLogo';
import { useBoutique } from '../context/BoutiqueContext';
import { sanitizePhoneForWhatsApp } from '../utils/whatsapp';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const {
    cartCount,
    setIsCartOpen,
    setIsSearchOpen,
    setShareModalPayload,
    isAdminAuthenticated,
    settings,
  } = useBoutique();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const currentSearch = new URLSearchParams(location.search);
  const activeCat = currentSearch.get('categorie');

  const navLinks = [
    {
      label: 'ACCUEIL',
      num: '01',
      to: '/',
      isActive: location.pathname === '/',
    },
    {
      label: 'COLLECTION',
      num: '02',
      to: '/catalogue',
      isActive: location.pathname === '/catalogue' && !activeCat,
    },
    {
      label: 'FEMME',
      num: '03',
      to: '/catalogue?categorie=Femme',
      isActive: location.pathname === '/catalogue' && activeCat === 'Femme',
    },
    {
      label: 'HOMME',
      num: '04',
      to: '/catalogue?categorie=Homme',
      isActive: location.pathname === '/catalogue' && activeCat === 'Homme',
    },
    {
      label: 'MIXTE',
      num: '05',
      to: '/catalogue?categorie=Mixte',
      isActive: location.pathname === '/catalogue' && activeCat === 'Mixte',
    },
    {
      label: 'MAISON & CONTACT',
      num: '06',
      to: '/contact',
      isActive: location.pathname === '/contact',
    },
  ];

  const waDigits = sanitizePhoneForWhatsApp(settings.whatsappNumber);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-[#1C1615]/95 backdrop-blur-md border-b border-white/[0.09] shadow-[0_10px_30px_-15px_rgba(0,0,0,0.6)]'
            : 'bg-[#231B19]/90 backdrop-blur-sm border-b border-white/[0.06]'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 h-[74px] sm:h-[82px] flex items-center justify-between">
          {/* Left: Mobile Trigger + Brand Emblem */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-[#FAF7F4]/85 hover:text-[#E2C0BC] transition-colors"
              aria-label="Ouvrir la navigation"
            >
              <Menu className="w-5 h-5" strokeWidth={1.6} />
            </button>
            <Link to="/" className="flex items-center">
              <JoshuaLogo size="sm" subtitle="ATELIER" />
            </Link>
          </div>

          {/* Center: Harmonized Editorial Spaced Navigation */}
          <nav className="hidden lg:flex items-center gap-7 xl:gap-9">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className={`group relative py-2 text-[10px] xl:text-[10.5px] uppercase tracking-[0.26em] font-medium transition-colors duration-300 ${
                  item.isActive
                    ? 'text-[#FAF7F4]'
                    : 'text-[#FAF7F4]/68 hover:text-[#E2C0BC]'
                }`}
              >
                {item.label}
                <span
                  className={`absolute left-0 right-0 bottom-0 h-[1px] bg-[#E2C0BC] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] origin-left ${
                    item.isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </Link>
            ))}
          </nav>

          {/* Right: Search, Share, Bag, Espace Vendeur */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-[#FAF7F4]/80 hover:text-[#E2C0BC] transition-colors duration-300"
              title="Rechercher un parfum"
              aria-label="Rechercher un parfum"
            >
              <Search className="w-[18px] h-[18px]" strokeWidth={1.5} />
            </button>

            <button
              type="button"
              onClick={() =>
                setShareModalPayload({
                  url: window.location.origin,
                  title: `${settings.boutiqueName} — ${settings.slogan}`,
                })
              }
              className="p-2 text-[#FAF7F4]/80 hover:text-[#E2C0BC] transition-colors duration-300"
              title="Partager la boutique"
              aria-label="Partager la boutique"
            >
              <Share2 className="w-[18px] h-[18px]" strokeWidth={1.5} />
            </button>

            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-[#FAF7F4]/85 hover:text-[#E2C0BC] transition-colors duration-300"
              title="Mon panier"
              aria-label="Ouvrir le panier"
            >
              <ShoppingBag className="w-[18px] h-[18px]" strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 min-w-[16px] h-[16px] px-1 rounded-full bg-[#E2C0BC] text-[#1C1615] text-[9.5px] font-semibold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate('/vendeur')}
              className="relative flex items-center gap-1.5 p-2 text-[#FAF7F4]/80 hover:text-[#E2C0BC] transition-colors duration-300"
              title="Espace Vendeur"
              aria-label="Espace Vendeur"
            >
              <User className="w-[18px] h-[18px]" strokeWidth={1.5} />
              {isAdminAuthenticated && (
                <span className="w-2 h-2 rounded-full bg-[#7A9A82] absolute top-1.5 right-1.5" />
              )}
              <span className="hidden xl:inline text-[9.5px] uppercase tracking-[0.24em] text-[#D4B8AE]">
                Atelier
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Editorial Navigation Drawer with Smooth Entrance */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[80] lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm animate-backdrop"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-[85vw] max-w-sm bg-[#1C1615] border-r border-white/10 h-full flex flex-col justify-between p-7 z-10 overflow-y-auto animate-drawer-left">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <JoshuaLogo size="sm" subtitle="ATELIER" />
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-[#FAF7F4]/70 hover:text-[#E2C0BC] transition-colors"
                  aria-label="Fermer"
                >
                  <X className="w-5 h-5" strokeWidth={1.5} />
                </button>
              </div>

              <div className="mt-8 space-y-1">
                {navLinks.map((item) => (
                  <Link
                    key={item.label}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-baseline justify-between py-3.5 border-b border-white/[0.06] transition-colors ${
                      item.isActive ? 'text-[#E2C0BC]' : 'text-[#FAF7F4]/85 hover:text-[#E2C0BC]'
                    }`}
                  >
                    <span className="font-serif text-2xl font-normal tracking-wide">
                      {item.label}
                    </span>
                    <span className="text-[10px] tracking-[0.24em] text-[#D4B8AE]/60">
                      {item.num}
                    </span>
                  </Link>
                ))}

                <Link
                  to="/commande"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-baseline justify-between py-3.5 border-b border-white/[0.06] text-[#FAF7F4]/85 hover:text-[#E2C0BC]"
                >
                  <span className="font-serif text-2xl font-normal tracking-wide">
                    PANIER ({cartCount})
                  </span>
                  <span className="text-[10px] tracking-[0.24em] text-[#D4B8AE]/60">07</span>
                </Link>

                <Link
                  to="/vendeur"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-baseline justify-between py-3.5 border-b border-white/[0.06] text-[#D4B8AE] hover:text-[#E2C0BC]"
                >
                  <span className="font-serif text-2xl font-normal tracking-wide">
                    ESPACE VENDEUR
                  </span>
                  <span className="text-[10px] tracking-[0.24em] text-[#D4B8AE]/60">ADMIN</span>
                </Link>
              </div>
            </div>

            <div className="pt-8 space-y-3">
              <p className="text-[9.5px] uppercase tracking-[0.26em] text-[#D4B8AE]/75">
                Livraison Jendouba · Règlement en espèces
              </p>
              <a
                href={`https://wa.me/${waDigits}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-atelier-blush w-full"
              >
                <MessageCircle className="w-4 h-4" strokeWidth={1.6} />
                <span>WhatsApp {settings.whatsappNumber}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
