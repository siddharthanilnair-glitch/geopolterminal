/* ============================================================
   INDO-PACIFIC TERMINAL — source registry & classifiers (v3)
   Shared by fetch.mjs (GitHub Actions) and, later, the desktop app.
   Frame: regional — South Asia & Southeast Asia.
   Maritime space retained as content (sub-tags + sea vocabulary),
   no longer the organizing geography.
   ============================================================ */

export const TIERS = { INT:'International', REG:'Regional', LOC:'Local', SPEC:'Specialist', ALERT:'Alerts' };
export const REGION_ORDER = ['South Asia','Southeast Asia'];

/* Gate rule: LOC in-region sources are ungated (fallback = home region).
   Everything else (wires, regional desks incl. Chinese outlets,
   specialist, alerts) must name the region to appear. */
const S = (code,name,country,tier,owner,lean,home,feed,domain,gate)=>(
  {code,name,country,tier,owner:owner||'priv',lean:lean||'',home:home||null,feed:feed||null,domain,gate:!!gate});

export const SOURCES = [
/* ---- INTERNATIONAL WIRES (gated) ---- */
S('REUT','Reuters','—','INT','priv','C',null,null,'reuters.com',true),
S('AP','Associated Press','—','INT','priv','C',null,null,'apnews.com',true),
S('BBC','BBC World','—','INT','pub','C',null,'https://feeds.bbci.co.uk/news/world/rss.xml','bbc.com',true),
S('ALJZ','Al Jazeera','—','INT','state','LL',null,'https://www.aljazeera.com/xml/rss/all.xml','aljazeera.com',true),
S('GUAR','The Guardian','—','INT','priv','LL',null,'https://www.theguardian.com/world/rss','theguardian.com',true),
S('F24','France 24','—','INT','pub','C',null,'https://www.france24.com/en/rss','france24.com',true),
S('DW','Deutsche Welle','—','INT','pub','C',null,'https://rss.dw.com/rdf/rss-en-world','dw.com',true),
S('UN','UN News','—','INT','igo','C',null,'https://news.un.org/feed/subscribe/en/news/all/rss.xml','news.un.org',true),
S('NHK','NHK World','—','INT','pub','C',null,null,'nhk.or.jp',true),

/* ---- REGIONAL DESKS incl. Chinese outlets (gated) ---- */
S('NIKK','Nikkei Asia','—','REG','priv','C',null,'https://asia.nikkei.com/rss/feed/nar','asia.nikkei.com',true),
S('SCMP','South China Morning Post','China','REG','priv','C',null,'https://www.scmp.com/rss/91/feed','scmp.com',true),
S('GLBT','Global Times','China','REG','state','L',null,'https://www.globaltimes.cn/rss/outbrain.xml','globaltimes.cn',true),
S('CHDY','China Daily','China','REG','state','LL',null,'https://www.chinadaily.com.cn/rss/world_rss.xml','chinadaily.com.cn',true),
S('XINH','Xinhua','China','REG','state','L',null,null,'english.news.cn',true),
S('CGTN','CGTN','China','REG','state','L',null,'https://www.cgtn.com/subscribe/rss/section/world.do','cgtn.com',true),
S('CAIX','Caixin Global','China','REG','priv','C',null,'https://www.caixinglobal.com/rss/feed.xml','caixinglobal.com',true),
S('6TON','Sixth Tone','China','REG','state','C',null,'https://www.sixthtone.com/rss','sixthtone.com',true),

/* ---- SPECIALIST (gated) ---- */
S('NAVN','Naval News','—','SPEC','priv','',null,'https://www.navalnews.com/feed/','navalnews.com',true),
S('USNI','USNI News','—','SPEC','ind','',null,'https://news.usni.org/feed','news.usni.org',true),

S('DEFP','The Defense Post','—','SPEC','priv','',null,'https://thedefensepost.com/feed/','thedefensepost.com',true),
S('JANE','Janes','—','SPEC','priv','',null,null,'janes.com',true),
S('DLGE','Dialogue Earth','—','SPEC','ind','',null,null,'dialogue.earth',true),
S('MONG','Mongabay','—','SPEC','ind','',null,'https://news.mongabay.com/feed/','news.mongabay.com',true),
S('DTE','Down To Earth','—','SPEC','priv','',null,null,'downtoearth.org.in',true),
S('CHN','Climate Home News','—','SPEC','ind','',null,'https://www.climatechangenews.com/feed/','climatechangenews.com',true),
S('GDSA','GDELT · South Asia','—','SPEC','igo','',null,'https://api.gdeltproject.org/api/v2/doc/doc?query=(Pakistan%20OR%20Bangladesh%20OR%20%22Sri%20Lanka%22%20OR%20Nepal%20OR%20Afghanistan%20OR%20Maldives)&mode=artlist&format=rss&maxrecords=40&timespan=2d','gdeltproject.org',true),
S('GDSE','GDELT · SE Asia','—','SPEC','igo','',null,'https://api.gdeltproject.org/api/v2/doc/doc?query=(Philippines%20OR%20Indonesia%20OR%20Myanmar%20OR%20Cambodia%20OR%20Laos%20OR%20%22Timor-Leste%22)&mode=artlist&format=rss&maxrecords=40&timespan=2d','gdeltproject.org',true),

/* ---- ALERTS (gated) ---- */
S('GDAC','GDACS Alerts','—','ALERT','igo','',null,'https://www.gdacs.org/xml/rss.xml','gdacs.org',true),
S('RWEB','ReliefWeb Updates','—','ALERT','igo','',null,'https://reliefweb.int/updates/rss.xml','reliefweb.int',true),

/* ============ SOUTH ASIA (local, ungated) ============ */
S('TOLO','TOLOnews','Afghanistan','LOC','ind','','South Asia',null,'tolonews.com'),
S('KHAM','Khaama Press','Afghanistan','LOC','ind','','South Asia','https://www.khaama.com/feed/','khaama.com'),
S('PJWK','Pajhwok Afghan News','Afghanistan','LOC','ind','','South Asia','https://pajhwok.com/feed/','pajhwok.com'),
S('AMU','Amu TV','Afghanistan','LOC','exile','','South Asia','https://amu.tv/feed/','amu.tv'),
S('AFIN','Afghanistan Intl','Afghanistan','LOC','exile','','South Asia',null,'afintl.com'),
S('8AM','Hasht-e Subh','Afghanistan','LOC','exile','','South Asia',null,'8am.media'),
S('DAWN','Dawn','Pakistan','LOC','priv','LL','South Asia','https://www.dawn.com/feeds/home','dawn.com'),
S('ETRB','Express Tribune','Pakistan','LOC','priv','C','South Asia','https://tribune.com.pk/feed','tribune.com.pk'),
S('TNI','The News Intl','Pakistan','LOC','priv','C','South Asia','https://www.thenews.com.pk/rss/1/1','thenews.com.pk'),
S('GEO','Geo News','Pakistan','LOC','priv','C','South Asia','https://www.geo.tv/rss/','geo.tv'),
S('ARY','ARY News','Pakistan','LOC','priv','LR','South Asia','https://arynews.tv/feed/','arynews.tv'),
S('BREC','Business Recorder','Pakistan','LOC','priv','C','South Asia',null,'brecorder.com'),
S('HIND','The Hindu','India','LOC','priv','C','South Asia','https://www.thehindu.com/news/national/feeder/default.rss','thehindu.com'),
S('TOI','Times of India','India','LOC','priv','LR','South Asia','https://timesofindia.indiatimes.com/rssfeedstopstories.cms','timesofindia.indiatimes.com'),
S('HT','Hindustan Times','India','LOC','priv','C','South Asia','https://www.hindustantimes.com/feeds/rss/india-news/rssfeed.xml','hindustantimes.com'),
S('IE','Indian Express','India','LOC','priv','C','South Asia','https://indianexpress.com/feed/','indianexpress.com'),
S('NDTV','NDTV','India','LOC','priv','LR','South Asia','https://feeds.feedburner.com/ndtvnews-top-stories','ndtv.com'),
S('PRNT','The Print','India','LOC','priv','C','South Asia','https://theprint.in/feed/','theprint.in'),
S('WIRE','The Wire','India','LOC','ind','L','South Asia','https://thewire.in/rss/','thewire.in'),
S('SCRL','Scroll.in','India','LOC','ind','L','South Asia','https://scroll.in/feed','scroll.in'),
S('KTMP','Kathmandu Post','Nepal','LOC','priv','','South Asia','https://kathmandupost.com/rss','kathmandupost.com'),
S('OKHB','Onlinekhabar English','Nepal','LOC','priv','','South Asia','https://english.onlinekhabar.com/feed','english.onlinekhabar.com'),
S('NPT','Nepali Times','Nepal','LOC','ind','','South Asia',null,'nepalitimes.com'),
S('MYRP','myRepublica','Nepal','LOC','priv','','South Asia',null,'myrepublica.nagariknetwork.com'),
S('RSNP','Rising Nepal','Nepal','LOC','state','','South Asia',null,'risingnepaldaily.com'),
S('KUEN','Kuensel','Bhutan','LOC','pub','','South Asia','https://kuenselonline.com/feed/','kuenselonline.com'),
S('BHUT','The Bhutanese','Bhutan','LOC','priv','','South Asia','https://thebhutanese.bt/feed/','thebhutanese.bt'),
S('DSTA','The Daily Star','Bangladesh','LOC','priv','LL','South Asia','https://www.thedailystar.net/rss.xml','thedailystar.net'),
S('DHTR','Dhaka Tribune','Bangladesh','LOC','priv','','South Asia','https://www.dhakatribune.com/feed','dhakatribune.com'),
S('BD24','bdnews24','Bangladesh','LOC','priv','','South Asia',null,'bdnews24.com'),
S('NAGE','New Age','Bangladesh','LOC','priv','','South Asia','https://www.newagebd.net/feed','newagebd.net'),
S('TBS','The Business Standard','Bangladesh','LOC','priv','','South Asia',null,'tbsnews.net'),
S('DMIR','Daily Mirror','Sri Lanka','LOC','priv','LL','South Asia',null,'dailymirror.lk'),
S('ADAD','Ada Derana','Sri Lanka','LOC','priv','','South Asia','https://www.adaderana.lk/rss.php','adaderana.lk'),
S('NWSF','News First','Sri Lanka','LOC','priv','','South Asia','https://www.newsfirst.lk/feed/','newsfirst.lk'),
S('MORN','The Morning','Sri Lanka','LOC','priv','','South Asia',null,'themorning.lk'),
S('ECON','EconomyNext','Sri Lanka','LOC','priv','','South Asia','https://economynext.com/feed','economynext.com'),
S('DFT','Daily FT','Sri Lanka','LOC','priv','','South Asia',null,'ft.lk'),
S('EDMV','The Edition','Maldives','LOC','priv','','South Asia',null,'edition.mv'),
S('SUNM','Sun Online','Maldives','LOC','priv','','South Asia',null,'en.sun.mv'),

/* ============ SOUTHEAST ASIA (local, ungated) ============ */
S('IRRA','The Irrawaddy','Myanmar','LOC','exile','LL','Southeast Asia','https://www.irrawaddy.com/feed','irrawaddy.com'),
S('MNOW','Myanmar Now','Myanmar','LOC','exile','','Southeast Asia','https://myanmar-now.org/en/feed/','myanmar-now.org'),
S('FRON','Frontier Myanmar','Myanmar','LOC','ind','','Southeast Asia','https://www.frontiermyanmar.net/en/feed/','frontiermyanmar.net'),
S('MIZZ','Mizzima','Myanmar','LOC','exile','','Southeast Asia','https://mizzima.com/feed','mizzima.com'),
S('DVB','DVB English','Myanmar','LOC','exile','','Southeast Asia','https://english.dvb.no/feed','english.dvb.no'),
S('GNLM','Global New Light','Myanmar','LOC','state','','Southeast Asia','https://www.gnlm.com.mm/feed/','gnlm.com.mm'),
S('BKKP','Bangkok Post','Thailand','LOC','priv','LR','Southeast Asia','https://www.bangkokpost.com/rss/data/topstories.xml','bangkokpost.com'),
S('NATH','The Nation Thailand','Thailand','LOC','priv','LL','Southeast Asia',null,'nationthailand.com'),
S('KHAO','Khaosod English','Thailand','LOC','priv','LL','Southeast Asia',null,'khaosodenglish.com'),
S('TPBS','Thai PBS World','Thailand','LOC','pub','','Southeast Asia','https://www.thaipbsworld.com/feed/','thaipbsworld.com'),
S('PRAC','Prachatai English','Thailand','LOC','ind','L','Southeast Asia','https://prachataienglish.com/feed','prachataienglish.com'),
S('LAOT','Laotian Times','Laos','LOC','priv','','Southeast Asia','https://laotiantimes.com/feed/','laotiantimes.com'),
S('VTES','Vientiane Times','Laos','LOC','state','','Southeast Asia',null,'vientianetimes.org.la'),
S('KHMT','Khmer Times','Cambodia','LOC','priv','','Southeast Asia','https://www.khmertimeskh.com/feed/','khmertimeskh.com'),
S('PPST','Phnom Penh Post','Cambodia','LOC','priv','','Southeast Asia',null,'phnompenhpost.com'),
S('CBJA','CamboJA News','Cambodia','LOC','ind','','Southeast Asia','https://cambojanews.com/feed/','cambojanews.com'),
S('CNSS','Cambodianess','Cambodia','LOC','ind','','Southeast Asia',null,'cambodianess.com'),
S('VNEX','VnExpress Intl','Vietnam','LOC','priv','','Southeast Asia','https://e.vnexpress.net/rss/news.rss','e.vnexpress.net'),
S('TUOI','Tuoi Tre News','Vietnam','LOC','state','','Southeast Asia',null,'tuoitrenews.vn'),
S('VNNT','VietnamNet','Vietnam','LOC','state','','Southeast Asia',null,'vietnamnet.vn'),
S('VNNS','Vietnam News','Vietnam','LOC','state','','Southeast Asia',null,'vietnamnews.vn'),
S('VPLS','VietnamPlus','Vietnam','LOC','state','','Southeast Asia',null,'en.vietnamplus.vn'),
S('NHND','Nhan Dan','Vietnam','LOC','state','','Southeast Asia',null,'en.nhandan.vn'),
S('VIR','Investment Review','Vietnam','LOC','state','','Southeast Asia','https://vir.com.vn/rss/home.rss','vir.com.vn'),
S('HANO','Hanoi Times','Vietnam','LOC','state','','Southeast Asia',null,'hanoitimes.vn'),
S('VNBF','Vietnam Briefing','Vietnam','LOC','ind','','Southeast Asia','https://www.vietnam-briefing.com/news/feed','vietnam-briefing.com'),
S('STAR','The Star','Malaysia','LOC','priv','C','Southeast Asia','https://www.thestar.com.my/rss/News','thestar.com.my'),
S('MMAI','Malay Mail','Malaysia','LOC','priv','C','Southeast Asia','https://www.malaymail.com/feed/rss/malaysia','malaymail.com'),
S('NST','New Straits Times','Malaysia','LOC','priv','C','Southeast Asia',null,'nst.com.my'),
S('FMT','Free Malaysia Today','Malaysia','LOC','priv','LR','Southeast Asia','https://www.freemalaysiatoday.com/feed/','freemalaysiatoday.com'),
S('MKIN','Malaysiakini','Malaysia','LOC','ind','LL','Southeast Asia','https://www.malaysiakini.com/rss/en/news.rss','malaysiakini.com'),
S('BERN','Bernama','Malaysia','LOC','state','','Southeast Asia',null,'bernama.com'),
S('ST','Straits Times','Singapore','LOC','pub','LR','Southeast Asia',null,'straitstimes.com'),
S('CNA','CNA','Singapore','LOC','pub','C','Southeast Asia','https://www.channelnewsasia.com/api/v1/rss-outbound-feed?_format=xml&category=10416','channelnewsasia.com'),
S('BT','Business Times SG','Singapore','LOC','pub','','Southeast Asia',null,'businesstimes.com.sg'),
S('MOTH','Mothership','Singapore','LOC','priv','','Southeast Asia','https://mothership.sg/feed/','mothership.sg'),
S('BBUL','Borneo Bulletin','Brunei','LOC','priv','','Southeast Asia','https://borneobulletin.com.bn/feed/','borneobulletin.com.bn'),
S('SCOP','The Scoop','Brunei','LOC','ind','','Southeast Asia',null,'thescoop.co'),
S('JKPT','Jakarta Post','Indonesia','LOC','priv','LL','Southeast Asia','https://www.thejakartapost.com/rss/news.xml','thejakartapost.com'),
S('JKGL','Jakarta Globe','Indonesia','LOC','priv','C','Southeast Asia','https://jakartaglobe.id/feed','jakartaglobe.id'),
S('TMPO','Tempo English','Indonesia','LOC','ind','C','Southeast Asia','https://en.tempo.co/rss/feed.rss','en.tempo.co'),
S('ANTR','Antara News','Indonesia','LOC','state','C','Southeast Asia','https://en.antaranews.com/rss/news.xml','en.antaranews.com'),
S('INQ','Inquirer','Philippines','LOC','priv','LL','Southeast Asia','https://www.inquirer.net/fullfeed','inquirer.net'),
S('RAPP','Rappler','Philippines','LOC','ind','LL','Southeast Asia','https://www.rappler.com/feed/','rappler.com'),
S('GMA','GMA News','Philippines','LOC','priv','C','Southeast Asia','https://data.gmanetwork.com/gno/rss/news/feed.xml','gmanetwork.com'),
S('ABS','ABS-CBN','Philippines','LOC','priv','C','Southeast Asia',null,'news.abs-cbn.com'),
S('PSTA','Philippine Star','Philippines','LOC','priv','LL','Southeast Asia','https://www.philstar.com/rss/headlines','philstar.com'),
S('MB','Manila Bulletin','Philippines','LOC','priv','C','Southeast Asia','https://mb.com.ph/feed','mb.com.ph'),
S('MNLT','Manila Times','Philippines','LOC','priv','LR','Southeast Asia','https://www.manilatimes.net/feed','manilatimes.net'),
S('BWLD','BusinessWorld','Philippines','LOC','priv','C','Southeast Asia','https://www.bworldonline.com/feed/','bworldonline.com'),
S('PNA','PH News Agency','Philippines','LOC','state','C','Southeast Asia',null,'pna.gov.ph'),
S('SUN','SunStar','Philippines','LOC','priv','C','Southeast Asia',null,'sunstar.com.ph'),
S('TATO','Tatoli','Timor-Leste','LOC','state','','Southeast Asia',null,'tatoli.tl'),

/* ---- RE-ADDED EXTERNAL DESKS (gated: appear only when naming the region) ---- */
S('ABC','ABC News','Australia','REG','pub','LL',null,'https://www.abc.net.au/news/feed/51120/rss.xml','abc.net.au',true),
S('SMH','Sydney Morning Herald','Australia','REG','priv','LL',null,'https://www.smh.com.au/rss/feed.xml','smh.com.au',true),
S('AGE','The Age','Australia','REG','priv','LL',null,'https://www.theage.com.au/rss/feed.xml','theage.com.au',true),
S('AUST','The Australian','Australia','REG','priv','LR',null,null,'theaustralian.com.au',true),
S('NCOM','news.com.au','Australia','REG','priv','LR',null,null,'news.com.au',true),
S('GAU','Guardian Australia','Australia','REG','priv','LL',null,'https://www.theguardian.com/australia-news/rss','theguardian.com',true),
S('SKY','Sky News Australia','Australia','REG','priv','R',null,null,'skynews.com.au',true),
S('SBS','SBS News','Australia','REG','pub','LL',null,'https://www.sbs.com.au/news/topic/latest/feed','sbs.com.au',true),
S('AFR','Financial Review','Australia','REG','priv','C',null,null,'afr.com',true),
S('9NWS','9News','Australia','REG','priv','C',null,null,'9news.com.au',true),
S('RNZ','RNZ','New Zealand','REG','pub','C',null,'https://www.rnz.co.nz/rss/national.xml','rnz.co.nz',true),
S('NZH','NZ Herald','New Zealand','REG','priv','C',null,null,'nzherald.co.nz',true),
S('1NWS','1News','New Zealand','REG','pub','LL',null,null,'1news.co.nz',true),
S('STUF','Stuff','New Zealand','REG','priv','LL',null,null,'stuff.co.nz',true),
S('NWRM','Newsroom','New Zealand','REG','ind','',null,null,'newsroom.co.nz',true),
S('TEHT','Tehran Times','Iran','REG','state','',null,'https://www.tehrantimes.com/rss','tehrantimes.com',true),
S('IRNA','IRNA','Iran','REG','state','',null,'https://en.irna.ir/rss','irna.ir',true),
S('PRTV','Press TV','Iran','REG','state','',null,null,'presstv.ir',true),
S('IRIN','Iran International','Iran','REG','exile','',null,null,'iranintl.com',true),
S('IRWR','IranWire','Iran','REG','exile','',null,null,'iranwire.com',true),
S('TOOM','Times of Oman','Oman','REG','priv','',null,'https://timesofoman.com/feed','timesofoman.com',true),
S('OOBS','Oman Observer','Oman','REG','state','',null,'https://www.omanobserver.om/feed','omanobserver.om',true),
S('NATL','The National (UAE)','—','REG','priv','C',null,'https://www.thenationalnews.com/rss','thenationalnews.com',true),
S('ARAB','Arab News','—','REG','priv','C',null,'https://www.arabnews.com/rss.xml','arabnews.com',true),
S('TPEI','Taipei Times','Taiwan','REG','priv','LL',null,'https://www.taipeitimes.com/xml/index.rss','taipeitimes.com',true),
S('FTWN','Focus Taiwan','Taiwan','REG','pub','LL',null,'https://focustaiwan.tw/rss/all.xml','focustaiwan.tw',true),
S('TWNN','Taiwan News','Taiwan','REG','priv','LL',null,null,'taiwannews.com.tw',true),
S('TWPL','TaiwanPlus','Taiwan','REG','pub','',null,null,'taiwanplus.com',true),
];

