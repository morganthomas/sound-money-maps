● Created nginx.conf with:

  - Port 80 — serves the Vite production build from /var/www/sound-money-maps/dist with a SPA fallback (try_files →        
  index.html) and long-lived cache headers for hashed assets.
  - Port 443 — TLS termination using a certificate at /etc/ssl/certs/sound-money-maps.crt + key at                         
  /etc/ssl/private/sound-money-maps.key, proxying all traffic to http://127.0.0.1:80.                                    
                                                                                                                           
  You'll need to:
  1. Run npm run build and copy dist/ to /var/www/sound-money-maps/dist (or adjust root to your preferred path).
  2. Place your SSL certificate and key at the paths above (or update them).

