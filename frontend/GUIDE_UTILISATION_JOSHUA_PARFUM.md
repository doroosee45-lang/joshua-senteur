# JOSHUA PARFUM — Guide d'Utilisation & Documentation (Frontend MERN)

**Slogan :** *Votre parfum, votre élégance.*  
**Zone de livraison :** Jendouba et les villes voisines, Tunisie  
**WhatsApp officiel :** `+216 56 45 49 46`  
**Mode de paiement :** Paiement en espèces à la livraison & Commande directe par WhatsApp

---

## 1. Accès Propriétaire (Espace Vendeur)

- **URL de l'espace vendeur :** cliquez sur l'icône **Vendeur (👤)** en haut à droite ou rendez-vous sur `/vendeur`.
- **Mot de passe initial :** `joshua2026`
- *Vous pouvez modifier ce mot de passe à tout moment depuis l'onglet **Livraison Jendouba & Paramètres → Sécurité Propriétaire**.*

---

## 2. Ajouter un parfum et choisir une photo depuis iPhone / Smartphone

1. Connectez-vous dans **Espace Vendeur** (`/vendeur`).
2. Ouvrez l'onglet **Parfums, Photos & Prix**, puis cliquez sur **« + Ajouter un parfum »**.
3. Appuyez sur le bouton **« Choisir une photo »** :
   - Sur **iPhone (Safari)** et **Android**, le sélecteur natif s'ouvre pour choisir une ou plusieurs images depuis **Photothèque**, **Prendre une photo** ou **Fichiers**.
   - Un **aperçu immédiat** s'affiche avant l'enregistrement. Vous pouvez définir la photo principale ou retirer une image.
4. Saisissez exclusivement votre **Prix de vente en Dinars Tunisiens (DT)** (aucun prix automatique n'est imposé), la catégorie (**Femme**, **Homme** ou **Mixte**), la description et la quantité en stock.
5. Cliquez sur **« Enregistrer le parfum »** : le parfum apparaît aussitôt dans le catalogue public.

---

## 3. Gérer les commandes et contacter les clients sur WhatsApp

1. Lorsqu'un client commande (via le panier ou via **Commande directe WhatsApp**), une **référence unique** (`JP-XXXX`) est générée.
2. Le client règle **en espèces à la livraison** et envoie le récapitulatif complet sur WhatsApp au **+216 56 45 49 46**.
3. Dans **Espace Vendeur → Commandes**, vous pouvez :
   - Filtrer par statut (*Nouvelle, Confirmée, En préparation, En livraison, Livrée, Annulée*) ou par date.
   - Mettre à jour le statut en un clic.
   - Cliquer sur **« WhatsApp Client »** pour ouvrir automatiquement une conversation WhatsApp pré-remplie en français avec le client, ou sur **« Appeler »**.

---

## 4. Architecture MERN (Connexion ultérieure au Backend Express / MongoDB)

Cette application correspond au **Frontend React (Vite + Tailwind CSS)** de la stack MERN :
- Toute la logique d'appel réseau est centralisée dans `src/services/api.js`.
- En mode autonome actuel, les produits, photos optimisées et commandes sont persistés localement via `IndexedDB` (`src/services/storageDb.js`).
- Pour relier votre futur serveur **Node.js / Express / MongoDB + Cloudinary**, il suffit de définir la variable d'environnement `VITE_API_URL=https://votre-api.com` pointant vers les routes REST (`/api/products`, `/api/orders`, `/api/settings`, `/api/auth/login`).

---

## 5. Estimation indicative des frais d'hébergement (Mise en production)

- **Hébergement Frontend React (Vercel / Netlify / Cloudflare Pages) :** Gratuit (0 DT / mois) avec certificat HTTPS inclus.
- **Nom de domaine personnalisé (`.com` ou `.tn`) :** ~40 à 65 DT / an.
- **Lors de l'ajout d'une base centralisée MERN (MongoDB Atlas M0 + Cloudinary Free + Render/Railway) :** Gratuit pour démarrer (puis ~15 à 25 DT / mois si fort trafic).
