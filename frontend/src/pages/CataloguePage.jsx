import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { Reveal } from '../components/Motion';
import { useBoutique } from '../context/BoutiqueContext';

const CATEGORIES = ['Tous', 'Femme', 'Homme', 'Mixte'];

export default function CataloguePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('categorie') || 'Tous';

  const [searchQuery, setSearchQuery] = useState('');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [sortBy, setSortBy] = useState('recent');

  const { publicProducts, settings } = useBoutique();

  const handleCategoryChange = (cat) => {
    if (cat === 'Tous') {
      searchParams.delete('categorie');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ categorie: cat });
    }
  };

  const filteredProducts = useMemo(() => {
    let list = [...publicProducts];

    if (activeCategory !== 'Tous') {
      list = list.filter((p) => p.category.toLowerCase() === activeCategory.toLowerCase());
    }

    if (onlyAvailable) {
      list = list.filter((p) => p.available && Number(p.stock) > 0);
    }

    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.notes || '').toLowerCase().includes(q) ||
          (p.description || '').toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'price-asc') {
      list.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => Number(b.price) - Number(a.price));
    } else {
      list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }

    return list;
  }, [publicProducts, activeCategory, onlyAvailable, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-[#FAF7F4] text-[#1C1615] pt-[74px] sm:pt-[82px] animate-page-enter">
      {/* Harmonized Espresso Banner */}
      <div className="relative bg-[#231B19] text-[#FAF7F4] py-16 sm:py-22 px-4 sm:px-8 overflow-hidden border-b border-white/[0.08]">
        <img
          src="/images/floral-mural.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
        />
        <Reveal className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 mb-3">
            <span className="w-6 h-[1px] bg-[#E2C0BC]/55" />
            <span className="text-[10px] uppercase tracking-[0.34em] text-[#E2C0BC] font-medium">
              {settings.boutiqueName} · LA COLLECTION
            </span>
            <span className="w-6 h-[1px] bg-[#E2C0BC]/55" />
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-normal leading-[1.08]">
            {activeCategory === 'Tous' ? (
              <>
                Toutes nos <em className="italic font-light text-[#E2C0BC]">Créations</em>
              </>
            ) : (
              <>
                Univers <em className="italic font-light text-[#E2C0BC]">{activeCategory}</em>
              </>
            )}
          </h1>
          <p className="text-xs sm:text-[13.5px] font-light text-[#FAF7F4]/72 mt-3.5 max-w-xl mx-auto leading-[1.8]">
            {settings.slogan} — Règlement en espèces à la livraison à Jendouba et dans les communes
            voisines.
          </p>
        </Reveal>
      </div>

      {/* Sticky Harmonized Filter Toolbar */}
      <div className="sticky top-[74px] sm:top-[82px] z-30 bg-[#FAF7F4]/95 backdrop-blur-md border-b border-[#E6DDD6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1 lg:pb-0">
            {CATEGORIES.map((cat) => {
              const active = activeCategory.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategoryChange(cat)}
                  className={`h-[38px] px-5 text-[10px] uppercase tracking-[0.24em] font-medium whitespace-nowrap transition-all duration-300 border ${
                    active
                      ? 'bg-[#1C1615] text-[#FAF7F4] border-[#1C1615]'
                      : 'bg-[#FCFAF8] text-[#6E5F5C] border-[#E6DDD6] hover:border-[#8A5A5A] hover:text-[#1C1615]'
                  }`}
                >
                  {cat === 'Tous' ? 'Toute la collection' : cat}
                </button>
              );
            })}
          </div>

          {/* Search + Availability + Sort */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative flex-1 sm:flex-initial sm:w-64">
              <Search
                className="w-3.5 h-3.5 text-[#8A7A77] absolute left-3.5 top-1/2 -translate-y-1/2"
                strokeWidth={1.6}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un sillage, une note..."
                className="w-full h-[38px] bg-[#FCFAF8] border border-[#DED4CC] pl-9 pr-8 text-xs text-[#1C1615] placeholder:text-[#9A8C88] focus:border-[#8A5A5A] focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8A7A77] hover:text-[#1C1615]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <label className="h-[38px] inline-flex items-center gap-2 text-xs font-light text-[#3A302E] cursor-pointer select-none bg-[#FCFAF8] border border-[#E6DDD6] px-3.5">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={(e) => setOnlyAvailable(e.target.checked)}
                className="accent-[#1C1615]"
              />
              <span>En stock</span>
            </label>

            <div className="h-[38px] inline-flex items-center gap-2 bg-[#FCFAF8] border border-[#E6DDD6] px-3.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#8A5A5A]" strokeWidth={1.6} />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-xs text-[#1C1615] focus:outline-none"
              >
                <option value="recent">Nouveautés</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Staggered Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
        <div className="flex items-center justify-between mb-8 text-[11px] uppercase tracking-[0.2em] text-[#6E5F5C]">
          <span>
            <strong className="text-[#1C1615]">{filteredProducts.length}</strong> création
            {filteredProducts.length > 1 ? 's' : ''}
          </span>
          <span>Tarifs en Dinars Tunisiens (DT)</span>
        </div>

        {filteredProducts.length === 0 ? (
          <Reveal className="bg-[#FCFAF8] border border-[#E6DDD6] p-14 text-center max-w-lg mx-auto">
            <p className="font-serif text-3xl text-[#1C1615]">Aucune création trouvée</p>
            <p className="text-xs font-light text-[#6E5F5C] mt-2.5 leading-[1.8]">
              Ajustez vos critères ou réinitialisez les filtres afin d’explorer l’ensemble de notre
              collection.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setOnlyAvailable(false);
                handleCategoryChange('Tous');
              }}
              className="mt-6 btn-atelier-dark"
            >
              Réinitialiser les filtres
            </button>
          </Reveal>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-7">
            {filteredProducts.map((product, idx) => (
              <Reveal key={`${product.id}-${activeCategory}`} delay={(idx % 4) * 80}>
                <ProductCard product={product} variant="light" />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
