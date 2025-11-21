# 🚀 Deployment Guide

Complete guide to deploying **The Infiltrators & The Ghost** to production.

## Pre-Deployment Checklist

Before deploying, ensure:

- [ ] `npm run build` completes successfully
- [ ] All tests pass (if you've added tests)
- [ ] No linting errors: `npm run lint`
- [ ] Game works correctly in production mode: `npm start`
- [ ] Environment variables are configured
- [ ] Gemini API key is ready (optional)

## Quick Deploy Options

### Option 1: Vercel (Recommended) ⭐

**Easiest and fastest deployment method.**

#### Method A: Deploy from GitHub

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_REPO_URL
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your repository
   - Add environment variable:
     - Key: `NEXT_PUBLIC_GEMINI_API_KEY`
     - Value: `your_api_key`
   - Click "Deploy"

3. **Done!** Your game is live in ~2 minutes.

#### Method B: Deploy with Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts and add API key when asked
```

**Custom Domain:**
- Go to Project Settings → Domains
- Add your custom domain
- Update DNS records as shown

### Option 2: Netlify

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy:**
   
   **Via Netlify CLI:**
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli
   
   # Login
   netlify login
   
   # Deploy
   netlify deploy --prod
   ```

   **Via Netlify Website:**
   - Drag and drop the `.next` folder to [netlify.com/drop](https://app.netlify.com/drop)

3. **Add Environment Variables:**
   - Site Settings → Environment Variables
   - Add: `NEXT_PUBLIC_GEMINI_API_KEY`

### Option 3: Railway

1. **Install Railway CLI:**
   ```bash
   npm install -g @railway/cli
   ```

2. **Deploy:**
   ```bash
   railway login
   railway init
   railway up
   ```

3. **Add Variables:**
   - Dashboard → Variables → Add `NEXT_PUBLIC_GEMINI_API_KEY`

### Option 4: DigitalOcean App Platform

1. **Create `app.yaml`:**
   ```yaml
   name: undercover-game
   services:
   - name: web
     github:
       repo: YOUR_USERNAME/undercover
       branch: main
     build_command: npm run build
     run_command: npm start
     envs:
     - key: NEXT_PUBLIC_GEMINI_API_KEY
       value: YOUR_KEY
   ```

2. **Deploy:**
   - Go to [cloud.digitalocean.com/apps](https://cloud.digitalocean.com/apps)
   - Create App → From GitHub
   - Select repository
   - Deploy

### Option 5: Self-Hosted (VPS)

#### On Ubuntu/Debian Server

1. **Install Node.js:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. **Clone and Setup:**
   ```bash
   git clone YOUR_REPO_URL
   cd undercover
   npm install
   npm run build
   ```

3. **Create `.env.local`:**
   ```bash
   echo "NEXT_PUBLIC_GEMINI_API_KEY=your_key" > .env.local
   ```

4. **Run with PM2:**
   ```bash
   # Install PM2
   sudo npm install -g pm2
   
   # Start app
   pm2 start npm --name "undercover" -- start
   
   # Enable startup
   pm2 startup
   pm2 save
   ```

5. **Setup Nginx (Optional):**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## Environment Variables

### Required for AI Features
```env
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

**Getting the API Key:**
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with Google account
3. Click "Create API Key"
4. Copy and use in deployment

**Note:** Game works perfectly without this key using fallback words!

## Build Configuration

### Next.js Configuration

The `next.config.mjs` is already optimized:

```javascript
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};
```

### Performance Optimizations

Already included:
- ✅ SWC minification
- ✅ Image optimization ready
- ✅ Code splitting (automatic)
- ✅ Static page generation where possible
- ✅ Optimized fonts (Google Fonts)

## Custom Domain Setup

### With Vercel
1. Project Settings → Domains
2. Add your domain
3. Configure DNS:
   - Type: `A`
   - Name: `@`
   - Value: `76.76.21.21`
   
   - Type: `CNAME`
   - Name: `www`
   - Value: `cname.vercel-dns.com`

### With Netlify
1. Domain Settings → Add Custom Domain
2. Follow DNS configuration instructions
3. Enable HTTPS (automatic)

### With Cloudflare (Any Provider)
1. Add site to Cloudflare
2. Update nameservers at your domain registrar
3. Add DNS records pointing to your hosting
4. Enable SSL/TLS

## SSL/HTTPS

### Automatic (Recommended)
- ✅ Vercel: Automatic SSL
- ✅ Netlify: Automatic SSL
- ✅ Railway: Automatic SSL

### Manual (VPS)
```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal is set up automatically
```

## Post-Deployment

### Testing Checklist

Test all features after deployment:

- [ ] Home page loads
- [ ] Game setup works
- [ ] Role assignment works (pass-the-phone)
- [ ] Gameplay screens function
- [ ] Voting works
- [ ] Victory screen displays
- [ ] AI word generation works (if key added)
- [ ] Offline words work as fallback
- [ ] Mobile responsive
- [ ] PWA installable
- [ ] All animations smooth

### Performance Testing

1. **Lighthouse Audit:**
   - Open Chrome DevTools
   - Go to Lighthouse tab
   - Run audit
   - Aim for 90+ scores

2. **Mobile Testing:**
   - Test on actual mobile devices
   - Check touch interactions
   - Verify animations are smooth
   - Test pass-the-phone mechanics

3. **Load Testing:**
   - Multiple simultaneous users
   - Verify API doesn't rate limit
   - Check response times

## Monitoring & Analytics

### Add Analytics (Optional)

**Vercel Analytics:**
```bash
npm install @vercel/analytics
```

Add to `app/layout.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react';

// In component:
<Analytics />
```

**Google Analytics:**
Add to `app/layout.tsx` in `<head>`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
```

### Error Tracking

**Sentry (Recommended):**
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

## Scaling Considerations

### For High Traffic

1. **CDN**: Already included with Vercel/Netlify
2. **Caching**: Static assets automatically cached
3. **Rate Limiting**: Consider for API route
4. **Database**: Not needed (no user data)

### API Rate Limits

Gemini API has rate limits:
- Free tier: 60 requests/minute
- Consider caching word generation results
- Fallback words ensure no downtime

## Maintenance

### Regular Updates

```bash
# Update dependencies
npm update

# Check for outdated packages
npm outdated

# Update major versions carefully
npm install package@latest
```

### Backup

```bash
# Backup code
git push origin main

# Backup environment variables
# Store .env.local in secure location (NOT in git)
```

## Troubleshooting

### Build Fails

**"Module not found"**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

**"Out of memory"**
```bash
NODE_OPTIONS=--max_old_space_size=4096 npm run build
```

### Runtime Issues

**API not working**
- Verify environment variable is set correctly
- Check API key is valid
- Ensure fallback words are working

**Slow performance**
- Enable caching
- Check network tab for slow requests
- Optimize images (if added)

**Mobile issues**
- Test on real devices
- Check viewport meta tag
- Verify touch events work

## Cost Estimates

### Free Tier Options
- ✅ **Vercel**: Free for hobby projects (100GB bandwidth/month)
- ✅ **Netlify**: Free (100GB bandwidth/month)
- ✅ **Railway**: $5/month credit (hobby tier)
- ✅ **Gemini API**: Free tier (60 requests/minute)

### Paid Options (If Needed)
- **Vercel Pro**: $20/month (unlimited bandwidth)
- **Netlify Pro**: $19/month
- **VPS**: $5-10/month (DigitalOcean, Linode)

**Recommendation**: Start with free tiers!

## Security Best Practices

### Already Implemented ✅
- Environment variables for API keys
- No sensitive data storage
- Client-side only processing
- HTTPS by default (on Vercel/Netlify)
- No user authentication needed

### Additional Security (Optional)
- Rate limiting on API routes
- CORS configuration
- Security headers (automatic on Vercel)

## Rollback Strategy

### Quick Rollback

**Vercel:**
- Deployments → Previous Deployment → Promote to Production

**Netlify:**
- Deploys → Previous Deploy → Publish Deploy

**Git-based:**
```bash
git revert HEAD
git push origin main
# Platform auto-deploys
```

## Support & Maintenance

### Regular Checks
- [ ] Check deployment logs weekly
- [ ] Monitor API usage
- [ ] Update dependencies monthly
- [ ] Test game functionality monthly
- [ ] Renew SSL certificates (if manual)

### Documentation
- Keep README.md updated
- Document any configuration changes
- Note any custom modifications

---

## 🎉 Deployment Complete!

Once deployed, your game will be accessible worldwide!

**Share the link with friends and enjoy!**

### Example Deployment URLs

After deployment, you'll get URLs like:
- Vercel: `https://undercover-game.vercel.app`
- Netlify: `https://undercover-game.netlify.app`
- Custom: `https://yourdomain.com`

### Next Steps

1. Deploy using your preferred method
2. Test thoroughly
3. Share with friends
4. Gather feedback
5. Iterate and improve!

---

**Need help?** Check other documentation:
- [README.md](./README.md)
- [QUICKSTART.md](./QUICKSTART.md)
- [INSTALLATION.md](./INSTALLATION.md)
- [BUILD_SUMMARY.md](./BUILD_SUMMARY.md)

**Happy deploying!** 🚀🎭

