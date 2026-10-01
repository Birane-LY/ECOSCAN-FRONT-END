# Diagrammes EcoScan

Sources de diagrammes pour le site vitrine, le back-office, l'API Django, le
service IA/RAG et PostgreSQL. Les parcours décrivent les responsabilités et
interactions principales du système ; ils ne détaillent pas chaque écran ni
chaque endpoint.

## Fichiers

| Sujet | Mermaid | PlantUML |
|---|---|---|
| Cas d'utilisation et acteurs | [cas-utilisation.md](./cas-utilisation.md) | [cas-utilisation.puml](./cas-utilisation.puml) |
| Classes métier et relations | [classes.md](./classes.md) | [classes.puml](./classes.puml) |
| Séquences fonctionnelles | [sequences.md](./sequences.md) | [sequences.puml](./sequences.puml) |

Les fichiers Markdown contiennent des blocs Mermaid rendus par GitHub et VS
Code avec l'extension Mermaid. Les fichiers `.puml` peuvent être prévisualisés
avec l'extension PlantUML ou exportés en SVG/PNG.

## Périmètre représenté

- La vitrine permet de consulter les offres et de démarrer une inscription.
- Le back-office couvre le pilotage d'une organisation, l'import et la saisie
  énergétique, l'analyse, les objectifs, la mémoire et l'assistant.
- Django porte les règles métier, les données, les accès et les abonnements.
- Le service IA est appelé par Django pour l'assistant et l'indexation RAG ; il
  peut rappeler Django pour récupérer le contexte métier autorisé.
- Le diagramme de classes ne prétend pas recenser toutes les tables Django :
  il privilégie le domaine utilisé dans les parcours de soutenance.

## Lecture des flux

1. Un document importé est stocké, traité par la chaîne OCR/classification/
   extraction, puis présenté pour intégration et analyse.
2. Les relevés rituels et les recharges alimentent une mesure Woyofal limitée à
   la fenêtre observée de 08 h à 20 h. Une anomalie est un signal à examiner,
   pas une cause établie.
3. Une hypothèse IA reste proposée jusqu'à validation humaine. Cette validation
   peut créer une recommandation ; l'utilisateur conserve la décision.
4. L'assistant assemble les documents indexés et le contexte métier courant,
   puis transmet la requête au fournisseur LLM configuré.

Les diagrammes sont des vues de conception destinées à expliquer le système.
En cas d'évolution du code, mettre à jour les deux représentations d'un même
sujet ensemble.
