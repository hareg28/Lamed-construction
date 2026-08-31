import type { Language } from '@/store/languageStore';

interface Translations {
  nav: {
    home: string;
    about: string;
    services: string;
    projects: string;
    news: string;
    contact: string;
  };
  hero: {
    badge: string;
    headline1: string;
    headline2: string;
    tagline: string;
    cta_contact: string;
    cta_projects: string;
  };
  sections: {
    ourProjects: string;
    ourServices: string;
    featuredProjects: string;
    viewAll: string;
    viewAllProjects: string;
    exploreServices: string;
    getFreeConsultation: string;
    haveProject: string;
    buildTogether: string;
    contactUs: string;
    stats_completed: string;
    stats_ongoing: string;
    stats_clients: string;
    stats_years: string;
  };
  filters: {
    all: string;
    status: string;
    type: string;
    search: string;
    clear: string;
    reset: string;
    showing: string;
    of: string;
    projects: string;
    newContract: string;
    underConstruction: string;
    finished: string;
    residential: string;
    commercial: string;
    mixedUse: string;
    special: string;
    renovation: string;
  };
  about: {
    title: string;
    mission: string;
    vision: string;
    certificates: string;
    awards: string;
    credentials: string;
    whyUs: string;
    ourStory: string;
  };
  contact: {
    title: string;
    subtitle: string;
    send: string;
    sending: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    service: string;
    selectService: string;
  };
  services: {
    title: string;
    subtitle: string;
  };
  news: {
    title: string;
    subtitle: string;
    readMore: string;
    featured: string;
    readArticle: string;
  };
}

