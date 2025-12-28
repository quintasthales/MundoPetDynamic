# Database & Production Features Setup Guide

This guide will help you set up the database, authentication, email notifications, and analytics for your MundoPetZen e-commerce site.

## 🗄️ Database Setup

### Option 1: Local PostgreSQL (Development)

1. **Install PostgreSQL:**
   ```bash
   # Ubuntu/Debian
   sudo apt-get install postgresql postgresql-contrib
   
   # macOS
   brew install postgresql
   ```

2. **Create Database:**
   ```bash
   sudo -u postgres psql
   CREATE DATABASE mundopetzen;
   CREATE USER mundopet WITH ENCRYPTED PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE mundopetzen TO mundopet;
   \q
   ```

3. **Update .env.local:**
   ```
   DATABASE_URL="postgresql://mundopet:your_password@localhost:5432/mundopetzen"
   ```

### Option 2: Cloud Database (Production - Recommended)

#### Vercel Postgres (Easiest)
1. Go to your Vercel project dashboard
2. Click "Storage" → "Create Database" → "Postgres"
3. Copy the `DATABASE_URL` to your `.env.local`

#### Supabase (Free Tier Available)
1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings → Database → Connection String
4. Copy connection string to `.env.local`

#### Railway (Simple & Affordable)
1. Create account at [railway.app](https://railway.app)
2. New Project → Add PostgreSQL
3. Copy `DATABASE_URL` from Variables tab

### Run Database Migrations

```bash
# Generate Prisma Client
pnpm prisma generate

# Create database tables
pnpm prisma db push

# (Optional) Seed sample data
pnpm prisma db seed
```

---

## 🔐 Authentication Setup (NextAuth.js)

### 1. Generate Secret Key

```bash
openssl rand -base64 32
```

### 2. Update .env.local

```env
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-generated-secret-key"
```

### 3. Google OAuth (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Secret to `.env.local`:

```env
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

---

## 📧 Email Notifications Setup

### Option 1: Gmail (Easiest for Testing)

1. **Enable 2-Factor Authentication** on your Google Account
2. **Create App Password:**
   - Go to Google Account → Security
   - 2-Step Verification → App passwords
   - Generate password for "Mail"

3. **Update .env.local:**
```env
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-app-specific-password"
```

### Option 2: SendGrid (Production - Recommended)

1. Create account at [sendgrid.com](https://sendgrid.com)
2. Create API key
3. Update `.env.local`:

```env
EMAIL_HOST="smtp.sendgrid.net"
EMAIL_PORT="587"
EMAIL_USER="apikey"
EMAIL_PASSWORD="your-sendgrid-api-key"
```

### Option 3: Resend (Modern Alternative)

1. Create account at [resend.com](https://resend.com)
2. Get API key
3. Install: `pnpm add resend`
4. Use Resend SDK instead of nodemailer

---

## 📊 Analytics Setup

### Google Analytics 4

1. Go to [Google Analytics](https://analytics.google.com)
2. Create new property (GA4)
3. Get Measurement ID (starts with G-)
4. Add to `.env.local`:

```env
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
```

### Facebook Pixel

1. Go to [Facebook Events Manager](https://business.facebook.com/events_manager)
2. Create new Pixel
3. Copy Pixel ID
4. Add to `.env.local`:

```env
NEXT_PUBLIC_FB_PIXEL_ID="XXXXXXXXXXXXXXXX"
```

---

## 💳 Payment Integration

### PagSeguro Configuration

Already configured! Just update your credentials in `.env.local`:

```env
NEXT_PUBLIC_PAGSEGURO_EMAIL="your-pagseguro-email@example.com"
NEXT_PUBLIC_PAGSEGURO_TOKEN="your-pagseguro-token"
PAGSEGURO_SANDBOX="true"  # Set to "false" for production
```

---

## 🎟️ Coupon System

### Create Sample Coupons

Run this in your terminal after database is set up:

```bash
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedCoupons() {
  await prisma.coupon.createMany({
    data: [
      {
        code: 'BEMVINDO10',
        description: 'Desconto de 10% para novos clientes',
        type: 'PERCENTAGE',
        value: 10,
        minPurchase: 50,
        maxUses: 100,
        validFrom: new Date('2024-01-01'),
        validUntil: new Date('2025-12-31'),
      },
      {
        code: 'FRETEGRATIS',
        description: 'Frete grátis em compras acima de R$ 100',
        type: 'FIXED',
        value: 15,
        minPurchase: 100,
        maxUses: 500,
        validFrom: new Date('2024-01-01'),
        validUntil: new Date('2025-12-31'),
      },
    ],
  });
  console.log('Coupons created!');
}

seedCoupons().then(() => process.exit(0));
"
```

---

## 🚀 Deployment Checklist

### Before Deploying to Production:

- [ ] Database created and migrated
- [ ] Environment variables set in Vercel
- [ ] Email service configured and tested
- [ ] Analytics tracking codes added
- [ ] Payment gateway in production mode
- [ ] SSL certificate enabled (automatic on Vercel)
- [ ] Custom domain configured
- [ ] Test all features in production

### Vercel Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

```
DATABASE_URL
NEXTAUTH_URL
NEXTAUTH_SECRET
GOOGLE_CLIENT_ID (optional)
GOOGLE_CLIENT_SECRET (optional)
EMAIL_HOST
EMAIL_PORT
EMAIL_USER
EMAIL_PASSWORD
NEXT_PUBLIC_APP_URL
NEXT_PUBLIC_GA_ID
NEXT_PUBLIC_FB_PIXEL_ID
NEXT_PUBLIC_PAGSEGURO_EMAIL
NEXT_PUBLIC_PAGSEGURO_TOKEN
PAGSEGURO_SANDBOX
```

---

## 📝 Testing

### Test Database Connection

```bash
pnpm prisma studio
```

This opens a GUI to view and edit your database.

### Test Email Sending

Create a test file `test-email.ts`:

```typescript
import { sendOrderConfirmation } from './src/lib/email';

sendOrderConfirmation({
  email: 'your-email@example.com',
  name: 'Test User',
  orderNumber: 'TEST-001',
  total: 100,
  items: [
    { name: 'Test Product', quantity: 1, price: 100 }
  ],
}).then(() => console.log('Email sent!'));
```

Run: `npx ts-node test-email.ts`

---

## 🆘 Troubleshooting

### Database Connection Issues

- Check DATABASE_URL format
- Ensure database server is running
- Check firewall rules
- Verify credentials

### Email Not Sending

- Check SMTP credentials
- Verify app password (for Gmail)
- Check spam folder
- Enable "Less secure app access" (Gmail)

### Analytics Not Tracking

- Verify tracking IDs are correct
- Check browser console for errors
- Ensure ad blockers are disabled
- Wait 24-48 hours for data to appear

---

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Nodemailer Documentation](https://nodemailer.com)
- [Google Analytics 4 Guide](https://support.google.com/analytics/answer/9304153)
- [PagSeguro API Docs](https://dev.pagseguro.uol.com.br/reference/api-reference)

---

## 🎉 You're Ready!

Once everything is configured, your e-commerce site will have:

✅ User authentication and accounts
✅ Database-backed products and orders
✅ Email notifications for orders
✅ Analytics tracking
✅ Coupon/discount system
✅ Production-ready infrastructure

Need help? Check the documentation or contact support!
