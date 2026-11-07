/**
 * IndexedDB Storage Adapter for Joshua Parfum (MERN Frontend)
 * Enables storing high-resolution perfume photos imported from phone/iPhone gallery
 * without hitting browser 5MB localStorage limits, while structuring data cleanly
 * like MongoDB collections ('products', 'orders', 'settings', 'auth').
 */

const DB_NAME = 'JoshuaParfumDB_v2';
const DB_VERSION = 1;
const STORE_NAME = 'collections';

function openDatabase() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      resolve(null);
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function dbGet(key, fallbackValue = null) {
  try {
    const db = await openDatabase();
    if (!db) {
      const raw = localStorage.getItem(`jp_${key}`);
      return raw ? JSON.parse(raw) : fallbackValue;
    }
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => {
        if (req.result !== undefined) {
          resolve(req.result);
        } else {
          const raw = localStorage.getItem(`jp_${key}`);
          resolve(raw ? JSON.parse(raw) : fallbackValue);
        }
      };
      req.onerror = () => resolve(fallbackValue);
    });
  } catch {
    return fallbackValue;
  }
}

export async function dbSet(key, value) {
  try {
    const db = await openDatabase();
    if (db) {
      await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.put(value, key);
        req.onsuccess = () => resolve(true);
        req.onerror = () => reject(req.error);
      });
    } else {
      localStorage.setItem(`jp_${key}`, JSON.stringify(value));
    }
  } catch {
    try {
      localStorage.setItem(`jp_${key}`, JSON.stringify(value));
    } catch {
      // Ignore quota errors if IndexedDB already succeeded
    }
  }
}

/**
 * Validates and compresses/optimizes an image File selected from phone/iPhone gallery
 * Returns { ok: true, dataUrl } or { ok: false, error: '...' }
 */
export function processUploadedImageFile(file) {
  return new Promise((resolve) => {
    const MAX_SIZE_MB = 12;
    const allowedMimePrefixes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];

    if (!file) {
      resolve({ ok: false, error: 'Aucun fichier sélectionné.' });
      return;
    }

    const fileType = (file.type || '').toLowerCase();
    const ext = (file.name || '').split('.').pop()?.toLowerCase() || '';
    const allowedExts = ['jpg', 'jpeg', 'png', 'webp', 'heic', 'heif'];

    if (
      !fileType.startsWith('image/') &&
      !allowedMimePrefixes.includes(fileType) &&
      !allowedExts.includes(ext)
    ) {
      resolve({
        ok: false,
        error: `Format non pris en charge ("${file.name}"). Veuillez choisir une photo JPG, PNG, WEBP ou HEIC depuis votre galerie.`,
      });
      return;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      const actualMb = (file.size / (1024 * 1024)).toFixed(1);
      resolve({
        ok: false,
        error: `L’image "${file.name}" est trop volumineuse (${actualMb} Mo). Taille maximale autorisée : ${MAX_SIZE_MB} Mo.`,
      });
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => {
      resolve({
        ok: false,
        error: `Impossible de lire la photo "${file.name}". Veuillez réessayer avec une autre image.`,
      });
    };

    reader.onload = (e) => {
      const rawDataUrl = e.target.result;
      const img = new Image();
      img.onload = () => {
        try {
          const MAX_DIM = 1280;
          let { width, height } = img;
          if (width > MAX_DIM || height > MAX_DIM) {
            if (width >= height) {
              height = Math.round((height * MAX_DIM) / width);
              width = MAX_DIM;
            } else {
              width = Math.round((width * MAX_DIM) / height);
              height = MAX_DIM;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const optimized = canvas.toDataURL('image/jpeg', 0.86);
          resolve({ ok: true, dataUrl: optimized });
        } catch {
          resolve({ ok: true, dataUrl: rawDataUrl });
        }
      };
      img.onerror = () => {
        // If browser cannot decode HEIC in canvas directly, let user know clearly
        if (ext === 'heic' || ext === 'heif') {
          resolve({
            ok: false,
            error:
              'Ce fichier HEIC nécessite un format standard (JPG ou PNG). Sur iPhone, choisissez la photo depuis « Photothèque » (conversion automatique en JPEG).',
          });
        } else {
          resolve({
            ok: false,
            error: `Format d’image non reconnu pour "${file.name}". Utilisez JPG, PNG ou WEBP.`,
          });
        }
      };
      img.src = rawDataUrl;
    };

    reader.readAsDataURL(file);
  });
}