/* ---- country detection (chips + region roll-up) ----
   China/Taiwan have region:null — detectable for chips, but a story
   naming only them does not pass the region gate. */
export const COUNTRIES = {
'Afghanistan':{region:'South Asia',kw:['afghanistan','afghan','kabul','taliban','kandahar','herat']},
'Pakistan':{region:'South Asia',kw:['pakistan','pakistani','islamabad','karachi','lahore','balochistan','baluchistan','gwadar','sindh','khyber','rawalpindi']},
'India':{region:'South Asia',kw:['india','indian','new delhi','delhi','mumbai','chennai','kolkata','bengaluru','assam','ladakh','arunachal','modi']},
'Nepal':{region:'South Asia',kw:['nepal','nepali','kathmandu','pokhara','terai']},
'Bhutan':{region:'South Asia',kw:['bhutan','bhutanese','thimphu']},
'Bangladesh':{region:'South Asia',kw:['bangladesh','bangladeshi','dhaka','chittagong','chattogram',"cox's bazar",'rohingya','sylhet','khulna']},
'Sri Lanka':{region:'South Asia',kw:['sri lanka','sri lankan','colombo','jaffna','trincomalee']},
'Maldives':{region:'South Asia',kw:['maldiv','malé']},
'Myanmar':{region:'Southeast Asia',kw:['myanmar','burma','burmese','yangon','naypyidaw','rakhine','sagaing','arakan','rohingya','shan state','kachin','karen state','kayah']},
'Thailand':{region:'Southeast Asia',kw:['thailand','thai ','bangkok','phuket','chiang mai','isaan']},
'Laos':{region:'Southeast Asia',kw:['laos','lao ','laotian','vientiane','luang prabang']},
'Cambodia':{region:'Southeast Asia',kw:['cambodia','cambodian','khmer','phnom penh','angkor','sihanoukville','preah vihear']},
'Vietnam':{region:'Southeast Asia',kw:['vietnam','vietnamese','hanoi','ho chi minh','da nang','haiphong','gulf of tonkin']},
'Malaysia':{region:'Southeast Asia',kw:['malaysia','malaysian','kuala lumpur','sabah','sarawak','johor','penang','putrajaya']},
'Singapore':{region:'Southeast Asia',kw:['singapore','singaporean']},
'Brunei':{region:'Southeast Asia',kw:['brunei','bandar seri begawan']},
'Indonesia':{region:'Southeast Asia',kw:['indonesia','indonesian','jakarta','sumatra','sulawesi','west papua','natuna','aceh','borneo','kalimantan','bali']},
'Philippines':{region:'Southeast Asia',kw:['philippine','filipino','manila','luzon','mindanao','palawan','visayas','sulu','cebu']},
'Timor-Leste':{region:'Southeast Asia',kw:['timor-leste','east timor','dili','timorese']},
'China':{region:null,kw:['china','chinese','beijing','pla ','xi jinping','yunnan','hong kong']},
'Australia':{region:null,kw:['australia','australian','canberra','sydney','aukus']},
'New Zealand':{region:null,kw:['new zealand','wellington','auckland']},
'Iran':{region:null,kw:['iran','iranian','tehran','irgc']},
'Oman':{region:null,kw:['oman','muscat']},
'Yemen':{region:null,kw:['yemen','yemeni','houthi','aden']},
'Taiwan':{region:null,kw:['taiwan','taipei','taiwanese']},
};

