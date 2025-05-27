# 🔐 Secure API Key Setup Guide

This guide shows you how to safely store and use API keys for the LLMs.txt Generator.

## 🚨 **NEVER put API keys in frontend code!**

API keys should always be stored securely on the server side. Here's how to do it properly:

## 📋 **Required API Keys**

### 1. **OpenAI API Key**
- Go to [OpenAI Platform](https://platform.openai.com/api-keys)
- Create a new API key
- Copy the key (starts with `sk-`)

### 2. **Stripe API Keys**
- Go to [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
- Copy **Publishable key** (starts with `pk_test_` or `pk_live_`)
- Copy **Secret key** (starts with `sk_test_` or `sk_live_`)

## 🛠️ **Local Development Setup**

### Step 1: Create Environment File
```bash
# Create .env.local file in your project root
touch .env.local
```

### Step 2: Add Your API Keys
```bash
# Edit .env.local and add:
OPENAI_API_KEY=sk-your-actual-openai-key-here
STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
```

### Step 3: Install Dependencies
```bash
npm install
```

### Step 4: Run Development Server
```bash
npm run dev
```

## 🚀 **Production Deployment (Vercel)**

### Step 1: Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Step 2: Add Environment Variables in Vercel Dashboard
1. Go to your project in [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Settings** → **Environment Variables**
3. Add these variables:

| Name | Value | Environment |
|------|-------|-------------|
| `OPENAI_API_KEY` | `sk-your-key...` | Production |
| `STRIPE_PUBLISHABLE_KEY` | `pk_live_your-key...` | Production |
| `STRIPE_SECRET_KEY` | `sk_live_your-key...` | Production |

### Step 3: Redeploy
```bash
vercel --prod
```

## 🔒 **Security Best Practices**

### ✅ **DO:**
- Store API keys in environment variables
- Use different keys for development/production
- Keep secret keys on the server only
- Use HTTPS in production
- Regularly rotate API keys

### ❌ **DON'T:**
- Put API keys in frontend JavaScript
- Commit `.env.local` to Git
- Share API keys in chat/email
- Use production keys in development
- Hardcode keys in source code

## 📁 **File Structure**
```
llmstxt/
├── api/
│   ├── analyze.js      # AI analysis endpoint
│   ├── config.js       # Public config endpoint
│   └── payment.js      # Payment processing
├── .env.local          # Local environment (not in Git)
├── env.example         # Example environment file
├── .gitignore          # Excludes .env.local
└── package.json        # Dependencies
```

## 🧪 **Testing**

### Test with Stripe Test Cards:
- **Success:** `4242 4242 4242 4242`
- **Decline:** `4000 0000 0000 0002`
- **Requires Auth:** `4000 0025 0000 3155`

Use any future expiry date and any 3-digit CVC.

## 🔧 **API Endpoints**

### `/api/config` (GET)
Returns public configuration (publishable keys only)

### `/api/analyze` (POST)
Processes AI analysis requests
```json
{
  "url": "https://example.com",
  "scrapedData": {...},
  "tier": "premium"
}
```

### `/api/payment` (POST)
Processes Stripe payments
```json
{
  "payment_method_id": "pm_...",
  "amount": 299
}
```

## 🆘 **Troubleshooting**

### "API key not configured"
- Check environment variables are set correctly
- Redeploy after adding environment variables
- Verify key format (starts with correct prefix)

### "Payment system not initialized"
- Check Stripe publishable key is loaded
- Verify Stripe.js is loaded in browser
- Check network connectivity

### "AI analysis failed"
- Verify OpenAI API key has credits
- Check API key permissions
- Monitor OpenAI usage dashboard

## 💰 **Cost Estimation**

### OpenAI API Costs:
- GPT-4: ~$0.03 per 1K tokens
- Average analysis: ~500 tokens = $0.015
- Your cost per $2.99 sale: ~$0.02

### Stripe Fees:
- 2.9% + $0.30 per transaction
- On $2.99: ~$0.39 in fees
- Your net revenue: ~$2.58

## 🔄 **Key Rotation**

Rotate API keys regularly:
1. Generate new keys in respective dashboards
2. Update environment variables
3. Test functionality
4. Deactivate old keys

---

**Remember: Security is paramount. Never expose secret keys to the frontend!** 