const translations: Record<Language, Translations> = {
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      services: 'Services',
      projects: 'Projects',
      news: 'News',
      contact: 'Contact',
    },
    hero: {
      badge: 'Trusted Construction in Addis Ababa',
      headline1: 'Building Ethiopia,',
      headline2: 'One Structure at a Time',
      tagline: 'BUILD HONESTLY.',
      cta_contact: 'Contact Us',
      cta_projects: 'View Projects',
    },
    sections: {
      ourProjects: 'Our Projects',
      ourServices: 'Our Services',
      featuredProjects: 'Featured Projects',
      viewAll: 'View All',
      viewAllProjects: 'View All Projects',
      exploreServices: 'Explore All Services',
      getFreeConsultation: 'Get a Free Consultation',
      haveProject: 'Have a Project in Mind?',
      buildTogether: "Let's build something extraordinary together.",
      contactUs: 'Contact Us',
      stats_completed: 'Projects Completed',
      stats_ongoing: 'Ongoing Projects',
      stats_clients: 'Happy Clients',
      stats_years: 'Years Experience',
    },
    filters: {
      all: 'All',
      status: 'Filter by Status',
      type: 'Filter by Type',
      search: 'Search projects by title, location, or client...',
      clear: 'Clear all filters',
      reset: 'Reset Filters',
      showing: 'Showing',
      of: 'of',
      projects: 'projects',
      newContract: 'New Contract',
      underConstruction: 'Under Construction',
      finished: 'Finished',
      residential: 'Residential',
      commercial: 'Commercial',
      mixedUse: 'Mixed Use',
      special: 'Special',
      renovation: 'Renovation',
    },
    about: {
      title: 'About Lamed Construction',
      mission: 'Our Mission',
      vision: 'Our Vision',
      certificates: 'Certificates & Awards',
      awards: 'Awards',
      credentials: 'Credentials',
      whyUs: 'Why Choose Us',
      ourStory: 'Our Story',
    },
    contact: {
      title: 'Get In Touch',
      subtitle: "We'd Love to Hear From You",
      send: 'Send Message',
      sending: 'Sending...',
      name: 'Full Name',
      email: 'Email Address',
      phone: 'Phone',
      message: 'Your Message',
      service: 'Service Interested In',
      selectService: 'Select a service...',
    },
    services: {
      title: 'Our Services',
      subtitle: 'End-to-end construction solutions delivered with quality.',
    },
    news: {
      title: 'Latest News & Updates',
      subtitle: 'Discover company announcements, project milestones, and industry insights.',
      readMore: 'Read More',
      featured: 'Featured',
      readArticle: 'Read Article',
    },
  },

  am: {
    nav: {
      home: 'መነሻ',
      about: 'ስለ እኛ',
      services: 'አገልግሎቶች',
      projects: 'ፕሮጀክቶች',
      news: 'ዜናዎች',
      contact: 'ያግኙን',
    },
    hero: {
      badge: 'በአዲስ አበባ የሚታመን ግንባታ',
      headline1: 'ኢትዮጵያን እየገነባን ነው,',
      headline2: 'አንድ ሕንጻ በጊዜ',
      tagline: 'በቅንነት ይገንቡ።',
      cta_contact: 'ያግኙን',
      cta_projects: 'ፕሮጀክቶችን ይመልከቱ',
    },
    sections: {
      ourProjects: 'ፕሮጀክቶቻችን',
      ourServices: 'አገልግሎቶቻችን',
      featuredProjects: 'ዋና ፕሮጀክቶች',
      viewAll: 'ሁሉንም ይዩ',
      viewAllProjects: 'ሁሉንም ፕሮጀክቶች ይዩ',
      exploreServices: 'ሁሉንም አገልግሎቶች ያስሱ',
      getFreeConsultation: 'ነጻ ምክር ያግኙ',
      haveProject: 'ፕሮጀክት አለዎት?',
      buildTogether: 'ልዩ የሆነ ነገር አብረን እንገንባ።',
      contactUs: 'ያግኙን',
      stats_completed: 'የተጠናቀቁ ፕሮጀክቶች',
      stats_ongoing: 'በሂደት ላይ ያሉ',
      stats_clients: 'ደስተኛ ደንበኞች',
      stats_years: 'የልምድ ዓመታት',
    },
    filters: {
      all: 'ሁሉም',
      status: 'በሁኔታ ያጣሩ',
      type: 'በዓይነት ያጣሩ',
      search: 'ፕሮጀክቶችን ፈልጉ...',
      clear: 'ሁሉንም አጥፉ',
      reset: 'ዳግም አቀናጁ',
      showing: 'እያሳየ',
      of: 'ከ',
      projects: 'ፕሮጀክቶች',
      newContract: 'አዲስ ውል',
      underConstruction: 'በግንባታ ላይ',
      finished: 'የተጠናቀቀ',
      residential: 'መኖሪያ',
      commercial: 'ንግዳዊ',
      mixedUse: 'ቅይጥ አጠቃቀም',
      special: 'ልዩ',
      renovation: 'ማደስ',
    },
    about: {
      title: 'ስለ ላሜድ ኮንስትራክሽን',
      mission: 'ተልዕኳችን',
      vision: 'ራዕያችን',
      certificates: 'ሰርቲፊኬቶች እና ሽልማቶች',
      awards: 'ሽልማቶች',
      credentials: 'ማረጋገጫዎች',
      whyUs: 'ለምን ይምረጡን',
      ourStory: 'ታሪካችን',
    },
    contact: {
      title: 'ያናግሩን',
      subtitle: 'ከእርስዎ ለመስማት ደስ ይለናል',
      send: 'መልዕክት ላክ',
      sending: 'እየተላከ ነው...',
      name: 'ሙሉ ስም',
      email: 'ኢሜይል',
      phone: 'ስልክ',
      message: 'መልዕክትዎ',
      service: 'የሚፈልጉት አገልግሎት',
      selectService: 'አገልግሎት ይምረጡ...',
    },
    services: {
      title: 'አገልግሎቶቻችን',
      subtitle: 'ጥሩ ጥራት ባለው ሙሉ የግንባታ ውጤቶች።',
    },
    news: {
      title: 'ዋና ዜናዎች እና ዝምድናዎች',
      subtitle: 'የኩባንያ ማስታወቂያዎችን, ፕሮጀክት ዝምድናዎችን ያስሱ።',
      readMore: 'ተጨማሪ ያንብቡ',
      featured: 'ዋና',
      readArticle: 'ጽሑፉን ያንብቡ',
    },
  },

  or: {
    nav: {
      home: 'Mana',
      about: 'Waa\'ee Keenya',
      services: 'Tajaajilaalee',
      projects: 'Pirojektoota',
      news: 'Oduu',
      contact: 'Nu Quunnamaa',
    },
    hero: {
      badge: 'Ijaarsa믿믿amu Addis Ababaatti',
      headline1: 'Itoophiyaa Ijaaraa jirra,',
      headline2: 'Mana Tokkoon Tokkoon',
      tagline: 'AMANAMUMMAAN IJAARI.',
      cta_contact: 'Nu Quunnamaa',
      cta_projects: 'Pirojektoota Ilaalaa',
    },
    sections: {
      ourProjects: 'Pirojektootni Keenya',
      ourServices: 'Tajaajilaalee Keenya',
      featuredProjects: 'Pirojektoota Beekamoo',
      viewAll: 'Hunda Ilaalaa',
      viewAllProjects: 'Pirojektoota Hunda Ilaalaa',
      exploreServices: 'Tajaajilaalee Hunda Barbaadi',
      getFreeConsultation: 'Gorsa Bilisaa Argadhu',
      haveProject: 'Pirojektii Qabdaa?',
      buildTogether: 'Waa\'ee addaa wajjiin haa ijaarnuu.',
      contactUs: 'Nu Quunnamaa',
      stats_completed: 'Pirojektoota Xumuraman',
      stats_ongoing: 'Pirojektoota Adeemaa',
      stats_clients: 'Maamiloota Gammadan',
      stats_years: 'Waggaa Muuxannoo',
    },
    filters: {
      all: 'Hunda',
      status: 'Haala Irratti Kallattii',
      type: 'Gosa Irratti Kallattii',
      search: 'Pirojektoota Barbaadi...',
      clear: 'Hunda Haqaa',
      reset: 'Deebi\'i',
      showing: 'Agarsiisaa',
      of: 'keessaa',
      projects: 'pirojektoota',
      newContract: 'Waliigaltee Haaraa',
      underConstruction: 'Ijaaramaa Jira',
      finished: 'Xumurame',
      residential: 'Jireenyaa',
      commercial: 'Daldala',
      mixedUse: 'Fayyadama Walitti Makame',
      special: 'Addaa',
      renovation: 'Haaromsa',
    },
    about: {
      title: 'Waa\'ee Lamed Construction',
      mission: 'Ergama Keenya',
      vision: 'Mul\'ata Keenya',
      certificates: 'Waraqaalee fi Badhaasota',
      awards: 'Badhaasota',
      credentials: 'Ragaalee',
      whyUs: 'Maaliif Nu Filattu',
      ourStory: 'Seenaa Keenya',
    },
    contact: {
      title: 'Nuuf Ergaa Ergi',
      subtitle: 'Isin irra dhaga\'uuf gammadna',
      send: 'Ergaa Ergi',
      sending: 'Ergamaa jira...',
      name: 'Maqaa Guutuu',
      email: 'Imeelii',
      phone: 'Bilbila',
      message: 'Ergaa Keessan',
      service: 'Tajaajila Barbaaddan',
      selectService: 'Tajaajila Filadhu...',
    },
    services: {
      title: 'Tajaajilaalee Keenya',
      subtitle: 'Furmaata ijaarsa guutuu qulqullina qabu.',
    },
    news: {
      title: 'Oduu fi Haaressa Oduulee',
      subtitle: 'Beeksisa, xumura pirojektii fi beekumsa argadhu.',
      readMore: 'Caalmaa Dubbisi',
      featured: 'Beekame',
      readArticle: 'Barreeffama Dubbisi',
    },
  },
};

export function useTranslation(lang: Language) {
  return translations[lang];
}

export default translations;