/* shared/transboundary vocabulary that implies the region without naming a country */
export const REGION_EXTRA = {
'South Asia':['south asia','south asian','saarc','himalaya','kashmir','bay of bengal','arabian sea','indian ocean','indo-pak','line of actual control','line of control','brahmaputra','ganges','indus','strait of hormuz','gulf of aden','gulf of oman'],
'Southeast Asia':['southeast asia','south-east asia','asean','mekong','south china sea','west philippine sea','spratly','paracel','scarborough','second thomas','ayungin','strait of malacca','malacca strait','andaman sea','golden triangle','timor sea'],
};

export const AXES = {
Conflict: {
 kinetic:['air strike','airstrike','air raid','missile strike','missile attack','drone strike','drone attack','artillery','shelling','rocket attack','bombing','suicide bombing','killed in','death toll','casualties','offensive','invasion','ambush','gunmen','open fire','crossfire','explosion kill'],
 maritime:['coast guard','boarding','rammed','ramming','water cannon','fonop','freedom of navigation','maritime militia','incursion','intrusion','naval standoff','blockade','seized vessel','detained fishermen','harass','dangerous maneuver','collision at sea','gray-zone','grey-zone','eez violation','unsafe intercept'],
 posture:['militar','army','soldier','troops','navy','navies','warship','frigate','destroyer','armed forces','air force','military exercise','joint drills','wargame','war game','troop deployment','troops deployed','carrier strike group','naval deployment','basing agreement','missile test','live-fire','mobilization','defence pact','defense pact','arms deal','arms sale','military aid','fighter jets','submarine deal','garrison','border clash','border dispute','border troops'],
 insurgency:['insurgent','insurgency','militant','militants','armed group','rebel','rebels','terror attack','terrorist','extremist','ied','junta','coup','armed clash','ceasefire','crackdown','ethnic armed'],
},
Climate: {
 extreme:['cyclone','typhoon','hurricane','flood','flooding','flash flood','heatwave','heat wave','drought','landslide','wildfire','bushfire','storm surge','monsoon','torrential rain','el niño','la niña','extreme heat','record temperature','record rainfall','glacial lake outburst','avalanche','cloudburst'],
 slowonset:['sea level','sea-level','coastal erosion','glacier','glacial melt','salinity','saltwater intrusion','coral bleaching','ocean warming','marine heatwave','water scarcity','desertification','crop failure','sinking island','subsidence','groundwater depletion','air quality','air pollution','smog'],
 humanitarian:['displaced','displacement','evacuat','relief camp','humanitarian crisis','food insecurity','food crisis','famine','climate refugee','climate migration','disaster death','missing after','stranded'],
 response:['disaster response','disaster relief','hadr','humanitarian assistance','relief operation','rescue operation','emergency declared','state of emergency','early warning','disaster preparedness','climate adaptation','resilience fund','loss and damage'],
},
};

