
# Grup Sohbet Uygulaması

Bu proje React Native ile geliştirilmiş olup ANDROID ve IOS platformunda çalışmaktadır. Kullanıcıların gruplar oluşturabileceği, gruplara katılabileceği ve gruplar içinde gerçek zamanlı sohbet edebileceği bir mobil uygulamadır. Grup kurucuları grubu silebilir, kullanıcılar ise gruplardan çıkabilir.

## Özellikler

- **Kullanıcı Kayıt ve Giriş**: Yeni kullanıcı kaydı ve giriş işlemleri yapılabilir.
- **Grup Oluşturma**: Kullanıcılar yeni gruplar oluşturabilir.
- **Gruba Katılma**: Kullanıcılar mevcut gruplara katılabilir.
- **Gerçek Zamanlı Mesajlaşma**: Kullanıcılar gruplarda gerçek zamanlı olarak sohbet edebilir.
- **Grup Yönetimi**:
  - **Grup Silme**: Grup kurucusu grubu silebilir. Grup silindiğinde gruptaki tüm kullanıcılar bu durumdan haberdar edilir.
  - **Gruptan Çıkma**: Kullanıcılar gruplardan çıkabilir.
- **Grup Üye Listesi**: Her grubun üye listesi görüntülenebilir.

## Kurulum

1. Bu projeyi bilgisayarınıza klonlayın:
   ```bash
   git clone https://github.com/keremerguner/SocketApp-React-Native
   cd SocketApp-React-Native
   ```

2. **Backend Kurulumu**
   - `server` dizinine gidin:
     ```bash
     cd server
     ```
   - Gerekli bağımlılıkları yükleyin:
     ```bash
     npm install
     ```
   - `.env` dosyasını oluşturun ve MongoDB bağlantı adresinizi ve diğer gerekli değişkenleri tanımlayın:
     ```
     MONGO_URI=<your-mongo-uri>
     ```
   - Sunucuyu başlatın:
     ```bash
     node index.
     
### Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

## Kullanım

- **Grup Oluştur**: Giriş yaptıktan sonra "Grup Oluştur" düğmesine tıklayın ve bir grup adı ve kodu belirleyin.
- **Gruba Katıl**: Mevcut bir gruba katılmak için "Gruba Katıl" düğmesine basarak grup kodunu girin.
- **Sohbet**: Bir gruba katıldığınızda, mesaj göndererek sohbete katılabilirsiniz.
- **Gruptan Çık**: Sohbet ekranının sağ üst köşesindeki "Gruptan Çık" düğmesi ile gruptan çıkabilirsiniz.
- **Grubu Sil**: Grubun kurucusuysanız, "Grubu Sil" düğmesine basarak grubu tamamen silebilirsiniz. Grup silindiğinde, tüm üyeler bilgilendirilir.

## Proje Yapısı

```plaintext
├── src
│   ├── pages
│   │   ├── components
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Home.tsx
│   │   │   ├── Chat.tsx
│   │   │   ├── CreateGroup.tsx
│   │   │   └── JoinGroup.tsx
│   │   ├── components
│   │   └── App.tsx
├── server
│   ├── models
│   │   ├── User.js
│   │   ├── Message.js
│   │   └── Group.js
│   ├── routes
│   │   ├── auth.js
│   │   ├── group.js
│   │   └── user.js
│   └── index.js
│   ├── .env
└── README.md
```

## Geliştirme

- Gerçek zamanlı mesajlaşma `Socket.IO` kullanılarak gerçekleştirilmiştir.
- Grup ve kullanıcı verileri `MongoDB` veritabanında saklanmaktadır.

## Katkı

1. Projeyi fork edin.
2. Yeni bir özellik dalı (`feature/AmazingFeature`) oluşturun.
3. Değişikliklerinizi commit edin (`git commit -m 'Add some AmazingFeature'`).
4. Dalınıza push edin (`git push origin feature/AmazingFeature`).
5. Bir Pull Request açın.

## Lisans

Bu proje MIT Lisansı altında lisanslanmıştır. Ayrıntılar için `LICENSE` dosyasına bakın.
