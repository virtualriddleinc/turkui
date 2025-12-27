# 🇬🇧 TurkUI

TurkUI is a lightweight UI component library developed for React projects, embracing Glassmorphism aesthetics, modern, responsive, and "Turquoise" themed.

## ✨ Features

- **Native and Modern:** Aesthetically designed specifically for the Turkish software ecosystem
- **Micro Design:** Functional components that take up minimal space
- **Glassmorphism:** Modern frosted glass effects
- **Localization:** Turkish and English versions
- **Dependency Friendly:** Uses only `lucide-react` and `Tailwind CSS`

## 📦 Installation

This library is currently under development. To include it in your project, simply copy the component file.

### Download Files from GitHub

1. **Turkish Version:**
   ```sh
   # Download TurkUITakvim.jsx file
   # https://github.com/virtualriddleinc/turkui/blob/main/TurkUITakvim.jsx
   ```

2. **English Version:**
   ```sh
   # Download TurkUICalendar.en.jsx file
   # https://github.com/virtualriddleinc/turkui/blob/main/TurkUICalendar.en.jsx
   ```

### Dependencies

```sh
npm install lucide-react
npm install -D tailwindcss postcss autoprefixer
```

## 🔨 Configuration

### 1. Tailwind CSS Installation

If you don't have Tailwind CSS in your project:

```sh
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 2. Tailwind Config Update

Make sure the `.jsx` extension is in the content array in `tailwind.config.ts` (or `tailwind.config.js`):

```typescript
content: [
  "./src/**/*.{ts,tsx,js,jsx}",
  // ... other paths
],
```

### 3. CSS Class Definitions

Add the following CSS class definitions to your `src/index.css` file:

```css
/* TurkUI Calendar Glass Panel Styles */
@layer components {
  .virtualriddle-glass-panel-main {
    @apply bg-[#134e4a]/95 backdrop-blur-xl border border-white/10 shadow-xl rounded-xl;
  }

  .virtualriddle-glass-panel-side {
    @apply bg-[#042f2e]/95 backdrop-blur-2xl border border-white/20 shadow-xl rounded-xl;
  }
}
```

## 📖 Usage

### Turkish Version

```typescript
import { useState } from 'react';
import TurkUITakvim from './components/TurkUITakvim';

function App() {
  const [tarih, setTarih] = useState<Date | null>(new Date());

  return (
    <TurkUITakvim
      value={tarih}
      onChange={(date) => setTarih(date)}
      placeholder="Tarih Seçiniz"
    />
  );
}
```

### English Version

```typescript
import { useState } from 'react';
import Calendar from './components/TurkUICalendar.en';

function App() {
  const [date, setDate] = useState<Date | null>(new Date());

  return (
    <Calendar
      value={date}
      onChange={(date) => setDate(date)}
      placeholder="Select Date"
    />
  );
}
```

## 📋 Versions

### Turkish Version (`TurkUITakvim.jsx`)
- Turkish comments and variable names
- Turkish month names: "Ocak", "Şubat", etc.
- Turkish day names: "Pt", "Sa", "Ça", etc.
- Date format: "15 Ocak 2024"
- Placeholder: "Tarih Seçiniz"

### English Version (`TurkUICalendar.en.jsx`)
- English comments and variable names
- English month names: "January", "February", etc.
- English day names: "Mon", "Tue", "Wed", etc.
- Date format: "15 January 2024"
- Placeholder: "Select Date"

## 🎯 Props

| Prop | Type | Default | Description |
|------|-----|---------|-------------|
| `value` | `Date \| null` | `null` | Selected date value |
| `onChange` | `(date: Date) => void` | - | Callback function called when date changes |
| `placeholder` | `string` | `"Tarih Seçiniz"` (TR) / `"Select Date"` (EN) | Placeholder text |
| `className` | `string` | `""` | Additional CSS classes |

## 🌟 Features

- **Glassmorphism Design:** Modern frosted glass effects
- **Wheel Picker:** Scrollable picker for month and year selection
- **Responsive:** Mobile and desktop compatible
- **Lightweight:** Minimal dependencies
- **Accessible:** Fully compatible with keyboard and mouse

## 🗺️ Roadmap

- [x] Calendar Component - Turkish and English versions
- [ ] Modal Component
- [ ] Toast Notification System
- [ ] Dropdown Menu
- [ ] NPM Package Release

## 📝 Notes

- The component depends on Tailwind CSS. Styles will not be applied without Tailwind configuration and CSS class definitions
- The component uses Inter font (automatically loaded)
- Modern browsers with `backdrop-blur` support are required for glassmorphism effects

## 📄 License

MIT License - See the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

We welcome your contributions! Please read the [CONTRIBUTING.md](CONTRIBUTING.md) file.

---

**Note:** This library is under active development. NPM package will be released soon.
