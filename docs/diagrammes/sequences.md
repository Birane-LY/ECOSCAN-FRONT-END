# Séquences principales

## Inscription depuis la vitrine et demande d'abonnement

```mermaid
sequenceDiagram
    actor Visiteur
    participant Vitrine as Site vitrine Next.js
    participant Proxy as Route API vitrine
    participant Django as API Django
    participant DB as PostgreSQL
    participant Paiement as Prestataire paiement

    Visiteur->>Vitrine: Consulte les plans
    Vitrine->>Proxy: GET /api/billing/plans
    Proxy->>Django: GET /billing/plans/
    Django->>DB: Lire les plans disponibles
    DB-->>Django: Plans actifs
    Django-->>Proxy: Réponse JSON
    Proxy-->>Vitrine: Plans affichables
    Visiteur->>Vitrine: Choisit un plan et complète le formulaire
    Vitrine->>Proxy: POST /api/register
    Proxy->>Django: POST /onboarding/ avec plan_id
    Django->>DB: Créer le compte et les objets d'organisation prévus
    DB-->>Django: Résultat d'inscription
    Django-->>Proxy: Confirmation ou erreur métier
    Proxy-->>Vitrine: Résultat de l'inscription
    opt Le parcours choisi déclenche un paiement
        Vitrine->>Django: Démarrer/consulter le checkout
        Django->>Paiement: Créer la session de paiement
        Paiement-->>Django: Statut ou URL de paiement
        Django->>DB: Enregistrer l'état de l'abonnement
    end
```

Le prestataire intervient selon le parcours de facturation réellement configuré ;
la sélection d'un plan ne doit pas être confondue avec un paiement confirmé.

## Import d'une facture et intégration analytique

```mermaid
sequenceDiagram
    actor Membre as Membre connecté
    participant BO as Back-office
    participant API as API Django
    participant DB as PostgreSQL
    participant OCR as Pipeline OCR et extraction
    participant Analyse as Services d'analyse

    Membre->>BO: Sélectionne un document
    BO->>API: Téléverser le fichier source
    API->>DB: Enregistrer FichierSource
    DB-->>API: Identifiant source
    API-->>BO: Source enregistrée
    BO->>API: Créer ImportDonnees puis lancer l'import
    API->>DB: Vérifier l'organisation et le compteur facultatif
    API->>OCR: Extraire le texte du fichier
    alt PDF contenant déjà du texte
        OCR->>OCR: Extraction textuelle pdftotext
    else Image ou PDF scanné
        OCR->>OCR: Tesseract français + Pillow/Poppler
    end
    OCR->>OCR: Classifier et extraire les champs énergétiques
    OCR-->>API: Texte, type et champs extraits
    API->>DB: Enregistrer état d'import et résultat extrait
    API-->>BO: Résultat à examiner / intégrer
    Membre->>BO: Vérifie et confirme l'intégration
    BO->>API: Confirmer les données validées
    API->>DB: Persister les données et la métrique correspondante
    API->>Analyse: Détecter les variations/anomalies applicables
    Analyse->>DB: Persister métriques et anomalies
    API-->>BO: État d'analyse consultable
```

Le contrôle humain précède l'intégration quand le pipeline demande une revue ;
un document rejeté ou incomplet n'est pas présenté comme une mesure fiable.

## Assistant RAG avec contexte métier

```mermaid
sequenceDiagram
    actor Membre as Membre connecté
    participant BO as Back-office
    participant Django as API Django
    participant IA as Service IA FastAPI
    participant RAG as RagStore isolé par organisation
    participant Contexte as Endpoint de contexte Django
    participant LLM as Routeur LLM

    Membre->>BO: Pose une question
    BO->>Django: POST question à l'assistant
    Django->>IA: POST /internal/query avec jeton interne
    IA->>RAG: Rechercher les documents de l'organisation
    RAG-->>IA: Extraits documentaires pertinents
    IA->>Contexte: GET contexte métier avec jeton interne
    Contexte->>Django: Charger métriques, objectifs et données permises
    Django-->>Contexte: Contexte métier de l'organisation
    Contexte-->>IA: Données JSON
    IA->>LLM: Question + extraits + contexte courant
    LLM-->>IA: Réponse et fournisseur utilisé
    IA-->>Django: Réponse et sources
    Django-->>BO: Résultat de l'assistant
    BO-->>Membre: Afficher réponse et sources
```

## Relevés rituels Woyofal et chaîne de décision

```mermaid
sequenceDiagram
    actor Membre as Membre connecté
    participant BO as Back-office
    participant API as API Django
    participant DB as PostgreSQL
    participant Mesure as Analyse Woyofal rituel
    participant Hypothese as Service d'hypothèse IA

    Membre->>BO: Saisit un relevé ou une recharge
    BO->>API: POST relevé/recharge pour le point suivi
    API->>DB: Vérifier droits, point, date et créneau
    API->>DB: Persister le relevé ou la recharge
    opt Créneau de clôture ou recharge déclenchant le recalcul
        API->>Mesure: Analyser les données de l'organisation/jour
        Mesure->>DB: Lire points, relevés et recharges
        Mesure->>Mesure: Calculer les intervalles 08–12, 12–16, 16–20
        Mesure->>DB: Persister métrique 08 h–20 h
        alt Référence suffisante et anomalie au-dessus du seuil
            Mesure->>DB: Persister anomalie
            Mesure->>Hypothese: Générer une cause probable
            Hypothese-->>Mesure: Hypothèse proposée
            Mesure->>DB: Persister l'hypothèse
        else Relevés/référence insuffisants ou variation normale
            Mesure-->>API: Statut explicite sans anomalie confirmée
        end
    end
    API-->>BO: Résultat et statut de traitement
    Membre->>BO: Confirme l'hypothèse après examen
    BO->>API: Confirmer l'hypothèse
    API->>DB: Enregistrer la validation humaine
    API->>DB: Créer une recommandation proposée en kWh
    API-->>BO: Hypothèse confirmée et recommandation, ou avertissement
    Membre->>BO: Accepte ou rejette la recommandation
    BO->>API: Enregistrer la décision
    API->>DB: Mettre à jour recommandation et objectif déclaré
```

La mesure Woyofal rituelle est une fenêtre observée de 08 h à 20 h, pas une
estimation de la consommation sur 24 heures. Une anomalie ne prouve jamais sa
cause ; la validation d'une hypothèse et la décision d'adopter une
recommandation sont des gestes humains distincts.
