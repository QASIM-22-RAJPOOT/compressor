# Pixelpress

A responsive, browser-only image compressor and converter built with React, Vite, and Tailwind CSS. No backend, accounts, remote fonts, or API integrations.

## Run

```sh
npm install
npm run dev
```

`npm run build` creates a production build in `dist`. `npm run preview` previews that build. `npm run lint` checks the source.

## Features

Drag and drop or select a JPG/JPEG, PNG, or WebP image; adjust quality and dimensions; preserve aspect ratio; export JPG, PNG, or WebP; inspect a draggable before/after comparison; download the output. Includes validation, processing states, size statistics, reset, and responsive FAQ sections.

Images are decoded locally and encoded with the browser Canvas API. JPG and WebP quality varies by browser; PNG is lossless and ignores the quality slider. JPG transparency becomes white. Output may be larger than an already optimized original; actual savings are shown. This app uses conventional local image processing, not an external AI model. Limits: 30 MB input, 80 megapixel input, 8,192 pixels per output dimension, and 40 megapixel output.
