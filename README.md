TurkUI - Proje Dokümantasyonu

Bu dosya, TurkUI projesini GitHub'da yayınlarken kök dizine (root) eklemeniz gereken standart dosyaları içerir.

Dosya 1: README.md

(Bu dosya projenin vitrinidir. İnsanlar projeyi burada tanır.)

🇹🇷 TurkUI

TurkUI, React projeleri için geliştirilmiş, Glassmorphism estetiğini benimseyen, modern, duyarlı ve "Turkuaz" temalı, hafif bir UI bileşen kütüphanesidir.

✨ Özellikler

Yerli ve Modern: Türk yazılım ekosistemi için özel olarak tasarlanmış estetik.

Micro Tasarım: Az yer kaplayan, işlevsel bileşenler.

Glassmorphism: Modern buzlu cam efektleri.

Karanlık/Aydınlık Mod: Tam uyumlu tema desteği.

Bağımlılık Dostu: Sadece lucide-react ve TailwindCSS kullanır.

📦 Kurulum

Bu kütüphane şu an geliştirme aşamasındadır. Projenize dahil etmek için bileşen dosyasını kopyalamanız yeterlidir.

(İleride NPM paketi olarak yayınlandığında)

npm install turk-ui


🔨 Kullanım (Tarih Seçici)

import { useState } from 'react';
import { TurkUITakvim } from './components/TurkUI';

function App() {
  const [tarih, setTarih] = useState(new Date());

  return (
    <TurkUITakvim 
        value={tarih} 
        onChange={setTarih} 
        className="w-full"
    />
  );
}


🗺️ Yol Haritası (Roadmap)

[x] Tarih Seçici (Calendar Micro)

[ ] Modal Bileşeni

[ ] Bildirim (Toast) Sistemi

[ ] Dropdown Menü

[ ] NPM Paketi Olarak Yayınlama

Dosya 2: CONTRIBUTING.md

(Bu dosya yönetim kurallarını belirler. Katkı yapmak isteyenler burayı okumak zorundadır.)

TurkUI'ye Katkıda Bulunma Rehberi

Öncelikle TurkUI'ye katkı sağlamak istediğiniz için teşekkürler! 🎉

Bu proje açık kaynaklıdır ancak kod kalitesini ve tasarım dilini korumak amacıyla belirli bir yönetim sürecine tabidir.

🤝 Yönetim ve Yetki

Bu projenin yönetimi ve son karar yetkisi proje sahibine (Maintainer) aittir. Gönderilen tüm kodlar (Pull Request'ler) incelendikten sonra projeye dahil edilir veya reddedilir.

🚀 Nasıl Katkı Yapabilirim?

Fork Edin: Projeyi kendi GitHub hesabınıza fork'layın.

Branch Açın: Yapacğınız değişiklik için yeni bir dal (branch) oluşturun.

git checkout -b ozellik/yeni-buton

Kodlayın: TurkUI tasarım diline (Glassmorphism, Teal renk paleti) sadık kalarak kodunuzu yazın.

Test Edin: Bileşenin hem aydınlık hem karanlık modda düzgün göründüğünden emin olun.

Pull Request (PR) Gönderin: Değişikliklerinizi ana projeye göndermek için PR açın.

PR açıklamasında neyi, neden değiştirdiğinizi detaylıca yazın.

⚠️ Kurallar

Tasarım Dili: Mevcut TurkUIStyles yapısını bozmayın. Turkuaz (#0f4c47 vb.) tonlarına sadık kalın.

Bağımlılıklar: Gereksiz NPM paketleri eklemekten kaçının. Proje olabildiğince saf (lean) kalmalıdır.

Saygı: Tartışmalarda ve yorumlarda saygılı bir dil kullanın.
