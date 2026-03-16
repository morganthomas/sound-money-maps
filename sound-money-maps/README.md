● Created nginx.conf with:

  - Port 80 — serves the Vite production build from /var/www/sound-money-maps/dist with a SPA fallback (try_files →        
  index.html) and long-lived cache headers for hashed assets.
                                                                                                                           
  You'll need to:
  1. Run npm run build and copy dist/ to /var/www/sound-money-maps/dist (or adjust root to your preferred path).

