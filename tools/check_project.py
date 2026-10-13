#!/usr/bin/env python3
"""Source checks. Run from any directory with Python 3.10+ and Node.js."""
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import re
import json
import math
import shutil
import struct
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
VOID = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'}
errors = []
GUP_ROOT = ROOT / 'page/gup'
HOLIX_ROOT = ROOT / 'page/holix-ai'
HOLIX_SCRIPT_ORDER = ['core', 'hub', 'mobile', 'workspace']
GUP_SCRIPT_ORDER = ['core', 'catalog', 'products', 'favorites', 'collection', 'dialogs', 'cart', 'mobile', 'site']
# These shared-script targets only exist on their owning storefront page.
GUP_OPTIONAL_IDS = {'home': {'browse-facets', 'clear-filters', 'sort-select'}, 'browse': {'product-dialog'}}

class Page(HTMLParser):
    def __init__(self, path):
        super().__init__(convert_charrefs=True)
        self.path = path
        self.nodes = []
        self.stack = []
        self.feed(path.read_text(encoding='utf-8'))
        if self.stack:
            errors.append(f'{path.relative_to(ROOT)}: unclosed elements: {self.stack}')

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag in {'a', 'button'} and any(t in {'a', 'button'} for t in self.stack):
            errors.append(f'{self.path.relative_to(ROOT)}: nested interactive control')
        self.nodes.append((tag, attrs))
        if tag not in VOID:
            self.stack.append(tag)

    def handle_startendtag(self, tag, attrs):
        self.nodes.append((tag, dict(attrs)))

    def handle_endtag(self, tag):
        if tag in VOID:
            return
        if not self.stack or self.stack[-1] != tag:
            errors.append(f'{self.path.relative_to(ROOT)}: unexpected closing </{tag}>')
            if tag in self.stack:
                self.stack = self.stack[:self.stack.index(tag)]
        else:
            self.stack.pop()

