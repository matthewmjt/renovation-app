# Renovation App

## First time setup on your server

### 1. Push this to a GitHub repo
On your local machine:
```bash
cd renovation-app
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/YOUR_USERNAME/renovation-app.git
git push -u origin main
```

### 2. Clone onto your Proxmox server
```bash
git clone https://github.com/YOUR_USERNAME/renovation-app.git
cd renovation-app
```

### 3. Configure environment
```bash
cp .env.example .env
nano .env
```
Set `APP_PASSWORD` and `SESSION_SECRET` (generate secret with `openssl rand -hex 32`).

### 4. Build and run
```bash
docker compose up -d --build
```

Access at `http://<your-server-ip>:3001`

---

## Deploying updates

On your local machine, after making changes:
```bash
git add .
git commit -m "describe your change"
git push
```

On your server:
```bash
cd renovation-app
git pull
docker compose up -d --build
```

---

## Data
SQLite database lives in `./data/renovation.db` — outside the container, safe across rebuilds.

Back up with: `cp data/renovation.db data/renovation.db.bak`
