# Running Your Portfolio with Nx

## ✅ Nx is Now Configured!

You can now use `nx serve` to run your portfolio with automatic browser opening and live reload.

## 🚀 Quick Start Commands

### Development Server (Recommended)

```bash
nx serve
# or
npm start
# or
npm run dev
```

This will:

- Start server on **http://localhost:4200**
- Automatically open your browser
- Disable caching for development

### Alternative Commands

```bash
# Using npm scripts
npm run serve    # Same as nx serve
npm start        # Same as nx serve

# Preview on different port
nx preview       # Opens on http://localhost:8080
```

## 📦 Initial Setup (One Time Only)

If you're setting this up on a new machine:

```bash
npm install
```

Then you can use any of the serve commands above.

## 🎯 Why Nx?

Using Nx gives you:

- **Better DX**: Simple `nx serve` command
- **Consistency**: Works the same across different projects
- **Scalability**: Easy to add more features/projects later
- **Caching**: Smart caching for better performance (when needed)

## 🛑 Stopping the Server

Press `Ctrl+C` in the terminal where the server is running.

## 🔄 Other Options (Still Available)

If you prefer not to use Nx, you can still use:

```bash
python3 -m http.server 8000
```

---

**Now just run `nx serve` and your portfolio will open automatically!** 🎉
