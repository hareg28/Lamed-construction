'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Sparkles,
  X,
  Send,
  RotateCcw,
  Bot,
  User,
  Building2,
  Phone,
  Mail,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import { toast } from 'sonner';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  suggestions?: string[];
  showLeadForm?: boolean;
}

export default function AIChatWidget() {
  const pathname = usePathname();
  const { language, setLanguage } = useLanguageStore();
  const [isOpen, setIsOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // In-chat lead capture state
  const [leadForm, setLeadForm] = useState({
    name: '',
    phoneOrEmail: '',
    service: 'Residential Construction',
    notes: '',
  });
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  // Don't render on admin pages
  const isAdmin = pathname?.startsWith('/admin');

  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const isAm = language === 'am';
      setMessages([
        {
          id: 'welcome-1',
          sender: 'bot',
          text: isAm
            ? 'ጤና ይስጥልኝ! ወደ **ላሜድ ኮንስትራክሽን (Lamed Construction)** እንኳን በደህና መጡ። እኔ የላሜድ የኤ አይ (AI) አማካሪዎ ነኝ። ስለ መኖሪያ ቪላዎች፣ የንግድ ህንፃዎች ወይም ስለ ግንባታ ወጪዎች በምን ላግዝዎ እችላለሁ?'
            : 'Hello! Welcome to **Lamed Construction PLC**. I am your intelligent AI construction advisor. How can I help you with your residential, commercial, or mixed-use project today?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestions: isAm
            ? ['የምንሰጣቸው አገልግሎቶች', 'የግንባታ ዋጋ ግምት', 'የተጠናቀቁ ፕሮጀክቶች', 'ነፃ የማማከር ቀጠሮ']
            : ['Explore Services', 'Cost & Pricing Estimates', 'View Past Projects', 'Book a Consultation'],
        },
      ]);
    }
  }, [language, messages.length]);

  // Auto scroll to latest message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  if (isAdmin) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    setInput('');
    setHasInteracted(true);

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          language,
          history: messages.slice(-6).map((m) => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text,
          })),
        }),
      });

      const data = await res.json();

      if (data.success && data.message) {
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            text: data.message,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            suggestions: data.suggestions || [],
            showLeadForm: data.showLeadForm || false,
          },
        ]);
      } else {
        throw new Error(data.error || 'Failed to generate response');
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text:
            language === 'am'
              ? 'ይቅርታ፣ ጊዜያዊ የግንኙነት ችግር አጋጥሟል። እባክዎን በቀጥታ በስልክ ቁጥር **+251 911 123 456** ይደውሉልን ወይም ጥያቄዎን በድጋሚ ይላኩ።'
              : 'Thank you for your message. You can also connect directly with our engineering office at **+251 911 123 456** or email **lamedconstructionbc1@gmail.com**.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestions: ['Call Office (+251 911 123 456)', 'Explore Services', 'Book Consultation'],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    const isAm = language === 'am';
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'bot',
        text: isAm
          ? 'ውይይቱ ታድሷል። ስለ ላሜድ ኮንስትራክሽን ፕሮጀክቶች፣ አገልግሎቶች ወይም ዋጋዎች ምን ማወቅ ይፈልጋሉ?'
          : 'Chat refreshed. What would you like to explore regarding Lamed Construction today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: isAm
          ? ['የምንሰጣቸው አገልግሎቶች', 'የግንባታ ዋጋ ግምት', 'የተጠናቀቁ ፕሮጀክቶች']
          : ['Explore Services', 'Cost Estimates', 'View Projects'],
      },
    ]);
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadForm.name || !leadForm.phoneOrEmail) {
      toast.error('Please provide your name and phone number or email.');
      return;
    }

    setIsSubmittingLead(true);
    try {
      const isEmail = leadForm.phoneOrEmail.includes('@');
      const payload = {
        name: leadForm.name,
        email: isEmail ? leadForm.phoneOrEmail : `${leadForm.name.toLowerCase().replace(/\s+/g, '')}@lead.lamed.com`,
        phone: !isEmail ? leadForm.phoneOrEmail : undefined,
        service: leadForm.service,
        message: `[AI Chat Inquiry] Service: ${leadForm.service}. Notes: ${leadForm.notes || 'Interested in consultation/quotation.'}`,
      };

      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setLeadSubmitted(true);
        toast.success('Inquiry submitted!', {
          description: 'Our engineering team will contact you shortly.',
        });
        setMessages((prev) => [
          ...prev,
          {
            id: `lead-confirm-${Date.now()}`,
            sender: 'bot',
            text:
              language === 'am'
                ? `እናመሰግናለን **${leadForm.name}**! የፕሮጀክት መረጃዎ በስኬት ተመዝግቧል። የኢንጂነሪንግ ክፍላችን በ **${leadForm.phoneOrEmail}** በ 24 ሰዓታት ውስጥ ያነጋግርዎታል።`
                : `Thank you **${leadForm.name}**! Your project details have been received. Our chief engineering advisor will contact you at **${leadForm.phoneOrEmail}** shortly.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            suggestions: ['Explore Services', 'View Past Projects'],
          },
        ]);
      } else {
        throw new Error('Failed to submit');
      }
    } catch {
      toast.error('Could not submit inquiry automatically. Please call +251 911 123 456.');
    } finally {
      setIsSubmittingLead(false);
    }
  };

  // Helper to format bold markdown and line breaks
  const formatMessageContent = (content: string) => {
    const parts = content.split('\n');
    return parts.map((line, idx) => {
      // Replace **text** with strong
      const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      return (
        <p
          key={idx}
          className={`${idx > 0 ? 'mt-1.5' : ''}`}
          dangerouslySetInnerHTML={{ __html: formatted }}
        />
      );
    });
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        {!isOpen && !hasInteracted && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: 1, duration: 0.4 }}
            onClick={() => setIsOpen(true)}
            className="cursor-pointer hidden sm:flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-navy-900/90 dark:bg-navy-950/95 backdrop-blur-md border border-emerald-500/30 text-white shadow-2xl hover:border-emerald-400 transition-all duration-300 group"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <div className="text-left">
              <p className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Lamed AI Assistant
              </p>
              <p className="text-[11px] text-gray-300">
                {language === 'am' ? 'ጥያቄ አለዎት? ያነጋግሩን' : 'Ask about services & costs'}
              </p>
            </div>
          </motion.div>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setIsOpen(!isOpen);
            setHasInteracted(true);
          }}
          className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-700 via-emerald-600 to-amber-600 text-white shadow-2xl flex items-center justify-center border-2 border-white/20 hover:shadow-emerald-500/40 transition-all duration-300"
          aria-label="Open AI Construction Assistant"
        >
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500 border-2 border-white"></span>
          </span>
          {isOpen ? (
            <X className="w-6 h-6 text-white transition-transform duration-200" />
          ) : (
            <Bot className="w-7 h-7 text-white" />
          )}
        </motion.button>
      </div>

      {/* Main Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.92 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[94vw] sm:w-[420px] max-h-[85vh] sm:max-h-[640px] h-[600px] flex flex-col rounded-2xl bg-white dark:bg-navy-900 border border-gray-200 dark:border-navy-700 shadow-2xl overflow-hidden font-sans"
          >
            {/* Header */}
            <div className="px-4 py-3.5 bg-gradient-to-r from-emerald-800 via-navy-900 to-navy-950 text-white flex items-center justify-between border-b border-emerald-500/20 shadow-md">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-amber-500 flex items-center justify-center text-white shadow-inner">
                  <Bot className="w-6 h-6" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-navy-900"></span>
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-wide flex items-center gap-1.5">
                    Lamed AI Assistant
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      24/7
                    </span>
                  </h3>
                  <p className="text-[11px] text-gray-300 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    {language === 'am' ? 'ኦንላይን • አማርኛ & English' : 'Online • English & አማርኛ'}
                  </p>
                </div>
              </div>

              {/* Header Controls */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setLanguage(language === 'am' ? 'en' : 'am')}
                  className="px-2 py-1 text-xs rounded-lg bg-white/10 hover:bg-white/20 text-gray-200 transition-colors font-medium border border-white/10"
                  title="Switch Language"
                >
                  {language === 'am' ? 'EN' : 'አማ'}
                </button>
                <button
                  onClick={handleResetChat}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                  title="Restart conversation"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                  title="Close chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50/50 dark:bg-navy-950/40 text-sm">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`flex gap-2 max-w-[88%] ${m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <div
                      className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-xs font-semibold ${
                        m.sender === 'user'
                          ? 'bg-amber-500 text-white'
                          : 'bg-emerald-600 text-white shadow-sm'
                      }`}
                    >
                      {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    <div
                      className={`p-3.5 rounded-2xl ${
                        m.sender === 'user'
                          ? 'bg-gradient-to-br from-emerald-600 to-emerald-700 text-white rounded-tr-none shadow-md'
                          : 'bg-white dark:bg-navy-800 text-gray-800 dark:text-gray-100 rounded-tl-none border border-gray-200 dark:border-navy-700 shadow-sm'
                      }`}
                    >
                      <div className="text-[13px] leading-relaxed break-words">
                        {formatMessageContent(m.text)}
                      </div>
                      <span
                        className={`text-[10px] block mt-1 text-right ${
                          m.sender === 'user' ? 'text-emerald-200' : 'text-gray-400 dark:text-gray-400'
                        }`}
                      >
                        {m.timestamp}
                      </span>
                    </div>
                  </div>

                  {/* Optional In-Chat Lead Form */}
                  {m.showLeadForm && !leadSubmitted && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="w-[92%] mt-3 p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-amber-50/40 dark:from-navy-800 dark:to-navy-900 border border-emerald-200 dark:border-navy-700 shadow-md ml-9"
                    >
                      <div className="flex items-center gap-2 mb-2 text-emerald-800 dark:text-emerald-400 font-semibold text-xs uppercase tracking-wider">
                        <Building2 className="w-4 h-4" />
                        {language === 'am' ? 'የፕሮጀክት ማማከር ቅጽ' : 'Quick Project Consultation'}
                      </div>
                      <form onSubmit={handleLeadSubmit} className="space-y-2.5">
                        <input
                          type="text"
                          required
                          placeholder={language === 'am' ? 'ሙሉ ስምዎ' : 'Your Full Name'}
                          value={leadForm.name}
                          onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-navy-600 bg-white dark:bg-navy-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                        <input
                          type="text"
                          required
                          placeholder={language === 'am' ? 'ስልክ ቁጥር ወይም ኢሜይል' : 'Phone Number or Email'}
                          value={leadForm.phoneOrEmail}
                          onChange={(e) => setLeadForm({ ...leadForm, phoneOrEmail: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-navy-600 bg-white dark:bg-navy-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                        <select
                          value={leadForm.service}
                          onChange={(e) => setLeadForm({ ...leadForm, service: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-navy-600 bg-white dark:bg-navy-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        >
                          <option value="Residential Construction">Residential Villas / Apartments</option>
                          <option value="Commercial Buildings">Commercial Towers & Plazas</option>
                          <option value="Mixed-Use Developments">Mixed-Use Complex</option>
                          <option value="Interior Finishing">Interior Design & Finishing</option>
                          <option value="Renovation">Renovation & Retrofitting</option>
                        </select>
                        <button
                          type="submit"
                          disabled={isSubmittingLead}
                          className="w-full py-2 px-3 bg-gradient-to-r from-emerald-600 to-amber-600 hover:from-emerald-700 hover:to-amber-700 text-white rounded-lg font-medium text-xs shadow-md transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                        >
                          {isSubmittingLead ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <>
                              <span>{language === 'am' ? 'ቀጠሮ መያዝ' : 'Request Consultation'}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </>
                          )}
                        </button>
                      </form>
                    </motion.div>
                  )}

                  {/* Suggestion Chips */}
                  {m.suggestions && m.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2 ml-9 max-w-[85%]">
                      {m.suggestions.map((sug, sIdx) => (
                        <button
                          key={sIdx}
                          onClick={() => handleSendMessage(sug)}
                          className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100 dark:bg-navy-800 dark:hover:bg-navy-700 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-navy-600 transition-colors shadow-2xs"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Typing indicator */}
              {isLoading && (
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="p-3 bg-white dark:bg-navy-800 rounded-2xl rounded-tl-none border border-gray-200 dark:border-navy-700 flex items-center gap-1.5 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"></span>
                    <span
                      className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"
                      style={{ animationDelay: '0.15s' }}
                    ></span>
                    <span
                      className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"
                      style={{ animationDelay: '0.3s' }}
                    ></span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-white dark:bg-navy-900 border-t border-gray-200 dark:border-navy-700">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    language === 'am'
                      ? 'ስለ አገልግሎት፣ ዋጋ ወይም ፕሮጀክቶች ይጠይቁ...'
                      : 'Ask about services, costs, projects...'
                  }
                  className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-gray-100 dark:bg-navy-800 border border-transparent focus:border-emerald-500 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-amber-600 text-white hover:from-emerald-700 hover:to-amber-700 disabled:opacity-40 transition-all shadow-md flex items-center justify-center"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
              <div className="flex items-center justify-between mt-2 px-1 text-[10px] text-gray-400 dark:text-gray-400">
                <span>Lamed AI Construction Consultant</span>
                <span>Addis Ababa, Ethiopia</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
