# 🔧 Troubleshooting Guide

## Fixed: Build Errors (November 2024)

### Issue 1: Favicon Error ✅ FIXED
**Error**: `Image import "favicon.ico" is not a valid image file`

**Solution Applied**: 
- Removed invalid favicon.ico file
- Updated layout.tsx to not require favicon
- Next.js will use default favicon handling

### Issue 2: Windows Path Error with pnpm ✅ FIXED
**Error**: `ERR_UNSUPPORTED_ESM_URL_SCHEME: Only URLs with a scheme in: file, data, and node are supported`

**Solution Applied**:
- Switched from pnpm to npm
- Cleaned up all lock files and node_modules
- Reinstalled dependencies with npm

**Updated Next.js**: Version 14.2.0 → 14.2.15 (latest stable)

---

## Current Status

The game should now run successfully with:

```bash
npm run dev
```

Then open: `http://localhost:3000`

---

## If You Still Have Issues

### 1. Clean Restart
```bash
# Stop the dev server (Ctrl+C)

# Clean everything
rm -rf .next node_modules package-lock.json

# Reinstall
npm install

# Start fresh
npm run dev
```

### 2. Check Node Version
```bash
node --version  # Should be 18.0 or higher
```

If outdated, update Node.js from [nodejs.org](https://nodejs.org/)

### 3. Windows Specific Issues

**If you see path errors:**
```bash
# Try using Git Bash instead of PowerShell
# Or use WSL (Windows Subsystem for Linux)
```

**If npm install fails:**
```bash
# Run as Administrator
# Or try:
npm install --legacy-peer-deps
```

### 4. Port Already in Use
```bash
# Use different port
npm run dev -- -p 3001
```

### 5. TypeScript Errors

If you see TS errors after starting:
```bash
# They should auto-resolve
# If not, try:
npm run build  # This will show actual errors
```

---

## Common Errors & Solutions

### "Cannot find module '@/...'
**Fix**: 
```bash
# Check tsconfig.json paths are correct
# Should have: "@/*": ["./*"]
```

### "Module not found: Can't resolve 'X'"
**Fix**:
```bash
npm install  # Reinstall dependencies
```

### CSS Not Loading
**Fix**:
```bash
# Hard refresh browser: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
# Or restart dev server
```

### Build Succeeds but Page Shows Error
**Fix**:
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

---

## Security Warnings

The npm install showed some vulnerabilities:
- **3 high, 1 critical**

These are in dev dependencies and don't affect the running game.

To fix (optional):
```bash
npm audit fix
# Or for forced fix (may break things):
# npm audit fix --force
```

⚠️ **Note**: Only run `audit fix --force` if you're prepared to test thoroughly after.

---

## Package Warnings

The following warnings during install are **safe to ignore**:
- `deprecated inflight@1.0.6` - Used by older npm packages
- `deprecated eslint@8.57.1` - Next.js still uses this version
- `deprecated glob@7.2.3` - Next.js dependency

These don't affect the game functionality.

---

## Performance Issues

### Dev Server Slow
**Windows users**: This is normal on first compile
- Subsequent hot reloads are faster
- Consider using WSL for better performance

### Build Takes Long
```bash
# Increase memory limit
set NODE_OPTIONS=--max_old_space_size=4096
npm run build
```

---

## Known Limitations

### Favicon
Currently, the game uses Next.js default favicon handling. To add a custom icon:

1. Create a proper `app/icon.png` (32x32 or 192x192)
2. Or use `app/icon.ico`
3. Next.js will auto-detect and use it

**Alternative**: Use an online tool to generate favicon files:
- [favicon.io](https://favicon.io/)
- [realfavicongenerator.net](https://realfavicongenerator.net/)

Then place files in `/public` folder.

---

## Getting Help

If none of these solutions work:

1. **Check the terminal output** - Read error messages carefully
2. **Check browser console** - Press F12 and look for errors
3. **Try a different browser** - Sometimes browser cache causes issues
4. **Restart your computer** - Clears locked files and ports

### Still Stuck?

Create an issue with:
- Your Node.js version (`node --version`)
- Your OS (Windows version)
- Full error message
- Steps you've already tried

---

## Success Checklist

Once running, you should see:

✅ Terminal shows: `✓ Ready in X.Xs`  
✅ Terminal shows: `○ Compiling /...`  
✅ Browser shows the game home screen  
✅ No red errors in browser console  
✅ Animations are smooth  

If all above are ✅, you're good to go! 🎉

---

## Next Steps After Success

1. **Test the game** - Run through one complete game
2. **Test on mobile** - Open from your phone
3. **Add API key** (optional) - For AI-generated words
4. **Deploy** - Follow DEPLOYMENT.md when ready

---

**Last Updated**: November 21, 2024  
**Issues Fixed**: Favicon error, Windows pnpm paths, Next.js version

