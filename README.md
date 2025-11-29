# Vue Documentation Site

A beautiful, themeable documentation site built with Vue 3, Vite, Tailwind CSS, and daisyUI.

## Features

- 🚀 **Fast & Modern** - Built with Vue 3 and Vite for optimal performance
- 🎨 **35+ Themes** - Switch between light and dark themes using daisyUI
- 📱 **Responsive** - Works great on all devices
- 📝 **MDX Support** - Write content with Markdown/MDX
- 📚 **Easy Navigation** - Auto-generated sidebar and table of contents
- 🔗 **Shareable URLs** - Hash-based routing for bookmarkable pages

## Getting Started

### Prerequisites

- Node.js 20.19.0+ or 22.12.0+
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO

# Install dependencies
npm install

# Start development server
npm run dev
```

The development server will start at `http://localhost:5173`.

## Scripts

| Command           | Description                              |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Start development server with hot reload |
| `npm run build`   | Build for production                     |
| `npm run preview` | Preview production build locally         |

## Deployment

### Building for Production

To create a production build:

```bash
npm run build
```

This generates optimized files in the `dist/` directory:

```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── ... (other assets)
└── vite.svg
```

### Previewing the Build Locally

Before deploying, you can preview the production build:

```bash
npm run preview
```

This starts a local server at `http://localhost:4173` serving the `dist/` folder.

### GitHub Pages Deployment

This project includes automatic deployment to GitHub Pages via GitHub Actions.

#### Automatic Deployment (Recommended)

1. **Push your code to GitHub:**

   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Enable GitHub Pages in your repository:**
   - Go to your repository on GitHub
   - Navigate to **Settings** → **Pages**
   - Under "Build and deployment", set **Source** to **GitHub Actions**

3. **Trigger the deployment:**
   - The workflow runs automatically on every push to `main`
   - You can also manually trigger it from **Actions** → **Deploy to GitHub Pages** → **Run workflow**

4. **Access your site:**
   - Your site will be available at: `https://YOUR_USERNAME.github.io/YOUR_REPO/`
   - The first deployment may take a few minutes

#### Manual Deployment

If you prefer to deploy manually:

```bash
# Build with the correct base path
VITE_BASE_URL=/YOUR_REPO/ npm run build

# The dist/ folder is ready to deploy
```

### Alternative Static Hosting Platforms

The built files in `dist/` can be deployed to any static hosting platform.

#### Neocities

1. Build your project: `npm run build`
2. Go to [neocities.org](https://neocities.org) and sign in
3. Navigate to your site's dashboard
4. Upload all files from the `dist/` folder to your site
   - You can drag and drop or use the file uploader
   - Make sure to include the `assets/` folder

#### Static.app

1. Build your project: `npm run build`
2. Go to [static.app](https://static.app)
3. Drag and drop the entire `dist/` folder onto the page
4. Your site will be deployed with a unique URL

#### Sevalla (Kinsta Static)

1. Build your project: `npm run build`
2. Log in to [Sevalla](https://sevalla.com) / Kinsta
3. Create a new static site
4. Connect your GitHub repository or upload the `dist/` folder
5. Configure the build command: `npm run build`
6. Set the publish directory: `dist`

#### Vercel

1. Import your GitHub repository at [vercel.com](https://vercel.com)
2. Vercel auto-detects Vite - no configuration needed
3. Your site deploys automatically on every push

#### Netlify

1. Import your GitHub repository at [netlify.com](https://netlify.com)
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy!

#### Cloudflare Pages

1. Connect your GitHub repository at [pages.cloudflare.com](https://pages.cloudflare.com)
2. Set build command: `npm run build`
3. Set build output directory: `dist`
4. Deploy!

#### Generic Upload (FTP/SFTP)

For traditional web hosts:

1. Build your project: `npm run build`
2. Upload the contents of `dist/` to your web server's public directory (e.g., `public_html/`, `www/`, `htdocs/`)

### Custom Domain

If using a custom domain (instead of `username.github.io/repo`):

1. Set `VITE_BASE_URL=/` in your environment or update `vite.config.js`:

   ```js
   base: '/',
   ```

2. Add a `CNAME` file to the `public/` folder with your domain:
   ```
   docs.yourdomain.com
   ```

## Project Structure

```
├── public/              # Static assets (copied as-is)
├── src/
│   ├── assets/          # Processed assets
│   ├── components/      # Vue components
│   │   ├── Sidebar.vue
│   │   ├── TableOfContents.vue
│   │   └── ThemeController.vue
│   ├── docs/            # Documentation content (MD/MDX files)
│   │   ├── index.mdx
│   │   ├── getting-started/
│   │   └── guides/
│   ├── App.vue          # Main app component
│   ├── main.js          # App entry point
│   └── style.css        # Global styles
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
└── package.json
```

## Adding Documentation

1. Create a new `.md` or `.mdx` file in `src/docs/`
2. Add frontmatter at the top:

   ```markdown
   ---
   title: Your Page Title
   description: A brief description
   order: 1
   ---

   Your content here...
   ```

3. The sidebar automatically updates to include your new page

## Theming

Click the theme picker in the sidebar to switch between 35+ daisyUI themes including:

- Light themes: light, cupcake, bumblebee, emerald, corporate, retro, etc.
- Dark themes: dark, synthwave, halloween, forest, dracula, night, etc.

## Learn More

- [Vue 3 Documentation](https://vuejs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [daisyUI](https://daisyui.com/)
- [GitHub Pages](https://pages.github.com/)
