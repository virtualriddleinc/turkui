# TurkUI

Modern, responsive, and customizable React UI component library. Comes with Turkish and English language support.

## Features

- 🎨 Modern and elegant design
- 📱 Fully responsive (mobile and desktop compatible)
- 🌐 Turkish and English language support
- 🎯 Fully customizable
- ⚡ Performance-focused
- 🎭 Glassmorphism effects
- ♿ Accessibility-focused

## Installation

```bash
npm install @turk-ui/turk-ui
```

or

```bash
yarn add @turk-ui/turk-ui
```

## Requirements

- React 18.0.0 or higher
- React DOM 18.0.0 or higher
- Tailwind CSS (recommended)

## Components

### Calendar

Modern, responsive, and customizable date picker component.

#### Basic Usage

```jsx
import React, { useState } from 'react';
import { Calendar } from '@turk-ui/turk-ui';

function App() {
  const [date, setDate] = useState(new Date());

  return (
    <Calendar
      value={date}
      onChange={(date, formattedDate) => {
        setDate(date);
        console.log(formattedDate);
      }}
    />
  );
}
```

#### Turkish Usage

```jsx
import { CalendarTR } from '@turk-ui/turk-ui';

<CalendarTR
  value={date}
  onChange={setDate}
  placeholder="Tarih seçiniz"
/>
```

#### English Usage

```jsx
import { CalendarEN } from '@turk-ui/turk-ui';

<CalendarEN
  value={date}
  onChange={setDate}
  placeholder="Select date"
/>
```

#### Customization

```jsx
<Calendar
  value={date}
  onChange={setDate}
  locale="en" // or "tr"
  color="#0d9488"
  backgroundColor="#1e293b"
  textColor="#ffffff"
  variant="modal" // "modal" | "dropdown" | "adaptive"
  opacity={0.95}
  displayFormat="dd MMMM yyyy"
  outputFormat="dd/MM/yyyy"
  selectionMode="full" // "full" | "day-month" | "month-year" | "day" | "month" | "year"
/>
```

#### Props

| Prop | Type | Default | Description |
|------|-----|---------|-------------|
| `value` | `Date` | `new Date()` | Selected date |
| `onChange` | `(date: Date, formatted: any) => void` | - | Called when date changes |
| `placeholder` | `string` | `"Select Date"` | Placeholder text |
| `locale` | `"tr" \| "en"` | `"tr"` | Language setting |
| `color` | `string` | `"#0d9488"` | Primary color |
| `backgroundColor` | `string` | `color` | Background color |
| `textColor` | `string` | `"#ffffff"` | Text color |
| `variant` | `"modal" \| "dropdown" \| "adaptive"` | `"modal"` | Display mode |
| `opacity` | `number` | `0.95` | Background opacity |
| `displayFormat` | `string` | `"dd MMMM yyyy"` | Display format |
| `outputFormat` | `string` | `"dd/MM/yyyy"` | Output format |
| `outputFormatType` | `string` | `"custom"` | Output format type |
| `selectionMode` | `string` | `"full"` | Selection mode |
| `className` | `string` | `""` | Additional CSS classes |
| `style` | `object` | `{}` | Additional styles |

## Contributing

We welcome contributions! Please report issues on [GitHub Issues](https://github.com/virtualriddleinc/turkui/issues) or submit [Pull Requests](https://github.com/virtualriddleinc/turkui/pulls).

## License

MIT License - See [LICENSE](LICENSE) file for details.

## Developer

[Virtual Riddle Inc.](https://www.virtualriddle.com)

