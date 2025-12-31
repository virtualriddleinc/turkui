# TurkUI

Modern, responsive ve özelleştirilebilir React UI bileşen kütüphanesi. Türkçe ve İngilizce dil desteği ile gelir.

## Özellikler

- 🎨 Modern ve şık tasarım
- 📱 Tam responsive (mobil ve masaüstü uyumlu)
- 🌐 Türkçe ve İngilizce dil desteği
- 🎯 Tamamen özelleştirilebilir
- ⚡ Performans odaklı
- 🎭 Glassmorphism efektleri
- ♿ Erişilebilirlik odaklı

## Kurulum

```bash
npm install @turk-ui/turk-ui
```

veya

```bash
yarn add @turk-ui/turk-ui
```

## Gereksinimler

- React 18.0.0 veya üzeri
- React DOM 18.0.0 veya üzeri
- Tailwind CSS (önerilir)

## Bileşenler

### Calendar (Takvim)

Modern, responsive ve özelleştirilebilir tarih seçici bileşeni.

#### Temel Kullanım

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

#### Türkçe Kullanım

```jsx
import { CalendarTR } from '@turk-ui/turk-ui';

<CalendarTR
  value={date}
  onChange={setDate}
  placeholder="Tarih seçiniz"
/>
```

#### İngilizce Kullanım

```jsx
import { CalendarEN } from '@turk-ui/turk-ui';

<CalendarEN
  value={date}
  onChange={setDate}
  placeholder="Select date"
/>
```

#### Özelleştirme

```jsx
<Calendar
  value={date}
  onChange={setDate}
  locale="tr" // veya "en"
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

| Prop | Tip | Varsayılan | Açıklama |
|------|-----|------------|----------|
| `value` | `Date` | `new Date()` | Seçili tarih |
| `onChange` | `(date: Date, formatted: any) => void` | - | Tarih değiştiğinde çağrılır |
| `placeholder` | `string` | `"Tarih Seçiniz"` | Placeholder metni |
| `locale` | `"tr" \| "en"` | `"tr"` | Dil ayarı |
| `color` | `string` | `"#0d9488"` | Ana renk |
| `backgroundColor` | `string` | `color` | Arkaplan rengi |
| `textColor` | `string` | `"#ffffff"` | Metin rengi |
| `variant` | `"modal" \| "dropdown" \| "adaptive"` | `"modal"` | Görünüm modu |
| `opacity` | `number` | `0.95` | Arkaplan opaklığı |
| `displayFormat` | `string` | `"dd MMMM yyyy"` | Görüntüleme formatı |
| `outputFormat` | `string` | `"dd/MM/yyyy"` | Çıktı formatı |
| `outputFormatType` | `string` | `"custom"` | Çıktı format türü |
| `selectionMode` | `string` | `"full"` | Seçim modu |
| `className` | `string` | `""` | Ek CSS sınıfları |
| `style` | `object` | `{}` | Ek stiller |

## Katkıda Bulunma

Katkılarınızı bekliyoruz! Lütfen [GitHub Issues](https://github.com/virtualriddleinc/turkui/issues) üzerinden sorun bildirin veya [Pull Request](https://github.com/virtualriddleinc/turkui/pulls) gönderin.

## Lisans

MIT License - Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## Geliştirici

[Virtual Riddle Teknoloji A.Ş.](https://www.virtualriddle.com.tr/)

