import os
import re
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

frontend_src = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "src"))

print(f"Scanning frontend directory: {frontend_src}")

all_tsx_files = []
for root, dirs, files in os.walk(frontend_src):
    for f in files:
        if f.endswith('.tsx') or f.endswith('.jsx'):
            all_tsx_files.append(os.path.join(root, f))

print(f"Found {len(all_tsx_files)} TSX/JSX files.")

total_buttons = 0
total_links = 0
dead_buttons = []
dead_links = []
empty_handlers = []
alert_handlers = []

button_pattern = re.compile(r'<button\b([^>]*)>(.*?)</button>', re.DOTALL)
link_pattern = re.compile(r'<Link\b([^>]*)>(.*?)</Link>', re.DOTALL)
a_pattern = re.compile(r'<a\b([^>]*)>(.*?)</a>', re.DOTALL)

for fpath in all_tsx_files:
    rel_path = os.path.relpath(fpath, frontend_src)
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Scan <button>
    for m in button_pattern.finditer(content):
        total_buttons += 1
        attrs = m.group(1)
        body = m.group(2).strip()[:60].replace('\n', ' ')

        has_onclick = 'onClick=' in attrs
        is_submit = 'type="submit"' in attrs or "type='submit'" in attrs
        is_reset = 'type="reset"' in attrs

        if not has_onclick and not is_submit and not is_reset:
            dead_buttons.append((rel_path, f"<button {attrs[:40]}...>{body}"))

        if re.search(r'onClick=\{\(\)\s*=>\s*\{\s*\}\}', attrs):
            empty_handlers.append((rel_path, f"Empty handler: <button {attrs[:40]}...>{body}"))

        if 'alert(' in attrs:
            alert_handlers.append((rel_path, f"Alert placeholder: <button {attrs[:40]}...>{body}"))

    # Scan <Link>
    for m in link_pattern.finditer(content):
        total_links += 1
        attrs = m.group(1)
        body = m.group(2).strip()[:60].replace('\n', ' ')
        if 'to="#"' in attrs or "to='#'" in attrs or 'to=""' in attrs:
            dead_links.append((rel_path, f"<Link {attrs[:40]}...>{body}"))

    # Scan <a>
    for m in a_pattern.finditer(content):
        total_links += 1
        attrs = m.group(1)
        body = m.group(2).strip()[:60].replace('\n', ' ')
        if 'href="#"' in attrs or "href='#'" in attrs or 'href=""' in attrs or 'href="#forgot"' in attrs:
            dead_links.append((rel_path, f"<a {attrs[:40]}...>{body}"))
        if 'alert(' in attrs:
            alert_handlers.append((rel_path, f"Alert placeholder: <a {attrs[:40]}...>{body}"))

print(f"\nAudit Results:")
print(f"Total <button> elements: {total_buttons}")
print(f"Total <Link> / <a> elements: {total_links}")

print(f"\n[1] Dead Buttons (no onClick and not type=submit): {len(dead_buttons)}")
for r, snippet in dead_buttons:
    print(f"  - {r}: {snippet}")

print(f"\n[2] Empty Handlers: {len(empty_handlers)}")
for r, snippet in empty_handlers:
    print(f"  - {r}: {snippet}")

print(f"\n[3] Alert() Placeholders: {len(alert_handlers)}")
for r, snippet in alert_handlers:
    print(f"  - {r}: {snippet}")

print(f"\n[4] Dead Links (href='#' or to='#'): {len(dead_links)}")
for r, snippet in dead_links:
    print(f"  - {r}: {snippet}")
