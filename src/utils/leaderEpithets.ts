import { DimensionKey, Leader, LeaderScores, TierLevel } from '../types';

/**
 * Custom historical epithets / role subtitles per figure.
 * Tailored strictly to each figure's historical role rather than generic templates.
 */
export const LEADER_TIER_EPITHETS: Record<string, string> = {
  // --- S TIER (& Top Figures) ---
  ataturk: 'Founder of the Republic & Commander-in-Chief',
  'suleiman-the-magnificent': 'The Lawgiver & World Emperor',
  'fatih-mehmed': 'Conqueror of Constantinople & Renaissance Sovereign',
  'yavuz-sultan-selim': 'Conqueror of the East & First Ottoman Caliph',
  'murad-1': 'Balkan Conqueror & State Architect',
  'mahmud-2': 'Radical Reformer & Modernization Pioneer',
  'abdulhamid-2': 'Balance-of-Power Diplomat & Hamidiye Architect',
  'mete-han': 'Steppe Organizer & Xiongnu Founder',
  attila: 'Scourge of God & European Hunnic Chieftain',
  'bumin-kagan': 'Founder of the First Turkic Khaganate',
  'istemi-yabgu': 'Western Yabgu & Silk Road Diplomat',
  'kutluk-kagan': 'Second Khaganate Founder & Independence Leader',
  'bilge-kagan': 'Sage of the Orkhon & Savior of the Khaganate',
  'vezir-tonyukuk': 'Steppe Grand Strategist & Chief Vizier',
  'kul-tigin': 'Steppe Supreme Commander & Defender of the Realm',
  'bogu-kagan': 'Settled Civilization Pioneer & Uyghur Khagan',
  'gazneli-mahmud': 'First Sultan & Conqueror in India',
  'tugrul-bey': 'Founder of Great Seljuk & First Sultan',
  'cagri-bey': 'Explorer of Anatolia & Supreme Commander',
  'sultan-alparslan': 'Victor of Manzikert & Great Commander',
  'sultan-meliksah': 'Seljuk Golden Zenith & World Sultan',
  nizamulmulk: 'Master of Statecraft & Nizamiyya Architect',
  'alaeddin-keykubad': 'Anatolian Golden Age & Great Sultan',
  'aydinoglu-umur-bey': 'Aegean Naval Ghazi & Prince',
  'uzun-hasan': 'Aq Qoyunlu Zenith & Lawmaking Sovereign',
  'emir-timur': 'Undefeated Conqueror & Timurid Renaissance Patron',

  caesar: 'Dictator of the Republic & Military Genius',
  octavius: 'First Roman Emperor & Architect of Pax Romana',
  vespasian: 'Restorer of Stability & Flavian Founder',
  trajan: 'Optimus Princeps & Conqueror Emperor',
  hadrian: 'Builder of Frontiers & Traveling Emperor',
  'constantine-the-great': 'Founder of Constantinople & Reforming Emperor',
  'justinian-i': 'Great Lawgiver & Builder of Hagia Sophia',
  pericles: 'Champion of Athenian Democracy & Golden Age Statesman',

  'george-washington': 'Father of the Nation & Founding President',
  'thomas-jefferson': 'Philosopher of Independence & Enlightenment President',
  'abraham-lincoln': 'Savior of the Union & Emancipator President',
  'theodore-roosevelt': 'Progressive Reformer & Superpower Architect',
  'franklin-d-roosevelt': 'New Deal & Wartime Victory President',
  'harry-truman': 'Cold War Strategist & Decisive President',
  'dwight-eisenhower': 'Allied Supreme Commander & Interstate President',
  'john-f-kennedy': 'Space Age Visionary & Missile Crisis Leader',
  'ronald-reagan': 'Economic Transformation & Cold War Victor',

  napoleon: 'Military Genius & Codifier of Modern Law',
  'charles-de-gaulle': 'Symbol of Resistance & Fifth Republic Architect',
  'frederick-the-great': 'Enlightened Monarch & Military Tactician',
  'otto-von-bismarck': 'Architect of German Unification & Realpolitik Master',
  'konrad-adenauer': 'Founder of West Germany & Stability Chancellor',
  'helmut-schmidt': 'Steadfast Crisis & Economic Chancellor',
  'william-the-conqueror': 'Conqueror of England & Feudal State Architect',
  'queen-elizabeth-1': 'Virgin Queen of the Tudor Golden Age',
  'william-3': 'Constitutional Monarch & Glorious Revolution Leader',
  'queen-victoria': 'Imperial Zenith & Sovereign of the Victorian Era',
  'elizabeth-2': 'Steadfast Anchor of the Crown & Constitutional Monarch',
  'margaret-thatcher': 'Free-Market Revolutionary & The Iron Lady',
  'isabella-castile': 'Founder of Unified Spain & Catholic Monarch',
  'mario-draghi': 'Savior of the Euro & Technocratic Statesman',
  'ii-katerina': 'Enlightened Empress & Imperial Expansionist',

  'emperor-taizong': 'Emperor of the Tang Golden Age of Zhenguan',
  'kubilay-han': 'Yuan Emperor & Lord of the Silk Road',
  saladin: 'Conqueror of Jerusalem & Chivalrous Sultan',
  'hz-ebubekir': 'First Caliph & Preserver of Unity',
  'hz-omer': 'Paragon of Justice & Caliphate Organizer',
  'hz-osman': 'Compiler of the Quran & First Naval Builder',
  'hz-ali': 'Gate of Knowledge & Caliph of Justice',
  'hz-hasan': 'Caliph of Peace & Unifier of the Community',
  'abdullah-bin-zubeyr': 'Caliph of Mecca & Champion of Shura',
  'yezid-1': 'Dynastic Succession & Tragedy of Karbala',
  'velid-1': 'Umayyad Zenith & First State Hospitals Patron',
  'hisam-bin-abdulmelik': 'Last Great Damascus Caliph & Fiscal Master',
  'mervan-2': 'Last Umayyad Caliph of Damascus & Field General',
  'abdurrahman-1': 'Falcon of Quraysh & Founder of Umayyad Córdoba',
  'hakem-2': 'Córdoba Library Patron & Scholarly Caliph',
  'omer-bin-abdulaziz': 'Just Caliph & Reforming Sovereign',
  'abdurrahman-3': 'Golden Age of Córdoba & Patron of Learning',
  'ebul-abbas-seffah': 'Founder of the Abbasid Dynasty & First Caliph',
  'el-mansur': 'Founder of Baghdad & Institutional Caliph',
  'muhammed-el-mehdi': 'Patron of Public Works & Pilgrimage Routes',
  'harun-resid': 'Islamic Golden Age & Caliph of Baghdad Splendor',
  'el-memun': 'Scientific Revolution & House of Wisdom Patron',
  'el-mutasim': 'Founder of Samarra & Conqueror of Amorium',
  'el-mutevekkil': 'End of the Mihna & Sunni Restoration Caliph',
  'el-mutazid': 'Second al-Mansur & Restorer of the Caliphate',
  'en-nasir-lidinillah': 'Futuwwa Organizer & Late Abbasid Revivalist',
  'el-mustasim': 'Last Abbasid Caliph of Baghdad & 1258 Tragedy',
  'sultan-baybars': 'Victor of Ain Jalut & Pillar of Mamluk Might',

  'narmer-menes': 'Unifier of Egypt & First Pharaoh',
  zoser: 'Builder of the Step Pyramid & Old Kingdom Pioneer',
  'khufu-keops': 'Pharaoh of the Great Pyramid of Giza',
  hatshepsut: 'Expedition to Punt & Golden Age Female Pharaoh',
  'thutmose-3': 'Napoleon of Ancient Egypt & Conqueror of Megiddo',
  akhenaton: 'Amarna Revolution & Pharaoh of Atenism',
  tutankhamun: 'Golden Boy King of the Restoration Era',
  'seti-1': '19th Dynasty Commander & Builder of Karnak',
  'ramses-2': 'Treaty of Kadesh & Ramses the Great',
  'ramses-3': 'Defender Against the Sea Peoples & Last Great Pharaoh',
  'kleopatra-7': 'Last Active Pharaoh & Master Polyglot Strategist',
  'kavalali-mehmed-ali': 'Founder of Modern Egypt & Reforming Viceroy',
  'enver-sedat': 'October War & Camp David Peace President',

  'thomas-sankara': 'Dignified Self-Reliance & Revolutionary President',
  'nelson-mandela': 'Icon of Freedom & Reconciliation President',
  'seretse-khama': 'Founder of Botswana & Development Pioneer',

  // --- PROMINENT A / B / C / D LEADERS ---
  'osman-gazi': 'Founder of the Ottoman Principality & Ghazi',
  'orhan-gazi': 'Conqueror of Bursa & Early State Institutionalizer',
  'bayezid-1': 'The Thunderbolt & Unifier of Anatolia',
  'mehmed-1': 'Restorer of the Empire After the Interregnum',
  'murad-2': 'Defender of the Balkans & Cultural Patron',
  'bayezid-2': 'Sultan of Stability, Naval Power & Tolerance',
  'murad-4': 'Conqueror of Baghdad & Iron-Willed Sultan',
  'selim-3': 'Nizam-i Cedid & Martyr of Modernization',
  abdulmecid: 'Tanzimat Edict & Reforming Sultan',
  'ismet-inonu': 'Lausanne Diplomat & Multi-Party Transition President',
  'turgut-ozal': 'Free-Market & Global Opening Architect',
  'bulent-ecevit': 'Cyprus Operation & Social Democratic Prime Minister',
  'adnan-menderes': 'Democratic Opening & Infrastructure Prime Minister',
  'suleyman-demirel': 'Veteran Statesman of Dams & Development',
  'necmettin-erbakan': 'Heavy Industry & Milli Görüş Founder',
  'recep-tayyip-erdogan': 'Infrastructure Overhaul & Dominant Executive Leader',
  'alparslan-turkes': 'Ideological Founder of the Nationalist Movement',
  'zeki-velidi-togan': 'Bashkir National Leader & Eminent Turkologist',
  'refik-saydam': 'Architect of Public Health & Hygiene Institutes',
  'recep-peker': 'Six Arrows Ideologue & Hardline Transition PM',
  'sukru-kaya': 'Atatürk-Era Interior Minister & State Organizer',
  'hasan-ali-yucel': 'Village Institutes & World Classics Pioneer',
  'mahmut-esat-bozkurt': 'Civil Code & Legal Revolution Architect',
  'tevfik-rustu-aras': '13-Year Atatürk Foreign Minister & Montreux Architect',
  'numan-menemencioglu': 'Montreux Negotiator & WWII Neutrality Diplomat',
  'ismail-cem': 'Multidimensional Diplomacy & EU Candidacy Architect',
  'mithat-pasa': 'Father of the First Constitution & Constitutionalism',
  'esref-bitlis': 'Strategic Counter-Terrorism & Peace Commander',

  'alexander-the-great': 'World Conqueror & Spreader of Hellenism',
  'marcus-aurelius': 'Philosopher Emperor & Stoic Statesman',
  cicero: 'Orator of the Republic & Defender of Law',
  'mark-antony': 'Roman Triumvir & Commander of the East',
  'genghis-khan': 'Founder of the Mongol Empire & Steppe Conqueror',
  'peter-the-great': 'Reforming Tsar Who Westernized Russia',
  'winston-churchill': 'Wartime Prime Minister of Defiance',
  'angela-merkel': 'European Consensus Chancellor & Crisis Manager',
  'friedrich-merz': 'Center-Right Economic Revival Leader',
  'vladimir-lenin': 'Bolshevik Revolutionary & Founder of the USSR',
  'josef-stalin': 'Rapid Industrialization & Totalitarian Iron Fist',
  'mikhail-gorbachev': 'Glasnost, Perestroika & End of the Cold War',
  'vladimir-putin': 'Centralized Autocracy & Geopolitical Revisionist',
  'sun-yat-sen': 'Founding Father of the Republic of China',
  'mao-zedong': 'Founder of the People’s Republic & Revolutionary Ideologue',
  'deng-xiaoping': 'Architect of China’s Economic Miracle',
  'fidel-castro': 'Cuban Revolution Leader & Anti-Imperialist Icon',
  'che-guevara': 'Transnational Guerrilla & Revolutionary Symbol',
  'haydar-aliyev': 'Architect of Modern Azerbaijan’s Stability',
  'ilham-aliyev': 'Karabakh Victory & Energy Diplomacy President',
  'ebulfez-elcibey': 'Democratic Independence & Popular Front Leader',
  'ruhollah-khomeini': 'Founder of the Iranian Islamic Republic & Supreme Leader',
  'nikol-pashinyan': 'Post-Velvet Revolution Wartime & Crisis Prime Minister',

  'adolf-hitler': 'Totalitarian Catastrophe & Instigator of World War II',
  caligula: 'Arbitrary Tyranny & Imperial Excess',
  'liz-truss': 'Shortest Tenure & Fiscal Turmoil Prime Minister',
  'kenan-evren': '1980 Military Coup Regime & Tutelage General',
  'mustafa-1': 'Mental Instability & Palace Crisis Reigns',
  'mustafa-4': 'Brief Counter-Coup Sultan',
  'damat-ferid-pasa': 'Signatory of Sèvres & Occupation Collaborator',
  'ali-kemal': 'Anti-Independence Polemicist & Brief Minister',
  'saddam-hussein': 'Authoritarian Repression & Ruinous Regional Wars',
  'nicolae-ceausescu': 'Repressive Police State & Economic Ruin Dictator',
  'enver-hoxha': 'Extreme Isolationist & Bunker State Dictator',
  'abdullah-ocalan': 'Armed Insurgency & Militant Organization Founder',
  'kim-il-sung': 'Architect of Juche & North Korean Dynasty Founder',
  'kim-jong-il': 'Military-First Regime & Arduous March Leader',
  'kim-jong-un': 'Nuclear Deterrence & Absolute Hereditary Ruler',
  'pol-pot': 'Year Zero Devastation & Perpetrator of the Killing Fields',
  'david-ben-gurion': 'Founder of Israel & First Prime Minister',
  'golda-meir': 'Yom Kippur War & Israel’s Iron Lady',
  'moshe-dayan': 'Six-Day War Commander & Camp David Diplomat',
  'yitzhak-rabin': 'Oslo Peace Architect & Assassinated Prime Minister',
  'menachem-begin': 'Founder of Likud & Camp David Peace Prime Minister',
  'shimon-peres': 'Economic Stabilization & Oslo Nobel Statesman',
  'ariel-sharon': 'Suez Crossing General & Gaza Disengagement PM',
  'benjamin-netanyahu': 'Longest-Serving Prime Minister & Polarizing Leader',
  'yair-lapid': 'Change Coalition Architect & Opposition Leader',
  'benny-gantz': 'Former IDF Chief of Staff & Centrist Statesman',
  'qasem-soleimani': 'Architect of the Quds Force & Regional Strategist',
  'mohammad-bagheri': 'Iranian Armed Forces Chief & Defense Doctrinarian',
  'hossein-salami': 'IRGC Commander-in-Chief & Asymmetric Strategist',
  'amir-ali-hajizadeh': 'Ballistic Missile, Drone & Aerospace Force Commander',
  'mohammad-reza-zahedi': 'Quds Force Levant & Syria Field Commander',
  'ali-sayyad-shirazi': 'Joint Front Strategist & Ground Forces Commander',
  'hassan-tehrani-moghaddam': 'Father of Iran’s Ballistic Missile Program',
  'mostafa-chamran': 'Physicist Defense Minister & Asymmetric Warfare Commander',
  'sheikh-ahmed-yassin': 'Founder & Spiritual Leader of Hamas',
  'abdel-aziz-al-rantisi': 'Hamas Co-Founder & Gaza Spokesman',
  'khaled-mashal': 'Hamas External Leader & Former Politburo Chief',
  'ismail-haniyeh': 'Former Palestinian Prime Minister & Hamas Politburo Chief',
  'yahya-sinwar': 'Gaza Hamas Leader & Oct 7 Architect',
  'mohammed-deif': 'Qassam Brigades Commander & Tunnel Network Architect',
  'oda-nobunaga': 'Firearms Tactician & First Great Unifier of Japan',
  'toyotomi-hideyoshi': 'Unifier of Japan & Taikō Reformer',
  'tokugawa-ieyasu': 'Founder of the Tokugawa Shogunate & Edo Peace',
  'emperor-meiji': 'Symbol of the Meiji Restoration & Modernization',
  'ito-hirobumi': 'First Prime Minister of Japan & Constitution Architect',
  'okubo-toshimichi': 'Architect of Meiji Industrialization & Bureaucracy',
  'saigo-takamori': 'Restoration Commander & The Last Samurai',
  'sakamoto-ryoma': 'Meiji Transition Visionary & Maritime Trade Pioneer',
  'togo-heihachiro': 'Victor of Tsushima ("Nelson of the East")',
  'hideki-tojo': 'World War II Militarist Wartime Prime Minister',
  'shigeru-yoshida': 'Yoshida Doctrine & Postwar Economic Miracle PM',
  'shinzo-abe': 'Architect of Abenomics & Longest-Serving PM',
  'shigeru-ishiba': 'Defense Specialist & Minority Government PM',
  'hafez-al-assad': 'Sphinx of Damascus & Iron-Fisted President',
  'bashar-al-assad': 'Last Baathist President & Civil War Collapse',
  'shukri-al-quwatli': 'First President of Independent Syria',

  // --- CHRISTIANITY & ROMAN EMPERORS ---
  'st-paul': 'Apostle to the Gentiles & Architect of Christian Theology',
  'st-augustine': 'Doctor of the Church & Author of The City of God',
  'st-benedict': 'Father of Western Monasticism',
  'pope-gregory-1': 'Founder of the Medieval Papacy & Gregory the Great',
  'pope-gregory-7': 'Gregorian Reforms & Victor at Canossa',
  'pope-urban-2': 'Initiator of the First Crusade',
  'st-francis-assisi': 'Founder of the Franciscans & Saint of Poverty and Peace',
  'st-thomas-aquinas': 'Peak of Scholasticism & Natural Law Philosopher',
  'martin-luther': 'Protestant Reformation Pioneer & Author of the 95 Theses',
  'john-calvin': 'Founder of Calvinism & Geneva Reformer',
  'theodosius-1': 'Last Emperor of a Unified Rome & Nicene Decree Ruler',
  'antoninus-pius': 'Golden Pax Romana & Treasury Emperor',
  'septimius-severus': 'Founder of the Severan Dynasty & African Emperor',
  aurelian: 'Restorer of the World & Imperial Unifier',
  'julian-apostate': 'Philosopher Emperor & Pagan Restorationist',
  'romulus-augustulus': 'Last Nominal Emperor of the Western Roman Empire',
  heraclius: 'Conqueror of Sassanid Persia & Eastern Roman Reformer',

  // --- TROTSKY, RUSSIA, MARXISTS, SPD & BRECHT ---
  'leon-trotsky': 'Founder of the Red Army & Permanent Revolution Theorist',
  'ivan-the-terrible': 'First Tsar of All Russia & Architect of Oprichnina',
  'nicholas-2': 'Last Romanov Tsar & 1917 Imperial Collapse',
  'karl-marx': 'Founder of Scientific Socialism & Author of Das Kapital',
  'friedrich-engels': 'Co-Founder of Marxism & Social Theorist',
  'rosa-luxemburg': 'Spartacist Leader & Libertarian Marxist Theorist',
  'karl-liebknecht': 'Anti-War Reichstag Deputy & Spartacist Co-Founder',
  'august-bebel': 'SPD Co-Founder & Reichstag Opposition Doyen',
  'karl-kautsky': 'Second International & Erfurt Program Theorist',
  'eduard-bernstein': 'Democratic Socialism & Welfare State Theorist',
  'clara-zetkin': 'March 8 Pioneer & Anti-Fascist Women’s Leader',
  'friedrich-ebert': 'First President of the Weimar Republic',
  'philipp-scheidemann': 'Proclaimer of the German Republic & First Chancellor',
  'bertolt-brecht': 'Founder of Epic Theater & Political Playwright',
  'christian-lindner': 'Debt-Brake Advocate & Former FDP Finance Minister',
  'markus-soder': 'Minister-President of Bavaria & CSU Power Broker',
  'heidi-reichinnek': 'Die Linke Parliamentary Co-Chair & Young Left Voice',

  // --- USA, UK, EUROPE & GLOBAL BALANCE ---
  'jd-vance': '50th US Vice President & Economic Nationalist',
  'kamala-harris': 'First Female Vice President in US History',
  'mike-pence': '48th US Vice President & Jan 6 Constitutional Defender',
  'marco-rubio': '72nd US Secretary of State & First Hispanic Top Diplomat',
  'dick-cheney': '46th US Vice President & Iraq War Architect',
  'al-gore': '45th US Vice President & Nobel Climate Advocate',
  'paul-ryan': '54th House Speaker & Tax Reform Architect',
  'gavin-newsom': 'Governor of California & National Democratic Spokesman',
  'bernie-sanders': 'Democratic Socialist Senator & Progressive Movement Leader',
  'alexandria-ocasio-cortez': 'Green New Deal Co-Sponsor & Progressive Voice',
  'rand-paul': 'Libertarian Senator & Anti-Surveillance/Interventionist',
  'nikki-haley': 'Former UN Ambassador & GOP Primary Challenger',
  'ron-desantis': 'Governor of Florida & Conservative State Executive',
  'pete-buttigieg': 'Former Transportation Secretary & Infrastructure Lead',
  'john-adams': '2nd US President & First Vice President',
  'clement-attlee': 'Architect of the NHS & Postwar British Welfare State',
  'jeremy-corbyn': 'Former Labour Party & Main Opposition Leader',
  'nicola-sturgeon': 'Former First Minister of Scotland & SNP Leader',
  'john-major': 'Northern Ireland Peace Process Initiator & PM',
  'david-lloyd-george': 'WWI Victory Prime Minister & People’s Budget Reformer',
  'louis-14': 'The Sun King & Zenith of Versailles Absolutism',
  'edouard-philippe': 'Former Prime Minister of France & Horizons Founder',
  'eric-zemmour': 'Founder of Reconquête! & Far-Right Polemicist',
  'silvio-berlusconi': 'Four-Time Italian PM & Media Tycoon',
  'matteo-renzi': 'Youngest Italian PM & Italia Viva Leader',
  'mahatma-gandhi': 'Champion of Nonviolent Resistance & Independence Icon',
  'jawaharlal-nehru': 'First Prime Minister & Architect of Independent India',
  'narendra-modi': 'Digital India & Hindu Nationalist Prime Minister',
  'lula-da-silva': 'Social Welfare Champion & Three-Time Brazilian President',
  'jair-bolsonaro': 'Right-Wing Populist Former President of Brazil',
  'volodymyr-zelenskyy': 'Defender of Kyiv & Wartime President of Ukraine',
  'petro-poroshenko': 'EU Association & Autocephaly Former President',

  // --- OTTOMAN COMMANDERS & GRAND ADMIRALS ---
  'barbaros-hayreddin-pasa': 'Victor of Preveza & Grand Admiral of the Mediterranean',
  'piri-reis': 'World Cartographer & Admiral Author of Kitab-ı Bahriye',
  'turgut-reis': 'Conqueror of Tripoli & Victor of Djerba',
  'kilic-ali-pasa': 'Grand Admiral Who Rebuilt the Fleet After Lepanto',
  'sokullu-mehmed-pasa': 'Grand Vizier to Three Sultans & Imperial Diplomat',
  'pargali-ibrahim-pasa': 'Mohács Commander & Suleiman’s Grand Vizier',
  'koprulu-mehmed-pasa': 'Founder of the Köprülü Era Who Saved the State',
  'cezayirli-gazi-hasan-pasa': 'Naval Academy Founder & Reforming Grand Admiral',
  'gazi-osman-pasa': 'Defender of Plevna (1877) & Legendary Marshal',

  // --- FRANCE (NAPOLEON II & III + DEEP HISTORY) ---
  'napoleon-2': 'King of Rome & Tragic Bonaparte Heir',
  'napoleon-3': 'Emperor of the Second Empire & Rebuilder of Paris',
  'clovis-1': 'First King of the Franks & Merovingian Founder',
  charlemagne: 'Father of Europe & Carolingian Emperor',
  'philip-2-augustus': 'Victor of Bouvines & Architect of Royal France',
  'louis-9': 'Saint King of Justice & Medieval Reformer',
  'joan-of-arc': 'Maid of Orléans & Patron Saint of Resistance',
  'francis-1-france': 'French Renaissance King & Ottoman Ally',
  'henry-4-france': 'Edict of Nantes King & Bourbon Founder',
  'cardinal-richelieu': 'Architect of Raison d’État & Chief Minister',
  'louis-16': 'Last Absolute Bourbon King of France',
  'marquis-de-lafayette': 'Hero of Two Worlds & Rights of Man Co-Author',
  'georges-clemenceau': 'WWI Victory Premier ("The Tiger") & Secularist',
  'leon-blum': 'Popular Front Reformer & Paid Leave Pioneer',
  'philippe-petain': 'Hero of Verdun & Vichy Collaborator Chief',
  'francois-mitterrand': 'Abolished Death Penalty & EU Treaty Architect President',
  'jacques-chirac': '2003 Iraq War Dissenter & Balancing President',
  'charles-montesquieu': 'Theorist of Separation of Powers & Legal Philosopher',
  'jean-jacques-rousseau': 'Social Contract & Popular Sovereignty Philosopher',

  // --- ITALY, SPAIN, RUSSIA, CHINA, INDIA, USA, UK, GERMANY & OTHERS ---
  'lorenzo-de-medici': 'Renaissance Patron & Florentine Diplomat',
  'niccolo-machiavelli': 'Founder of Modern Political Science & Author of The Prince',
  'camillo-di-cavour': 'Diplomatic Brain of Italian Unification',
  'giuseppe-garibaldi': 'Redshirts Commander & Sword of Italian Unification',
  'giuseppe-mazzini': 'Founder of Young Italy & Republican Philosopher',
  'victor-emmanuel-2': 'First King of Unified Italy (Padre della Patria)',
  'benito-mussolini': 'Fascist Dictator & Ruinous Axis Leader',
  'alcide-de-gasperi': 'Founding Father of the Italian Republic & EU',
  'antonio-gramsci': 'Cultural Hegemony Theorist & Political Thinker',
  'enrico-berlinguer': 'Eurocommunism & Historic Compromise Leader',
  'aldo-moro': 'Consensus Prime Minister Assassinated by Red Brigades',
  'el-cid': 'Undefeated Reconquista Knight & Lord of Valencia',
  'ferdinand-2-aragon': 'Co-Founder of Catholic Spain & Master Diplomat',
  'charles-5-spain': 'Habsburg Emperor on Whose Realm the Sun Never Set',
  'francisco-franco': 'Civil War Victor & 36-Year Military Dictator',
  'adolfo-suarez': 'Architect of Spain’s Post-Franco Democratic Transition',
  'felipe-gonzalez': 'EU Integration & Modern Socialist Prime Minister',
  'alexander-nevsky': 'Victor of the Battle on the Ice & Prince of Novgorod',
  'mikhail-kutuzov': '1812 Patriotic War Marshal Against Napoleon',
  'alexander-2-russia': 'Tsar Liberator Who Abolished Serfdom',
  'sergei-witte': 'Trans-Siberian & Russian Industrialization Architect',
  'georgy-zhukov': 'Conqueror of Stalingrad and Berlin & Soviet Marshal',
  'lavrentiy-beria': 'NKVD Chief & Architect of Deportations and Repression',
  'alexei-navalny': 'Anti-Corruption Opposition Leader & Political Martyr',
  'emperor-wu-han': 'Great Han Emperor Who Opened the Silk Road',
  'wu-zetian': 'Only Official Female Emperor in Chinese History',
  'zheng-he': 'Ming Treasure Fleet Admiral of Seven Ocean Voyages',
  'kangxi-emperor': '61-Year High Qing Golden Age Emperor',
  'chandragupta-maurya': 'Founder of the Maurya Empire & Subcontinent Unifier',
  'ashoka-the-great': 'Dharma Sovereign & Emperor of Nonviolence',
  'akbar-the-great': 'Sulh-i Kull & Mughal Golden Age Emperor',
  'shivaji-maharaj': 'Founder of the Maratha Empire & Guerrilla Strategist',
  'bhimrao-ambedkar': 'Architect of India’s Constitution & Anti-Caste Leader',
  'sardar-patel': 'Iron Man Who Unified 565 Princely States',
  'indira-gandhi': '1971 War Victory & Emergency Era Iron Lady',
  'manmohan-singh': 'Economist PM Behind the 1991 Market Reforms',
  'benjamin-franklin': 'Founding Father, Master Diplomat & Polymath',
  'alexander-hamilton': 'Architect of the US Financial System & First Treasury Secretary',
  'james-madison': 'Father of the US Constitution & 4th President',
  'ulysses-s-grant': 'Union General-in-Chief & 18th US President',
  'martin-luther-king': 'Civil Rights Leader & Nobel Peace Laureate',
  'malcolm-x': 'Black Liberation Movement Revolutionary Orator',
  'oliver-cromwell': 'Lord Protector of the Commonwealth & Commander',
  'william-pitt-younger': 'Anti-Napoleon Prime Minister Elected at Age 24',
  'duke-of-wellington': 'Victor of Waterloo, Iron Duke & Prime Minister',
  'horatio-nelson': 'Legendary British Admiral of Trafalgar',
  'benjamin-disraeli': 'One-Nation Conservatism & Suez Prime Minister',
  'william-gladstone': 'Four-Time Liberal Reform & Secret Ballot PM',
  'frederick-barbarossa': 'Holy Roman Emperor & Crusade Commander',
  'gustav-stresemann': 'Nobel Peace Chancellor Who Ended Hyperinflation',
  'paul-von-hindenburg': 'Tannenberg Field Marshal & Last Weimar President',
  'joschka-fischer': 'Green Foreign Minister Who Opposed the 2003 Iraq War',
  'dom-pedro-2': 'Enlightened Emperor Who Oversaw Abolition in Brazil',
  'getulio-vargas': 'Founder of Modern Brazil & Labor Code President',
  'volodymyr-the-great': 'Founding Prince of Kyivan Rus & Tryzub Ruler',
  'casimir-3-great': 'Reforming King Who Rebuilt Poland in Stone',
  'jan-3-sobieski': 'Cavalry King of the 1683 Siege of Vienna',
  'jozef-pilsudski': 'Founder of Interwar Poland & Victor of the Vistula',
  'lech-walesa': 'Solidarity Founder & Nobel Peace President',
  'william-of-orange': 'Father of Dutch Independence (William the Silent)',
  'minamoto-yoritomo': 'First Shogun of Japan & Kamakura Founder',
  'emperor-hirohito': 'Shōwa Era & Postwar Constitutional Emperor',

  // --- MARIE ANTOINETTE & US / UK / GERMANY DEEP POLITICS ---
  'marie-antoinette': 'Last Queen of France & Symbol of Revolutionary Tragedy',
  'henry-kissinger': 'Realpolitik Chief Diplomat & Nobel Peace Secretary of State',
  'hillary-clinton': 'First Female Major-Party Nominee & Secretary of State',
  'george-marshall': 'Marshall Plan Architect, Army Chief & Secretary of State',
  'colin-powell': 'First Black Joint Chiefs Chair & Secretary of State',
  'condoleezza-rice': 'First Black Female US Secretary of State',
  'robert-mcnamara': 'Vietnam-Era Defense Secretary & World Bank President',
  'antony-blinken': '71st US Secretary of State & Ukraine Coalition Diplomat',
  'janet-yellen': 'First Female US Treasury Secretary & Fed Chair',
  'jerome-powell': 'Federal Reserve Chair of the Inflation Tightening Era',
  'j-edgar-hoover': '48-Year Founding FBI Director & Intelligence Chief',
  'john-marshall': 'Chief Justice Who Established Judicial Review',
  'ruth-bader-ginsburg': 'Gender Equality Jurist & Supreme Court Icon',
  'mitch-mcconnell': 'Longest-Serving Senate Republican Leader',
  'chuck-schumer': 'Senate Democratic Majority & Minority Leader',
  'newt-gingrich': 'House Speaker of the 1994 Contract with America',
  'john-mccain': '2008 Presidential Nominee & Maverick Senator',
  'mitt-romney': '2012 Presidential Nominee, Governor & Principled Senator',
  'elizabeth-warren': 'CFPB Architect & Consumer Protection Senator',
  'fiorello-la-guardia': 'Legendary Reform Mayor Who Crushed Tammany Hall',
  'douglas-macarthur': 'Pacific Supreme Commander & Allied Occupation Viceroy',
  'neville-chamberlain': 'Munich Appeasement Prime Minister',
  'anthony-eden': '1956 Suez Crisis Prime Minister & Foreign Secretary',
  'aneurin-bevan': 'Founder of Britain’s National Health Service (NHS)',
  'ernest-bevin': 'British Foreign Secretary & Co-Architect of NATO',
  'robin-cook': 'Ethical Foreign Secretary Who Resigned Over the Iraq War',
  'george-osborne': 'Austerity-Era Chancellor of the Exchequer',
  'kwasi-kwarteng': '38-Day Mini-Budget Crisis Chancellor',
  'nick-clegg': 'Deputy Prime Minister of the 2010 Coalition Government',
  'alex-salmond': '2014 Independence Referendum Scottish First Minister',
  'john-bercow': 'Brexit-Era Speaker of the House of Commons',
  'oswald-mosley': '1930s British Union of Fascists (BUF) Leader',
  'william-wilberforce': 'Conscience of Parliament Who Abolished the Slave Trade',
  'emmeline-pankhurst': 'Suffragette Leader for Women’s Voting Rights',
  'frank-walter-steinmeier': '12th President of Germany & Former Foreign Minister',
  'richard-von-weizsacker': 'President of the Historic May 8 Liberation Speech',
  'wolfgang-schauble': 'Reunification Treaty Architect & Euro-Crisis Finance Minister',
  'hans-dietrich-genscher': '18-Year Reunification Diplomat & Foreign Minister',
  'walter-scheel': 'Ostpolitik Foreign Minister & 4th German President',
  'ursula-von-der-leyen': 'First Female EU Commission President & Former Defense Minister',
  'egon-bahr': '"Change Through Rapprochement" Ostpolitik Architect',
  'cem-ozdemir': 'First German Federal Minister of Turkish Heritage & Green Co-Chair',
  'matthias-erzberger': '1918 Armistice Signatory & Weimar Tax Reformer',
  'walther-rathenau': 'Rapallo Treaty Weimar Foreign Minister',
  'kurt-schumacher': 'Postwar Democratic SPD Founding Leader',
  'claus-von-stauffenberg': 'July 20 Operation Valkyrie Anti-Hitler Conspirator',
  'sophie-scholl': 'White Rose Anti-Nazi Student Resistance Symbol',
  'heinrich-bruning': 'Great Depression Austerity Chancellor',
  'fevzi-cakmak': 'Great Offensive Strategist & Second Field Marshal',
  'kazim-karabekir': 'Eastern Front Victor & Father of Orphans',
  'ali-fuat-cebesoy': 'Western Front Pioneer & Treaty of Moscow Envoy',
  'rauf-orbay': 'Hamidiye Naval Hero & TBMM Prime Minister',
  'refet-bele': 'Southern Front Commander & Peace Envoy to Istanbul',
  'nurettin-pasa': 'First Army Great Offensive & Iraq Front Commander',
  'fahrettin-altay': '5th Cavalry Corps Commander & Liberator of İzmir',
  'cevat-cobanli': 'Hero of March 18 at Gallipoli & Chief of Staff',
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

  if (
    sub === 'rashidun' ||
    sub === 'umayyad' ||
    sub === 'abbasid' ||
    titleLower.includes('halife') ||
    titleLower.includes('caliph')
  ) {
    return 'caliph';
  }
  if (sub === 'christian-thinker' || sub === 'de-thinker') {
    return 'thinker';
  }
  if (
    sub === 'islamic-commander' ||
    sub === 'ir-commander' ||
    sub === 'ottoman-commander' ||
    (sub === 'tr-actor' &&
      (titleLower.includes('orgeneral') ||
        titleLower.includes('paşa') ||
        titleLower.includes('komutan') ||
        titleLower.includes('general') ||
        titleLower.includes('commander'))) ||
    titleLower.includes('komutan') ||
    titleLower.includes('başkomutan') ||
    titleLower.includes('amiral') ||
    titleLower.includes('kaptan-ı derya') ||
    titleLower.includes('mareşal') ||
    titleLower.includes('general') ||
    titleLower.includes('commander') ||
    titleLower.includes('admiral') ||
    titleLower.includes('marshal')
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
    titleLower.includes('han') ||
    titleLower.includes('king') ||
    titleLower.includes('queen') ||
    titleLower.includes('emperor') ||
    titleLower.includes('empress') ||
    titleLower.includes('tsar') ||
    titleLower.includes('khagan') ||
    titleLower.includes('shah') ||
    titleLower.includes('pope') ||
    titleLower.includes('pharaoh') ||
    titleLower.includes('khan')
  ) {
    return 'monarch';
  }
  if (
    sub === 'tr-minister' ||
    sub === 'ottoman-late' ||
    titleLower.includes('bakan') ||
    titleLower.includes('vezir') ||
    titleLower.includes('sadrazam') ||
    titleLower.includes('minister') ||
    titleLower.includes('secretary') ||
    titleLower.includes('vizier')
  ) {
    return 'minister';
  }
  if (
    sub.endsWith('-party') ||
    sub === 'gr-current' ||
    titleLower.includes('genel başkan') ||
    titleLower.includes('muhalefet') ||
    titleLower.includes('parti') ||
    titleLower.includes('opposition') ||
    titleLower.includes('party')
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
 * Generates a personalized subtitle based on the figure's score tier, role, and top 2 dimensions.
 */
export function getLeaderTierSubtitle(
  leader: Leader,
  scores: LeaderScores,
  tier: TierLevel
): string {
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
        ? 'World Conqueror & Strategic Sovereign'
        : 'Military Genius & Historic Commander';
    }
    if (top1 === 'societal' || top2 === 'societal') {
      return role === 'monarch'
        ? 'Lawgiver & Civilizational Sovereign'
        : 'Epoch-Making Legal & Social Reformer';
    }
    if (top1 === 'economy' || top2 === 'economy') {
      return 'Prosperity Architect & Development Leader';
    }
    if (top1 === 'diplomacy' || top2 === 'diplomacy') {
      return 'Master of Global Balance & Diplomacy';
    }
    return 'Epoch-Defining Apex Statesman';
  }

  if (tier === 'A') {
    if (top1 === 'military' || (top1 === 'leadership' && scores.military >= 84)) {
      if (role === 'monarch') return 'Victorious Sovereign & Military Power';
      if (role === 'commander') return 'Distinguished Commander & Strategist';
      return 'Decisive Defense & Strategic Leader';
    }
    if (top1 === 'economy' && top2 === 'societal') {
      return 'Economic Growth & Institutional Reformer';
    }
    if (top1 === 'economy' || top2 === 'economy') {
      return role === 'minister'
        ? 'Economic & Fiscal Reformer'
        : 'Prosperity & Growth Statesman';
    }
    if (top1 === 'societal' || top2 === 'societal') {
      return role === 'minister'
        ? 'Education, Law & Institution Builder'
        : 'Progressive Legal & Social Reformer';
    }
    if (top1 === 'diplomacy' || top2 === 'diplomacy') {
      return 'Master Diplomat & International Actor';
    }
    if (role === 'monarch') return 'Commanding Sovereign & Era of Stability';
    if (role === 'party') return 'High-Impact Political Leader';
    return 'Distinguished Statesman & Era Leader';
  }

  if (tier === 'B') {
    if (top1 === 'military' && scores.military >= 78) {
      return role === 'monarch'
        ? 'Martial-Focused Sovereign'
        : 'Defense & Security-Oriented Leader';
    }
    if (top1 === 'economy') {
      return 'Economic Stability & Governance Focus';
    }
    if (top1 === 'societal') {
      return 'Social Order & Rule-of-Law Focus';
    }
    if (top1 === 'diplomacy') {
      return 'Balancing & Consensus Diplomat';
    }
    if (top1 === 'leadership') {
      return role === 'party'
        ? 'Charismatic & Influential Political Actor'
        : 'Strong Will & Balanced Governance';
    }
    return role === 'monarch'
      ? 'Stable Throne & Measured Rule'
      : 'Capable & Steady Administration';
  }

  if (tier === 'C') {
    if (scores.military >= 70 && scores.societal < 55) {
      return 'Hard-Power Focus, Contested Legacy';
    }
    if (scores.leadership >= 72 && scores.economy < 55) {
      return 'High Charisma, Weak Fiscal Record';
    }
    if (scores.economy >= 65 && scores.leadership < 58) {
      return 'Technocratic Effort, Limited Leadership';
    }
    if (role === 'party') {
      return 'Controversial & Polarizing Politics';
    }
    return 'Crisis-Ridden & Constrained Tenure';
  }

  // D TIER
  if (overall <= 15) {
    return 'Historically Catastrophic & Destructive Legacy';
  }
  if (scores.military >= 55 && scores.societal <= 30) {
    return 'Authoritarian Repression & Heavy Human Toll';
  }
  if (scores.economy <= 35 && scores.leadership <= 40) {
    return 'Economic Collapse & Governance Failure';
  }
  return 'Turbulent Tenure & Severe Historical Toll';
}