pages = {p.resolve(): Page(p) for p in ROOT.rglob('*.html')}
referenced = set()
for path, page in pages.items():
    ids = [a['id'] for _, a in page.nodes if 'id' in a]
    for ident, count in Counter(ids).items():
        if count > 1:
            errors.append(f'{path.relative_to(ROOT)}: duplicate id {ident}')
    if path.parent.name != 'jholit':
        if sum(t == 'h1' for t, _ in page.nodes) != 1:
            errors.append(f'{path.relative_to(ROOT)}: expected one page h1')
        if sum(t == 'main' for t, _ in page.nodes) != 1:
            errors.append(f'{path.relative_to(ROOT)}: expected one main landmark')
        if not any(t == 'a' and 'skip-link' in a.get('class', '').split() for t, a in page.nodes):
            errors.append(f'{path.relative_to(ROOT)}: missing skip link')
    if not any(t == 'html' and a.get('lang') for t, a in page.nodes):
        errors.append(f'{path.relative_to(ROOT)}: missing page language')
    if not any(t == 'meta' and a.get('name') == 'viewport' for t, a in page.nodes):
        errors.append(f'{path.relative_to(ROOT)}: missing viewport metadata')
    for tag, attrs in page.nodes:
        if tag == 'style' or 'style' in attrs or any(key.startswith('on') for key in attrs):
            errors.append(f'{path.relative_to(ROOT)}: inline styling or behaviour belongs in an external file')
        if tag == 'img' and 'alt' not in attrs:
            errors.append(f'{path.relative_to(ROOT)}: image missing alt')
        if tag == 'script' and 'src' not in attrs:
            errors.append(f'{path.relative_to(ROOT)}: inline behaviour belongs in an external file')
        if tag == 'script' and 'src' in attrs and 'defer' not in attrs:
            errors.append(f'{path.relative_to(ROOT)}: blocking script {attrs["src"]}')
        if tag == 'a' and attrs.get('target') == '_blank' and 'noopener' not in attrs.get('rel', ''):
            errors.append(f'{path.relative_to(ROOT)}: unsafe new-tab link')
        for attr in ['aria-labelledby', 'aria-describedby', 'aria-controls']:
            for ident in (attrs.get(attr) or '').split():
                if ident not in ids:
                    errors.append(f'{path.relative_to(ROOT)}: missing {attr} target {ident}')
        if attrs.get('data-search-target') and attrs['data-search-target'] not in ids:
            errors.append(f'{path.relative_to(ROOT)}: missing search target {attrs["data-search-target"]}')
        if tag == 'button' and attrs.get('type') not in {'button', 'submit', 'reset'}:
            errors.append(f'{path.relative_to(ROOT)}: button needs an explicit valid type')
        for attr in ['src', 'href']:
            value = attrs.get(attr)
            if not value:
                continue
            url = urlsplit(value)
            if url.scheme or url.netloc:
                continue
            if url.path.startswith('/'):
                errors.append(f'{path.relative_to(ROOT)}: root-absolute path breaks repository hosting: {value}')
                continue
            if tag == 'a' and url.path.endswith('.html'):
                errors.append(f'{path.relative_to(ROOT)}: use a directory navigation URL: {value}')
            target = (path.parent / unquote(url.path)).resolve() if url.path else path
            if not target.is_relative_to(ROOT):
                errors.append(f'{path.relative_to(ROOT)}: reference outside project {value}')
                continue
            if target.is_dir():
                target /= 'index.html'
            if not target.is_file():
                errors.append(f'{path.relative_to(ROOT)}: missing file {value}')
                continue
            referenced.add(target)
            if url.fragment and target in pages:
                if not any(a.get('id') == unquote(url.fragment) for _, a in pages[target].nodes):
                    errors.append(f'{path.relative_to(ROOT)}: missing fragment {value}')
    # All editable fields need an explicit name; placeholders are not names.
    label_targets = {a.get('for') for t, a in page.nodes if t == 'label'}
    for ident in label_targets - set(ids) - {None}:
        errors.append(f'{path.relative_to(ROOT)}: label references missing field {ident}')
    for tag, attrs in page.nodes:
        if tag not in {'input', 'textarea', 'select'} or attrs.get('type') == 'hidden':
            continue
        if not (attrs.get('aria-label') or attrs.get('aria-labelledby') or attrs.get('id') in label_targets):
            errors.append(f'{path.relative_to(ROOT)}: field without an explicit label {attrs.get("id", tag)}')
    # Catch a common refactor regression: a script still querying a renamed HTML ID.
    for tag, attrs in page.nodes:
        if tag != 'script' or not attrs.get('src'):
            continue
        source = attrs['src']
        if urlsplit(source).scheme or urlsplit(source).netloc:
            continue
        script = (path.parent / unquote(urlsplit(source).path)).resolve()
        if not script.is_file():
            continue  # The local-reference check above already reports missing files.
        selectors = re.findall(r'''(?:querySelector(?:All)?|\$)\(\s*["']#([\w-]+)["']''', script.read_text(encoding='utf-8'))
        optional_ids = set()
        if path.is_relative_to(GUP_ROOT) and script.is_relative_to(GUP_ROOT):
            page_type = next((a.get('data-page') for t, a in page.nodes if t == 'body'), '')
            optional_ids = GUP_OPTIONAL_IDS.get(page_type, set())
        for ident in sorted(set(selectors) - set(ids) - optional_ids):
            errors.append(f'{script.relative_to(ROOT)}: missing HTML selector target #{ident}')
    if path.is_relative_to(HOLIX_ROOT):
        scripts = [Path(a['src']).stem for t, a in page.nodes if t == 'script' and 'src' in a and
                   (path.parent / a['src']).resolve().is_relative_to(HOLIX_ROOT)]
        if scripts != HOLIX_SCRIPT_ORDER:
            errors.append(f'{path.relative_to(ROOT)}: unexpected HOLIX dependency order')
    if path.is_relative_to(GUP_ROOT):
        scripts = [Path(a['src']).stem for t, a in page.nodes if t == 'script' and 'src' in a and
                   (path.parent / a['src']).resolve().is_relative_to(GUP_ROOT)]
        if scripts != GUP_SCRIPT_ORDER:
            errors.append(f'{path.relative_to(ROOT)}: unexpected GUP dependency order')
        site_root = next((a.get('data-site-root', '') for t, a in page.nodes if t == 'body'), '')
        if (path.parent / site_root).resolve() != GUP_ROOT:
            errors.append(f'{path.relative_to(ROOT)}: incorrect data-site-root')

