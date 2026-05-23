# Kelvin Mariano - Personal Trainer Website

A modern single-page website for a gym instructor / personal trainer.

## Preview

Run a local static server from the project root:

```bash
python -m http.server 5173 --bind 127.0.0.1
```

Then open:

```text
http://127.0.0.1:5173/index.html
```

## Project Structure

```text
project-root/
|-- index.html              Main HTML file
|-- css/
|   |-- general.css         CSS variables, resets, utilities
|   |-- navbar.css          Sticky nav, mobile menu, theme toggle
|   |-- hero.css            Full-viewport split hero with photo frame
|   |-- about.css           Trainer identity card + bio
|   |-- services.css        Animated service cards grid
|   |-- photo-banner.css    Cinematic photo strip section
|   |-- contact.css         Contact info + form
|   |-- footer.css          Minimal footer bar
|   `-- responsive.css      Breakpoints for 1024px, 768px, and 480px
|-- js/
|   `-- script.js           Nav scroll, theme toggle, reveal, form behavior
`-- assets/
    |-- images/             Local hero/about photos
    |-- favicon/            Dark and light favicon assets
    `-- logo/               Dark and light logo assets
```

## Features

- Dark/light mode toggle persisted to `localStorage`
- Split hero layout with responsive photo frame and glow effects
- Small-mobile photo frame support below `480px`
- Animated floating badges on the hero photo
- Cinematic 5-image photo banner with hover desaturation
- Scroll-reveal animations via `IntersectionObserver`
- Active nav link highlight on scroll
- Service card 3D tilt on mouse move
- Hero name scramble effect on hover
- Contact form with client-side validation
- Responsive desktop, tablet, mobile, and small-mobile layouts
