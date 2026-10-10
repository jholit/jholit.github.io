#!/usr/bin/env python3
"""Dependency-free source checks. Run from any directory with Python 3.10+."""
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
VOID = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'}
errors = []

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
        if tag == 'img' and 'alt' not in attrs:
            errors.append(f'{path.relative_to(ROOT)}: image missing alt')
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
        for ident in sorted(set(selectors) - set(ids)):
            errors.append(f'{script.relative_to(ROOT)}: missing HTML selector target #{ident}')

for css in ROOT.rglob('*.css'):
    text = css.read_text()
    # Ignore comments and strings before checking balanced blocks.
    stripped = re.sub(r'/\*[\s\S]*?\*/|"(?:\\.|[^"\\])*"|\'(?:\\.|[^\'\\])*\'', '', text)
    depth = 0
    for ch in stripped:
        depth += (ch == '{') - (ch == '}')
        if depth < 0:
            break
    if depth:
        errors.append(f'{css.relative_to(ROOT)}: unbalanced CSS blocks')
    for match in re.finditer(r'url\(([^)]+)\)', text):
        value = match[1].strip(' \"\'')
        if urlsplit(value).scheme or value.startswith('#'):
            continue
        target = (css.parent / value).resolve()
        referenced.add(target)
        if not target.is_file():
            errors.append(f'{css.relative_to(ROOT)}: missing URL {value}')

for media in (ROOT / 'assets/images').rglob('*'):
    if media.is_file() and media.resolve() not in referenced:
        errors.append(f'{media.relative_to(ROOT)}: unreferenced media')

if not (ROOT / '.nojekyll').is_file():
    errors.append('Missing .nojekyll')
if 'small-screen-notice' in (ROOT / 'page/holix-ai/index.html').read_text():
    errors.append('HOLIX Ai small-screen notice still exists')

if errors:
    print('\n'.join(errors))
    sys.exit(1)
print(f'PASS: {len(pages)} HTML pages; local files/fragments; IDs/ARIA/script targets; button types; field labels; landmarks; image alternatives; CSS block/asset checks; no unused media.')
