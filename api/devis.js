// api/devis.js
import { put } from '@vercel/blob';
import { randomUUID } from 'crypto';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: { bodyParser: false }, // nécessaire pour formidable (multipart)
};

function parseForm(req) {
  const form = formidable({ multiples: false, maxFileSize: 10 * 1024 * 1024 }); // 10 Mo
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => (err ? reject(err) : resolve({ fields, files })));
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Méthode non autorisée' });
  }

  try {
    const { fields, files } = await parseForm(req);
    const prenom = (fields.prenom || '').toString().trim();
    const nom = (fields.nom || '').toString().trim();
    const tel = (fields.tel || '').toString().trim();
    const email = (fields.email || '').toString().trim();
    const message = (fields.message || '').toString().trim();

    if (!prenom || !nom || !tel) {
      return res.status(400).json({ ok: false, error: 'Champs requis manquants' });
    }
    const f = files.fichier;
    if (!f) {
      return res.status(400).json({ ok: false, error: 'Fichier manquant' });
    }

    // Lire le fichier temporaire et l’envoyer dans Vercel Blob
    const buffer = fs.readFileSync(f.filepath);
    const ext = (f.originalFilename || '').split('.').pop() || 'bin';
    const key = `listes/liste-${Date.now()}-${randomUUID()}.${ext}`;

    // Envoi vers Blob (privé par défaut; on peut le mettre public si souhaité)
    const blob = await put(key, buffer, {
      access: 'private',             // 'public' si tu veux un lien public
      contentType: f.mimetype || 'application/octet-stream',
    });

    // TODO (optionnel) : envoyer un email de notif (SendGrid, etc.)

    return res.status(200).json({
      ok: true,
      id: randomUUID(),
      prenom, nom, tel, email,
      blob: { url: blob.url, pathname: blob.pathname } // preuve de stockage
    });
  } catch (err) {
    console.error(err);
    const msg = err?.message?.includes('maxFileSize') ? 'Fichier trop volumineux (max 10 Mo)' : 'Erreur serveur';
    return res.status(500).json({ ok: false, error: msg });
  }
}
