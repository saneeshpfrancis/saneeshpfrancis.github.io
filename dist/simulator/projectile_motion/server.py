#!/usr/bin/env python3
"""
Lightweight Local HTTP Server for Projectile Motion Simulation
Serves the web application and opens it automatically in the default web browser.
"""

import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 8080

class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Enable caching headers and proper MIME types for ES6 modules
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

def run_server(port=PORT):
    # Ensure working directory is the script directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)

    # Find open port if 8080 is busy
    while port < 8090:
        try:
            with socketserver.TCPServer(("", port), Handler) as httpd:
                url = f"http://localhost:{port}/index.html"
                print("=" * 60)
                print("🚀 Projectile Motion Physics Science Lab Simulation")
                print("=" * 60)
                print(f"Server running at: {url}")
                print("Press Ctrl+C to stop the server.")
                print("=" * 60)

                # Open browser
                webbrowser.open(url)
                httpd.serve_forever()
        except OSError as e:
            if "Address already in use" in str(e) or e.errno == 98 or e.errno == 10048:
                port += 1
                continue
            raise

if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else PORT
    try:
        run_server(port)
    except KeyboardInterrupt:
        print("\nServer stopped gracefully.")
