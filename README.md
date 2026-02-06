# Garage Management - Gestion des Véhicules

## 📋 Description
Application web full-stack pour la gestion des clients et véhicules d'un garage.

## 🛠 Stack Technique
- **Frontend:** React 18 + Vite
- **Backend:** Node.js + Express
- **BDD:** MySQL/MariaDB
- **Auth:** JWT + bcryptjs

## 🚀 Installation

### Backend
```bash
npm install
npm start  # Le serveur tourne sur http://localhost:3000

### Frontend
cd client
npm install
npm run dev  # Le client tourne sur http://localhost:5173

### BDD
Créer une base : garage_db puis importer le fichier dans configs/garage.sql
Créer l'utilisateur : 
CREATE USER 'garage_user'@'localhost' IDENTIFIED BY 'tonMotDePasse';
GRANT ALL PRIVILEGES ON garage_db.* TO 'garage_user'@'localhost';
FLUSH PRIVILEGES;