# CSS belongs to stylesheets; reject embedded scripts/styles and obsolete asset copies above.
for css in ROOT.rglob('*.css'):
    text = css.read_text()
    # Ignore comments and strings before checking balanced blocks.
    stripped = re.sub(r'/\*[\s\S]*?\*/|"(?:\\.|[^"\\])*"|\'(?:\\.|[^\'\\])*\'', '', text)
    depth = 0
    for ch in stripped:
        depth += (ch == '{') - (ch == '}')
        if depth < 0:
            errors.append(f'{css.relative_to(ROOT)}: unexpected closing CSS block')
            break
    if depth:
        errors.append(f'{css.relative_to(ROOT)}: unbalanced CSS blocks')
    for match in re.finditer(r'url\(([^)]+)\)', text):
        value = match[1].strip(' \"\'')
        if urlsplit(value).scheme or urlsplit(value).netloc or value.startswith('#'):
            continue
        if urlsplit(value).path.startswith('/'):
            errors.append(f'{css.relative_to(ROOT)}: root-absolute URL breaks repository hosting: {value}')
            continue
        target = (css.parent / unquote(urlsplit(value).path)).resolve()
        if not target.is_relative_to(ROOT):
            errors.append(f'{css.relative_to(ROOT)}: URL outside project: {value}')
            continue
        referenced.add(target)
        if not target.is_file():
            errors.append(f'{css.relative_to(ROOT)}: missing URL {value}')

def webp_size(path):
    """Read intrinsic dimensions without an image-library dependency."""
    data = path.read_bytes()
    if data[:4] != b'RIFF' or data[8:12] != b'WEBP':
        raise ValueError('invalid WebP')
    kind = data[12:16]
    if kind == b'VP8 ':
        width, height = struct.unpack_from('<HH', data, 26)
        return width & 0x3FFF, height & 0x3FFF
    if kind == b'VP8X':
        return tuple(int.from_bytes(data[o:o + 3], 'little') + 1 for o in (24, 27))
    if kind != b'VP8L' or data[20] != 0x2F:
        raise ValueError('unsupported WebP')
    bits = int.from_bytes(data[21:25], 'little')
    return (bits & 0x3FFF) + 1, ((bits >> 14) & 0x3FFF) + 1


try:
    source = (GUP_ROOT / 'assets/js/catalog.js').read_text(encoding='utf-8')
    catalogue = json.loads(source[source.index('= [') + 2:].rstrip().removesuffix(';'))
    product_ids = set()
    for product in catalogue:
        ident = product['id']
        if ident in product_ids or not re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', ident):
            errors.append(f'GUP: invalid or duplicate product ID {ident}')
        product_ids.add(ident)
        for key in ['price', 'minPlayers', 'maxPlayers', 'maxTime', 'width', 'height']:
            value = product[key]
            if isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value):
                raise ValueError(f'{ident}: invalid {key}')
        if product['price'] < 0 or not 0 < product['minPlayers'] <= product['maxPlayers'] or product['maxTime'] <= 0:
            errors.append(f'GUP: invalid price/player/playtime values for {ident}')
        image = (GUP_ROOT / product['image']).resolve()
        if not image.is_relative_to(GUP_ROOT) or not image.is_file():
            errors.append(f'GUP: missing or invalid product image for {ident}')
        elif webp_size(image) != (product['width'], product['height']):
            errors.append(f'GUP: incorrect image dimensions for {ident}')
        referenced.add(image)
        # Product pages are intentionally unbuilt in the supplied prototype.
        route = urlsplit(product.get('href', f'products/{ident}/'))
        destination = (GUP_ROOT / route.path).resolve()
        if route.scheme or route.netloc or route.path.startswith('/') or not route.path.endswith('/') or not destination.is_relative_to(GUP_ROOT / 'products'):
            errors.append(f'GUP: invalid future product route for {ident}')
except (OSError, ValueError, KeyError, TypeError, struct.error) as error:
    errors.append(f'GUP catalogue: {error}')

for asset in ROOT.rglob('*'):
    if asset.is_file() and (asset.suffix in {'.css', '.js', '.webp', '.png', '.jpg', '.jpeg', '.svg', '.ico'}):
        if asset.resolve() not in referenced:
            errors.append(f'{asset.relative_to(ROOT)}: unreferenced asset')

if not shutil.which('node'):
    errors.append('Node.js is required for JavaScript syntax checks')
else:
    for script in ROOT.rglob('*.js'):
        result = subprocess.run(['node', '--check', str(script)], capture_output=True, text=True)
        if result.returncode:
            errors.append(result.stderr.strip())

if not (ROOT / '.nojekyll').is_file():
    errors.append('Missing .nojekyll')
if 'small-screen-notice' in (ROOT / 'page/holix-ai/index.html').read_text():
    errors.append('HOLIX Ai small-screen notice still exists')

if errors:
    print('\n'.join(errors))
    sys.exit(1)
print(f'PASS: {len(pages)} HTML pages; directory URLs; local files/fragments; IDs/ARIA/script targets; button types; field labels; landmarks; image alternatives; HOLIX/GUP dependencies; GUP catalogue; CSS blocks; JS syntax; no unused assets.')
