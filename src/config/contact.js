/**
 * CJERF Automotive - Global Contact & WhatsApp Configuration
 * 
 * Modifiez le numéro ci-dessous pour changer la destination des commandes
 * et des demandes sur-mesure WhatsApp.
 * Format international recommandé : "213XXXXXXXXX" (sans le '+')
 */
export const WHATSAPP_PHONE_NUMBER = "213790752359";

export const CONTACT_INFO = {
  brandName: "CJERF Automotive",
  tagline: "Automotive Design & Precision Engineering",
  slogan: "We Make Car Parts",
  email: "cjerfautomotive@gmail.com",
  phoneDisplay: "+213 (0) 790752359",
  city: "Alger",
  country: "🇩🇿",
  instagram: "https://www.instagram.com/cjerfautomotive_/",
  tiktok: "https://tiktok.com/@cjerfautomotive",
  developer: {
    name: "Khalil Hamidani",
    url: "https://khalilhamidani.engineer/",
  },
  workshopStatus: "ATELIER EN LIGNE // DISPONIBLE",
  deliveryScope: "Livraison 58 Wilayas",
  tolerance: "± 0.05 mm",
  materials: ["PETG Carbone (Fibre renforcée)", "ABS Haute Température (110°C / Anti-UV)", "ASA Automobile"],
};

/**
 * Génère le lien WhatsApp pré-rempli pour une pièce du catalogue
 */
export function getProductWhatsAppUrl(productTitle, vehicleModel = "") {
  const text = `Bonjour CJERF Automotive, je souhaite commander la pièce suivante :
- Produit : ${productTitle}${vehicleModel ? `\n- Véhicule : ${vehicleModel}` : ''}
- Provenance : Site Web Officiel

Pouvez-vous me confirmer la disponibilité et le tarif de livraison ? Merci !`;
  return `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent(text)}`;
}

/**
 * Génère le lien WhatsApp pour une demande sur-mesure
 */
export function getCustomPartWhatsAppUrl(formData) {
  const clientName = [formData.firstName, formData.lastName].filter(Boolean).join(' ') || formData.name || 'Client';
  const text = `Bonjour CJERF Automotive, je souhaite lancer une demande de fabrication SUR-MESURE :
- Client : ${clientName}
${formData.wilaya ? `- Wilaya : ${formData.wilaya}\n` : ''}${formData.phone ? `- Téléphone : ${formData.phone}\n` : ''}- Véhicule : ${formData.make || 'Non précisé'} ${formData.model || ''} (${formData.year || 'Année indéfinie'})
- Pièce recherchée : ${formData.description || 'Scan 3D ou modélisation nécessaire'}
- Finition souhaitée : ${formData.finish || 'Standard Noir'}

Merci de me confirmer la faisabilité et le devis !`;
  return `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent(text)}`;
}
