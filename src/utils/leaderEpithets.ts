import { DimensionKey, Leader, LeaderScores, TierLevel } from '../types';

/**
 * Kişiye özel tarihsel nitelik / unvan alt başlıkları.
 * Her liderin gerçek tarihsel rolüne göre yazılmıştır; kurucu olmayan liderlere
 * asla "Kurucu Deha" etiketi verilmez.
 */
export const LEADER_TIER_EPITHETS: Record<string, string> = {
  // --- S TIER (ve Zirve İsimler) ---
  ataturk: 'Cumhuriyet Kurucusu & Başkomutan',
  'suleiman-the-magnificent': 'Kanun Koyucu & Cihan İmparatoru',
  'fatih-mehmed': 'İstanbul Fatihi & Rönesans Hükümdarı',
  'yavuz-sultan-selim': 'Doğu Fatihi & İlk Osmanlı Halifesi',
  'murad-1': 'Balkan Fatihi & Devlet Teşkilatçısı',
  'mahmud-2': 'Köklü Islahatçı & Modernleşme Öncüsü',
  'abdulhamid-2': 'Denge Diplomatı & Hamidiye Mimarı',
  'mete-han': 'Bozkır Teşkilatçısı & Hun Kurucusu',
  attila: 'Avrupa Hun Başbuğu & Bozkır İmparatoru',
  'bumin-kagan': 'Göktürk Kağanlığı Kurucusu',
  'istemi-yabgu': 'Batı Kanadı Yabgusu & İpek Yolu Diplomatı',
  'kutluk-kagan': 'II. Göktürk Kurucusu & İstiklal Önderi',
  'bilge-kagan': 'Orhun Bilgesi & Kağanlık Kurtarıcısı',
  'vezir-tonyukuk': 'Bozkır Stratejisti & Başvezir',
  'kul-tigin': 'Bozkır Başkomutanı & Devlet Koruyucusu',
  'bogu-kagan': 'Yerleşik Uygarlık Öncüsü & Kağan',
  'gazneli-mahmud': 'İlk Sultan & Hindistan Fatihi',
  'tugrul-bey': 'Büyük Selçuklu Kurucusu & İlk Sultan',
  'cagri-bey': 'Anadolu Kaşifi & Başkomutan',
  'sultan-alparslan': 'Malazgirt Fatihi & Büyük Komutan',
  'sultan-meliksah': 'Selçuklu Zirvesi & Cihan Sultanı',
  nizamulmulk: 'Devlet Aklı & Nizamiye Mimarı',
  'alaeddin-keykubad': 'Anadolu Altın Çağı & Ulu Sultan',
  'aydinoglu-umur-bey': 'Ege Denizcisi & Gazi Bey',
  'uzun-hasan': 'Akkoyunlu Zirvesi & Kanunî Hükümdar',
  'emir-timur': 'Yenilmez Komutan & Rönesans Banisi',

  caesar: 'Cumhuriyet Diktatörü & Fetih Dehası',
  octavius: 'İlk Roma İmparatoru & Pax Romana',
  vespasian: 'İstikrar İmparatoru & Flavianus Kurucusu',
  trajan: 'Optimus Princeps & Fetih İmparatoru',
  hadrian: 'Sınır Mimarı & Gezgin İmparator',
  'constantine-the-great': 'Konstantinopolis Banisi & Reform İmparatoru',
  'justinian-i': 'Büyük Kanun Koyucu & Ayasofya Banisi',
  pericles: 'Atina Demokrasisi & Altın Çağ Lideri',

  'george-washington': 'Ulusun Babası & Kurucu Başkan',
  'thomas-jefferson': 'Bağımsızlık Filozofu & Aydın Başkan',
  'abraham-lincoln': 'Birlik Kurtarıcısı & Özgürlük Başkanı',
  'theodore-roosevelt': 'İlerlemeci Reformcu & Süper Güç Mimarı',
  'franklin-d-roosevelt': 'Buhran & Zafer Dönemi Başkanı',
  'harry-truman': 'Soğuk Savaş Stratejisti & Kararlı Başkan',
  'dwight-eisenhower': 'Müttefik Başkomutanı & Altyapı Başkanı',
  'john-f-kennedy': 'Uzay Çağı Vizyoneri & Kriz Lideri',
  'ronald-reagan': 'Ekonomik Dönüşüm & Soğuk Savaş Galibi',

  napoleon: 'Askeri Deha & Hukuk Reformcusu',
  'charles-de-gaulle': 'Direniş Sembolü & Cumhuriyet Mimarı',
  'frederick-the-great': 'Aydın Despot & Askeri Stratejist',
  'otto-von-bismarck': 'Alman Birliği Mimarı & Realpolitik Ustası',
  'konrad-adenauer': 'Batı Almanya Kurucusu & İstikrar Şansölyesi',
  'helmut-schmidt': 'Soğukkanlı Kriz & Ekonomi Şansölyesi',
  'william-the-conqueror': 'İngiltere Fatihi & Feodal Düzen Mimarı',
  'queen-elizabeth-1': 'Tudor Altın Çağı Kraliçesi',
  'william-3': 'Meşrutiyetçi Kral & Devrim Lideri',
  'queen-victoria': 'İmparatorluk Zirvesi & Viktorya Çağı',
  'elizabeth-2': 'Tahtın Sabit Çapası & Anayasal Monark',
  'margaret-thatcher': 'Piyasa Devrimcisi & Demir Leydi',
  'isabella-castile': 'Birleşik İspanya Kurucusu & Katolik Kraliçe',
  'mario-draghi': 'Euro Kurtarıcısı & Teknokrat Lider',
  'ii-katerina': 'Aydınlanma Çariçesi & İmparatorluk Genişleticisi',

  'emperor-taizong': 'Zhenguan Altın Çağı İmparatoru',
  'kubilay-han': 'Yuan İmparatoru & İpek Yolu Hükümdarı',
  saladin: 'Kudüs Fatihi & Şövalye Sultan',
  'hz-ebubekir': 'İlk Halife & Birlik Koruyucusu',
  'hz-omer': 'Adalet Timsali & Devlet Teşkilatçısı',
  'hz-osman': 'Kur’an Çoğaltıcısı & İlk Donanma Banisi',
  'hz-ali': 'İlmin Kapısı & Adalet Halifesi',
  'hz-hasan': 'Barış Halifesi & Ümmeti Birleştiren',
  'abdullah-bin-zubeyr': 'Mekke Halifesi & Şûra Savunucusu',
  'yezid-1': 'Saltanat Başlatıcısı & Kerbela Müsebbibi',
  'velid-1': 'Emevi Zirvesi & İlk Devlet Hastaneleri Banisi',
  'hisam-bin-abdulmelik': 'Son Büyük Şam Halifesi & Maliye Ustası',
  'mervan-2': 'Son Şam Emevi Halifesi & Cephe Komutanı',
  'abdurrahman-1': 'Kureyş Şahini & Endülüs Emevi Kurucusu',
  'hakem-2': 'Kurtuba Kütüphanesi & Bilim Hamisi Halife',
  'omer-bin-abdulaziz': 'Adil Halife & Islahatçı Hükümdar',
  'abdurrahman-3': 'Kurtuba Altın Çağı & Bilim Hamisi',
  'ebul-abbas-seffah': 'Abbasi Hanedanı Kurucusu & İlk Halife',
  'el-mansur': 'Bağdat Banisi & Teşkilatçı Halife',
  'muhammed-el-mehdi': 'İmar & Hac Yolu Halifesi',
  'harun-resid': 'İslam Altın Çağı & İhtişam Halifesi',
  'el-memun': 'Bilim Devrimi & Beytü’l-Hikme Hamisi',
  'el-mutasim': 'Samarra Banisi & Ammoriye Fatihi Halife',
  'el-mutevekkil': 'Mihne Bitiricisi & Sünni Restorasyon Halifesi',
  'el-mutazid': 'İkinci Mansur & Hilafet Toparlayıcısı',
  'en-nasir-lidinillah': 'Fütüvvet Kurucusu & Geç Abbasi Gücü',
  'el-mustasim': 'Son Bağdat Halifesi & 1258 Trajedisi',
  'sultan-baybars': 'Ayn Calut Galibi & Memlük Kudreti',

  'narmer-menes': 'Mısır’ı Birleştiren İlk Firavun',
  zoser: 'İlk Basamaklı Piramit & Eski Krallık Öncüsü',
  'khufu-keops': 'Büyük Gize Piramidi Banisi Firavun',
  hatshepsut: 'Punt Ticareti & Altın Çağ Kadın Firavunu',
  'thutmose-3': 'Mısır’ın Napolyon’u & Megiddo Fatihi',
  akhenaton: 'Amarna Devrimi & Aten İnancı Firavunu',
  tutankhamun: 'Restorasyon Dönemi Altın Firavunu',
  'seti-1': '19. Hanedan Komutanı & Karnak Mimarı',
  'ramses-2': 'Kadeş Barışı İmparatoru & Büyük Ramses',
  'ramses-3': 'Deniz Kavimlerini Durduran Son Büyük Firavun',
  'kleopatra-7': 'Son Aktif Firavun & Stratejist Kraliçe',
  'kavalali-mehmed-ali': 'Modern Mısır Kurucusu & Reformcu Vali',
  'enver-sedat': 'Ekim Savaşı & Camp David Barış Lideri',

  'thomas-sankara': 'Onurlu Kalkınma & Devrimci Lider',
  'nelson-mandela': 'Özgürlük Sembolü & Uzlaşı Başkanı',
  'seretse-khama': 'Botsvana Kurucusu & Kalkınma Öncüsü',

  // --- ÖNE ÇIKAN A / B / C / D LİDERLERİ ---
  'osman-gazi': 'Osmanlı Beyliği Kurucusu & Gazi',
  'orhan-gazi': 'Bursa Fatihi & İlk Devlet Kurumsallaştırıcısı',
  'bayezid-1': 'Yıldırım Komutan & Anadolu Birleştiricisi',
  'mehmed-1': 'Fetret Sonrası Devletin İkinci Banisi',
  'murad-2': 'Balkan Savunucusu & Kültür Hamisi',
  'bayezid-2': 'İstikrar, Donanma & Hoşgörü Sultanı',
  'murad-4': 'Bağdat Fatihi & Otorite Sultanı',
  'selim-3': 'Nizam-ı Cedid & Modernleşme Şehidi',
  abdulmecid: 'Tanzimat Fermanı & Reform Sultanı',
  'ismet-inonu': 'Lozan Diplomatı & Çok Partili Geçiş Lideri',
  'turgut-ozal': 'Serbest Piyasa & Dışa Açılım Mimarı',
  'bulent-ecevit': 'Kıbrıs Fatihi & Sosyal Demokrat Lider',
  'adnan-menderes': 'Demokratik Açılım & Kalkınma Başbakanı',
  'suleyman-demirel': 'Barajlar & Altyapı Siyasetinin Duayeni',
  'necmettin-erbakan': 'Ağır Sanayi & Milli Görüş Kurucusu',
  'recep-tayyip-erdogan': 'Altyapı Dönüşümü & Güçlü İcraat Lideri',
  'alparslan-turkes': 'Milliyetçi Hareketin İdeolog Kurucusu',
  'zeki-velidi-togan': 'Başkurdistan Önderi & Türkoloji Alimi',
  'refik-saydam': 'Halk Sağlığı & Hıfzıssıhha Mimarı',
  'hasan-ali-yucel': 'Köy Enstitüleri & Tercüme Devrimcisi',
  'mahmut-esat-bozkurt': 'Medeni Kanun & Hukuk Devrimcisi',
  'ismail-cem': 'Çok Boyutlu Diplomasi & AB Adaylığı Mimarı',
  'mithat-pasa': 'Kanun-i Esasi & Meşrutiyet Öncüsü',
  'esref-bitlis': 'Terörle Mücadelede Strateji & Barış Komutanı',

  'alexander-the-great': 'Dünya Fatihi & Helenizm Yayıcısı',
  'marcus-aurelius': 'Filozof İmparator & Stoacı Devlet Adamı',
  cicero: 'Cumhuriyet Hatibi & Hukuk Savunucusu',
  'mark-antony': 'Roma Triumviri & Doğu Cephesi Komutanı',
  'genghis-khan': 'Moğol İmparatorluğu Kurucusu & Bozkır Fatihi',
  'peter-the-great': 'Rusya’yı Avrupalılaştıran Reformcu Çar',
  'winston-churchill': 'Savaş Zamanı Direniş Başbakanı',
  'angela-merkel': 'Avrupa Denge Şansölyesi & Kriz Yöneticisi',
  'friedrich-merz': 'Merkez Sağ Ekonomik Toparlanma Lideri',
  'vladimir-lenin': 'Bolşevik Devrim & SSCB Kurucusu',
  'josef-stalin': 'Ağır Sanayi & Totaliter Demir Yumruk',
  'mikhail-gorbachev': 'Glasnost, Perestroyka & Soğuk Savaş Bitiricisi',
  'vladimir-putin': 'Merkezi Otorite & Jeopolitik Revizyonist',
  'sun-yat-sen': 'Modern Çin Cumhuriyeti Kurucu Önderi',
  'mao-zedong': 'Çin Halk Cumhuriyeti Kurucusu & İdeolog',
  'deng-xiaoping': 'Çin Ekonomik Mucizesinin Reform Mimarı',
  'fidel-castro': 'Küba Devrimi Önderi & Anti-Emperyalist Lider',
  'che-guevara': 'Uluslararası Gerilla & Devrim Sembolü',
  'haydar-aliyev': 'Modern Azerbaycan’ın İstikrar Mimarı',
  'ilham-aliyev': 'Karabağ Zaferi & Enerji Diplomasisi Lideri',
  'ebulfez-elcibey': 'Demokratik Bağımsızlık & Milli Cephe Önderi',
  'ruhollah-khomeini': 'İran İslam Devrimi Kurucusu & Rehber',
  'nikol-pashinyan': 'Kadife Devrim Sonrası Kriz Başbakanı',

  'adolf-hitler': 'Totaliter Yıkım & Dünya Savaşı Müsebbibi',
  caligula: 'Keyfi İstibdat & Çalkantılı İmparatorluk',
  'liz-truss': 'Tarihin En Kısa & Mali Çalkantılı Başbakanlığı',
  'kenan-evren': '12 Eylül Darbe Rejimi & Askeri Vesayet',
  'mustafa-1': 'Akli Dengesizlik & Saray Buhranları Dönemi',
  'mustafa-4': 'Kısa Süreli Darbe & Tepki Padişahı',
  'damat-ferid-pasa': 'Sevr İmzalayıcısı & İşgal İşbirlikçisi',
  'ali-kemal': 'Milli Mücadele Karşıtı Kalem & Kısa Nazırlık',
  'saddam-hussein': 'Otoriter Baskı & Yıkıcı Bölgesel Savaşlar',
  'nicolae-ceausescu': 'Baskıcı Rejim & Ekonomik Yıkım Diktatörü',
  'enver-hoxha': 'Aşırı İzolasyonist & Sığınak Rejimi Lideri',
  'abdullah-ocalan': 'Şiddet & Terör Örgütü Elebaşı',
  'kim-il-sung': 'Juche Kurucusu & Kuzey Kore Hanedan Başlatıcısı',
  'kim-jong-il': 'Önce Ordu Rejimi & Kıtlık Dönemi Lideri',
  'kim-jong-un': 'Nükleer Caydırıcılık & Mutlak Rejim Lideri',
  'pol-pot': 'Sıfır Yılı Yıkımı & Ölüm Tarlaları Faili',
  'david-ben-gurion': 'İsrail Devleti Kurucusu & İlk Başbakan',
  'golda-meir': 'Yom Kippur Krizi & Demir Leydi Başbakan',
  'moshe-dayan': 'Altı Gün Savaşı Komutanı & Camp David Diplomatı',
  'yitzhak-rabin': 'Oslo Barış Mimarı & Suikast Kurbanı Lider',
  'menachem-begin': 'Likud Kurucusu & Camp David Barış Başbakanı',
  'shimon-peres': 'Ekonomik İstikrar & Oslo Nobel Devlet Adamı',
  'ariel-sharon': 'Süveyş Komutanı & Gazze Çekilmesi Başbakanı',
  'benjamin-netanyahu': 'En Uzun Süreli Başbakan & Kutuplaştırıcı Lider',
  'yair-lapid': 'Değişim Koalisyonu & Merkez Muhalefet Lideri',
  'benny-gantz': 'Eski Genelkurmay Başkanı & Merkez Siyaset Lideri',
  'qasem-soleimani': 'Kudüs Gücü Mimarı & Bölgesel Stratejist',
  'mohammad-bagheri': 'İran Genelkurmay Başkanı & Savunma Doktrini Lideri',
  'hossein-salami': 'Devrim Muhafızları Başkomutanı & Asimetrik Stratejist',
  'amir-ali-hajizadeh': 'Füze, İHA & Hava-Uzay Kuvvetleri Komutanı',
  'mohammad-reza-zahedi': 'Kudüs Gücü Şam-Lübnan Saha Komutanı',
  'ali-sayyad-shirazi': 'Ortak Cephe Stratejisti & Kara Kuvvetleri Komutanı',
  'hassan-tehrani-moghaddam': 'İran Balistik Füze Programının Kurucusu',
  'mostafa-chamran': 'Fizikçi Savunma Bakanı & Düzensiz Harp Komutanı',
  'sheikh-ahmed-yassin': 'Hamas Kurucusu & Gazze Ruhani Lideri',
  'abdel-aziz-al-rantisi': 'Hamas Kurucu Ortağı & Gazze Sözcüsü',
  'khaled-mashal': 'Hamas Dış Lideri & Siyasi Büro Eski Başkanı',
  'ismail-haniyeh': 'Filistin Eski Başbakanı & Hamas Siyasi Lideri',
  'yahya-sinwar': 'Gazze Hamas Lideri & 7 Ekim Planlayıcısı',
  'mohammed-deif': 'Kassam Tugayları Başkomutanı & Tünel Mimarı',
  'oda-nobunaga': 'Ateşli Silah Devrimcisi & İlk Birleştirici',
  'toyotomi-hideyoshi': 'Japonya Birleştiricisi & Taikō Reformcusu',
  'tokugawa-ieyasu': 'Tokugawa Şogunluğu Kurucusu & Edo Barışı',
  'emperor-meiji': 'Meiji Restorasyonu & Sanayileşme Sembolü',
  'ito-hirobumi': 'İlk Japon Başbakanı & Meiji Anayasası Mimarı',
  'okubo-toshimichi': 'Meiji Sanayileşme & Devlet Kurucusu',
  'saigo-takamori': 'Restorasyon Başkomutanı & Son Samuray',
  'sakamoto-ryoma': 'Meiji Geçiş Vizyoneri & Deniz Ticareti Öncüsü',
  'togo-heihachiro': 'Tsushima Deniz Zaferi Komutanı ("Doğu’nun Nelson’u")',
  'hideki-tojo': 'II. Dünya Savaşı Militarist Başbakanı',
  'shigeru-yoshida': 'Yoshida Doktrini & Japon Ekonomik Mucizesi',
  'shinzo-abe': 'Abenomics Mimarı & En Uzun Süreli Başbakan',
  'shigeru-ishiba': 'Savunma Uzmanı & Azınlık Hükümeti Başbakanı',
  'hafez-al-assad': 'Şam’ın Sfenksi & Demir Yumruk Cumhurbaşkanı',
  'bashar-al-assad': 'Baas Rejiminin Son Lideri & İç Savaş Bilançosu',
  'shukri-al-quwatli': 'Bağımsız Suriye’nin İlk Cumhurbaşkanı',

  // --- HRİSTİYANLIK TARİHİ & ROMA İMPARATORLARI ---
  'st-paul': 'Milletlerin Havarisi & Hristiyan Teolojisi Mimarı',
  'st-augustine': 'Kilise Doktoru & Tanrı Devleti Filozofu',
  'st-benedict': 'Batı Manastır Sistemi Kurucusu',
  'pope-gregory-1': 'Orta Çağ Papalığının Kurucusu & Büyük Papa',
  'pope-gregory-7': 'Gregoryen Reformları & Canossa Galibi Papa',
  'pope-urban-2': 'Birinci Haçlı Seferi Başlatıcısı Papa',
  'st-francis-assisi': 'Fransisken Önderi & Yoksulluk/Barış Aziz’i',
  'st-thomas-aquinas': 'Skolastik Zirve & Doğal Hukuk Filozofu',
  'martin-luther': 'Protestan Reformu Başlatıcısı & 95 Tez Yazarı',
  'john-calvin': 'Kalvinizm Kurucusu & Cenevre Reformcusu',
  'theodosius-1': 'Hristiyanlığı Devlet Dini Yapan Son Tek Roma İmparatoru',
  'antoninus-pius': 'Altın Pax Romana & Hazine İmparatoru',
  'septimius-severus': 'Severus Hanedanı Kurucusu & Afrikalı İmparator',
  aurelian: 'Dünyanın Onarıcısı & İmparatorluğu Birleştiren',
  'julian-apostate': 'Filozof İmparator & Pagan Restorasyon Girişimi',
  'romulus-augustulus': 'Batı Roma’nın Son Sembolik İmparatoru',
  heraclius: 'Sasani Fatihi & Doğu Roma Reformcusu',

  // --- TROÇKİ, RUSYA, MARKSİSTLER, SPD & BRECHT ---
  'leon-trotsky': 'Kızıl Ordu Kurucusu & Sürekli Devrim Teorisyeni',
  'ivan-the-terrible': 'İlk Tüm Rusya Çarı & Opriçnina Hükümdarı',
  'nicholas-2': 'Son Romanov Çarı & 1917 Çöküşü',
  'karl-marx': 'Bilimsel Sosyalizm Kurucusu & Das Kapital Yazarı',
  'friedrich-engels': 'Marksizmin Eş Kurucusu & Sosyal Teorisyen',
  'rosa-luxemburg': 'Spartaküs Lideri & Özgürlükçü Marksist Kuramcı',
  'karl-liebknecht': 'Savaş Karşıtı Vekil & Spartaküs Eş Kurucusu',
  'august-bebel': 'SPD Kurucusu & Reichstag Muhalefet Duayeni',
  'karl-kautsky': 'II. Enternasyonal & Erfurt Programı Teorisyeni',
  'eduard-bernstein': 'Demokratik Sosyalizm & Refah Devleti Kuramcısı',
  'clara-zetkin': '8 Mart Öncüsü & Anti-Faşist Kadın Lideri',
  'friedrich-ebert': 'Weimar Cumhuriyeti’nin İlk Cumhurbaşkanı',
  'philipp-scheidemann': 'Alman Cumhuriyeti’ni İlan Eden İlk Şansölye',
  'bertolt-brecht': 'Epik Tiyatro Kurucusu & Politik Oyun Yazarı',
  'christian-lindner': 'Borç Freni Savunucusu & FDP Eski Maliye Bakanı',
  'markus-soder': 'Bavyera Başbakanı & CSU Güç Merkezi',
  'heidi-reichinnek': 'Die Linke Meclis Eş Başkanı & Genç Sol Muhalefet',

  // --- ABD, İNGİLTERE, AVRUPA & KÜRESEL DENGE ---
  'jd-vance': '50. ABD Başkan Yardımcısı & Ekonomik Milliyetçi',
  'kamala-harris': 'ABD Tarihinin İlk Kadın Başkan Yardımcısı',
  'mike-pence': '48. ABD Başkan Yardımcısı & 6 Ocak Anayasa Savunucusu',
  'marco-rubio': '72. ABD Dışişleri Bakanı & İlk Latin Başdiplomat',
  'dick-cheney': '46. ABD Başkan Yardımcısı & Irak Savaşı Mimarı',
  'al-gore': '45. ABD Başkan Yardımcısı & Nobel İklim Lideri',
  'paul-ryan': '54. Temsilciler Meclisi Başkanı & Vergi Reformcusu',
  'gavin-newsom': 'Kaliforniya Valisi & Ulusal Demokrat Sözcü',
  'bernie-sanders': 'Demokratik Sosyalist Senatör & İlerici Lider',
  'alexandria-ocasio-cortez': 'Yeşil Yeni Düzen Mimarı & Genç Sol Sözcü',
  'rand-paul': 'Liberteryen Senatör & Savaş/Gözetim Karşıtı',
  'nikki-haley': 'Eski BM Büyükelçisi & Parti İçi Rakip',
  'ron-desantis': 'Florida Valisi & Muhafazakâr Eyalet Lideri',
  'pete-buttigieg': 'Eski Ulaştırma Bakanı & Altyapı Yatırım Mimarı',
  'john-adams': 'ABD 2. Başkanı & İlk Başkan Yardımcısı',
  'clement-attlee': 'NHS & İngiliz Refah Devleti Kurucusu Başbakan',
  'jeremy-corbyn': 'İşçi Partisi Eski Ana Muhalefet Lideri',
  'nicola-sturgeon': 'İskoçya Eski Başbakanı & SNP Lideri',
  'john-major': 'Kuzey İrlanda Barış Süreci Başlatıcısı Başbakan',
  'david-lloyd-george': 'I. Dünya Savaşı Başbakanı & Sosyal Bütçe Reformcusu',
  'louis-14': 'Güneş Kral & Versay Mutlakiyetçiliği Zirvesi',
  'edouard-philippe': 'Fransa Eski Başbakanı & Horizons Lideri',
  'eric-zemmour': 'Reconquête! Kurucusu & Aşırı Sağ İdeolog',
  'silvio-berlusconi': '4 Dönem İtalya Başbakanı & Medya İmparatoru',
  'matteo-renzi': 'En Genç İtalya Başbakanı & Italia Viva Lideri',
  'mahatma-gandhi': 'Şiddetsiz Direniş Önderi & Bağımsızlık Sembolü',
  'jawaharlal-nehru': 'Bağımsız Hindistan Kurucu İlk Başbakanı',
  'narendra-modi': 'Dijital Hindistan & Hindu Milliyetçi Başbakan',
  'lula-da-silva': 'Sosyal Refah Lideri & 3 Dönem Brezilya Başkanı',
  'jair-bolsonaro': 'Sağ Popülist Eski Brezilya Devlet Başkanı',
  'volodymyr-zelenskyy': 'Kiev Savunması & Savaş Zamanı Ukrayna Başkanı',
  'petro-poroshenko': 'AB Yönelimi & Tomos Mimarı Eski Başkan',

  // --- OSMANLI KOMUTANLARI & KAPTAN-I DERYALARI ---
  'barbaros-hayreddin-pasa': 'Preveze Fatihi & Akdeniz Kaptan-ı Deryası',
  'piri-reis': 'Dünya Haritacısı & Kitab-ı Bahriye Amirali',
  'turgut-reis': 'Trablusgarp Fatihi & Cerbe Galibi Amiral',
  'kilic-ali-pasa': 'İnebahtı Sonrası Donanmayı Dirilten Kaptan-ı Derya',
  'sokullu-mehmed-pasa': 'Üç Padişahın Başveziri & İmparatorluk Diplomatı',
  'pargali-ibrahim-pasa': 'Mohaç Seraskeri & Kanuni Dönemi Başveziri',
  'koprulu-mehmed-pasa': 'Devleti Buhrandan Kurtaran Köprülüler Kurucusu',
  'cezayirli-gazi-hasan-pasa': 'Mühendishane Banisi & Bahriye Islahatçısı Paşa',
  'gazi-osman-pasa': '1877 Plevne Müdafii & Efsanevi Mareşal',

  // --- FRANSA (II. & III. NAPOLYON + DERİN TARİH) ---
  'napoleon-2': 'Roma Kralı & Trajik Bonapart Varisi',
  'napoleon-3': 'İkinci İmparatorluk İmparatoru & Paris Mimarı',
  'clovis-1': 'Frankların İlk Kralı & Merovenj Kurucusu',
  charlemagne: 'Avrupa’nın Babası & Karolenj İmparatoru',
  'philip-2-augustus': 'Bouvines Galibi & Merkezi Fransa Mimarı',
  'louis-9': 'Adalet Kralı & Orta Çağ Reformcusu',
  'joan-of-arc': 'Orléans Bakiresi & Ulusal Direniş Azizesi',
  'francis-1-france': 'Fransız Rönesansı Kralı & Osmanlı Müttefiki',
  'henry-4-france': 'Nantes Fermanı Kralı & Bourbon Kurucusu',
  'cardinal-richelieu': 'Devlet Aklı (Raison d’État) Mimarı Başbakan',
  'louis-16': 'Son Mutlakiyetçi Bourbon Kralı',
  'marquis-de-lafayette': 'İki Dünyanın Kahramanı & Haklar Bildirgesi Yazarı',
  'georges-clemenceau': 'Zafer Başbakanı ("Kaplan") & Laiklik Savunucusu',
  'leon-blum': 'Ücretli Tatil & Halk Cephesi Reformcusu',
  'philippe-petain': 'Verdun Kahramanı & Vichy İşbirlikçi Şefi',
  'francois-mitterrand': 'İdamı Kaldıran & AB Kurucu Cumhurbaşkanı',
  'jacques-chirac': '2003 Irak Karşıtı & Denge Cumhurbaşkanı',
  'charles-montesquieu': 'Kuvvetler Ayrılığı Kuramcısı & Hukuk Filozofu',
  'jean-jacques-rousseau': 'Toplum Sözleşmesi & Halk Egemenliği Filozofu',

  // --- İTALYA, İSPANYA, RUSYA, ÇİN, HİNDİSTAN, ABD, İNGİLTERE, ALMANYA & DİĞER ---
  'lorenzo-de-medici': 'Rönesans Hamisi & Floransa Diplomatı',
  'niccolo-machiavelli': 'Modern Siyaset Bilimi Kurucusu & "Prens" Yazarı',
  'camillo-di-cavour': 'İtalyan Birliği’nin Diplomatik Beyni',
  'giuseppe-garibaldi': 'Kırmızı Gömlekliler Başkomutanı & İtalya Kılıcı',
  'giuseppe-mazzini': 'Genç İtalya Kurucusu & Cumhuriyet Filozofu',
  'victor-emmanuel-2': 'Birleşik İtalya’nın İlk Kralı (Padre della Patria)',
  'benito-mussolini': 'Faşist Diktatör & Yıkıcı Mihver Lideri',
  'alcide-de-gasperi': 'İtalyan Cumhuriyeti & AB Kurucu Babası',
  'antonio-gramsci': 'Kültürel Hegemonya Kuramcısı & Düşünür',
  'enrico-berlinguer': 'Avrokomünizm & Tarihsel Uzlaşma Lideri',
  'aldo-moro': 'Kızıl Tugaylar Kurbanı Uzlaşı Başbakanı',
  'el-cid': 'Yenilmez Reconquista Şövalyesi & Valencia Beyi',
  'ferdinand-2-aragon': 'Katolik İspanya Eş Kurucusu & Diplomat',
  'charles-5-spain': 'Güneş Batmayan Habsburg İmparatoru',
  'francisco-franco': 'İç Savaş Galibi & 36 Yıllık Askeri Diktatör',
  'adolfo-suarez': 'Franco Sonrası Demokratik Geçiş Mimarı',
  'felipe-gonzalez': 'AB Entegrasyonu & Modern Sosyalist Başbakan',
  'alexander-nevsky': 'Buz Savaşı Galibi & Novgorod Prensi',
  'mikhail-kutuzov': '1812 Napolyon Seferi Zafer Mareşali',
  'alexander-2-russia': 'Serfliği Kaldıran Kurtarıcı Reformcu Çar',
  'sergei-witte': 'Trans-Sibirya & Rus Sanayileşme Mimarı',
  'georgy-zhukov': 'Stalingrad ve Berlin Fatihi SSCB Mareşali',
  'lavrentiy-beria': 'NKVD Şefi & Sürgünler Yöneticisi',
  'alexei-navalny': 'Yolsuzluk Karşıtı Baş Muhalif & Hapishane Kurbanı',
  'emperor-wu-han': 'İpek Yolu’nu Açan Büyük Han İmparatoru',
  'wu-zetian': 'Çin Tarihinin Tek Resmi Kadın İmparatoru',
  'zheng-he': '7 Okyanus Seferi Ming Hazine Amirali',
  'kangxi-emperor': '61 Yıllık Yüksek Qing Altın Çağ İmparatoru',
  'chandragupta-maurya': 'Maurya Kurucusu & Alt Kıta Birleştiricisi',
  'ashoka-the-great': 'Dharma Hükümdarı & Şiddetsizlik İmparatoru',
  'akbar-the-great': 'Sulh-i Kull & Babür Altın Çağı İmparatoru',
  'shivaji-maharaj': 'Maratha İmparatorluğu Kurucusu & Gerilla Ustası',
  'bhimrao-ambedkar': 'Hindistan Anayasası Mimarı & Kast Karşıtı Önder',
  'sardar-patel': '565 Prensliği Birleştiren Demir Adam',
  'indira-gandhi': '1971 Zaferi & Olağanüstü Hal Demir Leydisi',
  'manmohan-singh': '1991 Piyasa Reformları Ekonomist Başbakanı',
  'benjamin-franklin': 'Kurucu Baba, Başdiplomat & Bilim İnsanı',
  'alexander-hamilton': 'ABD Finansal Sistem Kurucusu & İlk Hazine Bakanı',
  'james-madison': 'ABD Anayasası’nın Babası & 4. Başkan',
  'ulysses-s-grant': 'İç Savaş Birliği Başkomutanı & 18. Başkan',
  'martin-luther-king': 'Medeni Haklar Önderi & Nobel Barış Sembolü',
  'malcolm-x': 'Siyahi Özgürlük Hareketi Devrimci Hatibi',
  'oliver-cromwell': 'İngiltere Topluluğu Lord Koruyucusu & Mareşal',
  'william-pitt-younger': '24 Yaşında Seçilen Napolyon Karşıtı Başbakan',
  'duke-of-wellington': 'Waterloo Galibi Demir Dük & Başbakan',
  'horatio-nelson': 'Trafalgar Zaferi Efsanevi İngiliz Amirali',
  'benjamin-disraeli': 'Tek Ulus Muhafazakârlığı & Süveyş Başbakanı',
  'william-gladstone': '4 Dönem Liberal Reform & Gizli Oy Başbakanı',
  'frederick-barbarossa': 'Kutsal Roma İmparatoru & Haçlı Komutanı',
  'gustav-stresemann': 'Hiperenflasyonu Bitiren Nobel Barış Şansölyesi',
  'paul-von-hindenburg': 'Tannenberg Mareşali & Weimar Son Cumhurbaşkanı',
  'joschka-fischer': '2003 Irak Karşıtı Yeşil Dışişleri Bakanı',
  'dom-pedro-2': 'Brezilya’da Köleliği Kaldıran Aydın İmparator',
  'getulio-vargas': 'Modern Brezilya Kurucusu & İş Kanunu Başkanı',
  'volodymyr-the-great': 'Kiev Rus Kurucu Prensi & Tryzub Hükümdarı',
  'casimir-3-great': 'Polonya’yı Taştan İnşa Eden Reformcu Kral',
  'jan-3-sobieski': '1683 Viyana Meydanı Süvari Kralı',
  'jozef-pilsudski': 'Polonya Kurucusu & Vistül Zaferi Mareşali',
  'lech-walesa': 'Solidarność Kurucusu & Nobel Barış Cumhurbaşkanı',
  'william-of-orange': 'Hollanda Bağımsızlık Kurucusu (Sessiz Willem)',
  'minamoto-yoritomo': 'Japonya’nın İlk Şogunu & Kamakura Kurucusu',
  'emperor-hirohito': 'Shōwa Çağı & Savaş Sonrası Anayasal İmparator',
};

