# 24 Rei — site

Reconstrução do site da **24 Rei Gráfica** (24rei.com.br): mesmo conteúdo institucional,
linguagem visual nova, com motion e interações no padrão de referências como a Halogenn.

## Conceito

A marca da 24 Rei já é **CMYK** — ciano, magenta, amarelo e preto no próprio símbolo.
O site inteiro é construído em cima disso: paleta, gradientes de texto, barra de progresso,
cores de cada serviço e a barra de registro no rodapé.

| Tinta | Hex |
|---|---|
| Cyan | `#36a9e1` |
| Magenta | `#e60080` |
| Yellow | `#fde900` |
| Key | `#1d1d1b` |

Tipografia: **DM Sans** (display e corpo).

## Stack

HTML + CSS + JS puros, sem build e sem dependências. Três arquivos:

```
index.html       estrutura e conteúdo
styles.css       design system e componentes
main.js          interações
assets/          logo e símbolo (SVG, da marca oficial)
assets/fotos/    maquinário e parque gráfico (fotos da própria 24 Rei)
```

## Versão hospedada

`build-artifact.py` gera `dist/index.html`, que é a mesma página adaptada para hospedagem
em sandbox: sem o esqueleto HTML (a plataforma embrulha a página) e com o iframe do Google
Maps trocado por um cartão de endereço com link, porque iframe de terceiro é bloqueado lá.

```bash
python3 build-artifact.py
```

O `index.html` da raiz continua sendo a versão de produção, intacta.

## Rodando local

```bash
python3 -m http.server 4324
```

Depois abra http://localhost:4324 — ou use o perfil `24rei` em `.claude/launch.json`.

## Seções

1. **Hero** — foto da prensa offset da casa como capa (Ken Burns lento), headline em três linhas com reveal por máscara, blobs CMYK em `screen` com parallax de ponteiro, retícula de meio-tom e selos (2.000 m², produção 24h, FSC®)
2. **Marquee** — esteira infinita com as capacidades de produção
3. **Quem somos** — coluna sticky + contadores animados (24.600 jobs, +10 anos, 98% satisfação, +80 colaboradores)
4. **Parque gráfico** — faixa com a vista aérea do galpão e a linha de produção em cinco etapas (pré-impressão, offset, digital, acabamento, expedição)
5. **Serviços** — acordeão onde a linha é preenchida pela cor do serviço (os 6 serviços do site original)
6. **Vantagens** — os três diferenciais, incluindo a certificação FSC®
7. **Missão e valores** — missão + os quatro valores da empresa
8. **Contato** — formulário, dados, redes e mapa
9. **Rodapé** — navegação completa e barra de registro CMYK

## Formulário

Não depende de backend: monta a mensagem formatada (nome, empresa, e-mail, telefone,
assunto, serviço e descrição do projeto) e abre o **WhatsApp comercial**
(`5511993563103`) com tudo pronto para envio. O e-mail segue como alternativa visível.

A abertura usa um link real clicado por script, não `window.open`, que morre em bloqueador
de pop-up e em página incorporada. Se mesmo assim não abrir, a nota embaixo do botão vira
um link clicável com a mensagem já montada.

Para trocar por um backend de verdade, o ponto único é o `form.addEventListener('submit', ...)`
em [`main.js`](main.js).

## Motion

Reveals por `IntersectionObserver`, contadores com easing cúbico, header que encolhe,
barra de progresso de leitura, menu em `clip-path` com entrada escalonada e parallax
dos blobs do hero. Tudo respeita `prefers-reduced-motion: reduce`.

## Acessibilidade

- Skip link, landmarks e `aria-expanded` no acordeão e no menu
- Foco visível em ciano
- Texto dos painéis de serviço com contraste mínimo de 4.5:1 sobre cada cor
- Sem overflow horizontal em 375px

## Fotos

Duas fotos, ambas da própria 24 Rei, recuperadas da biblioteca do site atual
(`wp-content/uploads`): a prensa offset com tinta magenta e ciano, que é a capa, e a
vista aérea do galpão em Quarta Parada.

Existiam mais duas (chão de fábrica e dobradeira) que saíram: são fotos de celular com
fundo bagunçado e enfraqueciam a seção ao lado da capa. Estão no histórico do git se
alguém quiser de volta. Para recolocar uma galeria ali, o que falta é fotografia nova do
maquinário: enquadramento fechado na máquina, luz controlada e fundo limpo.

Não foi possível gerar WebP nesta máquina (sem `cwebp` e sem suporte a WebP no `sips`),
então as fotos seguem em JPEG: 280 KB no total, com a capa em `preload` e a aérea em
`loading="lazy"`. Converter para WebP/AVIF é o ganho de performance mais fácil daqui.

## Dados da empresa

R. Dr. João Batista de Lacerda, 694 — Quarta Parada, São Paulo/SP, CEP 03177-010
(11) 2022-4475 · WhatsApp (11) 99356-3103 · atendimento@24rei.com.br
