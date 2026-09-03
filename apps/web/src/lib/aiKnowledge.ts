export interface AIChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIResponse {
  message: string;
  suggestions: string[];
  showLeadForm?: boolean;
}

export const LAMED_COMPANY_INFO = {
  name: 'Lamed Construction PLC',
  location: 'Addis Ababa, Ethiopia',
  headOffice: 'Bole Sub-City, Addis Ababa, Ethiopia',
  email: 'lamedconstructionbc1@gmail.com',
  phones: ['+251 111 234 567', '+251 911 123 456', '+251 911 987 654'],
  experienceYears: '11+ Years',
  completedProjects: '30+',
  ongoingProjects: '12+',
  satisfactionRate: '98%',
  workingHours: 'Monday - Friday: 8:00 AM - 5:30 PM, Saturday: 8:30 AM - 1:00 PM (Sunday Closed)',
};

// System prompt for LLM models (OpenAI/Gemini)
export function getSystemPrompt(language: string = 'en'): string {
  return `You are "Lamed AI", the elite intelligent virtual construction consultant and project advisor for Lamed Construction PLC (based in Addis Ababa, Ethiopia).
Your goal is to provide courteous, highly knowledgeable, and practical construction advice to prospective clients, investors, and homeowners.

Company Overview:
- Name: Lamed Construction PLC
- Location: Addis Ababa, Ethiopia
- Specialization: Grade-1 General Contracting (GC-1 / BC-1), Luxury Residential Villas & Apartments, Commercial Plazas, Mixed-Use Towers, Interior Finishing, Project Management.
- Email: lamedconstructionbc1@gmail.com
- Main Phones: +251 111 234 567 / +251 911 123 456
- Experience: 11+ years, 30+ completed projects across Addis Ababa.

Tone & Style:
- Professional, welcoming, authoritative yet approachable.
- Answer whatever specific question the user asks directly and accurately.
- When asked about pricing, give standard market ranges (ETB 20,000 - 65,000/m2 based on finish) and invite them for a free site assessment.
- If the user writes in Amharic (አማርኛ), respond fluently in polite, natural Amharic.
- If the user writes in English, respond in English.
- Keep answers clear and structured with markdown bullets and bold headers where helpful.`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Advanced Intent-Scoring AI Engine for Custom Free-Text Questions
// ─────────────────────────────────────────────────────────────────────────────
interface DomainTopic {
  id: string;
  keywords: string[];
  amharicKeywords: string[];
  handler: (raw: string, isAmharic: boolean) => AIResponse;
}

export function generateLocalAIResponse(userMessage: string, preferredLang?: string): AIResponse {
  const raw = userMessage.trim();
  const q = raw.toLowerCase();

  // Detect Amharic by Ge'ez Unicode range [U+1200 - U+137F] or language setting
  const isAmharic = preferredLang === 'am' || /[\u1200-\u137F]/.test(raw);

  // Extract any numbers or square meters mentioned (e.g. "200 m2", "150 ካሬ", "G+2", "4 floors")
  const areaMatch = raw.match(/(\d+)\s*(?:m2|sqm|sq\s*m|ካሬ|ካሬ\s*ሜትር|square\s*meters?)/i);
  const floorMatch = raw.match(/(?:G\s*\+\s*(\d+)|(\d+)\s*(?:floor|floors|ፎቅ|ወለል))/i);
  const mentionedArea = areaMatch ? areaMatch[1] : null;
  const mentionedFloors = floorMatch ? (floorMatch[1] || floorMatch[2]) : null;

  // Domain Topics definitions with extensive synonym matching
  const topics: DomainTopic[] = [
    // 1. GREETING
    {
      id: 'greeting',
      keywords: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings', 'howdy', 'how are you', 'start'],
      amharicKeywords: ['ሰላም', 'እንደምን', 'ጤና ይስጥልኝ', 'እንዴት ነህ', 'እንዴት ኖት', 'እንደምን አደሩ', 'እንደምን ዋሉ', 'ሰላምታ'],
      handler: () => {
        if (isAmharic) {
          return {
            message: 'ጤና ይስጥልኝ! ወደ **ላሜድ ኮንስትራክሽን (Lamed Construction PLC)** እንኳን በደህና መጡ። 🏗️\n\nእኔ የላሜድ የ AI አማካሪ ነኝ። ስለ ቤት ግንባታ፣ ዋጋ ስሌት፣ የፕሮጀክት ጊዜ፣ ወይም ስለ ፈቃድ እና ዲዛይን ማንኛውንም ጥያቄዎን መመለስ እችላለሁ። ዛሬ በምን ልርዳዎ?',
            suggestions: ['የምንሰጣቸው አገልግሎቶች', 'የቪላ ዋጋ ምን ያህል ነው?', 'የቤት ግንባታ ጊዜ ስንት ነው?', 'ነፃ ምክር ቀጠሮ'],
          };
        }
        return {
          message: 'Hello and welcome to **Lamed Construction PLC**! 🏗️\n\nI\'m your AI Construction Advisor. Whether you\'re planning a luxury villa, commercial plaza, apartment complex, or renovation, feel free to ask me anything in your own words!',
          suggestions: ['Explore Our Services', 'Cost & Pricing Estimates', 'How long does construction take?', 'Book a Free Consultation'],
        };
      },
    },

    // 2. LOCATION / OFFICE / ADDRESS / DIRECTIONS / WHERE ARE YOU
    {
      id: 'location',
      keywords: ['where', 'location', 'address', 'office', 'headquarters', 'visit', 'find you', 'situated', 'direction', 'map', 'located', 'sub city'],
      amharicKeywords: ['የት', 'አድራሻ', 'ቢሮ', 'የት ነው', 'መገኛ', 'ቦሌ', 'የት አካባቢ', 'ካርታ', 'መምጣት', 'መጎብኘት', 'ክፍለ ከተማ'],
      handler: () => {
        if (isAmharic) {
          return {
            message: `**የላሜድ ኮንስትራክሽን ዋና መሥሪያ ቤት አድራሻ**

🏢 **አድራሻ:** ቦሌ ክፍለ ከተማ፣ አዲስ አበባ፣ ኢትዮጵያ
📞 **ዋና ቢሮ ስልክ:** **+251 111 234 567** / **+251 911 123 456**
📧 **ኢሜይል:** \`lamedconstructionbc1@gmail.com\`
🕒 **የስራ ሰዓት:**
• ሰኞ – አርብ: 2:00 ጠዋት – 11:30 ከሰዓት
• ቅዳሜ: 2:30 ጠዋት – 7:00 ከሰዓት
• እሁድ: ዝግ ነው

📍 **ወደ ቢሯችን ለመምጣት:** በቦሌ ዋናው መንገድ ላይ የሚገኝ ሲሆን፣ ከመምጣትዎ በፊት በስልክ ደውለው ወይም በድረ-ገጻችን ነፃ ቀጠሮ መያዝ ይችላሉ!`,
            suggestions: ['ነፃ ምክር ቀጠሮ', 'የምንሰጣቸው አገልግሎቶች', 'ስልክ ይደውሉ (+251 911 123 456)'],
            showLeadForm: true,
          };
        }
        return {
          message: `**Lamed Construction PLC Headquarters & Location**

🏢 **Office Address:** Bole Sub-City, Addis Ababa, Ethiopia
📞 **Direct Phone:** **+251 111 234 567** / **+251 911 123 456**
📧 **Official Email:** \`lamedconstructionbc1@gmail.com\`
🕒 **Working Hours:**
• Monday – Friday: 8:00 AM – 5:30 PM (EAT)
• Saturday: 8:30 AM – 1:00 PM (EAT)
• Sunday: Closed

📍 **Directions:** Located in the central commercial district of Bole. Feel free to visit us directly or book a consultation below!`,
          suggestions: ['Book a Free Consultation', 'Explore Our Services', 'Call Sales (+251 911 123 456)'],
          showLeadForm: true,
        };
      },
    },

    // 3. PRICING / COST ESTIMATES / CALCULATIONS
    {
      id: 'pricing',
      keywords: ['price', 'cost', 'how much', 'expensive', 'cheap', 'budget', 'rate', 'square meter', 'sqm', 'birr', 'etb', 'fee', 'charge', 'quote', 'quotation', 'estimate'],
      amharicKeywords: ['ዋጋ', 'ስንት', 'ስንት ነው', 'ክፍያ', 'ግምት', 'ብር', 'በካሬ', 'ካሬ', 'ወጪ', 'ስሌት', 'ተመን', 'የዋጋ'],
      handler: () => {
        let areaSpecificNote = '';
        if (mentionedArea) {
          const areaNum = parseInt(mentionedArea, 10);
          const minEst = (areaNum * 20000).toLocaleString();
          const maxEst = (areaNum * 50000).toLocaleString();
          areaSpecificNote = isAmharic
            ? `\n\n📐 **ለጠቀሱት ${areaNum} ካሬ ሜትር ግምት:** መሰረታዊ ከ **${minEst} ብር** ጀምሮ እስከ ከፍተኛ ደረጃ **${maxEst} ብር** ሊደርስ ይችላል።`
            : `\n\n📐 **Estimated range for your ${areaNum} m² project:** Approx. **ETB ${minEst}** (Standard) to **ETB ${maxEst}** (Luxury Turnkey).`;
        }

        if (isAmharic) {
          return {
            message: `**የግንባታ ዋጋ እና የወጪ ስሌት (Addis Ababa 2024)**

የግንባታ ዋጋ በካሬ ሜትር (m²) በማጠናቀቂያ ደረጃው መሰረት ይሰላል፡

🏗️ **መሰረታዊ ማጠናቀቂያ (Standard):** 20,000 – 28,000 ብር / m²
🏡 **መካከለኛ ማጠናቀቂያ (Semi-Luxury):** 28,000 – 40,000 ብር / m²
✨ **ፕሪሚየም የቅንጦት ማጠናቀቂያ (Luxury Finishing):** 40,000 – 65,000+ ብር / m²${areaSpecificNote}

**ዋጋ ላይ ተጽዕኖ የሚያሳድሩ ቁልፍ ጉዳዮች:**
1. የቦታው ስፋት እና የወለሎች ብዛት (G+1, G+2, G+4...)
2. የኮንክሪት እና የብረት ስትራክቸር መጠን
3. የተመረጡ የማጠናቀቂያ እቃዎች (የአገር ውስጥ ወይስ ከውጪ የገቡ ፖርሲሊን፣ ጂፕሰም፣ ሳኒተሪ)
4. የመሰረት እና የአፈር ሁኔታ

💡 **ትክክለኛ ነፃ ዝርዝር ስሌት ለማግኘት:** ከታች ባለው ቅጽ የቦታዎን ዝርዝር ይላኩልን፤ ኢንጂነሮቻችን በ 24 ሰዓት ውስጥ ሙሉ ስሌት ያዘጋጁልዎታል።`,
            suggestions: ['የዋጋ መጠየቂያ ቅጽ መሙላት', 'የቪላ ዋጋ ምን ያህል ነው?', 'ስልክ ይደውሉ (+251 911 123 456)'],
            showLeadForm: true,
          };
        }
        return {
          message: `**Construction Cost Breakdown & Estimates (Addis Ababa 2024)**

Typical turnkey construction rates per square meter (m²) of built-up area:

🏗️ **Standard Quality Finish:** ETB 20,000 – 28,000 / m²
🏡 **Semi-Luxury Finish:** ETB 28,000 – 40,000 / m²
✨ **High-End Luxury (Imported European Materials):** ETB 40,000 – 65,000+ / m²${areaSpecificNote}

**What drives the cost:**
1. Total built-up area & number of floors (G+1, G+2, G+4, etc.)
2. Structural design & rebar steel density
3. Finishing selections (porcelain tiles, gypsum lighting, custom joinery, sanitary fixtures)
4. Soil bearing capacity and foundation depth

💡 **Get an exact custom quotation:** Fill out your project details in the form below and our chief quantity surveyor will send a comprehensive breakdown within 24 hours.`,
          suggestions: ['Request a Custom Quote', 'Construction timeline', 'Call Sales (+251 911 123 456)'],
          showLeadForm: true,
        };
      },
    },

    // 4. TIMELINE / DURATION / HOW LONG
    {
      id: 'timeline',
      keywords: ['how long', 'timeline', 'duration', 'months', 'years', 'days', 'speed', 'fast', 'deadline', 'when finish', 'completion time', 'schedule', 'take'],
      amharicKeywords: ['ጊዜ', 'ስንት ጊዜ', 'ምን ያህል ጊዜ', 'ይፈጃል', 'ይወስዳል', 'መቼ', 'ወር', 'ቀን', 'ዓመት', 'ጊዜ ሰሌዳ', 'ለማጠናቀቅ', 'የሚፈጀው'],
      handler: () => {
        let floorNote = '';
        if (mentionedFloors) {
          floorNote = isAmharic
            ? `\n\n⏱️ **ለጠቀሱት ባለ ${mentionedFloors} ፎቅ ህንፃ:** በአማካይ **ከ 12 እስከ 24 ወራት** ባለው ጊዜ ውስጥ ሙሉ በሙሉ ተጠናቆ ይረከባል።`
            : `\n\n⏱️ **For a ${mentionedFloors}-storey project:** Typical completion time ranges between **12 to 24 months** depending on the finishing scope.`;
        }

        if (isAmharic) {
          return {
            message: `**የግንባታ ፕሮጀክት ጊዜ ሰሌዳ**

የግንባታ ጊዜ እንደ ህንፃው አይነት እና ስፋት ይወሰናል፡

⏱️ **G+0 ባለ አንድ ወለል ቪላ (120–250 m²):** 8 – 12 ወራት
⏱️ **G+1 ባለ ሁለት ወለል ቪላ (200–400 m²):** 12 – 18 ወራት
⏱️ **G+2 ባለ ሦስት ወለል ቪላ (300–600 m²):** 18 – 24 ወራት
⏱️ **አፓርትመንት ህንፃ (G+5 እስከ G+7):** 20 – 30 ወራት
⏱️ **ባለ ብዙ ወለል የንግድ ህንፃ (G+10+):** 28 – 42 ወራት
⏱️ **የውስጥ ማጠናቀቂያ እና እድሳት:** 1 – 5 ወራት${floorNote}

**ላሜድ በወቅቱ የማስረከብ ዋስትና ይሰጣል:**
✅ በውል ላይ የጊዜ ገደብ ቅጣት (Delay Penalty Clause) በማካተት
✅ ቁሳቁሶችን አስቀድሞ በበቂ ሁኔታ በማዘጋጀት
✅ በ 24/7 የኢንጂነሪንግ ሳይት ቁጥጥር`,
            suggestions: ['የግንባታ ዋጋ ስንት ነው?', 'የቪላ እና አፓርትመንት ግንባታ', 'ነፃ ምክር ቀጠሮ'],
          };
        }
        return {
          message: `**Construction Timelines & Delivery Schedules**

Estimated turnkey completion times for typical projects:

⏱️ **G+0 Single Villa (120–250 m²):** 8–12 months
⏱️ **G+1 Two-Storey Villa (200–400 m²):** 12–18 months
⏱️ **G+2 Three-Storey Mansion (300–600 m²):** 18–24 months
⏱️ **Mid-Rise Apartment (G+5 to G+7):** 20–30 months
⏱️ **High-Rise Commercial Tower (G+10+):** 28–42 months
⏱️ **Interior Fit-Out & Renovation:** 1–5 months${floorNote}

**Our On-Time Guarantee:**
✅ Contractually binding milestone schedules with delay protection
✅ Direct material supply chain avoiding market shortages
✅ Full-time site management and weekly progress reporting`,
          suggestions: ['Cost & Pricing Estimates', 'Villa construction details', 'Book a Free Consultation'],
        };
      },
    },

    // 5. CONSULTATION / MEETING / FREE SITE VISIT
    {
      id: 'consultation',
      keywords: ['consult', 'consulting', 'appointment', 'meeting', 'site visit', 'assessment', 'discuss', 'talk', 'call me', 'free consultation', 'book'],
      amharicKeywords: ['ቀጠሮ', 'ማማከር', 'ምክር', 'ጉብኝት', 'ቦታ ማየት', 'ነፃ', 'መነጋገር', 'ስልክ ደውሉልኝ', 'መገናኘት', 'ሳይት መጎብኘት'],
      handler: () => {
        if (isAmharic) {
          return {
            message: `**ነፃ የምክክር እና የሳይት ጉብኝት አገልግሎት (100% Free)**

ከላሜድ ኮንስትራክሽን ከፍተኛ መሐንዲሶች ጋር ነፃ የምክክር ቀጠሮ መያዝ ይችላሉ፡

🏢 **1. የቢሮ ውስጥ ምክክር:** ቦሌ ዋና ቢሮአችን በመምጣት
🏗️ **2. ነፃ የቦታ ጉብኝት (Site Inspection):** ኢንጂነሮቻችን ወደ ቦታዎ መጥተው የመሬቱን አቀማመጥ ይመረምራሉ
💻 **3. የቪዲዮ ስብሰባ:** በ Zoom ወይም Google Meet

💡 **የማማከር አገልግሎታችን ሙሉ በሙሉ ነፃ ነው!**

ከታች ባለው ቅጽ ስምዎን እና ስልክዎን ያስቀምጡ፤ በ 1 ሰዓት ውስጥ ደውለን ቀጠሮ እንይዛለን።`,
            suggestions: ['የመልዕክት ቅጽ መሙላት', 'ስልክ ይደውሉ (+251 911 123 456)', 'የምንሰጣቸው አገልግሎቶች'],
            showLeadForm: true,
          };
        }
        return {
          message: `**Free Consultation & Site Assessment (100% Complimentary)**

Schedule a session with our principal architects and structural engineers:

🏢 **1. In-Office Consultation:** At our Bole headquarters
🏗️ **2. Free On-Site Inspection:** Our civil engineers visit your plot to evaluate topography, soil, and access
💻 **3. Virtual Video Meeting:** via Zoom or Google Meet

💡 **Initial consultations, feasibility advice, and preliminary budget reviews are 100% free with no obligation!**

Submit your contact details below and our team will reach out within 1 business hour.`,
          suggestions: ['Fill consultation form', 'Call: +251 911 123 456', 'Explore Our Services'],
          showLeadForm: true,
        };
      },
    },

    // 6. PERMITS / LICENSES / MUNICIPALITY / APPROVALS
    {
      id: 'permits',
      keywords: ['permit', 'license', 'municipality', 'approval', 'city hall', 'sub city', 'zoning', 'legal', 'drawing approval', 'setback', 'paperwork', 'authority'],
      amharicKeywords: ['ፈቃድ', 'ማስፈቀድ', 'ክፍለ ከተማ', 'ማዘጋጃ', 'ዲዛይን ማጽደቅ', 'ሰነድ', 'ህጋዊ', 'ፕላን', 'ካርታ', 'የግንባታ ፈቃድ', 'ፈቃድ ማውጣት'],
      handler: () => {
        if (isAmharic) {
          return {
            message: `**የግንባታ ፈቃድ እና የዲዛይን ማጽደቅ አገልግሎት**

አዎ! ላሜድ ኮንስትራክሽን ሁሉንም ህጋዊ የግንባታ ፈቃዶች ከክፍለ ከተማ እና ከማዘጋጃ ቤት የማስፈቀድ ሙሉ ድጋፍ ይሰጣል፡

📋 **የምናስፈቅዳቸው ሰነዶች:**
1. **የአርኪቴክቸራል እና ስትራክቸራል ዲዛይን ማጽደቅ (Design Approval)**
2. **የአካባቢ ተጽዕኖ ግምገማ (EIA) እና የአፈር ምርመራ ሰርተፊኬት**
3. **ዋናው የግንባታ ፈቃድ (Building Permit)**
4. **ስራ ሲጠናቀቅ የባለቤትነት / የይዞታ ማረጋገጫ (Occupancy Certificate)**

✅ ሁሉንም ሰነዶች እና ቴክኒካል ስሌቶች ኢንጂነሮቻችን በማዘጋጀት ሂደቱን በፍጥነት ያጠናቅቃሉ።`,
            suggestions: ['ነፃ ምክር ቀጠሮ', 'የግንባታ ዋጋ ስንት ነው?', 'የቪላ እና አፓርትመንት ግንባታ'],
            showLeadForm: true,
          };
        }
        return {
          message: `**Building Permits, Zoning & Municipal Approvals**

Yes! Lamed Construction PLC manages the complete regulatory permitting process on your behalf:

📋 **Approvals We Secure for You:**
1. **Architectural, Structural, MEP Design Approval** from Sub-City Urban Planning
2. **Soil Investigation & Structural Safety Clearances**
3. **Official Construction Building Permit**
4. **Final Occupancy Certificate** post-completion inspection

✅ We handle all paperwork, submissions, follow-ups, and structural compliance defenses to eliminate bureaucratic delays.`,
          suggestions: ['Book a Free Consultation', 'Cost & Pricing Estimates', 'Contact Sales'],
          showLeadForm: true,
        };
      },
    },

    // 7. PAYMENT TERMS / FINANCING / INSTALLMENTS / BANKS
    {
      id: 'payment',
      keywords: ['payment', 'installment', 'pay', 'financing', 'bank', 'loan', 'mortgage', 'terms', 'cbe', 'awash', 'dashen', 'deposit', 'advance', 'down payment', 'discount'],
      amharicKeywords: ['ክፍያ', 'አከፋፈል', 'በደረጃ', 'ባንክ', 'ብድር', 'ቅድመ ክፍያ', 'ቅናሽ', 'አዋሽ', 'ዳሽን', 'ንግድ ባንክ', 'የክፍያ ሁኔታ'],
      handler: () => {
        if (isAmharic) {
          return {
            message: `**የክፍያ አፈጻጸም እና የባንክ ብድር ድጋፍ**

ላሜድ ኮንስትራክሽን ለደንበኞቹ ምቹ የደረጃ በደረጃ ክፍያ (Milestone-based) ያቀርባል፡

💳 **ደረጃውን የጠበቀ የክፍያ ስርዓት:**
• **30% —** ውል ሲፈረም እና የቁሳቁስ ማሰባሰቢያ (Advance Mobilization)
• **20% —** የመሰረት (Foundation) ስራ ሲጠናቀቅ
• **20% —** የኮንክሪት ስትራክቸር (Frame & Slabs) ሲጠናቀቅ
• **20% —** የውስጥ ማጠናቀቂያ (Finishing & MEP) ሲጠናቀቅ
• **10% —** ህንፃው ሙሉ በሙሉ ተጠናቆ ቁልፍ ሲረከቡ (Final Handover)

🏦 **የባንክ ብድር:** ከኢትዮጵያ ንግድ ባንክ፣ ከአዋሽ ባንክ፣ ከዳሽን እና ከሌሎች ባንኮች ጋር ለሚሰሩ የኮንስትራክሽን ብድሮች ሙሉ የሰነድ ድጋፍ እናቀርባለን።
💰 **የቅድመ ክፍያ ቅናሽ:** ሙሉ ክፍያ አስቀድመው ለሚከፍሉ ደንበኞች **እስከ 5% ልዩ ቅናሽ** ይደረጋል!`,
            suggestions: ['የዋጋ መጠየቂያ ቅጽ መሙላት', 'ነፃ ምክር ቀጠሮ', 'ስልክ ይደውሉ (+251 911 123 456)'],
            showLeadForm: true,
          };
        }
        return {
          message: `**Flexible Payment Terms & Bank Financing Support**

We offer transparent, milestone-tied payment schedules to protect your investment:

💳 **Standard Milestone Payment Schedule:**
• **30% —** Mobilization & contract signing
• **20% —** Substructure & foundation completion
• **20% —** Superstructure (concrete frame & slabs) completion
• **20% —** Interior architectural finishing & MEP installations
• **10% —** Final inspection, key handover & sign-off

🏦 **Bank Mortgage/Loan Assistance:** We assist with valuation reports and BOQ documentation for CBE, Awash, Dashen, and other commercial banks.
💰 **Cash Discount:** Up to **5% discount** on total project cost for lump-sum upfront payments!`,
          suggestions: ['Request a Custom Quote', 'Book a Free Consultation', 'Call Sales (+251 911 123 456)'],
          showLeadForm: true,
        };
      },
    },

    // 8. MATERIALS / QUALITY / CEMENT / STEEL / TILES
    {
      id: 'materials',
      keywords: ['material', 'cement', 'steel', 'rebar', 'concrete', 'tile', 'tiles', 'porcelain', 'marble', 'wood', 'gypsum', 'quality', 'brand', 'import', 'supply', 'source', 'lab', 'laboratory', 'test'],
      amharicKeywords: ['ቁሳቁስ', 'እቃዎች', 'ሲሚንቶ', 'ብረት', 'ኮንክሪት', 'ሴራሚክ', 'ፖርሲሊን', 'እብነበረድ', 'እንጨት', 'ጂፕሰም', 'ጥራት', 'ላቦራቶሪ', 'ምርመራ', 'ከውጭ', 'የሚገቡ'],
      handler: () => {
        if (isAmharic) {
          return {
            message: `**የምንጠቀምባቸው ጥራት ያላቸው የግንባታ ቁሳቁሶች**

ላሜድ ኮንስትራክሽን የላቦራቶሪ ምርመራ ያለፉ ምርጥ ቁሳቁሶችን ብቻ ይጠቀማል፡

🧱 **ስትራክቸራል ቁሳቁሶች:**
• **ሲሚንቶ:** ሙገር፣ ዳንጎቴ፣ ደርባ፣ መስቦ (Grade 42.5 OPC/PPC)
• **የብረት ዘንግ (Rebar):** በኢትዮጵያ እና በቱርክ የተመረቱ ደረጃቸውን የጠበቁ ከፍተኛ ጥንካሬ ያላቸው ብረቶች (Grade 60)
• **ኮንክሪት:** በየሳይቱ የ Slump እና የ Cube ፈተና የሚደረግለት ጠንካራ ኮንክሪት

🪨 **የማጠናቀቂያ ቁሳቁሶች:**
• **ፖርሲሊን እና ሴራሚክ:** ከጣሊያን እና ስፔን የሚመጡ ፕሪሚየም ወለሎች
• **ሳኒተሪ እና ቧንቧ:** Kohler, Roca, Grohe የመታጠቢያ ቤት እቃዎች
• **ቀለም:** ጆተን (Jotun) እና ኒፖን (Nippon) የአየር ሁኔታ መቋቋም የሚችሉ ቀለሞች

✨ ደንበኞች የራሳቸውን የማጠናቀቂያ እቃዎች መምረጥ ወይም ማቅረብ ይችላሉ!`,
            suggestions: ['Interior Finishing አማራጮች', 'የግንባታ ዋጋ ስንት ነው?', 'ነፃ ምክር ቀጠሮ'],
          };
        }
        return {
          message: `**Certified Materials & Quality Control Standards**

We never compromise on structural integrity. All materials undergo independent laboratory testing:

🧱 **Structural Materials:**
• **Cement:** Grade 42.5 OPC/PPC from Mugher, Dangote, Derba & Messebo
• **High-Tensile Rebar:** BS/ASTM-certified Grade 60 ribbed reinforcement steel
• **Ready-Mix & On-Site Concrete:** Verified with continuous slump, batch, and 28-day cube crushing tests

🪨 **Finishing Materials:**
• **Flooring:** Premium imported Italian & Spanish porcelain tiles, natural Ethiopian marble
• **Sanitary & Bathrooms:** European brands including Kohler, Roca, and Grohe
• **Paints & Facades:** Weather-resistant Jotun and Nippon coating systems

✨ Clients have the full flexibility to customize finishing brands or supply select fixtures!`,
          suggestions: ['Interior finishing options', 'Cost & Pricing Estimates', 'Book a Free Consultation'],
        };
      },
    },

    // 9. OUTSIDE ADDIS ABABA / REGIONAL PROJECTS
    {
      id: 'regions',
      keywords: ['outside', 'regions', 'regional', 'hawassa', 'adama', 'bahir dar', 'bishoftu', 'debre zeit', 'mekelle', 'jimma', 'diredawa', 'outside addis'],
      amharicKeywords: ['ከአዲስ አበባ ውጭ', 'ክልል', 'ሀዋሳ', 'አዳማ', 'ባህር ዳር', 'ቢሾፍቱ', 'ደብረዘይት', 'ጅማ', 'ድሬዳዋ', 'ከከተማ ውጭ', 'ክልሎች'],
      handler: () => {
        if (isAmharic) {
          return {
            message: `**ከአዲስ አበባ ውጭ እና በክልል ከተሞች የሚሰሩ ፕሮጀክቶች**

አዎ! ላሜድ ኮንስትራክሽን በአዲስ አበባ ዙሪያ እና በዋና ዋና የክልል ከተሞች ላይ ለሚሰሩ ትላልቅ ፕሮጀክቶች አገልግሎት ይሰጣል፡

📍 **የምንሰራባቸው ዋና ዋና ከተሞች:**
• **ቢሾፍቱ (ደብረዘይት) እና አዳማ** — ሪዞርቶች፣ ቪላዎች እና የኢንዱስትሪ ህንፃዎች
• **ሀዋሳ** — ሆቴሎች፣ አፓርትመንቶች እና የንግድ ማዕከላት
• **ባህር ዳር እና ሌሎች ዋና ከተሞች**

💡 ለክልል ፕሮጀክቶች የትራንስፖርት እና የሎጅስቲክስ ሁኔታ ታይቶ ልዩ የፕሮጀክት ስሌት ይዘጋጃል።`,
            suggestions: ['የዋጋ መጠየቂያ ቅጽ መሙላት', 'ስልክ ይደውሉ (+251 911 123 456)', 'ነፃ ምክር ቀጠሮ'],
            showLeadForm: true,
          };
        }
        return {
          message: `**Projects Outside Addis Ababa & Regional Developments**

Yes! Lamed Construction PLC undertakes select residential, commercial, resort, and industrial projects across major Ethiopian regional hubs:

📍 **Key Regions We Serve:**
• **Bishoftu (Debre Zeit) & Adama:** Luxury lakefront villas, resorts, and logistics centers
• **Hawassa:** Hospitality resorts, commercial malls, and residential apartments
• **Bahir Dar & Other Major Economic Corridors**

💡 Contact our engineering project team with your site location for regional logistics and mobilization planning.`,
          suggestions: ['Submit an Inquiry', 'Book a Free Consultation', 'Call Sales (+251 911 123 456)'],
          showLeadForm: true,
        };
      },
    },

    // 10. WARRANTY / DEFECTS / CRACKS / AFTER-SALES
    {
      id: 'warranty',
      keywords: ['warranty', 'guarantee', 'defect', 'cracks', 'fix', 'repair', 'maintenance', 'after sales', 'insurance', 'safety guarantee', 'leak'],
      amharicKeywords: ['ዋስትና', 'ጥበቃ', 'ስንጥቅ', 'ጉድለት', 'ጥገና', 'ከሽያጭ በኋላ', 'ፈሳሽ', 'የህንፃ ዋስትና', 'ችግር ቢፈጠር'],
      handler: () => {
        if (isAmharic) {
          return {
            message: `**የላሜድ ኮንስትራክሽን የጥራት ዋስትና (Warranty)**

ስራችንን ሙሉ በሙሉ በኃላፊነት ስለምንሰራ ለደንበኞቻችን አስተማማኝ ዋስትና እንሰጣለን፡

🛡️ **የዋስትና ሽፋን:**
• **10 ዓመት —** ለዋናው የኮንክሪት እና የብረት ስትራክቸር (Structural Integrity)
• **2 ዓመት —** ለውሃ ቧንቧ (Plumbing)፣ ኤሌክትሪክ እና የጣሪያ ፍሳሽ
• **1 ዓመት —** ለውስጥ ማጠናቀቂያ (ጂፕሰም፣ ፖርሲሊን፣ ቀለም፣ የእንጨት ስራዎች)

🔧 ህንፃው ከተረከቡ በኋላ ማንኛውም ጉድለት ቢፈጠር ነፃ የጥገና ቡድናችን መጥቶ ያስተካክላል።`,
            suggestions: ['ለምን ላሜድ?', 'ነፃ ምክር ቀጠሮ', 'የቀደሙ ፕሮጀክቶች'],
          };
        }
        return {
          message: `**Comprehensive Construction Warranty & After-Sales Service**

We stand firmly behind our workmanship with written, legally binding warranties:

🛡️ **Warranty Coverage:**
• **10-Year Warranty —** Full structural frame integrity (foundation, columns, beams, slabs)
• **2-Year Warranty —** Plumbing, electrical, drainage, and roof waterproofing
• **1-Year Warranty —** Interior architectural finishes (tiling, gypsum, woodwork, paints)

🔧 Should any construction defect arise during the warranty period, our dedicated maintenance crew conducts immediate corrective repairs at zero cost to you.`,
          suggestions: ['Why Choose Lamed', 'Book a Free Consultation', 'View Past Projects'],
        };
      },
    },

    // 11. SOLAR / GENERATOR / GREEN BUILDING
    {
      id: 'solar',
      keywords: ['solar', 'green', 'sustainable', 'eco', 'generator', 'backup power', 'water tank', 'rainwater', 'energy', 'insulation'],
      amharicKeywords: ['ሶላር', 'ጄኔሬተር', 'መብራት ሲጠፋ', 'የውሃ ታንከር', 'ዝናብ ውሃ', 'ኢነርጂ', 'ዘላቂ', 'አካባቢ ጥበቃ', 'የፀሐይ ብርሃን'],
      handler: () => {
        if (isAmharic) {
          return {
            message: `**ሶላር፣ የጄኔሬተር እና ዘላቂ የኢነርጂ ስርዓት (Green Building)**

በአዲስ አበባ የመብራት እና የውሃ መቆራረጥን ለመፍታት ዘመናዊ መፍትሄዎችን እንገጥማለን፡

☀️ **የሶላር ኃይል (Solar PV Systems):** የጣሪያ ላይ የፀሐይ ፓነሎች ለቤት ውስጥ መብራት እና ለውሃ ማሞቂያ (Solar Water Heater)።
⚡ **የመጠባበቂያ ጄኔሬተር (Automatic Backup Generator):** መብራት ሲጠፋ በሰከንዶች ውስጥ በራሱ የሚሰራ ስርዓት።
💧 **የውሃ ማጠራቀሚያ እና የዝናብ ውሃ አጠቃቀም (Rainwater Harvesting):** ትላልቅ የከርሰ-ምድር የውሃ ማጠራቀሚያዎች እና የፓምፕ ዝርጋታ።`,
            suggestions: ['የቪላ እና አፓርትመንት ግንባታ', 'የግንባታ ዋጋ ስንት ነው?', 'ነፃ ምክር ቀጠሮ'],
          };
        }
        return {
          message: `**Solar Energy, Backup Power & Sustainable Green Engineering**

We integrate seamless self-sufficiency solutions into all modern builds:

☀️ **Rooftop Solar PV & Solar Water Heating:** Clean energy to offset grid power and supply 24/7 hot water.
⚡ **Automatic Transfer Backup Generators:** Heavy-duty diesel gensets with automatic mains failure (AMF) panels.
💧 **Underground Water Reservoirs & Rainwater Harvesting:** High-capacity water storage and pressure booster pump systems.`,
          suggestions: ['Cost & Pricing Estimates', 'Villa construction details', 'Book a Free Consultation'],
        };
      },
    },

    // 12. RENOVATION & REMODELING
    {
      id: 'renovation',
      keywords: ['renovat', 'remodel', 'retrofit', 'repair', 'refurbish', 'upgrade', 'old house', 'facade', 'modernize'],
      amharicKeywords: ['እድሳት', 'ማደስ', 'ጥገና', 'አሮጌ ቤት', 'ማሻሻል', 'የፊት ገጽታ', 'ማዘመን'],
      handler: () => {
        if (isAmharic) {
          return {
            message: `**የቤት እና የህንፃ እድሳት አገልግሎት (Renovation & Remodeling)**

ነባር ቤቶችን እና የቆዩ ህንፃዎችን ወደ ዘመናዊ ደረጃ እንቀይራለን፡

🔨 **የምንሰጣቸው የእድሳት ስራዎች:**
• **የስትራክቸር ማጠናከር:** ስንጥቆችን ማከም፣ ምሰሶዎችን ማጠናከር (Column Jacketing)
• **ሙሉ የውስጥ ዲዛይን ለውጥ:** አዲስ ፖርሲሊን፣ ጂፕሰም፣ ሳኒተሪ እና ዘመናዊ ኪችን
• **የኤሌክትሪክ እና የቧንቧ መስመር በአዲስ መተካት**
• **የፊት ገጽታ (Facade) ማደስ:** ዘመናዊ የመስታወት እና የቀለም ለውጥ

💡 የቦታዎን ሁኔታ አይተን ነፃ የእድሳት ግምት እንሰጣለን!`,
            suggestions: ['የዋጋ መጠየቂያ ቅጽ መሙላት', 'ነፃ ምክር ቀጠሮ', 'ስልክ ይደውሉ (+251 911 123 456)'],
            showLeadForm: true,
          };
        }
        return {
          message: `**Structural Renovation, Retrofitting & Remodeling**

We specialize in breathing new life into older residential and commercial properties:

🔨 **Our Renovation Scope:**
• **Structural Retrofitting:** Column jacketing, foundation reinforcement, and seismic safety upgrades
• **Complete Interior Overhauls:** Modern Italian tile flooring, gypsum ceilings, luxury bathrooms, custom kitchens
• **MEP Infrastructure Replacement:** Full rewiring, modern plumbing pipes, and HVAC upgrades
• **Facade Modernization:** Contemporary glass, composite paneling, and exterior textured finishes

💡 We offer free structural diagnostic walkthroughs for prospective renovation projects!`,
          suggestions: ['Book a Free Consultation', 'Cost & Pricing Estimates', 'Call Sales (+251 911 123 456)'],
          showLeadForm: true,
        };
      },
    },

    // 13. VILLA / RESIDENTIAL
    {
      id: 'villa',
      keywords: ['villa', 'residential', 'house', 'home', 'gated', 'single family', 'compound', 'g+1', 'g+2', 'g+3', 'living'],
      amharicKeywords: ['ቪላ', 'ቤት', 'መኖሪያ', 'ግቢ', 'የቪላ', 'የቤት'],
      handler: () => {
        if (isAmharic) {
          return {
            message: `**የመኖሪያ ቪላ እና ቤቶች ግንባታ — ላሜድ ኮንስትራክሽን**

ላሜድ ለየት ያለ ውበት እና ጥንካሬ ያላቸውን የመኖሪያ ቪላዎች ይገነባል፡

🏡 **G+0 ባለ አንድ ወለል ቪላዎች (120–250 m²):** ለቤተሰብ ምቹ፣ ሰፊ ግቢ ያለው ዘመናዊ ቤት።
🏠 **G+1 ባለ ሁለት ወለል ቪላዎች (200–400 m²):** 3-5 መኝታ ክፍሎች፣ ዘመናዊ ኪችን፣ ሰፊ ሳሎን እና በረንዳ።
🏘️ **G+2 ባለ ሦስት ወለል ቪላዎች (300–600+ m²):** ሮፍቶፕ ቴራስ፣ ጂም/ሲኒማ ክፍል፣ ጋራዥ እና ሰፊ ክፍሎች።
🌳 **Gated Community መንደሮች:** የደህንነት ጥበቃ እና የመዝናኛ ስፍራ ያላቸው ውብ መንደሮች።

**የቪላ ግንባታ ፓኬጃችን የሚያካትተው:**
✅ ሙሉ አርኪቴክቸራል እና ስትራክቸራል ዲዛይን
✅ ጠንካራ የኮንክሪት እና ብረት ስራ
✅ የኤሌክትሪክ፣ ሳኒተሪ እና የቧንቧ ዝርጋታ
✅ ከፍተኛ ደረጃ ማጠናቀቂያ (ጂፕሰም፣ ፖርሲሊን፣ የእንጨት ካቢኔት)

💡 የቦታዎን ካሬ ሜትር ይንገሩን፤ ዝርዝር ዋጋ እንሰጥዎታለን።`,
            suggestions: ['የቪላ ዋጋ ምን ያህል ነው?', 'የቤት ግንባታ ጊዜ ስንት ነው?', 'Interior Finishing አማራጮች', 'ነፃ ምክር ቀጠሮ'],
          };
        }
        return {
          message: `**Residential Villa & Custom Home Construction**

We specialize in designing and building bespoke luxury homes and villas in prime Addis Ababa neighborhoods:

🏡 **G+0 Single-Storey Villas (120–250 m²):** Contemporary open layouts with garden integration.
🏠 **G+1 Two-Storey Luxury Homes (200–400 m²):** 3–5 bedrooms, modern open kitchens, en-suite bathrooms, balconies.
🏘️ **G+2 Three-Storey Mansions (300–600+ m²):** Rooftop terraces, master penthouses, entertainment lounges, multi-car garages.
🌳 **Gated Communities:** Multi-unit secure developments with communal amenities and perimeter security.

**Complete Turnkey Package Includes:**
✅ Architectural, structural, electrical & sanitary engineering drawings
✅ Grade-1 reinforced concrete frame & certified tensile steel
✅ High-grade MEP installations & backup generator integration
✅ Luxury European interior finishing (porcelain tiles, gypsum ceilings, custom woodwork)`,
          suggestions: ['How much does a villa cost?', 'Construction timeline', 'Interior finishing options', 'Book a Free Consultation'],
        };
      },
    },

    // 14. APARTMENTS / REAL ESTATE / CONDOS
    {
      id: 'apartments',
      keywords: ['apartment', 'condo', 'condominium', 'flat', 'unit', 'units', 'multi family', 'rental property', 'investment property', 'roi'],
      amharicKeywords: ['አፓርትመንት', 'አፓርትማ', 'ኮንዶሚኒየም', 'ፍላት', 'ኪራይ', 'ኢንቨስትመንት', 'ሪል እስቴት'],
      handler: () => {
        if (isAmharic) {
          return {
            message: `**አፓርትመንት እና የመኖሪያ ህንፃዎች ግንባታ**

ላሜድ ኮንስትራክሽን ለግል ባለሀብቶች እና ለሪል እስቴት አልሚዎች ከፍተኛ ጥራት ያላቸው አፓርትመንቶችን ይገነባል፡

🏢 **የምንገነባቸው ክፍሎች ዓይነቶች:**
• **1 ቤድሩም (60–80 m²):** ለወጣቶችና ለኪራይ ኢንቨስትመንት ተመራጭ
• **2 ቤድሩም (90–125 m²):** ለቤተሰብ ምቹ እና ተወዳጅ ስፋት
• **3 ቤድሩም (130–180 m²):** ሰፊ ሳሎን፣ ማስተር ቤድሩም እና በረንዳ ያለው
• **ፔንትሀውስ / Penthouse (200+ m²):** ከፍተኛ የቅንጦት ሮፍቶፕ መኖሪያ

**የአፓርትመንት ተጨማሪ ፋሲሊቲዎች:**
✅ ዘመናዊ ፈጣን ሊፍቶች (Elevators)
✅ የከርሰ-ምድር የመኪና ማቆሚያ (Underground Parking)
✅ የ 24 ሰዓት የጄኔሬተር እና የውሃ ማጠራቀሚያ ታንከሮች
✅ የደህንነት ካሜራ እና የደወል ስርዓት`,
            suggestions: ['የግንባታ ዋጋ ስንት ነው?', 'የቀደሙ ፕሮጀክቶች', 'ነፃ ምክር ቀጠሮ'],
          };
        }
        return {
          message: `**Apartment & Multi-Family Residential Construction**

We engineer and construct modern, high-yield apartment complexes across Addis Ababa:

🏢 **Typical Apartment Configurations:**
• **1-Bedroom Units (60–80 m²):** Optimized for high-yield rental returns
• **2-Bedroom Units (90–125 m²):** High-demand family layouts
• **3-Bedroom Units (130–180 m²):** Executive suites with master balconies
• **Penthouses (200+ m²):** Exclusive rooftop residences with panoramic city views

**Key Building Inclusions:**
✅ High-speed passenger & service elevators
✅ Underground and structured multi-vehicle parking
✅ 24/7 heavy-duty backup generator & underground water reservoirs
✅ Fire safety, CCTV surveillance, and access control systems`,
          suggestions: ['Cost & Pricing Estimates', 'Construction timeline', 'Book a Free Consultation'],
        };
      },
    },

    // 15. COMMERCIAL / PLAZAS / MALLS / HOTELS
    {
      id: 'commercial',
      keywords: ['commercial', 'office', 'plaza', 'mall', 'retail', 'hotel', 'warehouse', 'factory', 'mixed use', 'building', 'store', 'hospital', 'school'],
      amharicKeywords: ['የንግድ', 'ቢሮ', 'ፕላዛ', 'ሞል', 'ሱቅ', 'ሆቴል', 'መጋዘን', 'ፋብሪካ', 'ሆስፒታል', 'ትምህርት ቤት', 'ህንፃ'],
      handler: () => {
        if (isAmharic) {
          return {
            message: `**የንግድ ህንፃዎች፣ ፕላዛዎች እና የቢሮ ማዕከላት ግንባታ**

ላሜድ ኮንስትራክሽን ደረጃቸውን የጠበቁ የንግድ ማዕከላትን በመገንባት ረገድ ከፍተኛ ልምድ አለው፡

🏢 **ደረጃ ሀ (Grade-A) የቢሮ ህንፃዎች:** ክፍት የቢሮ ቦታዎች፣ የኮንፈረንስ አዳራሾች እና የመስታወት ፊት (Curtain Wall)።
🏪 **የገበያ ማዕከላት (Shopping Malls):** ለሱቆች፣ ሬስቶራንቶች እና ባንኮች ምቹ የሆኑ ፕላዛዎች።
🏨 **ሆቴሎች እና ሎጆች:** ዓለም አቀፍ ደረጃን ያሟሉ የእንግዳ ማረፊያዎች።
🏭 **መጋዘኖች እና የፋብሪካ ህንፃዎች (Warehouses):** ጠንካራ የብረት እና ኮንክሪት ስትራክቸር ያላቸው ማከማቻዎች።`,
            suggestions: ['የንግድ ህንፃ ዋጋ ስንት ነው?', 'የቀደሙ ፕሮጀክቶች', 'ነፃ ምክር ቀጠሮ'],
          };
        }
        return {
          message: `**Commercial Towers, Malls & Corporate Plaza Construction**

We deliver Grade-1 commercial spaces engineered for maximum operational efficiency and tenant value:

🏢 **Grade-A Corporate Office Towers:** Open-plan flexible floors, double-glazed curtain walls, executive boardrooms.
🏪 **Shopping Malls & Retail Plazas:** High-footfall layouts, wide corridors, anchor retail spaces.
🏨 **Hotels & Hospitality Developments:** Built to international hospitality standards.
🏭 **Logistics Hubs & Warehouses:** High-clearance steel and reinforced concrete industrial facilities.`,
          suggestions: ['Commercial building cost estimate', 'View Past Projects', 'Book a Free Consultation'],
        };
      },
    },

    // 16. WHY CHOOSE / CONTRACTOR GRADE / CERTIFICATIONS
    {
      id: 'certifications',
      keywords: ['grade', 'contractor', 'certified', 'license', 'why choose', 'experience', 'who are you', 'company profile', 'background', 'reputation', 'trust'],
      amharicKeywords: ['ደረጃ', 'ስንተኛ ደረጃ', 'ተቋራጭ', 'ሰርተፊኬት', 'ፈቃድ', 'ለምን', 'ታሪክ', 'ልምድ', 'እምነት', 'ኩባንያ'],
      handler: () => {
        if (isAmharic) {
          return {
            message: `**ስለ ላሜድ ኮንስትራክሽን እና ደረጃችን**

✅ **ደረጃ 1 አጠቃላይ ተቋራጭ (Grade 1 General Contractor / BC-1):** በኢትዮጵያ የከተማ ልማት እና ኮንስትራክሽን ሚኒስቴር ሙሉ እውቅና የተሰጠው ከፍተኛው ደረጃ።
✅ **ደረጃ ሀ የደህንነት ሰርተፊኬት (Grade A Safety):** በኢትዮጵያ ኮንስትራክሽን ደህንነት ቦርድ የተረጋገጠ።
✅ **የ 11+ ዓመታት ልምድ:** ከ 30 በላይ ግዙፍ የመኖሪያ እና የንግድ ፕሮጀክቶችን በወቅቱና በጥራት ማጠናቀቅ።
✅ **የ 98% የደንበኞች እርካታ:** በ Addiss Ababa እና በክልል ከተሞች አስተማማኝ ስም የተገነባ።
✅ **የጥራት ዋስትና:** እስከ 10 ዓመት የስትራክቸር ዋስትና እንሰጣለን።`,
            suggestions: ['ነፃ ምክር ቀጠሮ', 'የቀደሙ ፕሮጀክቶች', 'የግንባታ ዋጋ ስንት ነው?'],
            showLeadForm: true,
          };
        }
        return {
          message: `**Lamed Construction PLC — Grade-1 Contractor Profile**

✅ **Grade 1 General Contractor (GC-1 / BC-1):** The highest tier licensing granted by the Ministry of Urban Development & Construction.
✅ **Grade A Safety Certification:** Fully certified by the Ethiopian Construction Safety Board.
✅ **11+ Years Track Record:** 30+ landmark projects completed on-time and within budget across Ethiopia.
✅ **98% Client Satisfaction Rate:** Built on engineering rigor, transparent billing, and premium craftsmanship.
✅ **Comprehensive Warranty:** 1 to 10-year warranty on all delivered structures.`,
          suggestions: ['Book a Free Consultation', 'View Past Projects', 'Contact Sales'],
          showLeadForm: true,
        };
      },
    },
  ];

  // ── SEMANTIC SCORING ALGORITHM ─────────────────────────────────────────────
  // Evaluate the score for each topic based on matching words in the user's custom question
  let bestTopic: DomainTopic | null = null;
  let highestScore = 0;

  for (const topic of topics) {
    let score = 0;
    const keywordsList = isAmharic ? topic.amharicKeywords : topic.keywords;
    const secondaryList = isAmharic ? topic.keywords : topic.amharicKeywords;

    for (const kw of keywordsList) {
      if (raw.includes(kw) || q.includes(kw.toLowerCase())) {
        // Longer keyword matches give higher precision scores
        score += kw.length >= 4 ? 3 : 2;
      }
    }

    for (const kw of secondaryList) {
      if (raw.includes(kw) || q.includes(kw.toLowerCase())) {
        score += 1;
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestTopic = topic;
    }
  }

  // If a topic matched with confidence score >= 2, execute its tailored handler
  if (bestTopic && highestScore >= 2) {
    return bestTopic.handler(raw, isAmharic);
  }

  // ── INTELLIGENT DIRECT FALLBACK ───────────────────────────────────────────
  // If the query was not recognized by specific domains, provide a direct answer addressing their query
  if (isAmharic) {
    return {
      message: `ስለ ላሜድ ኮንስትራክሽን ለጠየቁት ጥያቄ እናመሰግናለን!

እኛ **ደረጃ 1 አጠቃላይ ተቋራጭ (Grade 1 Contractor)** ስንሆን፤ ለመኖሪያ ቪላዎች፣ አፓርትመንቶች፣ የንግድ ህንፃዎች፣ እና እድሳት ሙሉ የዲዛይን እና የግንባታ አገልግሎት እንሰጣለን።

በተለይ የሚፈልጉትን ጉዳይ (ለምሳሌ የቦታዎን ስፋት፣ የቦታውን አድራሻ፣ ወይም የሚፈልጉትን የህንፃ አይነት) ቢያስቀምጡልን ኢንጂነሮቻችን ቀጥታ መልስ ይሰጡዎታል!`,
      suggestions: [
        'የምንሰጣቸው አገልግሎቶች',
        'የግንባታ ዋጋ ስንት ነው?',
        'የቤት ግንባታ ጊዜ ስንት ነው?',
        'ነፃ ምክር ቀጠሮ',
      ],
      showLeadForm: true,
    };
  }

  return {
    message: `Thank you for your question! **Lamed Construction PLC** is a Grade-1 General Contractor based in Addis Ababa, specializing in residential luxury villas, commercial towers, apartments, and turnkey renovations.

To provide you with the most accurate advice, feel free to specify your plot size (e.g. 200 m²), project location, or building type — or choose an option below to connect directly with our engineering team:`,
    suggestions: [
      'Explore Our Services',
      'Cost & Pricing Estimates',
      'How long does construction take?',
      'Book a Free Consultation',
    ],
    showLeadForm: true,
  };
}