type RoleArchetype =
  | 'founder_check'
  | 'monarch'
  | 'commander'
  | 'caliph'
  | 'minister'
  | 'thinker'
  | 'executive'
  | 'party';

function detectRoleArchetype(leader: Leader): RoleArchetype {
  const sub = leader.subCategory || '';
  const titleLower = leader.title.toLowerCase();

  if (sub === 'rashidun' || sub === 'umayyad' || sub === 'abbasid' || titleLower.includes('halife')) {
    return 'caliph';
  }
  if (sub === 'christian-thinker' || sub === 'de-thinker') {
    return 'thinker';
  }
  if (
    sub === 'islamic-commander' ||
    sub === 'ir-commander' ||
    sub === 'ottoman-commander' ||
    (sub === 'tr-actor' && (titleLower.includes('orgeneral') || titleLower.includes('paşa') || titleLower.includes('komutan'))) ||
    titleLower.includes('komutan') ||
    titleLower.includes('başkomutan') ||
    titleLower.includes('amiral') ||
    titleLower.includes('kaptan-ı derya') ||
    titleLower.includes('mareşal') ||
    titleLower.includes('general')
  ) {
    return 'commander';
  }
  if (
    sub === 'ottoman-sultan' ||
    sub === 'uk-monarch' ||
    sub === 'es-monarch' ||
    sub === 'eg-pharaoh' ||
    sub === 'turkic-seljuk' ||
    sub === 'ancient-rome' ||
    sub === 'ancient-greece' ||
    sub === 'mn-leader' ||
    sub === 'christian-pope' ||
    titleLower.includes('padişah') ||
    titleLower.includes('sultan') ||
    titleLower.includes('kral') ||
    titleLower.includes('kraliçe') ||
    titleLower.includes('imparator') ||
    titleLower.includes('çar') ||
    titleLower.includes('kağan') ||
    titleLower.includes('şah') ||
    titleLower.includes('papa') ||
    titleLower.includes('han')
  ) {
    return 'monarch';
  }
  if (
    sub === 'tr-minister' ||
    sub === 'ottoman-late' ||
    titleLower.includes('bakan') ||
    titleLower.includes('vezir') ||
    titleLower.includes('sadrazam')
  ) {
    return 'minister';
  }
  if (
    sub.endsWith('-party') ||
    sub === 'gr-current' ||
    titleLower.includes('genel başkan') ||
    titleLower.includes('muhalefet') ||
    titleLower.includes('parti')
  ) {
    return 'party';
  }
  return 'executive';
}

