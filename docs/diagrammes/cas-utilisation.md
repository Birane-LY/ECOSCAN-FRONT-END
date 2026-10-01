# Cas d'utilisation EcoScan

```mermaid
flowchart LR
    visiteur([Visiteur])
    membre([Utilisateur d'organisation])
    adminOrg([Administrateur d'organisation])
    adminPlateforme([Administrateur plateforme])
    fournisseur([Prestataire de paiement])

    subgraph vitrine["Site vitrine"]
        consulterOffres([Consulter les offres])
        creerCompte([Créer un compte et demander un abonnement])
    end

    subgraph espace["Back-office organisation"]
        authentifier([S'authentifier])
        gererStructure([Gérer la structure, les sites et compteurs])
        importer([Importer une facture ou un document énergétique])
        suivre([Saisir les relevés et recharges énergétiques])
        consulterAnalyse([Consulter métriques et anomalies])
        traiterHypothese([Examiner et confirmer ou rejeter une hypothèse])
        suivreReco([Créer, examiner et décider une recommandation])
        gererObjectifs([Gérer les objectifs et consulter leur progression])
        consulterMemoire([Consulter la mémoire stratégique])
        interroger([Interroger l'assistant énergétique])
        gererEquipe([Gérer les membres de l'organisation])
    end

    subgraph plateforme["Administration EcoScan"]
        gererClients([Gérer organisations et utilisateurs])
        gererOffres([Gérer les plans et abonnements])
        superviser([Superviser facturation et plateforme])
    end

    visiteur --> consulterOffres
    visiteur --> creerCompte
    creerCompte --> authentifier
    membre --> authentifier
    membre --> importer
    membre --> suivre
    membre --> consulterAnalyse
    membre --> traiterHypothese
    membre --> suivreReco
    membre --> gererObjectifs
    membre --> consulterMemoire
    membre --> interroger
    adminOrg --> gererStructure
    adminOrg --> gererEquipe
    adminOrg --> gererObjectifs
    adminOrg --> importer
    adminPlateforme --> gererClients
    adminPlateforme --> gererOffres
    adminPlateforme --> superviser
    creerCompte -. "crée la demande d'abonnement" .-> gererOffres
    gererOffres -. "paiement selon le parcours configuré" .-> fournisseur
```

Le diagramme distingue la validation humaine d'une hypothèse de la décision
d'adopter une recommandation. La mesure Woyofal du rituel s'applique uniquement
aux relevés disponibles entre 08 h et 20 h.
