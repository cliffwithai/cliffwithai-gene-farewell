"""Build the GitHub Pages files from src/card.html.

  index.html       the three-page card for everyone
  gene/index.html  Gene's own page: only the 糖蔥 he received
Run: python3 tools/build.py
"""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
src = (ROOT / "src" / "card.html").read_text(encoding="utf-8")

HEAD = """<!doctype html>
<html lang="zh-Hant">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="robots" content="noindex, nofollow">
<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>
</head>
<body>
"""
TAIL = "\n</body>\n</html>\n"


def must_replace(text, old, new):
    assert text.count(old) >= 1, f"not found: {old[:60]}"
    return text.replace(old, new)


# Everyone's card: the cover link goes to Gene's standalone page.
card = must_replace(
    src,
    '<button class="skip" type="button" data-go="for-gene">我是 Gene，看大家送我的糖蔥</button>',
    '<a class="skip" href="gene/">我是 Gene，看大家送我的糖蔥</a>',
)
(ROOT / "index.html").write_text(HEAD + card + TAIL, encoding="utf-8")

# Gene's page lives one folder down, so shared assets move up a level.
gene = must_replace(src, '<title>Gama 夥伴的海底郵局</title>', '<title>給 Gene 大星的糖蔥</title>')
gene = must_replace(gene, 'const PAGE_MODE = "card";', 'const PAGE_MODE = "gene";')
gene = must_replace(gene, '"gene-face/', '"../gene-face/')
(ROOT / "gene").mkdir(exist_ok=True)
(ROOT / "gene" / "index.html").write_text(HEAD + gene + TAIL, encoding="utf-8")
print("built index.html and gene/index.html")
