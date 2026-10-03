#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Gera dist/index.html: a mesma pagina, adaptada para hospedagem como Artifact.

Duas coisas nao funcionam em pagina hospedada em sandbox:
  - iframe de outro site (o mapa do Google)  -> vira um cartao com link
  - a pagina e embrulhada num skeleton       -> doctype/html/head/body saem daqui

O site de producao continua sendo o index.html da raiz, intacto.
"""
import re, pathlib

raiz = pathlib.Path(__file__).parent
origem = (raiz / 'index.html').read_text(encoding='utf-8')

# 1) so o conteudo do body
corpo = re.search(r'<body>(.*)</body>', origem, re.S).group(1).strip()

# 2) o que o <head> original carrega e que a pagina ainda precisa
fontes = re.search(r'<link rel="stylesheet" href="https://fonts\.googleapis\.com[^>]*>', origem).group(0)

# 3) mapa em iframe -> cartao com link (iframes de terceiros sao bloqueados)
ENDERECO = ('R. Dr. João Batista de Lacerda, 694, Quarta Parada'
            ' · São Paulo/SP · CEP 03177-010')
MAPS = ('https://www.google.com/maps/search/?api=1&query='
        'R.+Dr.+Jo%C3%A3o+Batista+de+Lacerda,+694+-+Quarta+Parada,'
        '+S%C3%A3o+Paulo+-+SP,+03177-010')
cartao = (
    '<a class="mapcard rv" href="' + MAPS + '" target="_blank" rel="noopener">\n'
    '      <span class="mapcard__pin" aria-hidden="true">\n'
    '        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"'
    ' stroke-linecap="round" stroke-linejoin="round">'
    '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>\n'
    '      </span>\n'
    '      <span class="mapcard__txt"><small>Onde a gente fica</small>' + ENDERECO + '</span>\n'
    '      <span class="mapcard__go">Abrir no Google Maps\n'
    '        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"'
    ' stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
    '<path d="M7 17 17 7M9 7h8v8"/></svg>\n'
    '      </span>\n'
    '    </a>'
)
corpo = re.sub(r'<div class="map rv">.*?</div>', cartao, corpo, flags=re.S)

CSS_CARTAO = """
/* cartao de endereco (substitui o iframe do mapa na versao hospedada) */
.mapcard{display:flex;flex-wrap:wrap;align-items:center;gap:18px;
  margin-top:clamp(50px,6vw,84px);padding:clamp(22px,2.6vw,30px);
  border:1px solid var(--line-soft);border-radius:var(--radius);background:var(--panel);
  transition:border-color .4s var(--ease),background .4s var(--ease),transform .5s var(--ease)}
.mapcard:hover{border-color:rgba(255,255,255,.18);background:var(--panel-2);transform:translateY(-3px)}
.mapcard__pin{width:46px;height:46px;border-radius:50%;display:grid;place-items:center;flex:none;
  background:rgba(230,0,128,.12);color:var(--m)}
.mapcard__pin svg{width:21px;height:21px}
.mapcard__txt{flex:1 1 260px;min-width:0;font-size:16px;color:var(--ink-soft)}
.mapcard__txt small{display:block;font:600 11.5px/1 var(--sans);letter-spacing:.2em;
  text-transform:uppercase;color:var(--muted);margin-bottom:7px}
.mapcard__go{display:inline-flex;align-items:center;gap:9px;font:600 14px/1 var(--sans);color:var(--ink)}
.mapcard__go svg{width:15px;height:15px}
.mapcard:hover .mapcard__go svg{transform:translate(3px,-3px);transition:transform .4s var(--ease)}
"""

saida = (
    '<title>24 Rei Gráfica</title>\n'
    + fontes + '\n'
    + '<link rel="stylesheet" href="styles.css">\n'
    + '<style>' + CSS_CARTAO + '</style>\n\n'
    + corpo + '\n'
)

dist = raiz / 'dist'
dist.mkdir(exist_ok=True)
(dist / 'index.html').write_text(saida, encoding='utf-8')
print('dist/index.html', len(saida), 'bytes')
