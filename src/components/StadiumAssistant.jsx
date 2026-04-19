import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, Languages, MessageSquare, MapPin, Coffee, Info, Activity, ShieldAlert, X } from 'lucide-react';

const StadiumAssistant = ({ zones, stalls, parkingLots, onClose, onNavigate }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I am your Smart Stadium Assistant. I can help you find exits, food, or check crowd status. How can I help you today?", sender: 'bot', lang: 'en' }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [language, setLanguage] = useState('en'); // en, ta, hi
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isTyping]);

  const responses = {
    en: {
      greeting: "Hello! I am your Smart Stadium Assistant. I can help you find exits, food, or check crowd status.",
      typing: "AI is thinking...",
      gate4: {
        text: "Gate 4 is located near the North Stand. It's currently CLEAR with no queue.",
        action: { label: "Navigate to Gate 4", dest: "Gate 4" }
      },
      exit: {
        text: "The nearest exit for your current location (Pavillion Stand) is Gate 2. It's about a 2-minute walk.",
        action: { label: "Show Exit Route", dest: "Gate 2" }
      },
      food: () => {
        const sorted = [...stalls].sort((a, b) => a.waitTime - b.waitTime);
        return {
          text: `The shortest queue for food is at "${sorted[0].name}" with just a ${sorted[0].waitTime} min wait.`,
          action: { label: `Go to ${sorted[0].name}`, dest: sorted[0].name }
        };
      },
      restroom: "Restrooms in Block C are currently busy (10 min wait). I recommend using the restrooms near Gate 5 which are currently empty.",
      crowd: () => {
        const congested = zones.filter(z => z.status === 'congested').length;
        return `Current stadium capacity is at 78%. ${congested > 0 ? `We noticed some crowding near ${zones.find(z => z.status === 'congested')?.name}.` : "All areas are flowing smoothly."}`;
      },
      default: "I'm sorry, I'm still learning. Try asking about 'Nearest Exit', 'Food queues', or 'Restrooms'."
    },
    ta: {
      greeting: "வணக்கம்! நான் உங்கள் மைதான உதவியாளர். வெளியேறும் வழிகள், உணவு அல்லது கூட்ட நெரிசலைப் பற்றி நான் உங்களுக்கு உதவ முடியும்.",
      typing: "AI யோசிக்கிறது...",
      gate4: {
        text: "கேட் 4 வடக்கு ஸ்டாண்டிற்கு அருகில் உள்ளது. இது தற்போது கூட்டமில்லாமல் உள்ளது.",
        action: { label: "கேட் 4-க்குச் செல்", dest: "Gate 4" }
      },
      exit: {
        text: "உங்கள் தற்போதைய இடத்திற்கு (Pavillion) அருகில் உள்ள வெளியேறும் வழி கேட் 2 ஆகும்.",
        action: { label: "வழியைப் பார்", dest: "Gate 2" }
      },
      food: () => {
        const sorted = [...stalls].sort((a, b) => a.waitTime - b.waitTime);
        return {
          text: `உணவுக்கான மிகக் குறுகிய வரிசை "${sorted[0].name}" இல் உள்ளது (${sorted[0].waitTime} நிமிடம்).`,
          action: { label: `${sorted[0].name}-க்கு செல்`, dest: sorted[0].name }
        };
      },
      restroom: "பிளாக் சி-யில் உள்ள கழிப்பறைகள் பிஸியாக உள்ளன. கேட் 5-க்கு அருகில் உள்ளதைப் பயன்படுத்தவும்.",
      crowd: "தற்போது மைதானம் 78% நிறைந்துள்ளது. அனைத்து பகுதிகளும் சீராக இயங்குகின்றன.",
      default: "மன்னிக்கவும், நான் இன்னும் கற்று வருகிறேன். 'வெளியேறும் வழி', 'உணவு வரிசை' பற்றி கேட்கவும்."
    },
    hi: {
      greeting: "नमस्ते! मैं आपका स्टेडियम सहायक हूँ। मैं आपको निकास, भोजन या भीड़ की स्थिति जानने में मदद कर सकता हूँ।",
      typing: "AI सोच रहा है...",
      gate4: {
        text: "गेट 4 नॉर्थ स्टैंड के पास स्थित है। वहां फिलहाल भीड़ नहीं है।",
        action: { label: "गेट 4 पर जाएं", dest: "Gate 4" }
      },
      exit: {
        text: "आपके वर्तमान स्थान (Pavillion) के लिए निकटतम निकास गेट 2 है।",
        action: { label: "रास्ता देखें", dest: "Gate 2" }
      },
      food: () => {
        const sorted = [...stalls].sort((a, b) => a.waitTime - b.waitTime);
        return {
          text: `फूड के लिए सबसे छोटी लाइन "${sorted[0].name}" पर है (${sorted[0].waitTime} मिनट)।`,
          action: { label: `${sorted[0].name} पर जाएं`, dest: sorted[0].name }
        };
      },
      restroom: "ब्लॉक सी में शौचालय व्यस्त हैं। गेट 5 के पास वाले शौचालय खाली हैं।",
      crowd: "स्टेडियम की क्षमता फिलहाल 78% है। स्थिति सामान्य है।",
      default: "क्षमा करें, मैं अभी सीख रहा हूँ। 'निकास' या 'भोजन' के बारे में पूछें।"
    }
  };

  const handleSend = (text = inputText) => {
    if (!text.trim()) return;

    const newMsg = { id: Date.now(), text, sender: 'user' };
    setMessages(prev => [...prev, newMsg]);
    setInputText("");
    setIsTyping(true);

    setTimeout(() => {
      let replyObj = { text: responses[language].default };
      const lowerText = text.toLowerCase();

      if (lowerText.includes('gate') || lowerText.includes('வழி')) replyObj = responses[language].gate4;
      else if (lowerText.includes('exit') || lowerText.includes('வெளியேற')) replyObj = responses[language].exit;
      else if (lowerText.includes('food') || lowerText.includes('உணவு') || lowerText.includes('खाना')) replyObj = typeof responses[language].food === 'function' ? responses[language].food() : responses[language].food;
      else if (lowerText.includes('restroom') || lowerText.includes('கழிப்பறை') || lowerText.includes('toilet')) replyObj = { text: responses[language].restroom };
      else if (lowerText.includes('crowd') || lowerText.includes('நேரிசல்') || lowerText.includes('भीड़')) replyObj = { text: typeof responses[language].crowd === 'function' ? responses[language].crowd() : responses[language].crowd };

      setMessages(prev => [...prev, { id: Date.now() + 1, ...replyObj, sender: 'bot' }]);
      setIsTyping(false);
    }, 1200);
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
    setMessages([{ id: Date.now(), text: responses[lang].greeting, sender: 'bot', lang }]);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 3000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }} onClick={onClose}>
      <div style={{ background: 'var(--bg-dark)', width: '100%', maxWidth: '450px', height: '85vh', borderRadius: '30px 30px 0 0', display: 'flex', flexDirection: 'column', overflow: 'hidden', borderTop: '1px solid var(--card-border)', boxShadow: '0 -20px 50px rgba(0,0,0,0.5)' }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ padding: '1.2rem', borderBottom: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'linear-gradient(135deg, var(--primary), #2dd4bf)', padding: '10px', borderRadius: '15px', color: '#fff', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)' }}>
              <Bot size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-main)' }}>Stadium AI Assistant</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                 <div style={{ width: '6px', height: '6px', background: 'var(--status-clear)', borderRadius: '50%' }}></div>
                 <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600' }}>ONLINE • MULTILINGUAL</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', padding: '10px', borderRadius: '12px', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
        </div>

        {/* Language Selector */}
        <div style={{ display: 'flex', gap: '8px', padding: '0.8rem 1.2rem', background: 'rgba(0,0,0,0.2)' }}>
          {['en', 'ta', 'hi'].map(lang => (
            <button 
              key={lang} 
              onClick={() => changeLanguage(lang)}
              style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '8px', border: '1px solid var(--card-border)', background: language === lang ? 'var(--primary)' : 'var(--surface-subtle)', color: language === lang ? 'var(--text-inverse)' : 'var(--text-main)', cursor: 'pointer', fontWeight: 'bold' }}
            >
              {lang === 'en' ? 'ENGLISH' : lang === 'ta' ? 'தமிழ்' : 'हिन्दी'}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 1.2rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {messages.map(msg => (
            <div key={msg.id} style={{ alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
              <div style={{ 
                padding: '12px 16px', 
                borderRadius: msg.sender === 'user' ? '20px 4px 20px 20px' : '4px 20px 20px 20px',
                background: msg.sender === 'user' ? 'var(--primary)' : 'var(--surface-subtle)',
                color: msg.sender === 'user' ? 'var(--text-inverse)' : 'var(--text-main)',
                fontSize: '0.9rem',
                lineHeight: '1.5',
                boxShadow: msg.sender === 'user' ? '0 4px 15px rgba(59, 130, 246, 0.3)' : 'none'
              }}>
                {msg.text}

                {/* Render Action Button if exists */}
                {msg.action && (
                  <button 
                    onClick={() => { onNavigate(msg.action.dest); onClose(); }}
                    style={{ marginTop: '12px', width: '100%', padding: '10px', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  >
                    <MapPin size={14} /> {msg.action.label}
                  </button>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div style={{ alignSelf: 'flex-start', color: 'var(--text-muted)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '4px' }}>
              <Activity size={14} className="pulse" /> {responses[language].typing}
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Quick Chips */}
        <div style={{ padding: '0 1.2rem 1rem 1.2rem', display: 'flex', gap: '8px', overflowX: 'auto', whiteSpace: 'nowrap', WebkitOverflowScrolling: 'touch' }}>
          {[
            { label: 'Nearest Exit?', icon: <ShieldAlert size={14} /> },
            { label: 'Food queue?', icon: <Coffee size={14} /> },
            { label: 'Gate 4?', icon: <MapPin size={14} /> },
            { label: 'Crowd status?', icon: <Activity size={14} /> }
          ].map(chip => (
            <button 
              key={chip.label}
              onClick={() => handleSend(chip.label)}
              style={{ padding: '8px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', color: 'var(--text-main)', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s' }}
            >
              {chip.icon} {chip.label}
            </button>
          ))}
        </div>

        {/* Input */}
        <div style={{ padding: '1.2rem', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="How can I help you?"
              style={{ flex: 1, padding: '14px 18px', borderRadius: '16px', border: '1px solid var(--card-border)', background: 'var(--surface-inner)', color: 'var(--text-main)', fontSize: '1rem', outline: 'none' }}
            />
            <button 
              onClick={() => handleSend()}
              style={{ padding: '14px', width: '54px', height: '54px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)' }}
            >
              <Send size={22} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StadiumAssistant;