function getTopTwoDimensions(scores: LeaderScores): [DimensionKey, DimensionKey] {
  const entries: [DimensionKey, number][] = [
    ['military', scores.military],
    ['economy', scores.economy],
    ['societal', scores.societal],
    ['diplomacy', scores.diplomacy],
    ['leadership', scores.leadership],
    ['legacy', scores.legacy],
  ];
  entries.sort((a, b) => b[1] - a[1]);
  return [entries[0][0], entries[1][0]];
}

/**
 * Liderin hem puanına (S/A/B/C/D) hem de rolüne ve en baskın 2 boyutuna göre
 * kişiselleştirilmiş alt etiket üretir.
 */
export function getLeaderTierSubtitle(
  leader: Leader,
  scores: LeaderScores,
  tier: TierLevel
): string {
  // Lider hâlâ varsayılan tier'ında ise ve özel unvanı tanımlıysa doğrudan kişiye özel unvanı döndür
  const defaultSum =
    leader.defaultScores.military +
    leader.defaultScores.economy +
    leader.defaultScores.societal +
    leader.defaultScores.diplomacy +
    leader.defaultScores.leadership +
    leader.defaultScores.legacy;
  const defaultOverall = Math.round(defaultSum / 6);
  const defaultTier: TierLevel =
    defaultOverall >= 90
      ? 'S'
      : defaultOverall >= 80
      ? 'A'
      : defaultOverall >= 70
      ? 'B'
      : defaultOverall >= 55
      ? 'C'
      : 'D';

  if (tier === defaultTier && LEADER_TIER_EPITHETS[leader.id]) {
    return LEADER_TIER_EPITHETS[leader.id];
  }

  const [top1, top2] = getTopTwoDimensions(scores);
  const role = detectRoleArchetype(leader);
  const overall = Math.round(
    (scores.military +
      scores.economy +
      scores.societal +
      scores.diplomacy +
      scores.leadership +
      scores.legacy) /
      6
  );

  if (tier === 'S') {
    if (top1 === 'military' || (top1 === 'leadership' && top2 === 'military')) {
      return role === 'monarch'
        ? 'Cihan Fatihi & Stratejik Hükümdar'
        : 'Askeri Deha & Tarihi Komutan';
    }
    if (top1 === 'societal' || top2 === 'societal') {
      return role === 'monarch'
        ? 'Kanun Koyucu & Medeniyet Hükümdarı'
        : 'Çağ Açan Hukuk & Toplum Reformcusu';
    }
    if (top1 === 'economy' || top2 === 'economy') {
      return 'Refah Mimarı & Kalkınma Lideri';
    }
    if (top1 === 'diplomacy' || top2 === 'diplomacy') {
      return 'Küresel Denge & Diplomasi Ustası';
    }
    return 'Tarihe Yön Veren Zirve Devlet Adamı';
  }

  if (tier === 'A') {
    if (top1 === 'military' || (top1 === 'leadership' && scores.military >= 84)) {
      if (role === 'monarch') return 'Muzaffer Hükümdar & Askeri Güç';
      if (role === 'commander') return 'Seçkin Başkomutan & Stratejist';
      return 'Kararlı Savunma & Strateji Lideri';
    }
    if (top1 === 'economy' && top2 === 'societal') {
      return 'Ekonomik Kalkınma & Reform Mimarı';
    }
    if (top1 === 'economy' || top2 === 'economy') {
      return role === 'minister'
        ? 'Ekonomi & Maliye Reformcusu'
        : 'Refah & Büyüme Odaklı Devlet Adamı';
    }
    if (top1 === 'societal' || top2 === 'societal') {
      return role === 'minister'
        ? 'Eğitim, Hukuk & Kurum Mimarı'
        : 'İlerlemeci Reform & Hukuk Lideri';
    }
    if (top1 === 'diplomacy' || top2 === 'diplomacy') {
      return 'Usta Diplomat & Uluslararası Aktör';
    }
    if (role === 'monarch') return 'Güçlü Hükümdar & İstikrar Dönemi';
    if (role === 'party') return 'Yüksek Etkili Siyasi Lider';
    return 'Seçkin Devlet Adamı & Dönem Lideri';
  }

  if (tier === 'B') {
    if (top1 === 'military' && scores.military >= 78) {
      return role === 'monarch'
        ? 'Askeri Ağırlıklı Hükümdar'
        : 'Savunma & Güvenlik Odaklı Lider';
    }
    if (top1 === 'economy') {
      return 'Ekonomik İstikrar & Yönetim Odaklı';
    }
    if (top1 === 'societal') {
      return 'Toplumsal Düzen & Hukuk Odaklı';
    }
    if (top1 === 'diplomacy') {
      return 'Denge & Uzlaşı Diplomatı';
    }
    if (top1 === 'leadership') {
      return role === 'party'
        ? 'Karizmatik & Etkili Siyasi Aktör'
        : 'Güçlü İrade, Dengeli İcraat';
    }
    return role === 'monarch'
      ? 'İstikrarlı Taht & Dengeli İdare'
      : 'Yetkin & İstikrarlı Yönetim';
  }

  if (tier === 'C') {
    if (scores.military >= 70 && scores.societal < 55) {
      return 'Sert Güç Odaklı, Tartışmalı Miras';
    }
    if (scores.leadership >= 72 && scores.economy < 55) {
      return 'Yüksek Karizma, Zayıf Mali Bilanço';
    }
    if (scores.economy >= 65 && scores.leadership < 58) {
      return 'Teknokratik Çaba, Sınırlı Liderlik';
    }
    if (role === 'party') {
      return 'Tartışmalı & Kutuplaştırıcı Siyaset';
    }
    return 'Krizlerle Çalkalanan Sınırlı Dönem';
  }

  // D TIER
  if (overall <= 15) {
    return 'Tarihsel Açıdan Yıkıcı & Olumsuz Miras';
  }
  if (scores.military >= 55 && scores.societal <= 30) {
    return 'Otoriter Baskı & Ağır Toplumsal Bedel';
  }
  if (scores.economy <= 35 && scores.leadership <= 40) {
    return 'Ekonomik Çöküş & Yönetim Zaafı';
  }
  return 'Bunalımlı Dönem & Ağır Bilanço';
}
