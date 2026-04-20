import React, { useState } from 'react';
import { X, CreditCard, Smartphone, Check, ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';

export const FoodMenuModal = ({ stall, cart, setCart, onCheckout, onClose }) => {
  if (!stall) return null;

  const updateQuantity = (item, delta) => {
    setCart(prev => {
      const existingItem = prev.find(i => i.id === item.id);
      if (existingItem) {
        const newQuantity = Math.max(0, existingItem.quantity + delta);
        if (newQuantity === 0) {
          return prev.filter(i => i.id !== item.id);
        }
        return prev.map(i => i.id === item.id ? { ...i, quantity: newQuantity } : i);
      } else if (delta > 0) {
        return [...prev, { ...item, quantity: 1 }];
      }
      return prev;
    });
  };

  const getItemQuantity = (itemId) => {
    return cart.find(i => i.id === itemId)?.quantity || 0;
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 3000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div 
        style={{ 
          background: 'var(--bg-dark)', 
          width: '100%', 
          maxWidth: '500px', 
          borderTopLeftRadius: '24px', 
          borderTopRightRadius: '24px', 
          padding: '24px',
          maxHeight: '85vh',
          overflowY: 'auto',
          border: '1px solid var(--card-border)',
          boxShadow: '0 -10px 40px rgba(0,0,0,0.5)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-main)', margin: 0 }}>{stall.name}</h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Select items and quantities</p>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'var(--text-main)', padding: '8px', borderRadius: '50%' }}>
            <X size={24} />
          </button>
        </div>

        <div style={{ display: 'flex', gap: '16px', flexDirection: 'column', minHeight: '100px' }}>
          {stall.menu && stall.menu.length > 0 ? (
            stall.menu.map(item => {
              const qty = getItemQuantity(item.id);
              return (
                <div key={item.id} style={{ display: 'flex', gap: '16px', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '16px', border: '1px solid var(--card-border)', alignItems: 'center' }}>
                  <div style={{ fontSize: '2rem', background: 'rgba(255,255,255,0.05)', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px' }}>
                    {item.image}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-main)' }}>{item.name}</h4>
                    <p style={{ margin: '4px 0 0', fontWeight: 'bold', color: 'var(--primary)' }}>₹{item.price}</p>
                  </div>
                  
                  {qty > 0 ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--primary)', borderRadius: '10px', padding: '4px 8px' }}>
                      <button 
                        onClick={() => updateQuantity(item, -1)}
                        style={{ background: 'transparent', border: 'none', color: 'white', padding: '4px', cursor: 'pointer' }}
                      >
                        <Minus size={16} />
                      </button>
                      <span style={{ color: 'white', fontWeight: 'bold', minWidth: '20px', textAlign: 'center' }}>{qty}</span>
                      <button 
                        onClick={() => updateQuantity(item, 1)}
                        style={{ background: 'transparent', border: 'none', color: 'white', padding: '4px', cursor: 'pointer' }}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => updateQuantity(item, 1)}
                      style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '10px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                    >
                      <Plus size={16} /> Add
                    </button>
                  )}
                </div>
              );
            })
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 20px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px dashed var(--card-border)' }}>
              <ShoppingCart size={40} style={{ color: 'var(--text-muted)', marginBottom: '12px', opacity: 0.5 }} />
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>No menu items found for this stall.</p>
              <p style={{ color: 'var(--primary)', fontSize: '0.75rem', marginTop: '8px' }}>Admin hint: Please click "Seed Initial Data" in the Admin Settings to populate menus.</p>
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div style={{ marginTop: '30px', borderTop: '1px solid var(--card-border)', paddingTop: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShoppingCart size={20} /> Order Summary ({cart.reduce((s, i) => s + i.quantity, 0)})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px', maxHeight: '150px', overflowY: 'auto' }}>
              {cart.map((item) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', background: 'rgba(255,255,255,0.02)', padding: '8px 12px', borderRadius: '10px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ color: 'var(--text-main)', fontWeight: '500' }}>{item.name}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>₹{item.price} each</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ margin: 0, fontWeight: 'bold', color: 'var(--text-main)' }}>₹{item.price * item.quantity}</p>
                      <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-muted)' }}>Qty: {item.quantity}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--card-border)', paddingTop: '16px' }}>
              <div>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Grand Total</p>
                <p style={{ margin: 0, fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--text-main)' }}>₹{total}</p>
              </div>
              <button 
                onClick={onCheckout}
                style={{ background: 'var(--status-clear)', color: 'white', border: 'none', padding: '14px 32px', borderRadius: '16px', fontWeight: 'bold', fontSize: '1rem', boxShadow: '0 8px 16px rgba(16, 185, 129, 0.3)', cursor: 'pointer' }}
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const PaymentModal = ({ total, onConfirm, onClose }) => {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 3100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div 
        style={{ 
          background: 'var(--bg-dark)', 
          width: '100%', 
          maxWidth: '400px', 
          borderRadius: '24px', 
          padding: '24px',
          border: '1px solid var(--card-border)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ background: 'rgba(59, 130, 246, 0.1)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <CreditCard size={32} color="var(--primary)" />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--text-main)', margin: 0 }}>Secure Checkout</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Paying ₹{total} to Zentry Food Corner</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button 
            onClick={() => onConfirm('UPI')}
            style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%', padding: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--card-border)', borderRadius: '16px', color: 'var(--text-main)', textAlign: 'left', cursor: 'pointer' }}
          >
            <Smartphone size={24} />
            <div>
              <p style={{ margin: 0, fontWeight: 'bold' }}>UPI Payment</p>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>GPay, PhonePe, Paytm</p>
            </div>
            <Check size={20} style={{ marginLeft: 'auto', color: 'var(--status-clear)' }} />
          </button>

          <button 
            onClick={() => onConfirm('CARD')}
            style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%', padding: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--card-border)', borderRadius: '16px', color: 'var(--text-main)', textAlign: 'left', cursor: 'pointer' }}
          >
            <CreditCard size={24} />
            <div>
              <p style={{ margin: 0, fontWeight: 'bold' }}>Credit / Debit Card</p>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Visa, Mastercard, RuPay</p>
            </div>
          </button>
        </div>

        <button 
          onClick={onClose}
          style={{ width: '100%', marginTop: '24px', background: 'transparent', border: 'none', color: 'var(--text-muted)', fontWeight: '600', cursor: 'pointer' }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
