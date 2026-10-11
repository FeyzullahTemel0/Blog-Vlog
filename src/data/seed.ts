import type { Category, Post, SiteData } from "@/lib/types";

export const CATEGORIES: Category[] = [
  { id: "sehir", name: "Şehir Rehberi", emoji: "🏙️", color: "#0F766E" },
  { id: "doga", name: "Doğa & Dağ", emoji: "🏔️", color: "#4D7C0F" },
  { id: "yemek", name: "Yemek Rotası", emoji: "🍜", color: "#EA580C" },
  { id: "kultur", name: "Kültür & Sanat", emoji: "🎭", color: "#7C3AED" },
  { id: "butce", name: "Bütçe Dostu", emoji: "💸", color: "#B45309" },
];

const POSTS: Post[] = [
  {
    id: "p-kapadokya",
    slug: "kapadokya-balon-sabahi",
    title: "Kapadokya'da Bir Sabah: Balonlar Uyanmadan Önce",
    excerpt:
      "Saat 04:30'da çalan alarm, soğuk bir şafak ve yüzlerce balonun gökyüzünde yavaşça açılışı. Kapadokya'yı en güzel bu saatte deneyimlemek için rehberim.",
    content: `
Alarm saat 04:30'da çaldığında yataktan çıkmak için bir sebep aramak zorunda kalmadım. Göreme'deki küçük pansiyonun bahçesinde, henüz uyanmamış tepelerin üzerinde ilk ışıklar belirmeye başlamıştı.

## Neden bu kadar erken?

Sıcak hava balonları, sabah rüzgârlarının en sakin olduğu anlarda havalanır. Güneş doğmadan önce uçuşa geçmek hem daha güvenli hem de gökyüzünü bambaşka bir renge boyar.

> Kapadokya'nın gerçek yüzünü yalnızca balonlar uçmadan önceki o sessiz dakikalarda görebilirsiniz.

## Uçuşta neler yaşadım?

Sepet yerden kesildiğinde sesler bile değişiyor. Brülörün kısa ve sıcak uğultusu, altınızda kayan vadiler ve peribacaları... Yaklaşık bir saat süren uçuş boyunca rüzgârla birlikte süzüldük.

- Yanınıza kalın bir mont ve eldiven alın.
- Kamerayı boynunuza takın; ellerinizi boş tutmak isteyeceksiniz.
- Pilotun anlatımını dinleyin, vadilerin isimlerini öğrenmek keyifli.

## Pratik notlar

Uçuş ücretleri sezona ve operatöre göre değişiyor. **Rezervasyonu en az bir hafta önceden** yapmanızı öneririm; özellikle ilkbahar ve sonbahar aylarında kontenjanlar hızla doluyor.

Balonlar iniş yaptıktan sonra geleneksel şampanyalı kutlama, bu deneyimin en tatlı kapanışıdır. Bir sonraki yazıda Ürgüp'ün şarap yollarında nelere dikkat etmeniz gerektiğini anlatacağım.
`,
    categoryId: "doga",
    tags: ["Kapadokya", "Balon", "Gün Doğumu"],
    status: "published",
    cover: "",
    gallery: [],
    place: { city: "Göreme", country: "Türkiye", countryCode: "TR", lat: 38.6431, lng: 34.8289 },
    createdAt: "2026-09-02T06:30:00+03:00",
    updatedAt: "2026-09-02T06:30:00+03:00",
  },
  {
    id: "p-kyoto",
    slug: "kyoto-sessiz-sokaklar",
    title: "Kyoto'nun Sessiz Sokakları: Gion'dan Higashiyama'ya",
    excerpt:
      "Turist kalabalığı henüz uyanmadan, ahşap evlerin ve dar taş sokakların arasında kaybolmak için en iyi zaman.",
    content: `
Kyoto'da en çok sevdiğim saat, tapınakların kapılarının yeni açıldığı andır. Gion'un arka sokaklarında yalnızca süpürgenin sesi ve uzaktan gelen bir tren düdüğü duyuluyor.

## Rota önerim

Sabah erken saatte Yasaka Tapınağı'ndan başlayıp Sannenzaka ve Ninenzaka sokaklarına doğru yavaşça yürüyün. Öğleye doğru Kiyomizu-dera'ya ulaşmak, kalabalığın en az olduğu zamana denk gelir.

> Kyoto'yu gezmenin en iyi yolu, planlarınızı bir kenara bırakıp bir sokağın sizi nereye götüreceğini görmektir.

## Küçük detaylar

- Geleneksel çay evlerinde matcha kavramak, bir dakikalık bir mola değil, küçük bir ritüel.
- Ayakkabılarınızı çıkaracağınız yerler için çorap taşıyın.
- Fotoğraf çekerken geishaları izinsiz fotoğraflamayın; bu saygısızlık olarak görülüyor.

Kyoto'da bir hafta geçirmek mümkünse, bir gününüzü Nara'ya ayırın. Geyiklerin arasında yürümek, şehrin gürültüsünden tam bir kopuş demek.
`,
    categoryId: "sehir",
    tags: ["Japonya", "Kyoto", "Tapınak"],
    status: "published",
    cover: "",
    gallery: [],
    place: { city: "Kyoto", country: "Japonya", countryCode: "JP", lat: 35.0116, lng: 135.7681 },
    createdAt: "2026-08-14T08:10:00+03:00",
    updatedAt: "2026-08-14T08:10:00+03:00",
  },
  {
    id: "p-hoi-an",
    slug: "hoi-an-fenerler-ve-cao-lau",
    title: "Hoi An'de Fenerler, Nehir ve Bir Kase Cao Lầu",
    excerpt:
      "Eski liman kasabasının sarı duvarları, akşam olunca yanan binlerce fener ve sokak mutfağının unutulmaz lezzetleri.",
    content: `
Hoi An'a vardığımda ilk işim bir bisiklet kiralamak oldu. Eski şehrin yolları dar ama düz; nehir kıyısına kadar pedal çevirmek bile ayrı bir keyif.

## Akşam fenerleri

Her akşam fenerler yanınca Thu Bồn Nehri'nin üzerinde süzülen sepetler, yerel bir ritüelin parçası. Bir sepeti 20 bin dong'a alıp dilek tutabilirsiniz; ama asıl güzellik, kıyıdan izlemek.

## Yemek: Cao Lầu

Bu kasabaya özgü erişte, kendine has kül suyuyla hazırlanır ve kızarmış domuz eti, taze otlar ile servis edilir. Sokak kenarında oturup kaseyi bitirene kadar konuşmamak, en doğru yemek ritüeli.

> Bir kase cao lầu, Hoi An'ı anlamak için tek başına yeterli.

## İpuçları

- Eski kasabanın bilet ücreti var; bir günlük bileti önceden alın.
- Terzilerde ısmarlama kıyafet dikimi birkaç günde tamamlanabiliyor, provayı ihmal etmeyin.
- Öğle sıcağında kafelerde dinlenin, akşamı fenerler için saklayın.
`,
    categoryId: "yemek",
    tags: ["Vietnam", "Hoi An", "Sokak Lezzetleri"],
    status: "published",
    cover: "",
    gallery: [],
    place: { city: "Hội An", country: "Vietnam", countryCode: "VN", lat: 15.8801, lng: 108.338 },
    createdAt: "2026-07-22T19:45:00+03:00",
    updatedAt: "2026-07-22T19:45:00+03:00",
  },
  {
    id: "p-lizbon",
    slug: "lizbon-tramvay-28",
    title: "Lizbon'da Bütçeyle Dolaşmak: 28 Numaralı Tramvay ve Ötesi",
    excerpt:
      "Tepeler, azulejo kaplı duvarlar ve kırmızı-sarı tramvaylar. Lizbon'u bütçenizi zorlamadan keşfetmenin yolları.",
    content: `
Lizbon yedi tepe üzerine kurulu ve bu tepeleri yürüyerek aşmak bazen can sıkıcı olabiliyor. Neyse ki şehrin ulaşımı, bütçe dostu gezginler için gerçekten cömert.

## 28 numaralı tramvay

Alfama ve Graça mahallelerinden geçen bu tarihi tramvay, sabahın erken saatlerinde en sakin hâlinde. Tek bir bilet ile şehri çapraz olarak görebilirsiniz; ama hat çok kalabalık olabiliyor, cüzdanınıza ve çantanıza dikkat edin.

## Ücretsiz keyifler

- Miradouro'lar (seyir terasları) tamamen ücretsiz ve gün batımı için birebir.
- Mouraria'da sokak müzisyenlerini dinlemek için bir bardak su yeterli.
- Feira da Ladra pazarında eski kitap ve plak aramak, saatler süren bir oyun.

## Bütçe planı

**Günlük 60-70 euro** ile rahat bir Lizbon deneyimi mümkün. Yemek için Time Out Market yerine mahalle lokantalarını tercih edin; hem daha ucuz hem daha otantik.

> Lizbon'un en güzel manzarası, bir tramvayın penceresinden yavaşça kayarken görülüyor.
`,
    categoryId: "butce",
    tags: ["Portekiz", "Lizbon", "Bütçe"],
    status: "published",
    cover: "",
    gallery: [],
    place: { city: "Lizbon", country: "Portekiz", countryCode: "PT", lat: 38.7223, lng: -9.1393 },
    createdAt: "2026-06-05T12:00:00+03:00",
    updatedAt: "2026-06-05T12:00:00+03:00",
  },
  {
    id: "p-tiflis",
    slug: "tiflis-sarap-ve-hamam",
    title: "Tiflis'te Bir Hafta Sonu: Şarap, Balkon ve Kükürtlü Hamamlar",
    excerpt:
      "Eski hamamların kubbeleri, şarap evlerinde saatler süren sohbetler ve Kura Nehri kıyısında bir gün batımı.",
    content: `
Tiflis'e vardığımda şehir bana bir sürpriz gibi göründü: Eski ve yeni yan yana, ahşap balkonlar, kiliseler ve modern sanat galerileri aynı sokakta.

## Kükürtlü hamam kültürü

Abanotubani mahallesinde, asırlık tuğla kubbeler altında kükürtlü su ile tanışmak bambaşka bir deneyim. Rezervasyonu önceden yapın; özel hamam odaları hem daha rahat hem de daha huzurlu.

## Şarap evleri

Gürcistan şarabının kökeni binlerce yıl öncesine dayanıyor. Kvevri denilen toprak küplerde fermente edilen beyaz şaraplar, bu şehirde mutlaka denenmeli. Bir şarap evinde yerel bir aileyle sohbet etmek, rehberlerin hiçbir zaman anlatamayacağı kadar öğreticidir.

> Tiflis'te şarap bir içecek değil, bir sohbetin bahanesidir.

## Gün batımı

Narikala Kalesi'nden şehri izlemek, akşamın son ışıklarını yakalamak için ideal. Yürüyerek inerken Kura Nehri kıyısındaki kafelere uğrayın.
`,
    categoryId: "kultur",
    tags: ["Gürcistan", "Tiflis", "Hamam", "Şarap"],
    status: "published",
    cover: "",
    gallery: [],
    place: { city: "Tiflis", country: "Gürcistan", countryCode: "GE", lat: 41.7151, lng: 44.8271 },
    createdAt: "2026-05-18T17:20:00+03:00",
    updatedAt: "2026-05-18T17:20:00+03:00",
  },
  {
    id: "p-marakes",
    slug: "marakes-medina-kaybolmak",
    title: "Marakeş Medinası'nda Kaybolmanın Sanatı",
    excerpt:
      "Dar sokaklar, baharat kokuları ve Jemaa el-Fna'nın akşam telaşı. Medinada yön bulmaya çalışmadan yürümeyi öğrenmek.",
    content: `
Marakeş'in medinasında ilk iki saat tamamen yanlış yönlere yürüdüm. Sonra bir şey fark ettim: haritayı kapatıp kokuları takip ettiğimde şehir bana kendini açmaya başladı.

## Jemaa el-Fna

Meydanda akşam olunca hikâye anlatıcıları, yılan oynatıcılar ve sıcak sokak yemekleri bir araya geliyor. Bir tabak harira ile meydanı izlemek, şehrin en iyi tanıtımı.

## Medinada yürümek

- Sabah saatlerinde Bahia Sarayı'nı ziyaret edin; kalabalık henüz başlamamış olur.
- Pazarlık yapmak bekleniyor, ama gülümsemek de en az pazarlık kadar önemli.
- Derin bir nefes alın ve sokağın sesine kulak verin.

> Medinada kaybolmak bir hata değil, şehri tanımanın ilk adımıdır.

Akşam saatlerinde Ben Youssef Medresesi'nin mozaiklerine bakmak, gün boyu süren karmaşanın ardından size bir huzur bahşedecek.
`,
    categoryId: "kultur",
    tags: ["Fas", "Marakeş", "Medina"],
    status: "published",
    cover: "",
    gallery: [],
    place: { city: "Marakeş", country: "Fas", countryCode: "MA", lat: 31.6295, lng: -7.9811 },
    createdAt: "2026-04-02T10:05:00+03:00",
    updatedAt: "2026-04-02T10:05:00+03:00",
  },
  {
    id: "p-datca",
    slug: "datca-kiyi-rotasi",
    title: "Datça Kıyı Rotası: Koy Koy Yürüyüş",
    excerpt:
      "Sahil boyunca uzanan patika, tek başına bir koyda geçirilen öğleden sonralar ve sakin bir Ege tatili için not defteri.",
    content: `
Bu yazı henüz taslak aşamasında. Datça'nın koylarını tek tek yürüdüğüm rotayı, mevsim ve su durumuna göre ayrıntılandırmayı planlıyorum.

## Taslak notlar

- Kargacık ve Hayıtbükü koyları arasındaki patika, sabah erken başlandığında çok daha keyifli.
- Su şişesi ve güneş kremi yanınızda olsun; gölge neredeyse yok.
`,
    categoryId: "doga",
    tags: ["Ege", "Datça", "Yürüyüş"],
    status: "draft",
    cover: "",
    gallery: [],
    place: { city: "Datça", country: "Türkiye", countryCode: "TR", lat: 36.727, lng: 27.687 },
    createdAt: "2026-10-06T09:00:00+03:00",
    updatedAt: "2026-10-06T09:00:00+03:00",
  },
];

