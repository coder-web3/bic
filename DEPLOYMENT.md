# Deployment & Backup Strategy

## 1. INDEPENDENT PRODUCTION BUILD
- The BIC Next.js application is a permanent, standalone production system.
- It does NOT rely on Antigravity, AI runtimes, or development-only APIs.
- The repository must be built and run using standard Node.js environments.

## 2. DEPLOYMENT REQUIREMENTS
- **Node.js**: Compatible LTS version.
- **Environment Variables**: Must be securely injected into the production environment. Do not commit `.env` files.
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Hosting**: Can be deployed to standard VPS (e.g., Ubuntu + PM2/Docker), Vercel, AWS, or any provider supporting Next.js production builds.

## 3. ENVIRONMENT VARIABLES
The production server requires the following secrets:
```env
# Database
DATABASE_URL="mysql://USERNAME:PASSWORD@HOST:3306/DATABASE_NAME"

# Authentication
AUTH_SECRET="strong_random_generated_secret"

# Storage / Media
STORAGE_PATH="/var/www/bic/media" # or S3 credentials
```

## 4. DATABASE MIGRATIONS IN PRODUCTION
- Never run `npx prisma db push` against the remote production MySQL database.
- Use `npx prisma migrate deploy` to safely apply trackable, version-controlled migrations to the schema.
- Because the existing WordPress database serves as the live data source, CMS migrations must be explicitly verified to ensure they do not DROP, TRUNCATE, or overwrite WordPress tables.

## 5. BACKUP & RECOVERY STRATEGY
A disaster recovery plan must be established because this is a long-term production application.
1. **Database Backups**: The MySQL database must have automated daily backups (e.g., cron job using `mysqldump` or provider-managed backups).
2. **Media Backups**: Uploaded media must be backed up to a secondary storage location or synced via rsync/S3 replication.
3. **Source Code**: Tracked in Git, safely stored in a private repository.
4. **Environment**: A clear record of environment requirements (without actual secrets) must be documented for quick recovery.
