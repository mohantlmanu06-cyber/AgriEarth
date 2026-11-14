import os
import re
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

frontend_src = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "src"))

valid_routes = {
    '/', '/about', '/how-it-works', '/nasa-data', '/features', '/contact', '/login', '/register',
    '/dashboard', '/fields', '/add-field', '/field-analysis', '/planner', '/recommendations',
    '/nasa-explorer', '/weather-climate', '/soil-health', '/crops', '/compare-rotations',
    '/what-if', '/risk-uncertainty', '/crop-history', '/data-sources', '/reports', '/settings'
}

link_pattern = re.compile(r'to=[\'"]([^\'"]+)[\'"]')
navigate_pattern = re.compile(r'navigate\([\'"]([^\'"]+)[\'"]')

mismatches = []
for root, dirs, files in os.walk(frontend_src):
    for f in files:
        if f.endswith('.tsx') or f.endswith('.jsx'):
            p = os.path.join(root, f)
            with open(p, 'r', encoding='utf-8') as fh:
                text = fh.read()
            
            for m in link_pattern.finditer(text):
                route = m.group(1).split('?')[0].split('#')[0]
                if route.startswith('${') or '{' in route:
                    continue
                # Normalize dynamic routes
                norm = re.sub(r'/\d+$', '', route)
                if route not in valid_routes and norm not in valid_routes and not route.startswith('http'):
                    mismatches.append((os.path.relpath(p, frontend_src), 'Link', route))

            for m in navigate_pattern.finditer(text):
                route = m.group(1).split('?')[0].split('#')[0]
                if route.startswith('${') or '{' in route:
                    continue
                norm = re.sub(r'/\d+$', '', route)
                if route not in valid_routes and norm not in valid_routes and not route.startswith('http'):
                    mismatches.append((os.path.relpath(p, frontend_src), 'navigate', route))

print(f"Total mismatched or dead navigation routes found: {len(mismatches)}")
for file, kind, r in mismatches:
    print(f"  [{kind}] {file} -> '{r}'")