export const PROFILE = {
  name: "Deniz Arslan",
  initials: "DA",
  title: "Gezgin · Yazar · Amatör Fotoğrafçı",
  bio: [
    "2016'da tek bir sırt çantası ve bir bilet ile başladığım yolculuk bugün 37 ülke ve yüzlerce küçük köşeye dönüştü.",
    "Bu defterde şehirlerin sesini, yemeklerin kokusunu ve yolda öğrendiğim küçük dersleri paylaşıyorum.",
    "Hedefim ucuz değil, anlamlı seyahat etmek: yerel insanlarla konuşmak, sokakta kaybolmak ve geri dönmek istemek.",
  ],
  timeline: [
    { year: "2016", title: "İlk Sırt Çantası", text: "Kapadokya'dan başlayan, planı olmayan ilk yolculuk." },
    { year: "2019", title: "Yazmaya Başlamak", text: "Notlarımı bir blogda toplamaya karar verdim." },
    { year: "2022", title: "Uzun Rota", text: "Asya'da altı ay; Kyoto'dan Hoi An'a yavaş bir kıyı yolculuğu." },
    { year: "2025", title: "Yerel Rehberler", text: "Gezginler için özel rotalar ve fotoğraf atölyeleri." },
  ],
  interests: ["Gün doğumu", "Yerel mutfak", "Analog fotoğraf", "Tren yolculukları", "Eski kitap pazarları"],
  stats: { countries: 37, cities: 214, km: 58000 },
  links: {
    instagram: "https://www.instagram.com",
    youtube: "https://www.youtube.com",
    email: "mailto:merhaba@yolcunundefteri.com",
  },
};

