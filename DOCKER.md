# Lancer EcoScan avec Docker Compose

Cette configuration lance le site vitrine Next.js, le back-office Next.js, l'API Django, le service IA FastAPI et PostgreSQL pour le développement et les tests locaux. Elle suppose que les trois depots sont voisins comme dans l'arborescence de developpement :

```text
Documents/
|-- ECOSCAN FRONT-END/
|   |-- docker-compose.yml
|   |-- ecoscan/
|   `-- ecoscan-front-end/
|-- ECOSCAN BACK-END/
|   `-- ecoscan-backend/
`-- ECOSCAN IA/
```

## Premiere configuration

1. Dans `ECOSCAN FRONT-END`, copiez `.env.docker.example` vers `.env.docker`.
2. Generez deux jetons aleatoires distincts et configurez-les dans `.env.docker`.
3. Dans `ECOSCAN BACK-END/ecoscan-backend`, copiez `.env.example` vers `.env`.
4. Dans `ECOSCAN IA`, copiez `.env.example` vers `.env`.
5. Renseignez dans le `.env` IA les cles des fournisseurs externes utilises (par exemple Groq). Ne commitez aucun de ces fichiers.

Les valeurs `ECOSCAN_AI_INTERNAL_TOKEN` doivent rester identiques dans Django (`AI_SERVICE_INTERNAL_TOKEN`) et FastAPI (`INTERNAL_TOKEN`). Les valeurs `ECOSCAN_DJANGO_INTERNAL_TOKEN` doivent rester identiques dans Django et FastAPI (`DJANGO_INTERNAL_TOKEN`). Compose transmet ces valeurs depuis `.env.docker`, au-dessus des valeurs d'environnement individuelles.

Depuis le dossier `ECOSCAN FRONT-END` :

```powershell
docker compose --env-file .env.docker up --build
```

Ouvrez le site vitrine sur <http://localhost:3000>, le back-office sur <http://localhost:3001>, l'API Django sur <http://localhost:8000/admin/> et la verification IA sur <http://localhost:8001/health>. Django applique automatiquement les migrations au demarrage. Les donnees PostgreSQL, les fichiers media Django et l'index RAG sont conserves dans des volumes Docker. Si un port est deja utilise, modifiez sa valeur `*_HOST_PORT` dans `.env.docker`.

L'image backend installe aussi Tesseract avec les donnees de langue francaise, Poppler pour convertir les PDF scannes, ainsi que les dependances Python `pytesseract` et `pdf2image`. Apres une mise a jour du Dockerfile ou de `requirements.txt`, reconstruisez et relancez le backend depuis ce dossier :

```powershell
docker compose --env-file .env.docker up -d --build backend
```

Cette commande remplace le conteneur backend en conservant les volumes de donnees.

Pour arreter les conteneurs sans perdre les donnees :

```powershell
docker compose --env-file .env.docker down
```

Pour supprimer aussi les donnees locales persistantes, operation irreversible :

```powershell
docker compose --env-file .env.docker down --volumes
```

Cette configuration est reservee au poste de developpement : Django fonctionne en mode DEBUG avec `runserver`, les ports sont publies uniquement sur la machine locale et les secrets de l'exemple ne sont pas destines a la production.

## Depots utilises individuellement

Chaque application possede son propre Dockerfile et peut etre construite depuis son depot. Le `docker-compose.yml` a la racine de `ECOSCAN FRONT-END` orchestre les quatre applications ensemble et inclut PostgreSQL pour le backend local.
