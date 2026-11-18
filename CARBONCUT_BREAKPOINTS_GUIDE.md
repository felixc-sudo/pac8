# CARBONCUT — Responsive Carbon Services & CSS Media Queries Breakpoints

Static web application demonstrating **CSS Media Queries Breakpoints** (`@media only screen and (max-width: 1024px)` for Tablet and `@media only screen and (max-width: 640px)` for Mobile), paired with an interactive Carbon Footprint Calculator and a live JavaScript **CRUD** checklist.

## Files Included
- `index.html` — Root HTML entry point for GitHub Pages and Vercel.
- `carboncut_viewport_queries.css` — Desktop, Tablet, and Mobile media query rules and theme styles.
- `carboncut_breakpoint_crud.js` — Live viewport width/breakpoint detector, carbon calculator, and CRUD task array (`addTask()`).
- `vercel.json` — Zero-config Vercel static deployment configuration.

## GitHub & Vercel Deployment Steps
1. Extract `carboncut_media_breakpoints.zip` and open a terminal inside `carboncut_media_breakpoints`.
2. Push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Add CARBONCUT CSS Media Queries website"
   git branch -M main
   git remote add origin https://github.com/<your-username>/carboncut-media-breakpoints.git
   git push -u origin main
   ```
3. Open [vercel.com](https://vercel.com), click **Add New → Project**, import `carboncut-media-breakpoints`, keep Framework Preset as **Other**, and click **Deploy**.
