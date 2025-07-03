# Étape 1: Image de base
FROM node:20-slim AS builder

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier package.json et package-lock.json pour installer les dépendances
COPY package*.json ./

# Installer les dépendances de production
RUN npm install --omit=dev

# Étape 2: Construire l'image finale
FROM node:20-slim

# Définir le répertoire de travail
WORKDIR /app

# Copier les dépendances du builder
COPY --from=builder /app/node_modules ./node_modules

# Copier le reste du code de l'application (server.js, etc.)
COPY . .

# Le port que votre application Express écoute
# Cloud Run injectera la variable PORT, mais pour Dockerfile, 
# c'est mieux d'avoir une valeur par défaut ou de s'assurer que votre app l'utilise.
# Votre server.js utilise déjà process.env.PORT || 5000, ce qui est parfait.
# Cloud Run attend que votre application écoute sur $PORT (8080 par défaut dans Cloud Run)
EXPOSE 8080 

# Commande pour démarrer votre application
CMD ["node", "server.js"]
