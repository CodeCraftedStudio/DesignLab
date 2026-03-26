import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Lock, LayoutTemplate, ShieldCheck, Mail, KeyRound, Smartphone, ArrowRight, Github } from 'lucide-react';
import { useDesignStore } from '@/store/useDesignStore';
import { ColorPickerInput } from '@/components/ui/ColorPickerInput';

export default function AuthTool() {
  const { colorRoles } = useDesignStore();
  const [pageType, setPageType] = useState('Sign In');
  const [layoutStyle, setLayoutStyle] = useState('Centered Card');
  const [showSocial, setShowSocial] = useState(true);
  const [showLogo, setShowLogo] = useState(true);

  const Sidebar = (
    <div className="flex flex-col gap-6 p-4 h-full overflow-y-auto">
      <div className="flex items-center gap-2 border-b border-border pb-2">
        <Lock size={16} className="text-primary" />
        <h2 className="font-display font-bold">Auth Designer</h2>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-muted-foreground">Flow Type</label>
          <div className="grid grid-cols-2 gap-2">
            {['Sign In', 'Sign Up', 'Forgot Password', 'OTP Verify'].map(t => (
              <button 
                key={t}
                onClick={() => setPageType(t)}
                className={`p-2 text-xs rounded border text-center transition-colors ${pageType === t ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-secondary border-border'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-muted-foreground">Layout Style</label>
          <div className="flex flex-col gap-2">
            {['Centered Card', 'Split Screen', 'Minimal'].map(l => (
              <button 
                key={l}
                onClick={() => setLayoutStyle(l)}
                className={`p-3 text-sm rounded-lg border text-left flex items-center gap-3 transition-colors ${layoutStyle === l ? 'bg-primary/10 border-primary text-primary' : 'bg-background hover:bg-secondary border-border'}`}
              >
                <LayoutTemplate size={16} />
                {l}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-border">
          <label className="flex items-center gap-3 text-sm cursor-pointer">
            <input type="checkbox" checked={showLogo} onChange={e => setShowLogo(e.target.checked)} className="accent-primary w-4 h-4 rounded" />
            Show Brand Logo
          </label>
          <label className="flex items-center gap-3 text-sm cursor-pointer">
            <input type="checkbox" checked={showSocial} onChange={e => setShowSocial(e.target.checked)} className="accent-primary w-4 h-4 rounded" />
            Include Social Login
          </label>
        </div>
      </div>
    </div>
  );

  const renderForm = () => {
    return (
      <div className="w-full max-w-sm flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {showLogo && (
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: colorRoles.primary }}>✦</div>
            <span className="font-display font-bold text-2xl" style={{ color: colorRoles.text }}>Brand</span>
          </div>
        )}
        
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-display font-bold" style={{ color: colorRoles.text }}>
            {pageType === 'Sign In' ? 'Welcome back' : 
             pageType === 'Sign Up' ? 'Create an account' : 
             pageType === 'Forgot Password' ? 'Reset password' : 'Check your email'}
          </h1>
          <p className="opacity-70 text-sm" style={{ color: colorRoles.text }}>
            {pageType === 'Sign In' ? 'Enter your details to access your account.' : 
             pageType === 'Sign Up' ? 'Start your 14-day free trial. No credit card required.' : 
             pageType === 'Forgot Password' ? 'We will send you a reset link.' : 'We sent a 6-digit code to your email.'}
          </p>
        </div>

        <form className="space-y-4" onSubmit={e => e.preventDefault()}>
          {(pageType === 'Sign In' || pageType === 'Sign Up' || pageType === 'Forgot Password') && (
            <div className="space-y-1">
              <label className="text-sm font-medium" style={{ color: colorRoles.text }}>Email address</label>
              <input 
                type="email" 
                placeholder="name@example.com" 
                className="w-full p-3 rounded-lg border bg-transparent outline-none transition-shadow"
                style={{ borderColor: colorRoles.border, color: colorRoles.text }}
                onFocus={(e) => e.target.style.boxShadow = `0 0 0 2px ${colorRoles.primary}40`}
                onBlur={(e) => e.target.style.boxShadow = 'none'}
              />
            </div>
          )}

          {(pageType === 'Sign In' || pageType === 'Sign Up') && (
            <div className="space-y-1">
              <label className="text-sm font-medium flex justify-between" style={{ color: colorRoles.text }}>
                Password
                {pageType === 'Sign In' && <span className="opacity-70 text-xs hover:underline cursor-pointer" style={{ color: colorRoles.primary }}>Forgot password?</span>}
              </label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full p-3 rounded-lg border bg-transparent outline-none transition-shadow"
                style={{ borderColor: colorRoles.border, color: colorRoles.text }}
                onFocus={(e) => e.target.style.boxShadow = `0 0 0 2px ${colorRoles.primary}40`}
                onBlur={(e) => e.target.style.boxShadow = 'none'}
              />
              {pageType === 'Sign Up' && (
                <div className="flex gap-1 mt-2">
                  <div className="h-1 flex-1 rounded-full" style={{ backgroundColor: colorRoles.primary }}></div>
                  <div className="h-1 flex-1 rounded-full" style={{ backgroundColor: colorRoles.primary }}></div>
                  <div className="h-1 flex-1 rounded-full" style={{ backgroundColor: colorRoles.border }}></div>
                  <div className="h-1 flex-1 rounded-full" style={{ backgroundColor: colorRoles.border }}></div>
                </div>
              )}
            </div>
          )}

          {pageType === 'OTP Verify' && (
            <div className="flex gap-2 justify-center my-4">
              {[1,2,3,4,5,6].map(i => (
                <input 
                  key={i} 
                  type="text" 
                  maxLength={1} 
                  className="w-12 h-14 text-center text-xl font-bold rounded-lg border bg-transparent outline-none"
                  style={{ borderColor: colorRoles.border, color: colorRoles.text }}
                  onFocus={(e) => e.target.style.borderColor = colorRoles.primary}
                  onBlur={(e) => e.target.style.borderColor = colorRoles.border}
                />
              ))}
            </div>
          )}

          <button 
            className="w-full p-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-transform hover:-translate-y-0.5"
            style={{ backgroundColor: colorRoles.primary, color: '#fff' }}
          >
            {pageType === 'Sign In' ? 'Sign In' : 
             pageType === 'Sign Up' ? 'Create Account' : 
             pageType === 'Forgot Password' ? 'Send Reset Link' : 'Verify Code'}
            <ArrowRight size={16} />
          </button>
        </form>

        {showSocial && (pageType === 'Sign In' || pageType === 'Sign Up') && (
          <div className="space-y-4">
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t" style={{ borderColor: colorRoles.border }}></div>
              <span className="flex-shrink-0 mx-4 text-xs opacity-50 uppercase tracking-wider" style={{ color: colorRoles.text }}>Or continue with</span>
              <div className="flex-grow border-t" style={{ borderColor: colorRoles.border }}></div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 p-2.5 rounded-lg border transition-colors" style={{ borderColor: colorRoles.border, color: colorRoles.text }} onMouseOver={e => e.currentTarget.style.backgroundColor = `${colorRoles.text}10`} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                <Github size={16} /> GitHub
              </button>
              <button className="flex items-center justify-center gap-2 p-2.5 rounded-lg border transition-colors" style={{ borderColor: colorRoles.border, color: colorRoles.text }} onMouseOver={e => e.currentTarget.style.backgroundColor = `${colorRoles.text}10`} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                <Mail size={16} /> Google
              </button>
            </div>
          </div>
        )}

        <div className="text-center text-sm opacity-80" style={{ color: colorRoles.text }}>
          {pageType === 'Sign In' ? "Don't have an account? " : "Already have an account? "}
          <span className="font-bold cursor-pointer hover:underline" style={{ color: colorRoles.primary }}>
            {pageType === 'Sign In' ? "Sign up" : "Sign in"}
          </span>
        </div>
      </div>
    );
  };

  return (
    <Layout sidebar={Sidebar}>
      <div className="h-full w-full transition-colors duration-500 flex" style={{ backgroundColor: colorRoles.background }}>
        
        {layoutStyle === 'Centered Card' && (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="p-8 md:p-12 rounded-3xl border shadow-2xl bg-white/5 backdrop-blur-xl relative overflow-hidden" style={{ borderColor: colorRoles.border, backgroundColor: colorRoles.surface }}>
              {/* Decorative blobs inside card */}
              <div className="absolute -top-20 -right-20 w-40 h-40 blur-3xl rounded-full opacity-20 pointer-events-none" style={{ backgroundColor: colorRoles.primary }}></div>
              <div className="absolute -bottom-20 -left-20 w-40 h-40 blur-3xl rounded-full opacity-10 pointer-events-none" style={{ backgroundColor: colorRoles.primary }}></div>
              {renderForm()}
            </div>
          </div>
        )}

        {layoutStyle === 'Minimal' && (
          <div className="flex-1 flex items-center justify-center p-8 bg-transparent">
            {renderForm()}
          </div>
        )}

        {layoutStyle === 'Split Screen' && (
          <>
            <div className="flex-1 hidden md:flex flex-col justify-between p-12 relative overflow-hidden" style={{ backgroundColor: colorRoles.surface, borderRight: `1px solid ${colorRoles.border}` }}>
              {/* Complex background element */}
              <div className="absolute inset-0 opacity-30" style={{ backgroundImage: `radial-gradient(circle at 20% 50%, ${colorRoles.primary}40 0%, transparent 50%), radial-gradient(circle at 80% 80%, ${colorRoles.primary}20 0%, transparent 50%)` }}></div>
              
              <div className="relative z-10 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: colorRoles.primary }}>✦</div>
                <span className="font-display font-bold text-xl" style={{ color: colorRoles.text }}>Brand</span>
              </div>
              
              <div className="relative z-10 max-w-md">
                <blockquote className="text-3xl font-display font-bold leading-tight mb-6" style={{ color: colorRoles.text }}>
                  "This design system tool saved us hundreds of hours. The components are beautiful and perfectly integrated."
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border-2" style={{ borderColor: colorRoles.primary, backgroundColor: `${colorRoles.primary}40` }}></div>
                  <div>
                    <div className="font-bold" style={{ color: colorRoles.text }}>Sarah Jenkins</div>
                    <div className="text-sm opacity-70" style={{ color: colorRoles.text }}>Lead Designer at TechCorp</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center p-8">
              {renderForm()}
            </div>
          </>
        )}

      </div>
    </Layout>
  );
}
