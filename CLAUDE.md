# RénoRadar

## Projet

Plateforme de leads passoires thermiques pour artisans RGE. On croise les données ouvertes DPE (ADEME) avec cadastre, registre des entreprises, DVF pour générer des fiches prospects qualifiées.

**Marché** : 4.8M de passoires thermiques en France. Interdiction location G depuis 2025, F en 2028, E en 2034. Les artisans paient 25-80€/lead via agences classiques.

**Concurrent direct** : ProChantier (seul, early-stage, pas de traction visible).

## Branding

- **Nom** : RénoRadar
- **Baseline** : "Détectez les passoires thermiques près de chez vous"
- **Logo** : sonde radar (arcs concentriques ouverts + point central), trait foncé
- **Couleurs** : accent chartreuse #C8F23D, fond blanc/gris clair, noir pour texte
- **Typos** : Space Grotesk (titres, chiffres, brand) + Plus Jakarta Sans (corps de texte)
- **Ton** : pas de jargon tech. "Prospect" ou "chantier", jamais "lead"

## Stack technique prévue

- Next.js + Vercel
- PostgreSQL sur Railway
- Stripe (crédits + abonnements)
- Leaflet ou Mapbox GL (carte)
- Brevo (emails alertes)
- Cron hebdo : sync API ADEME

## APIs et sources de données

| Source | Endpoint | Usage |
|---|---|---|
| ADEME DPE | `data.ademe.fr/data-fair/api/v1/datasets/meg-83tjwtg8dyz4vv7h1dqe/lines` | Base principale : 14.3M DPE, 108+ champs, mise à jour hebdo |
| API Adresse (BAN) | `api-adresse.data.gouv.fr/search` | Géolocalisation + ID parcelle |
| Cadastre IGN | `apicarto.ign.fr/api/cadastre/parcelle` | Parcelle cadastrale |
| Recherche Entreprises | `recherche-entreprises.api.gouv.fr/search` | SCI + dirigeants à une adresse |
| DVF | `apidf-preprod.cerema.fr/dvf_opendata/geomutations` | Transactions récentes |
| ADEME RGE | `data.ademe.fr` (liste-des-entreprises-rge-2) | Liste artisans avec tel + email |
| Dropcontact | API payante ~0.05€/contact | Email dirigeant SCI |

### Exemples de requêtes ADEME

```bash
# Tous les F/G chauffés au fioul dans le 62, maisons > 60m², DPE < 18 mois
/lines?etiquette_dpe_in=F,G&code_departement_ban_eq=62&type_batiment_eq=maison&surface_habitable_logement_gte=60&type_energie_principale_chauffage_eq=Fioul%20domestique&date_etablissement_dpe_gte=2024-09-22&size=100

# Compter les F/G d'un département
/lines?etiquette_dpe_in=F,G&code_departement_ban_eq=62&size=0

# SCI à une adresse
https://recherche-entreprises.api.gouv.fr/search?q=21%20rue%20de%20douai%2062450
```

### Rate limits ADEME
- Anonyme : 600 req/60s
- Avec clé API : 1200 req/60s
- Licence Ouverte v2.0 (usage commercial OK, citer ADEME)

## Modèle économique

### 3 couches
1. **Gratuit** : carte + compteur + 3 fiches offertes
2. **Crédits** : 2-3€/fiche, accès J+30 (30j de délai vs exclusifs)
3. **Exclusif** : 149-399€/mois, max 3 par spécialité par zone, accès J+0

### Un bien = plusieurs ventes
PAC + isolation + menuiseries = 3 spécialités = 3 ventes du même bien. Pas de concurrence entre eux.

### Flou gratuit vs déblocage payant
- **Visible** : commune, DPE (F/G), type chauffage, tranche surface, score, "Propriétaire identifié" (oui/non)
- **Payant** : adresse exacte, isolation détaillée, facture, SCI + gérants, argumentaire, contact

## Départements de lancement

1. Pas-de-Calais (62) — 6 456 maisons F/G < 18 mois, 1 574 au fioul
2. Isère (38) — 28% fioul, zone H1
3. Moselle (57) — 26% fioul, zone H1 très froide

## Contrainte légale critique

**Prospection téléphonique rénovation énergétique = INTERDITE** (loi 24/07/2020, amende 375K€).
Seuls canaux légaux : courrier postal + visite sur place. Notre service de courrier Manuscry est donc LE canal de prospection.

## Envoi courrier : Manuscry

- API REST, 2,50€/carte manuscrite (robot stylo), pas d'abonnement
- On vend 3,50€ à l'artisan, 1€ marge
- Personnalisation dynamique, QR code trackable, J+2 livraison
- Site : manuscry.com

## Enrichissement propriétaire

- SCI : API Recherche Entreprises (gratuit) + Fichier Personnes Morales data.gouv.fr
- Entrepreneurs individuels : SIRENE par adresse (~60% trouvables)
- Copros : Registre National des Copropriétés (syndic)
- Particuliers : Cartegie (data broker, 20M propriétaires, devis : 01.44.51.66.99)
- Fallback : courrier "Le Propriétaire, [adresse]" (légal sans connaître le nom)

## Fichiers du projet

```
renoradar/
├── CLAUDE.md
├── data/
│   └── leads-pret-a-equiper-62.csv     ← 30 leads PAC-ready, Pas-de-Calais
├── leads-sample/
│   ├── fiche-bremes-vanhaecke.html      ← fiche pour Geothermie Vanhaecke
│   ├── fiche-thiembronne-boudringhin.html ← fiche pour EURL N Boudringhin
│   ├── fiche-arques-boudringhin.html    ← ancienne fiche (isolation insuffisante)
│   ├── fiche-lead-01-bapaume.html       ← template original
│   └── liste-artisans-PAC-62-saint-omer.md
├── guide-prospection.html               ← guide cold call complet
```

## Prochaines étapes

1. [x] Cold call artisans PAC zone Saint-Omer — 2 intéressés (Boudringhin, Vanhaecke)
2. [x] Envoyer fiches personnalisées aux 2 artisans
3. [ ] Attendre retour Boudringhin + Vanhaecke (follow-up J+3)
4. [ ] Acheter le domaine renoradar.fr
5. [ ] Contacter Cartegie pour devis enrichissement propriétaire
6. [ ] Contacter Manuscry pour accès API
7. [ ] Poser l'architecture Next.js de la plateforme
8. [ ] Télécharger Fichier Personnes Morales (data.gouv.fr) et intégrer en base
9. [ ] Implémenter la sync ADEME → PostgreSQL
10. [ ] Carte Leaflet avec points floutés par spécialité
11. [ ] Système de crédits Stripe
12. [ ] Intégration Manuscry (bouton "Envoyer un courrier")
