# 🚀 Vercel deployment guide - Brand360

## Option 1: Deploy from GitHub (recommended)

### Step 1: Push the code to GitHub

1. Initialize a Git repository (if you haven't already):
```bash
cd Brand360
git init
git add .
git commit -m "Initial commit - Brand360"
```

2. Create a repository on GitHub and connect it:
```bash
git remote add origin https://github.com/tu-usuario/brand360.git
git branch -M main
git push -u origin main
```

### Step 2: Connect with Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **\"Add New Project\"**
3. Import your `brand360` repository
4. Vercel will automatically detect it as a Vite project

### Step 3: Configure environment variables (optional)

If you want to use real AI in production:

1. In the project configuration on Vercel, go to **Settings > Environment Variables**
2. Add the following variables:
   - `VITE_AI_PROVIDER`: `openai`, `gemini`, or `mock`
   - `VITE_AI_API_KEY`: Your API key (if you are not using mock mode)

3. Click **Save** and **Redeploy**

### Step 4: Deploy

1. Vercel will deploy automatically
2. Your app will be available at `https://your-project.vercel.app`
3. Each push to `main` will trigger a new deployment

---

## Option 2: Deploy using Vercel CLI

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Log in

```bash
vercel login
```

### Step 3: Deploy

From the project folder:

```bash
cd Brand360
vercel
```

Follow the prompts:
- **Set up and deploy?** → `Y`
- **Which scope?** → Select your account
- **Link to existing project?** → `N` (first time)
- **Project name?** → `brand360` (or whatever you prefer)
- **Directory?** → `./` (press Enter)
- **Override settings?** → `N`

### Step 4: Configure environment variables (optional)

```bash
vercel env add VITE_AI_PROVIDER
# Enter: mock (or openai/gemini)

vercel env add VITE_AI_API_KEY
# Enter your API key (if you are not using mock)
```

### Step 5: Deploy to production

```bash
vercel --prod
```

---

## Option 3: Deploy from Vercel Dashboard (without Git)

1. Go to [vercel.com](https://vercel.com)
2. Click **\"Add New Project\"**
3. Select **\"Upload\"** instead of importing from Git
4. Zip the `Brand360` folder
5. Upload the ZIP
6. Vercel will automatically detect the configuration

---

## ⚙️ Automatic configuration

The `vercel.json` file is already configured with:
- ✅ Build command: `npm run build`
- ✅ Output directory: `dist`
- ✅ Framework: Vite
- ✅ Rewrites for SPA (Single Page Application)
- ✅ Cache headers for assets

## 🔧 Environment variables on Vercel

### For development (Preview)
- Go to **Settings > Environment Variables**
- Add variables with **Environment** = `Preview`

### For production
- Add the same variables with **Environment** = `Production`

### Available variables:
```
VITE_AI_PROVIDER=mock|openai|gemini
VITE_AI_API_KEY=your_api_key_here
```

## 📝 Post-deployment checklist

1. ✅ The app loads correctly
2. ✅ Tailwind styles are applied
3. ✅ Animations work
4. ✅ The 3-step flow works
5. ✅ Identity generation works (mock or real AI)

## 🐛 Troubleshooting

### Error: "Build failed"
- Verify that `package.json` has all the correct scripts
- Check the build logs in the Vercel Dashboard

### Error: "404 on routes"
- Verify that `vercel.json` has the rewrite configured
- Make sure the `outputDirectory` is `dist`

### Environment variables not working
- Verify that variable names start with `VITE_`
- Redeploy after adding variables
- Check that they are in the correct environment (Production/Preview)

### Assets not loading
- Verify that paths are relative
- Check the `base` configuration in `vite.config.js` if needed

## 🔗 Useful URLs

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Vercel docs**: https://vercel.com/docs
- **Vite docs**: https://vitejs.dev/guide/static-deploy.html#vercel

## ✨ Deployment features

- ✅ **Automatic deploys** on every push to main
- ✅ **Preview deployments** for each PR
- ✅ **Automatic HTTPS**
- ✅ **Global CDN** for static assets
- ✅ **Analytics** (optional, requires Pro plan)

---

**Your Brand360 app will be online in minutes!** 🎉
