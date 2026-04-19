import React, { useState } from 'react';
import { MessageSquare, Music, Send, ThumbsUp, Vote, User, Hash, HelpCircle, PlusCircle } from 'lucide-react';

const EventInteract = () => {
  const [feed, setFeed] = useState([
    { id: 1, user: "Rahul K.", time: "2m ago", text: "Does anyone know when the second half starts?", likes: 12, category: "Question" },
    { id: 2, user: "Priya S.", time: "5m ago", text: "The vibe here is incredible! Best match of the season! 🏟️✨", likes: 24, category: "Comment" },
    { id: 3, user: "Admin", time: "10m ago", text: "Welcome Fans! Use this space to interact and vote on our live polls.", likes: 156, category: "Announcement" }
  ]);

  const [polls, setPolls] = useState([
    {
      id: 101,
      question: "Which song should the DJ play next?",
      totalVotes: 1240,
      voted: false,
      options: [
        { id: 'a', label: 'Whistle Podu (Remix)', votes: 850 },
        { id: 'b', label: 'Vathi Coming', votes: 240 },
        { id: 'c', label: 'Naatu Naatu', votes: 150 }
      ]
    }
  ]);

  const [inputText, setInputText] = useState("");

  const handlePost = () => {
    if (!inputText.trim()) return;
    const newMessage = {
      id: Date.now(),
      user: "You",
      time: "Just now",
      text: inputText,
      likes: 0,
      category: "Comment"
    };
    setFeed([newMessage, ...feed]);
    setInputText("");
  };

  const handleVote = (pollId, optionId) => {
    setPolls(prevPolls => prevPolls.map(poll => {
      if (poll.id === pollId && !poll.voted) {
        return {
          ...poll,
          voted: true,
          totalVotes: poll.totalVotes + 1,
          options: poll.options.map(opt => 
            opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
          )
        };
      }
      return poll;
    }));
  };

  return (
    <div style={{ padding: '0 1rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeIn 0.4s ease-out' }}>
      
      {/* Active Polls Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Vote size={18} color="var(--primary)" /> Live Polls
        </h3>
        
        {polls.map(poll => (
          <div key={poll.id} style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '18px', padding: '1.2rem', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem' }}>
              <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '8px', borderRadius: '10px', color: 'var(--primary)' }}>
                <Music size={20} />
              </div>
              <div>
                <p style={{ fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{poll.question}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{poll.totalVotes.toLocaleString()} votes cast</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {poll.options.map(option => {
                const percentage = Math.round((option.votes / (poll.totalVotes || 1)) * 100);
                return (
                  <button 
                    key={option.id}
                    disabled={poll.voted}
                    onClick={() => handleVote(poll.id, option.id)}
                    style={{ 
                      position: 'relative', width: '100%', padding: '12px 16px', borderRadius: '12px', border: poll.voted ? 'none' : '1px solid var(--card-border)', 
                      background: 'var(--surface-subtle)', color: 'var(--text-main)', textAlign: 'left', cursor: poll.voted ? 'default' : 'pointer', overflow: 'hidden',
                      transition: 'all 0.3s'
                    }}
                  >
                    {/* Progress Bar Background */}
                    {poll.voted && (
                      <div style={{ position: 'absolute', inset: 0, width: `${percentage}%`, background: 'rgba(59, 130, 246, 0.2)', transition: 'width 1s ease-out' }}></div>
                    )}
                    
                    <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1 }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{option.label}</span>
                      {poll.voted && <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--primary)' }}>{percentage}%</span>}
                    </div>
                  </button>
                );
              })}
            </div>
            {poll.voted && (
              <p style={{ textAlign: 'center', fontSize: '0.7rem', color: 'var(--status-clear)', marginTop: '12px', fontWeight: '600' }}>✓ Thanks for voting!</p>
            )}
          </div>
        ))}
      </div>

      {/* Community Feed Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={18} color="var(--primary)" /> Community Feed
          </h3>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>4.2k active online</span>
        </div>

        {/* Input Bar */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '0.5rem' }}>
           <input 
             type="text" 
             value={inputText}
             onChange={(e) => setInputText(e.target.value)}
             onKeyPress={(e) => e.key === 'Enter' && handlePost()}
             placeholder="Discuss the match or ask a question..."
             style={{ flex: 1, padding: '12px 16px', borderRadius: '14px', border: '1px solid var(--card-border)', background: 'var(--surface-subtle)', color: 'var(--text-main)', fontSize: '0.85rem' }}
           />
           <button 
             onClick={handlePost}
             style={{ padding: '0 16px', background: 'var(--primary)', color: 'var(--text-inverse)', border: 'none', borderRadius: '14px', cursor: 'pointer' }}
           >
             <Send size={18} color="var(--text-inverse)" />
           </button>
        </div>

        {/* Feed Items */}
        {feed.map(item => (
          <div key={item.id} style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                 <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(45deg, var(--primary), #2dd4bf)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={14} color="var(--text-inverse)" />
                 </div>
                 <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{item.user}</span>
                 {item.category === 'Announcement' && (
                   <span style={{ padding: '2px 6px', background: 'rgba(59, 130, 246, 0.2)', color: 'var(--primary)', fontSize: '0.6rem', borderRadius: '4px', fontWeight: 'bold' }}>OFFICIAL</span>
                 )}
              </div>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{item.time}</span>
            </div>
            
            <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: '1.4' }}>{item.text}</p>
            
            <div style={{ display: 'flex', gap: '15px', marginTop: '4px' }}>
              <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                 <ThumbsUp size={12} /> {item.likes}
              </button>
              <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                 <MessageSquare size={12} /> Reply
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Floating Action Hint */}
      <div style={{ textAlign: 'center', padding: '1rem', opacity: 0.5 }}>
        <p style={{ fontSize: '0.7rem' }}>Be respectful to other fans. Happy cheering! 📣</p>
      </div>

    </div>
  );
};

export default EventInteract;