export const AXIS_META = {
Conflict:{color:'#B0473A',subs:{kinetic:'Kinetic',maritime:'Maritime / gray-zone',posture:'Posture & exercises',insurgency:'Insurgency & internal'}},
Climate:{color:'#2E7D6B',subs:{extreme:'Extreme weather',slowonset:'Slow-onset',humanitarian:'Displacement & humanitarian',response:'Response & adaptation'}},
};

export const SEVERE = ['killed','dead','death toll','casualties','fatalities','massacre','missile','airstrike','air strike','invasion','offensive','state of emergency','mass evacuation','evacuate','displaced','super typhoon','category 5','landfall','martial law','exchange of fire','major flood','collapse','outbreak'];

export const COUNTRY_TAGS = Object.keys(COUNTRIES);

/* ---- country-focus pages shown in the rail ---- */
export const FOCUS = ['Philippines','Indonesia'];

/* ---- gazetteer: keyword → [lat, lng, display name]
   Keys match detection vocabulary; specific places resolve before
   country centroids. ---- */
export const GAZETTEER = {
/* maritime & transboundary features */
'second thomas':[9.73,115.87,'Second Thomas Shoal'],'ayungin':[9.73,115.87,'Second Thomas Shoal'],
'scarborough':[15.15,117.77,'Scarborough Shoal'],'spratly':[10.0,114.0,'Spratly Islands'],
'paracel':[16.5,112.0,'Paracel Islands'],'natuna':[3.95,108.15,'Natuna Islands'],
'taiwan strait':[24.5,119.5,'Taiwan Strait'],'strait of malacca':[3.0,100.5,'Strait of Malacca'],
'malacca strait':[3.0,100.5,'Strait of Malacca'],'andaman sea':[10.0,96.0,'Andaman Sea'],
'bay of bengal':[15.0,88.0,'Bay of Bengal'],'arabian sea':[15.0,65.0,'Arabian Sea'],
'gulf of tonkin':[20.0,107.5,'Gulf of Tonkin'],'timor sea':[-10.5,127.0,'Timor Sea'],
'mekong':[15.5,105.5,'Mekong Basin'],'golden triangle':[20.35,100.08,'Golden Triangle'],
'kashmir':[34.0,76.0,'Kashmir'],'line of control':[34.1,74.5,'Line of Control'],
'line of actual control':[33.0,79.0,'Line of Actual Control'],'ladakh':[34.2,77.6,'Ladakh'],
'arunachal':[28.2,94.7,'Arunachal Pradesh'],'himalaya':[28.6,84.0,'Himalayas'],
/* South Asia cities/areas */
'kabul':[34.55,69.2,'Kabul'],'kandahar':[31.62,65.72,'Kandahar'],'herat':[34.35,62.2,'Herat'],
'islamabad':[33.72,73.06,'Islamabad'],'karachi':[24.86,67.0,'Karachi'],'lahore':[31.55,74.35,'Lahore'],
'gwadar':[25.12,62.32,'Gwadar'],'rawalpindi':[33.6,73.07,'Rawalpindi'],'balochistan':[28.5,65.5,'Balochistan'],'baluchistan':[28.5,65.5,'Balochistan'],
'new delhi':[28.61,77.21,'New Delhi'],'delhi':[28.61,77.21,'Delhi'],'mumbai':[19.08,72.88,'Mumbai'],
'chennai':[13.08,80.27,'Chennai'],'kolkata':[22.57,88.36,'Kolkata'],'bengaluru':[12.97,77.59,'Bengaluru'],
'assam':[26.2,92.9,'Assam'],'kathmandu':[27.71,85.32,'Kathmandu'],'pokhara':[28.21,83.99,'Pokhara'],'terai':[27.0,84.9,'Terai'],
'thimphu':[27.47,89.64,'Thimphu'],'dhaka':[23.81,90.41,'Dhaka'],'chittagong':[22.36,91.78,'Chattogram'],
'chattogram':[22.36,91.78,'Chattogram'],"cox's bazar":[21.44,91.97,"Cox's Bazar"],'sylhet':[24.9,91.87,'Sylhet'],'khulna':[22.82,89.55,'Khulna'],
'colombo':[6.93,79.85,'Colombo'],'jaffna':[9.66,80.01,'Jaffna'],'trincomalee':[8.57,81.23,'Trincomalee'],
'malé':[4.18,73.51,'Malé'],
/* Southeast Asia cities/areas */
'yangon':[16.87,96.2,'Yangon'],'naypyidaw':[19.76,96.08,'Naypyidaw'],'rakhine':[20.5,93.0,'Rakhine'],
'sagaing':[21.88,95.98,'Sagaing'],'shan state':[21.5,98.0,'Shan State'],'kachin':[25.8,97.4,'Kachin'],
'bangkok':[13.76,100.5,'Bangkok'],'phuket':[7.88,98.39,'Phuket'],'chiang mai':[18.79,98.98,'Chiang Mai'],
'vientiane':[17.97,102.63,'Vientiane'],'luang prabang':[19.89,102.14,'Luang Prabang'],
'phnom penh':[11.56,104.92,'Phnom Penh'],'sihanoukville':[10.63,103.5,'Sihanoukville'],'preah vihear':[14.39,104.68,'Preah Vihear'],
'hanoi':[21.03,105.85,'Hanoi'],'ho chi minh':[10.82,106.63,'Ho Chi Minh City'],'da nang':[16.05,108.2,'Da Nang'],'haiphong':[20.86,106.68,'Haiphong'],
'kuala lumpur':[3.14,101.69,'Kuala Lumpur'],'johor':[1.49,103.74,'Johor'],'penang':[5.42,100.33,'Penang'],
'sabah':[5.98,116.07,'Sabah'],'sarawak':[1.55,110.34,'Sarawak'],
'bandar seri begawan':[4.9,114.94,'Bandar Seri Begawan'],
'jakarta':[-6.2,106.85,'Jakarta'],'sumatra':[-0.6,101.3,'Sumatra'],'aceh':[4.7,96.75,'Aceh'],
'bali':[-8.4,115.19,'Bali'],'sulawesi':[-2.0,121.0,'Sulawesi'],'kalimantan':[0.0,114.0,'Kalimantan'],'west papua':[-3.5,135.5,'Papua (ID)'],
'manila':[14.6,120.98,'Manila'],'cebu':[10.32,123.9,'Cebu'],'luzon':[16.0,121.0,'Luzon'],
'mindanao':[7.5,125.0,'Mindanao'],'palawan':[9.5,118.5,'Palawan'],'visayas':[11.0,124.0,'Visayas'],'sulu':[6.0,121.0,'Sulu'],
'dili':[-8.56,125.57,'Dili'],
/* periphery */
'beijing':[39.9,116.4,'Beijing'],'tehran':[35.69,51.39,'Tehran'],'muscat':[23.59,58.41,'Muscat'],'aden':[12.79,45.03,'Aden'],'sydney':[-33.87,151.21,'Sydney'],'canberra':[-35.28,149.13,'Canberra'],'auckland':[-36.85,174.76,'Auckland'],'yunnan':[24.5,101.5,'Yunnan'],'hong kong':[22.32,114.17,'Hong Kong'],'taipei':[25.03,121.56,'Taipei'],
};

export const COUNTRY_CENTROID = {
'Afghanistan':[33.9,67.7],'Pakistan':[30.4,69.3],'India':[22.9,79.6],'Nepal':[28.2,84.0],
'Bhutan':[27.5,90.5],'Bangladesh':[23.7,90.4],'Sri Lanka':[7.9,80.7],'Maldives':[3.2,73.2],
'Myanmar':[21.0,96.1],'Thailand':[15.0,101.0],'Laos':[19.9,102.5],'Cambodia':[12.5,104.9],
'Vietnam':[16.0,107.8],'Malaysia':[4.0,102.3],'Singapore':[1.35,103.82],'Brunei':[4.5,114.7],
'Indonesia':[-2.5,118.0],'Philippines':[12.9,121.8],'Timor-Leste':[-8.8,125.9],
'China':[32.0,110.0],'Taiwan':[23.7,121.0],
};
