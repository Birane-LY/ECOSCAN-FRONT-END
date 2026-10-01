# Classes métier et relations

Vue simplifiée des principales classes persistées et de leurs associations.
Les détails de rôles, statuts et champs secondaires sont volontairement omis.

```mermaid
classDiagram
    class Utilisateur
    class UtilisateurOrganisation
    class Organisation
    class Site
    class Compteur
    class PointSuiviEnergetique
    class ReleveRituelEnergetique
    class RechargeRituelWoyofal
    class FichierSource
    class ImportDonnees
    class ResultatMetrique
    class Anomalie
    class Hypothese
    class Objectif
    class Recommandation
    class Action
    class MemoireStrategique
    class Plan
    class Abonnement
    class JournalAudit

    Utilisateur "1" -- "0..*" UtilisateurOrganisation : affiliation
    Organisation "1" -- "0..*" UtilisateurOrganisation : membres
    Organisation "1" *-- "0..*" Site : possède
    Site "1" *-- "0..*" Compteur : héberge
    Organisation "1" *-- "0..*" PointSuiviEnergetique : suit
    Site "0..1" -- "0..*" PointSuiviEnergetique : localise
    Compteur "0..1" -- "0..*" PointSuiviEnergetique : référence optionnelle
    PointSuiviEnergetique "1" *-- "0..*" ReleveRituelEnergetique : reçoit
    PointSuiviEnergetique "1" *-- "0..*" RechargeRituelWoyofal : reçoit

    Organisation "1" *-- "0..*" FichierSource : possède
    FichierSource "1" -- "0..*" ImportDonnees : est traité par
    Organisation "1" *-- "0..*" ImportDonnees : importe
    Organisation "1" *-- "0..*" ResultatMetrique : analyse
    Compteur "0..1" -- "0..*" ResultatMetrique : mesure optionnelle
    FichierSource "0..1" -- "0..*" ResultatMetrique : source éventuelle
    ResultatMetrique "0..1" -- "0..*" Anomalie : déclenche
    Organisation "1" *-- "0..*" Anomalie : détecte
    Anomalie "1" *-- "0..*" Hypothese : explique

    Organisation "1" *-- "0..*" Objectif : définit
    Objectif "1" -- "0..*" Recommandation : cible
    Anomalie "0..1" -- "0..*" Recommandation : origine
    Recommandation "1" *-- "0..*" Action : décompose en
    Organisation "1" *-- "0..*" MemoireStrategique : conserve
    Anomalie "0..1" -- "0..*" MemoireStrategique : retrace
    Action "0..1" -- "0..*" MemoireStrategique : référence

    Plan "1" -- "0..*" Abonnement : souscrit
    Organisation "1" -- "0..*" Abonnement : bénéficie
    Utilisateur "0..1" -- "0..*" JournalAudit : effectue
    Organisation "0..1" -- "0..*" JournalAudit : périmètre
```

`PointSuiviEnergetique` représente le suivi rituel et peut être rattaché à un
compteur physique ou fonctionner sans compteur. Les résultats agrégés du rituel
Woyofal sont au niveau de l'organisation ; les périodes couvertes sont 08 h–20 h.
La mémoire stratégique conserve les diagnostics et actions validés, pas les
relevés bruts.