export const SEED: SiteData = {
  socials: [
    { id: "soc-instagram", platform: "instagram", handle: "denizinyolculugu" },
    { id: "soc-youtube", platform: "youtube", handle: "yolcununDefteri" },
    { id: "soc-x", platform: "x", handle: "denizyolda" },
    { id: "soc-tiktok", platform: "tiktok", handle: "denizyolda" },
    { id: "soc-pinterest", platform: "pinterest", handle: "yolcunundefteri" },
    { id: "soc-spotify", platform: "spotify", handle: "yolculuk.listesi" },
  ],
  categories: CATEGORIES,
  posts: POSTS,
  location: {
    city: "İstanbul",
    country: "Türkiye",
    countryCode: "TR",
    lat: 40.99,
    lng: 29.027,
    status: "Kadıköy'de sabah kahvesi ☕",
    visible: true,
    updatedAt: "2026-10-11T07:20:00+03:00",
  },
  subscribers: [
    { id: "s-1", email: "ayse.kaya@example.com", createdAt: "2026-10-01T10:00:00+03:00" },
    { id: "s-2", email: "mert.demir@example.com", createdAt: "2026-09-18T14:30:00+03:00" },
    { id: "s-3", email: "elif.yildiz@example.com", createdAt: "2026-09-05T20:15:00+03:00" },
    { id: "s-4", email: "can.ozturk@example.com", createdAt: "2026-08-21T09:45:00+03:00" },
  ],
};

export const LOCATION_PRESETS = [
  { city: "Göreme", country: "Türkiye", countryCode: "TR", lat: 38.6431, lng: 34.8289 },
  { city: "Kyoto", country: "Japonya", countryCode: "JP", lat: 35.0116, lng: 135.7681 },
  { city: "Lizbon", country: "Portekiz", countryCode: "PT", lat: 38.7223, lng: -9.1393 },
  { city: "Tiflis", country: "Gürcistan", countryCode: "GE", lat: 41.7151, lng: 44.8271 },
  { city: "Marakeş", country: "Fas", countryCode: "MA", lat: 31.6295, lng: -7.9811 },
  { city: "İstanbul", country: "Türkiye", countryCode: "TR", lat: 40.99, lng: 29.027 },
];
