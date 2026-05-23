# Kelvin Mariano - Personal Trainer Website

A modern single-page website for a gym instructor / personal trainer.

## Preview

Install dependencies:

```bash
npm install
```

Create a local `.env` file:

```bash
cp .env.example .env
```

Set these values:

```text
RESEND_API_KEY=re_your_api_key
RESEND_FROM_EMAIL="Kelvin Mariano <you@your-verified-domain.com>"
CONTACT_TO_EMAIL=marianokelvin@yahoo.com
```

Run the Vercel dev server from the project root so `/api/contact` is available:

```bash
npm run dev
```

Then open the local URL shown by Vercel, usually:

```text
http://localhost:3000
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
|-- api/
|   `-- contact.js          Resend contact-form email endpoint
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
- Contact form with client-side validation and Resend email delivery
- Responsive desktop, tablet, mobile, and small-mobile layouts

## Resend Setup

The browser posts contact submissions to `/api/contact`, which sends the email with Resend on the server side. Add the same environment variables from `.env.example` to your hosting provider.

For production, use a sender email from a verified Resend domain for `RESEND_FROM_EMAIL`.
