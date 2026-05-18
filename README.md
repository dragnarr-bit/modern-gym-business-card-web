# Kelvin Mariano — Personal Trainer Website

A modern, single-page business card website for a gym instructor / personal trainer.

## Project Structure

```
project-root/
├── index.html              Main HTML file
├── css/
│   ├── general.css         CSS variables, resets, utilities
│   ├── navbar.css          Sticky nav, mobile menu, theme toggle
│   ├── hero.css            Full-viewport split hero with photo
│   ├── about.css           Trainer identity card + bio
│   ├── services.css        Animated service cards grid
│   ├── photo-banner.css    Cinematic photo strip section
│   ├── contact.css         Contact info + form
│   ├── footer.css          Minimal footer bar
│   └── responsive.css      All breakpoints (1024 / 768 / 480px)
├── js/
│   └── script.js           Nav scroll, theme toggle, reveal, form
└── assets/
    ├── images/             (add local hero/about photos here)
    ├── favicons/           (add any custom favicon assets here)
    └── logo/               (add any logo icon assets here)
```

## Features
- Dark/light mode toggle (persisted to localStorage)
- Split hero layout with floating photo + glow effects
- Animated floating badges on hero photo
- Cinematic 5-image photo banner with hover de-saturation
- Scroll-reveal animations via IntersectionObserver
- Active nav link highlight on scroll
- Service card 3D tilt on mouse move
- Hero name scramble effect on hover
- Contact form with client-side validation
- Fully responsive (desktop → tablet → mobile → 480px)

## Customisation
- Replace Unsplash URLs in index.html with your own photos
- Update name, stats and content in index.html
- Change `--accent` colour in general.css to match your brand
- Swap Google Fonts (Bebas Neue + Barlow) as needed
