---
type: regex
target:
  source: file
  path: src/fonts.ts
---
(?=[\s\S]*@fontsource/inter/(?:latin-)?500)(?=[\s\S]*@fontsource/inter/(?:latin-)?600)|@fontsource-variable/inter
