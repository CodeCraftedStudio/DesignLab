import React, { useState, useEffect, useRef, useCallback } from 'react';
import Layout from '@/components/Layout';
import {
  Code2, Play, Download, Copy, FileCode, Plus, X, Laptop, Smartphone,
  Tablet, Check, ChevronDown, Trash2, RotateCcw, Maximize, Minimize,
  Sun, Moon, Terminal as TerminalIcon, Eye, EyeOff, Zap, FolderDown
} from 'lucide-react';
import { useDesignStore } from '@/store/useDesignStore';
import JSZip from 'jszip';

/* ─── Types ─── */
interface FileTab {
  id: string;
  name: string;
  content: string;
  lang: 'html' | 'css' | 'javascript' | 'jsx';
}

interface Template {
  name: string;
  desc: string;
  icon: string;
  files: FileTab[];
}

interface Theme {
  id: string;
  name: string;
  author: string;
  description: string;
  icon: string;
  bg: string;
  fg: string;
  lineNo: string;
  activeLine: string;
  border: string;
  syntax: {
    tag: string;
    attr: string;
    string: string;
    comment: string;
    selector: string;
    prop: string;
    val: string;
    keyword: string;
    var: string;
    num: string;
    fn: string;
    bracket: string;
    operator: string;
  }
}

/* ─── Themes ─── */
const THEMES: Theme[] = [
  {
    id: 'one-dark',
    name: 'One Dark Pro',
    author: 'Binaryify',
    description: 'Iconic dark theme for Atom and VS Code',
    icon: '⚡',
    bg: '#282c34',
    fg: '#abb2bf',
    lineNo: '#4b5263',
    activeLine: '#2c313a',
    border: '#181a1f',
    syntax: {
      tag: '#e06c75',
      attr: '#d19a66',
      string: '#98c379',
      comment: '#5c6370',
      selector: '#e06c75',
      prop: '#61afef',
      val: '#98c379',
      keyword: '#c678dd',
      var: '#e5c07b',
      num: '#d19a66',
      fn: '#61afef',
      bracket: '#abb2bf',
      operator: '#56b6c2'
    }
  },
  {
    id: 'dracula',
    name: 'Dracula Official',
    author: 'Zeno Rocha',
    description: 'A dark theme for many editors, shells, and more',
    icon: '🧛',
    bg: '#282a36',
    fg: '#f8f8f2',
    lineNo: '#6272a4',
    activeLine: '#44475a',
    border: '#191a21',
    syntax: {
      tag: '#ff79c6',
      attr: '#50fa7b',
      string: '#f1fa8c',
      comment: '#6272a4',
      selector: '#ff79c6',
      prop: '#8be9fd',
      val: '#f1fa8c',
      keyword: '#ff79c6',
      var: '#8be9fd',
      num: '#bd93f9',
      fn: '#50fa7b',
      bracket: '#f8f8f2',
      operator: '#ff79c6'
    }
  },
  {
    id: 'monokai',
    name: 'Monokai',
    author: 'Monokai',
    description: 'The classic Monokai color scheme',
    icon: '🏝️',
    bg: '#272822',
    fg: '#f8f8f2',
    lineNo: '#90908a',
    activeLine: '#3e3d32',
    border: '#1e1f1c',
    syntax: {
      tag: '#f92672',
      attr: '#a6e22e',
      string: '#e6db74',
      comment: '#75715e',
      selector: '#f92672',
      prop: '#66d9ef',
      val: '#e6db74',
      keyword: '#f92672',
      var: '#a6e22e',
      num: '#ae81ff',
      fn: '#66d9ef',
      bracket: '#f8f8f2',
      operator: '#f92672'
    }
  },
  {
    id: 'github-dark',
    name: 'GitHub Dark',
    author: 'GitHub',
    description: 'GitHub\'s flagship dark theme',
    icon: '🐙',
    bg: '#0d1117',
    fg: '#c9d1d9',
    lineNo: '#484f58',
    activeLine: '#161b22',
    border: '#30363d',
    syntax: {
      tag: '#7ee787',
      attr: '#d2a8ff',
      string: '#a5d6ff',
      comment: '#8b949e',
      selector: '#7ee787',
      prop: '#79c0ff',
      val: '#a5d6ff',
      keyword: '#ff7b72',
      var: '#ffa657',
      num: '#79c0ff',
      fn: '#d2a8ff',
      bracket: '#c9d1d9',
      operator: '#ff7b72'
    }
  },
  {
    id: 'night-owl',
    name: 'Night Owl',
    author: 'Sarah Drasner',
    description: 'For the night owls out there',
    icon: '🦉',
    bg: '#011627',
    fg: '#d6deeb',
    lineNo: '#4b6479',
    activeLine: '#0b2942',
    border: '#010e1a',
    syntax: {
      tag: '#7fdbca',
      attr: '#addb67',
      string: '#ecc48d',
      comment: '#637777',
      selector: '#7fdbca',
      prop: '#82aaff',
      val: '#ecc48d',
      keyword: '#c792ea',
      var: '#addb67',
      num: '#f78c6c',
      fn: '#82aaff',
      bracket: '#d6deeb',
      operator: '#c792ea'
    }
  },
  {
    id: 'cobalt2',
    name: 'Cobalt2',
    author: 'Wes Bos',
    description: 'A official theme for her majesty',
    icon: '👑',
    bg: '#193549',
    fg: '#ffffff',
    lineNo: '#4b6479',
    activeLine: '#1f4662',
    border: '#152c3e',
    syntax: {
      tag: '#9effff',
      attr: '#ffc600',
      string: '#3ad900',
      comment: '#0088ff',
      selector: '#ffc600',
      prop: '#9effff',
      val: '#3ad900',
      keyword: '#ff9d00',
      var: '#ffc600',
      num: '#ff628c',
      fn: '#ffc600',
      bracket: '#ffffff',
      operator: '#ff9d00'
    }
  },
  {
    id: 'shades-of-purple',
    name: 'Shades of Purple',
    author: 'Ahmad Awais',
    description: 'Great purple theme for VS Code',
    icon: '🍇',
    bg: '#2d2b55',
    fg: '#ffffff',
    lineNo: '#a599e9',
    activeLine: '#1e1e3f',
    border: '#1a1a30',
    syntax: {
      tag: '#ff9d00',
      attr: '#fad000',
      string: '#a5ff90',
      comment: '#b362ff',
      selector: '#ff9d00',
      prop: '#9effff',
      val: '#a5ff90',
      keyword: '#ff9d00',
      var: '#fad000',
      num: '#ff628c',
      fn: '#fad000',
      bracket: '#ffffff',
      operator: '#ff9d00'
    }
  },
  {
    id: 'tokyo-night',
    name: 'Tokyo Night',
    author: 'Enki',
    description: 'A clean dark theme for VS Code',
    icon: '🗼',
    bg: '#1a1b26',
    fg: '#c0caf5',
    lineNo: '#3b4261',
    activeLine: '#292e42',
    border: '#15161e',
    syntax: {
      tag: '#f7768e',
      attr: '#e0af68',
      string: '#9ece6a',
      comment: '#565f89',
      selector: '#bb9af7',
      prop: '#7aa2f7',
      val: '#9ece6a',
      keyword: '#bb9af7',
      var: '#e0af68',
      num: '#ff9e64',
      fn: '#7aa2f7',
      bracket: '#c0caf5',
      operator: '#89ddff'
    }
  },
  {
    id: 'ayu-mirage',
    name: 'Ayu Mirage',
    author: 'Ayu',
    description: 'A smooth dark theme',
    icon: '🍣',
    bg: '#212733',
    fg: '#d9d7ce',
    lineNo: '#5c6773',
    activeLine: '#242936',
    border: '#191e2a',
    syntax: {
      tag: '#ed9366',
      attr: '#ffcc66',
      string: '#bae67e',
      comment: '#5c6773',
      selector: '#f07178',
      prop: '#5ccfe6',
      val: '#bae67e',
      keyword: '#ffa759',
      var: '#ffcc66',
      num: '#ffcc66',
      fn: '#ffd580',
      bracket: '#d9d7ce',
      operator: '#f07178'
    }
  },
  {
    id: 'nord',
    name: 'Nord',
    author: 'Arctic Ice Studio',
    description: 'An arctic, north-bluish clean color theme',
    icon: '❄️',
    bg: '#2e3440',
    fg: '#eceff4',
    lineNo: '#4c566a',
    activeLine: '#3b4252',
    border: '#232831',
    syntax: {
      tag: '#81a1c1',
      attr: '#8fbcbb',
      string: '#a3be8c',
      comment: '#616e88',
      selector: '#88c0d0',
      prop: '#81a1c1',
      val: '#a3be8c',
      keyword: '#81a1c1',
      var: '#d8dee9',
      num: '#b48ead',
      fn: '#88c0d0',
      bracket: '#eceff4',
      operator: '#81a1c1'
    }
  }
];

/* ─── Syntax Highlight (Class-based) ─── */
function highlightLogic(code: string, lang: string): string {
  if (!code) return ' ';
  let c = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  if (lang === 'html') {
    c = c.replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="syntax-comment">$1</span>');
    c = c.replace(/(=)(&quot;|")([^"&]*)(&quot;|")/g, (m, p1, p2, p3, p4) => `${p1}${p2}<span class="syntax-string">${p3}</span>${p4}`);
    c = c.replace(/(&lt;\/?)([\w-]+)/g, (m, p1, p2) => `${p1}<span class="syntax-tag">${p2}</span>`);
    c = c.replace(/([\w-]+)(?==)/g, '<span class="syntax-attr">$1</span>');
  } else if (lang === 'css') {
    c = c.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="syntax-comment">$1</span>');
    c = c.replace(/([^{,]+)(?=[^}]*\{)/g, '<span class="syntax-selector">$1</span>');
    c = c.replace(/([\w-]+)\s*(?=:)/g, '<span class="syntax-prop">$1</span>');
    c = c.replace(/(:)([^;{]+)(;|\})/g, (m, p1, p2, p3) => {
      const val = p2.replace(/(\d+)(px|rem|em|vh|vw|%|s|ms|deg)?/g, '<span class="syntax-num">$1</span><span class="syntax-keyword">$2</span>');
      return `${p1}<span class="syntax-val">${val}</span>${p3}`;
    });
  } else if (lang === 'javascript' || lang === 'jsx' || lang === 'tsx') {
    const strings: string[] = [];
    c = c.replace(/(["'`])(\\?.)*?\1/g, (m) => {
      strings.push(`<span class="syntax-string">${m}</span>`);
      return `__STR_${strings.length - 1}__`;
    });
    const comments: string[] = [];
    c = c.replace(/(\/\/.+$|\/\*[\s\S]*?\*\/)/gm, (m) => {
      comments.push(`<span class="syntax-comment">${m}</span>`);
      return `__COM_${comments.length - 1}__`;
    });
    c = c.replace(/(\.)(\w+)/g, '$1<span class="syntax-fn">$2</span>');
    c = c.replace(/\b(const|let|var|function|return|if|else|for|while|class|import|export|default|from|new|this|true|false|null|undefined|async|await|try|catch|throw|switch|case|break|continue|void|typeof|instanceof|yield|super|static|set|get|in|of|interface|type|enum)\b/g, '<span class="syntax-keyword">$1</span>');
    c = c.replace(/\b(document|window|console|Math|Date|JSON|Array|Object|String|Number|Boolean|Promise|Symbol|Map|Set|RegExp|Error|NaN|Infinity|Proxy|Reflect)\b/g, '<span class="syntax-var">$1</span>');
    c = c.replace(/\b(\d+\.?\d*|true|false|null|undefined)\b/g, (m) => m.includes('span') ? m : `<span class="syntax-num">${m}</span>`);
    c = c.replace(/\b(\w+)\s*(?=\()/g, '<span class="syntax-fn">$1</span>');
    c = c.replace(/([+\-*/%=!&|<>?:]+)/g, (m) => (m.includes('span') || m.includes('_')) ? m : `<span class="syntax-operator">${m}</span>`);
    c = c.replace(/([{}()\[\]])/g, '<span class="syntax-bracket">$1</span>');
    c = c.replace(/([,;])/g, '<span class="syntax-bracket" style="opacity:0.8">$1</span>');
    strings.forEach((s, i) => c = c.split(`__STR_${i}__`).join(s));
    comments.forEach((o, i) => c = c.split(`__COM_${i}__`).join(o));
  }
  return c;
}

function highlight(code: string, lang: string): string {
  const highlighted = highlightLogic(code, lang);
  return highlighted.split('\n').map((line) => `<div class="code-line">${line || ' '}</div>`).join('');
}

/* ─── Templates ─── */
const TEMPLATES: Template[] = [
  {
    name: 'Landing Hero', desc: 'Modern hero section with gradient CTA', icon: '🚀',
    files: [
      { id: 'index.html', name: 'index.html', lang: 'html', content: `<section class="hero">
  <div class="hero-badge">✨ New Release v2.0</div>
  <h1>Build Beautiful <span class="gradient-text">Interfaces</span></h1>
  <p class="subtitle">Create stunning web experiences with our modern design toolkit. Fast, accessible, and beautifully crafted.</p>
  <div class="cta-group">
    <button class="btn-primary" onclick="handleClick('start')">Get Started Free</button>
    <button class="btn-secondary" onclick="handleClick('docs')">View Docs →</button>
  </div>
  <div class="stats">
    <div class="stat"><span class="stat-value">50k+</span><span class="stat-label">Developers</span></div>
    <div class="stat"><span class="stat-value">99.9%</span><span class="stat-label">Uptime</span></div>
    <div class="stat"><span class="stat-value">4.9★</span><span class="stat-label">Rating</span></div>
  </div>
</section>` },
      { id: 'styles.css', name: 'styles.css', lang: 'css', content: `* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Inter', system-ui, sans-serif; background: #0a0a0f; color: #e2e2f0; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
.hero { text-align: center; padding: 60px 40px; max-width: 720px; }
.hero-badge { display: inline-block; padding: 6px 16px; background: rgba(99,102,241,.15); color: #818cf8; border-radius: 20px; font-size: 13px; font-weight: 600; margin-bottom: 24px; border: 1px solid rgba(99,102,241,.25); }
h1 { font-size: 52px; font-weight: 800; line-height: 1.1; margin-bottom: 20px; letter-spacing: -1.5px; }
.gradient-text { background: linear-gradient(135deg, #6366f1, #a78bfa, #f472b6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.subtitle { font-size: 18px; color: #8888a8; line-height: 1.6; margin-bottom: 36px; max-width: 540px; margin-left: auto; margin-right: auto; }
.cta-group { display: flex; gap: 12px; justify-content: center; margin-bottom: 48px; }
.btn-primary { padding: 14px 32px; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; border: none; border-radius: 10px; font-size: 15px; font-weight: 600; cursor: pointer; transition: all .2s; box-shadow: 0 4px 20px rgba(99,102,241,.4); }
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 30px rgba(99,102,241,.5); }
.btn-secondary { padding: 14px 32px; background: transparent; color: #c4c4d8; border: 1px solid #2a2a3e; border-radius: 10px; font-size: 15px; font-weight: 500; cursor: pointer; transition: all .2s; }
.btn-secondary:hover { border-color: #6366f1; color: #fff; }
.stats { display: flex; gap: 48px; justify-content: center; }
.stat { display: flex; flex-direction: column; gap: 4px; }
.stat-value { font-size: 24px; font-weight: 700; color: #fff; }
.stat-label { font-size: 13px; color: #6b6b88; }` },
      { id: 'script.js', name: 'script.js', lang: 'javascript', content: `function handleClick(type) {
  if (type === 'start') {
    document.querySelector('.hero-badge').textContent = '🎉 Welcome aboard!';
    document.querySelector('.hero-badge').style.background = 'rgba(34,197,94,.15)';
    document.querySelector('.hero-badge').style.color = '#4ade80';
    document.querySelector('.hero-badge').style.borderColor = 'rgba(34,197,94,.25)';
  } else {
    window.open('https://github.com', '_blank');
  }
  console.log('Button clicked:', type);
}

// Animate stats on load
document.querySelectorAll('.stat-value').forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(10px)';
  el.style.transition = 'all 0.5s ease';
  setTimeout(() => {
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
  }, 300 + i * 150);
});` },
    ]
  },
  {
    name: 'Dashboard Card', desc: 'Analytics card with chart', icon: '📊',
    files: [
      { id: 'index.html', name: 'index.html', lang: 'html', content: `<div class="card">
  <div class="card-header">
    <div>
      <h3 class="card-title">Revenue</h3>
      <p class="card-subtitle">Monthly earnings overview</p>
    </div>
    <span class="badge badge-success">+24.5%</span>
  </div>
  <div class="card-value">$48,352</div>
  <div class="chart" id="chart"></div>
  <div class="card-footer">
    <div class="footer-item">
      <span class="dot dot-blue"></span>
      <span>This month</span>
    </div>
    <div class="footer-item">
      <span class="dot dot-gray"></span>
      <span>Last month</span>
    </div>
  </div>
</div>` },
      { id: 'styles.css', name: 'styles.css', lang: 'css', content: `* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Inter', system-ui, sans-serif; background: #0f0f17; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
.card { background: #16161f; border: 1px solid #1e1e2e; border-radius: 16px; padding: 24px; width: 380px; color: #e2e2f0; box-shadow: 0 20px 60px rgba(0,0,0,.4); }
.card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; }
.card-title { font-size: 14px; font-weight: 600; color: #9898b0; }
.card-subtitle { font-size: 11px; color: #5c5c78; margin-top: 2px; }
.badge { padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; }
.badge-success { background: rgba(34,197,94,.12); color: #4ade80; }
.card-value { font-size: 36px; font-weight: 800; margin: 12px 0 20px; letter-spacing: -1px; }
.chart { display: flex; align-items: flex-end; gap: 6px; height: 100px; margin-bottom: 20px; }
.chart .bar { flex: 1; border-radius: 4px 4px 0 0; transition: all .3s; cursor: pointer; position: relative; }
.chart .bar:hover { opacity: .8; transform: scaleY(1.05); transform-origin: bottom; }
.card-footer { display: flex; gap: 20px; padding-top: 16px; border-top: 1px solid #1e1e2e; }
.footer-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #7878a0; }
.dot { width: 8px; height: 8px; border-radius: 50%; }
.dot-blue { background: #6366f1; }
.dot-gray { background: #3a3a50; }` },
      { id: 'script.js', name: 'script.js', lang: 'javascript', content: `const data = [40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 68];
const chart = document.getElementById('chart');

data.forEach((value, i) => {
  const bar = document.createElement('div');
  bar.className = 'bar';
  bar.style.height = value + '%';
  bar.style.background = i === 9 ? '#6366f1' : '#2a2a3e';
  bar.style.animationDelay = i * 50 + 'ms';
  
  bar.addEventListener('mouseenter', () => {
    bar.style.background = '#6366f1';
    console.log('Month ' + (i+1) + ': $' + (value * 48).toLocaleString());
  });
  bar.addEventListener('mouseleave', () => {
    if (i !== 9) bar.style.background = '#2a2a3e';
  });
  
  chart.appendChild(bar);
});` },
    ]
  },
  {
    name: 'Login Form', desc: 'Glassmorphic auth form', icon: '🔐',
    files: [
      { id: 'index.html', name: 'index.html', lang: 'html', content: `<div class="container">
  <div class="form-card">
    <div class="logo">◆</div>
    <h2>Welcome back</h2>
    <p class="desc">Sign in to your account</p>
    <form onsubmit="handleSubmit(event)">
      <div class="field">
        <label>Email</label>
        <input type="email" placeholder="you@example.com" id="email" required />
      </div>
      <div class="field">
        <label>Password</label>
        <input type="password" placeholder="••••••••" id="password" required />
      </div>
      <div class="options">
        <label class="checkbox"><input type="checkbox" /> Remember me</label>
        <a href="#" class="link">Forgot password?</a>
      </div>
      <button type="submit" class="btn-submit">Sign In</button>
    </form>
    <p class="footer-text">Don't have an account? <a href="#" class="link">Sign up</a></p>
  </div>
</div>` },
      { id: 'styles.css', name: 'styles.css', lang: 'css', content: `* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Inter', system-ui; background: linear-gradient(135deg, #0f0c29, #302b63, #24243e); min-height: 100vh; display: flex; align-items: center; justify-content: center; }
.container { position: relative; }
.container::before { content: ''; position: absolute; width: 200px; height: 200px; background: #6366f1; border-radius: 50%; top: -60px; left: -60px; filter: blur(80px); opacity: .5; }
.container::after { content: ''; position: absolute; width: 200px; height: 200px; background: #f472b6; border-radius: 50%; bottom: -60px; right: -60px; filter: blur(80px); opacity: .4; }
.form-card { position: relative; z-index: 1; background: rgba(255,255,255,.06); backdrop-filter: blur(24px); border: 1px solid rgba(255,255,255,.1); border-radius: 20px; padding: 40px; width: 400px; color: #e2e2f0; }
.logo { width: 48px; height: 48px; background: linear-gradient(135deg, #6366f1, #a78bfa); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; color: white; font-weight: 800; margin-bottom: 24px; }
h2 { font-size: 24px; font-weight: 700; margin-bottom: 6px; }
.desc { color: #8888a8; font-size: 14px; margin-bottom: 28px; }
.field { margin-bottom: 18px; }
label { display: block; font-size: 13px; font-weight: 500; color: #b0b0c8; margin-bottom: 6px; }
input[type="email"], input[type="password"] { width: 100%; padding: 12px 14px; background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.1); border-radius: 10px; color: #e2e2f0; font-size: 14px; outline: none; transition: border .2s; }
input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,.15); }
.options { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; font-size: 13px; }
.checkbox { display: flex; align-items: center; gap: 6px; color: #9898b0; cursor: pointer; }
.link { color: #818cf8; text-decoration: none; font-weight: 500; }
.link:hover { text-decoration: underline; }
.btn-submit { width: 100%; padding: 13px; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; border: none; border-radius: 10px; font-size: 15px; font-weight: 600; cursor: pointer; transition: all .2s; }
.btn-submit:hover { box-shadow: 0 6px 24px rgba(99,102,241,.4); transform: translateY(-1px); }
.footer-text { text-align: center; font-size: 13px; color: #7878a0; margin-top: 20px; }` },
      { id: 'script.js', name: 'script.js', lang: 'javascript', content: `function handleSubmit(e) {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const btn = document.querySelector('.btn-submit');
  btn.textContent = 'Signing in...';
  btn.style.opacity = '0.7';
  
  setTimeout(() => {
    btn.textContent = '✓ Welcome!';
    btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
    btn.style.opacity = '1';
    console.log('Signed in as:', email);
  }, 1500);
}` },
    ]
  },
  {
    name: 'Pricing Table', desc: 'Three-tier pricing cards', icon: '💰',
    files: [
      { id: 'index.html', name: 'index.html', lang: 'html', content: `<div class="pricing">
  <div class="plan">
    <h3>Starter</h3>
    <div class="price">$9<span>/mo</span></div>
    <ul>
      <li>✓ 5 Projects</li>
      <li>✓ 10GB Storage</li>
      <li>✓ Email Support</li>
      <li class="muted">✗ Custom Domain</li>
    </ul>
    <button class="btn" onclick="selectPlan('starter')">Choose Plan</button>
  </div>
  <div class="plan featured">
    <div class="popular">Most Popular</div>
    <h3>Professional</h3>
    <div class="price">$29<span>/mo</span></div>
    <ul>
      <li>✓ Unlimited Projects</li>
      <li>✓ 100GB Storage</li>
      <li>✓ Priority Support</li>
      <li>✓ Custom Domain</li>
    </ul>
    <button class="btn btn-featured" onclick="selectPlan('pro')">Choose Plan</button>
  </div>
  <div class="plan">
    <h3>Enterprise</h3>
    <div class="price">$79<span>/mo</span></div>
    <ul>
      <li>✓ Everything in Pro</li>
      <li>✓ 1TB Storage</li>
      <li>✓ 24/7 Support</li>
      <li>✓ SLA Guarantee</li>
    </ul>
    <button class="btn" onclick="selectPlan('enterprise')">Contact Sales</button>
  </div>
</div>` },
      { id: 'styles.css', name: 'styles.css', lang: 'css', content: `* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Inter', system-ui; background: #0a0a0f; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
.pricing { display: flex; gap: 16px; padding: 40px; }
.plan { background: #16161f; border: 1px solid #1e1e2e; border-radius: 16px; padding: 32px; width: 260px; color: #e2e2f0; position: relative; transition: transform .2s; }
.plan:hover { transform: translateY(-4px); }
.plan.featured { border-color: #6366f1; background: linear-gradient(180deg, #1a1a2e, #16161f); box-shadow: 0 0 40px rgba(99,102,241,.15); transform: scale(1.05); }
.plan.featured:hover { transform: scale(1.05) translateY(-4px); }
.popular { position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 4px 16px; border-radius: 12px; font-size: 11px; font-weight: 600; }
h3 { font-size: 18px; font-weight: 700; margin-bottom: 8px; }
.price { font-size: 42px; font-weight: 800; margin-bottom: 24px; letter-spacing: -2px; }
.price span { font-size: 16px; color: #6b6b88; font-weight: 400; letter-spacing: 0; }
ul { list-style: none; margin-bottom: 28px; }
li { padding: 8px 0; font-size: 14px; color: #b0b0c8; border-bottom: 1px solid #1e1e2e; }
li.muted { color: #4a4a60; }
.btn { width: 100%; padding: 12px; background: #1e1e2e; color: #c4c4d8; border: 1px solid #2a2a3e; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all .2s; }
.btn:hover { border-color: #6366f1; color: #fff; }
.btn-featured { background: linear-gradient(135deg, #6366f1, #8b5cf6); border: none; color: white; box-shadow: 0 4px 16px rgba(99,102,241,.3); }
.btn-featured:hover { box-shadow: 0 6px 24px rgba(99,102,241,.5); }` },
      { id: 'script.js', name: 'script.js', lang: 'javascript', content: `function selectPlan(plan) {
  const allBtns = document.querySelectorAll('.btn');
  allBtns.forEach(btn => { btn.textContent = btn.closest('.featured') ? 'Choose Plan' : btn.textContent; btn.style.background = ''; });
  
  event.target.textContent = '✓ Selected!';
  event.target.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
  console.log('Selected plan:', plan);
}` },
    ]
  },
  {
    name: 'Empty Project', desc: 'Start from scratch', icon: '📄',
    files: [
      { id: 'index.html', name: 'index.html', lang: 'html', content: `<div id="app">
  <h1>Hello World</h1>
  <p>Start building your component here.</p>
</div>` },
      { id: 'styles.css', name: 'styles.css', lang: 'css', content: `* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: 'Inter', system-ui, sans-serif;
  background: #0a0a0f;
  color: #e2e2f0;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

#app {
  text-align: center;
  padding: 40px;
}

h1 {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 12px;
}

p {
  color: #8888a8;
  font-size: 16px;
}` },
      { id: 'script.js', name: 'script.js', lang: 'javascript', content: `// Your JavaScript code here
console.log('Hello from DesignLab!');` },
    ]
  },
  {
    name: 'Animated Buttons', desc: '3D and glow effect buttons', icon: '✨',
    files: [
      { id: 'index.html', name: 'index.html', lang: 'html', content: `<div class="container">
  <button class="btn-3d">Push Me</button>
  <button class="btn-glow">Glow Pulse</button>
  <button class="btn-liquid">
    <span>Liquid Fill</span>
    <div class="liquid"></div>
  </button>
</div>` },
      { id: 'styles.css', name: 'styles.css', lang: 'css', content: `body { background: #050505; display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: 'Inter', sans-serif; }
.container { display: flex; flex-direction: column; gap: 30px; }
/* 3D Button */
.btn-3d { padding: 16px 40px; font-size: 18px; font-weight: 700; color: white; background: #6366f1; border: none; border-radius: 12px; cursor: pointer; position: relative; transition: all 0.1s; box-shadow: 0 8px 0 #4338ca, 0 15px 20px rgba(0,0,0,.3); }
.btn-3d:active { transform: translateY(4px); box-shadow: 0 4px 0 #4338ca, 0 8px 10px rgba(0,0,0,.3); }
/* Glow Button */
.btn-glow { padding: 16px 40px; font-size: 18px; font-weight: 600; color: #fff; background: #111; border: 1px solid #333; border-radius: 12px; cursor: pointer; position: relative; overflow: hidden; }
.btn-glow::before { content: ''; position: absolute; inset: -2px; background: linear-gradient(45deg, #ff0000, #ff7300, #fffb00, #48ff00, #00ffd5, #002bff, #7a00ff, #ff00c8, #ff0000); background-size: 400%; z-index: -1; filter: blur(5px); animation: glowing 20s linear infinite; opacity: 0; transition: opacity .3s ease-in-out; }
.btn-glow:hover::before { opacity: 1; }
@keyframes glowing { 0% { background-position: 0 0; } 50% { background-position: 400% 0; } 100% { background-position: 0 0; } }` },
      { id: 'script.js', name: 'script.js', lang: 'javascript', content: `console.log('Button animations loaded');` }
    ]
  },
  {
    name: 'Glass Header', desc: 'Premium glassmorphic navbar', icon: '💎',
    files: [
      { id: 'index.html', name: 'index.html', lang: 'html', content: `<nav class="navbar">
  <div class="logo">Studio<b>.</b></div>
  <div class="links">
    <a href="#">Projects</a>
    <a href="#">Services</a>
    <a href="#">About</a>
    <button class="btn-dark">Connect</button>
  </div>
</nav>
<main>
  <div class="blob"></div>
</main>` },
      { id: 'styles.css', name: 'styles.css', lang: 'css', content: `body { background: #0a0a0f; margin: 0; min-height: 200vh; color: white; font-family: 'Inter', sans-serif; overflow-x: hidden; }
.navbar { position: fixed; top: 20px; left: 50%; transform: translateX(-50%); width: 90%; max-width: 1000px; height: 64px; background: rgba(255,255,255,0.03); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; display: flex; align-items: center; justify-content: space-between; padding: 0 24px; z-index: 100; }
.logo { font-size: 20px; font-weight: 800; }
.logo b { color: #6366f1; }
.links { display: flex; align-items: center; gap: 32px; }
.links a { text-decoration: none; color: #aaa; font-size: 14px; font-weight: 500; transition: color .2s; }
.links a:hover { color: #fff; }
.btn-dark { background: #fff; color: #000; border: none; padding: 10px 20px; border-radius: 12px; font-weight: 600; font-size: 14px; cursor: pointer; }
.blob { position: absolute; width: 500px; height: 500px; background: #6366f1; border-radius: 50%; top: -100px; left: -100px; filter: blur(120px); opacity: 0.2; animation: move 20s infinite alternate; }
@keyframes move { from { transform: translate(0,0); } to { transform: translate(100vw, 50vh); } }` },
      { id: 'script.js', name: 'script.js', lang: 'javascript', content: `window.addEventListener('scroll', () => {
  const nav = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    nav.style.background = 'rgba(0,0,0,0.5)';
    nav.style.height = '72px';
  } else {
    nav.style.background = 'rgba(255,255,255,0.03)';
    nav.style.height = '64px';
  }
});` }
    ]
  },
  {
    name: 'Neon Button', icon: '💡', desc: 'Glowing neon effect',
    files: [
      { id: 'index.html', name: 'index.html', lang: 'html', content: `<div class="container">\n  <button class="neon-btn">NEON GLOW</button>\n</div>` },
      { id: 'styles.css', name: 'styles.css', lang: 'css', content: `.container { display: flex; justify-content: center; align-items: center; min-height: 200px; background: #050505; }\n.neon-btn { padding: 15px 35px; background: transparent; color: #03e9f4; font-size: 18px; font-weight: 700; text-transform: uppercase; border: 2px solid #03e9f4; border-radius: 10px; cursor: pointer; position: relative; overflow: hidden; transition: 0.5s; letter-spacing: 4px; }\n.neon-btn:hover { background: #03e9f4; color: #050801; box-shadow: 0 0 5px #03e9f4, 0 0 25px #03e9f4, 0 0 50px #03e9f4; }` },
      { id: 'script.js', name: 'script.js', lang: 'javascript', content: `console.log('Neon power on!');` }
    ]
  },
  {
    name: 'Modern Modal', icon: '🪟', desc: 'Animated modal window',
    files: [
      { id: 'index.html', name: 'index.html', lang: 'html', content: `<div class="modal-overlay">\n  <div class="modal-content">\n    <h3>Welcome Back!</h3>\n    <p>Please log in to continue.</p>\n    <button class="primary-btn">Sign In</button>\n  </div>\n</div>` },
      { id: 'styles.css', name: 'styles.css', lang: 'css', content: `.modal-overlay { width: 100%; height: 100%; background: rgba(0,0,0,0.7); backdrop-filter: blur(8px); display: flex; justify-content: center; align-items: center; }\n.modal-content { background: white; padding: 40px; border-radius: 24px; width: 320px; text-align: center; box-shadow: 0 20px 50px rgba(0,0,0,0.3); animation: modalIn 0.5s cubic-bezier(0.16, 1, 0.3, 1); }\n@keyframes modalIn { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }\nh3 { margin-bottom: 12px; font-size: 20px; color: #1a1a2e; }\n.primary-btn { width: 100%; padding: 12px; background: #6366f1; color: white; border: none; border-radius: 12px; font-weight: 600; cursor: pointer; }` },
      { id: 'script.js', name: 'script.js', lang: 'javascript', content: `console.log('Modal ready');` }
    ]
  },
  {
    name: 'Feature Grid', icon: '📐', desc: 'Sleek component showcase',
    files: [
      { id: 'index.html', name: 'index.html', lang: 'html', content: `<div class="feature-grid">\n  <div class="card">🚀 Fast</div>\n  <div class="card active">🔒 Secure</div>\n  <div class="card">🎨 Custom</div>\n</div>` },
      { id: 'styles.css', name: 'styles.css', lang: 'css', content: `.feature-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; padding: 40px; background: #fcfcfd; }\n.card { padding: 32px; background: white; border-radius: 20px; border: 1px solid #f1f1f5; text-align: center; font-weight: 600; }\n.card.active { border-color: #6366f1; background: #f5f3ff; }` },
      { id: 'script.js', name: 'script.js', lang: 'javascript', content: `console.log('Grid loaded');` }
    ]
  }
];

/* ─── Main Component ─── */
export default function CodeEditorTool() {
  const { colorRoles } = useDesignStore();
  
  // Persistent State
  const [files, setFiles] = useState<FileTab[]>(() => {
    const saved = localStorage.getItem('dl_editor_files');
    return saved ? JSON.parse(saved) : TEMPLATES[0].files;
  });
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('dl_editor_theme');
    if (saved) {
      const found = THEMES.find(t => t.id === saved);
      if (found) return found;
    }
    return THEMES[0];
  });

  const [activeFileId, setActiveFileId] = useState('index.html');
  const [autoRun, setAutoRun] = useState(true);
  const [previewContent, setPreviewContent] = useState('');
  const [previewSize, setPreviewSize] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showConsole, setShowConsole] = useState(true);
  const [consoleLogs, setConsoleLogs] = useState<{type: string; text: string}[]>([]);
  const [copied, setCopied] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showExtensions, setShowExtensions] = useState(true);
  const [darkPreview, setDarkPreview] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('dl_editor_files', JSON.stringify(files));
  }, [files]);

  useEffect(() => {
    localStorage.setItem('dl_editor_theme', currentTheme.id);
  }, [currentTheme]);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);

  const activeFile = files.find(f => f.id === activeFileId)!;

  const updateFileContent = (newContent: string) => {
    setFiles(prev => prev.map(f => f.id === activeFileId ? { ...f, content: newContent } : f));
  };

  const handleEditorScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    const { scrollTop, scrollLeft } = e.currentTarget;
    if (preRef.current) {
      preRef.current.scrollTop = scrollTop;
      preRef.current.scrollLeft = scrollLeft;
    }
    if (gutterRef.current) {
      gutterRef.current.scrollTop = scrollTop;
    }
  };

  const buildPreview = useCallback(() => {
    const htmlFile = files.find(f => f.lang === 'html')?.content || '';
    const cssFile = files.find(f => f.lang === 'css')?.content || '';
    const jsFile = files.find(f => f.lang === 'javascript' || f.lang === 'jsx')?.content || '';

    const doc = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<style>${cssFile}</style>
</head>
<body>
${htmlFile}
<script>
// Console proxy
(function(){
  const _log = console.log, _warn = console.warn, _error = console.error;
  function send(type, args) {
    const text = Array.from(args).map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ');
    window.parent.postMessage({ __console: true, type, text }, '*');
  }
  console.log = function() { send('log', arguments); _log.apply(console, arguments); };
  console.warn = function() { send('warn', arguments); _warn.apply(console, arguments); };
  console.error = function() { send('error', arguments); _error.apply(console, arguments); };
  window.onerror = function(msg, src, line) { send('error', ['Error: ' + msg + ' (line ' + line + ')']); };
})();
</script>
<script>${jsFile}</script>
</body>
</html>`;
    setPreviewContent(doc);
  }, [files]);

  // Listen to console messages from iframe
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data && e.data.__console) {
        setConsoleLogs(prev => [...prev.slice(-50), { type: e.data.type, text: e.data.text }]);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  // Auto-run
  useEffect(() => {
    if (!autoRun) return;
    const t = setTimeout(buildPreview, 400);
    return () => clearTimeout(t);
  }, [files, autoRun, buildPreview]);

  // Initial build
  useEffect(() => { buildPreview(); }, []);

  // Sync scroll

  const copyCode = () => {
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const formatCode = () => {
    let content = activeFile.content;
    let indent = 0;
    const lines = content.split('\n').map(line => line.trim());
    const formatted = lines.map(line => {
      if (line.match(/^[}\])]/) || line.match(/^<\//)) indent = Math.max(0, indent - 1);
      const res = '  '.repeat(indent) + line;
      if ((line.match(/[{\[(]$/) && !line.match(/[}\])]$/)) || (line.match(/<[^/!][^>]*>$/) && !line.match(/\/>$/))) indent++;
      return res;
    }).join('\n');
    updateFileContent(formatted);
  };

  const downloadZip = async () => {
    const zip = new JSZip();
    files.forEach(f => zip.file(f.name, f.content));
    // Also create a full index.html that links everything
    const htmlF = files.find(f => f.lang === 'html')?.content || '';
    const cssF = files.find(f => f.lang === 'css')?.content || '';
    const jsF = files.find(f => f.lang === 'javascript' || f.lang === 'jsx')?.content || '';
    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>DesignLab Export</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  ${htmlF}
  <script src="script.js"></script>
</body>
</html>`;
    zip.file('full-page.html', fullHtml);
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'designlab-export.zip'; a.click();
    URL.revokeObjectURL(url);
  };

  const loadTemplate = (t: Template) => {
    setFiles(t.files.map(f => ({ ...f })));
    setActiveFileId(t.files[0].id);
    setConsoleLogs([]);
    // REMOVED AUTO-COLLAPSE
    setTimeout(buildPreview, 100);
  };

  const addFile = () => {
    const name = prompt('File name (e.g., utils.js):');
    if (!name) return;
    const ext = name.split('.').pop() || 'html';
    const lang = ext === 'css' ? 'css' : ext === 'js' ? 'javascript' : ext === 'jsx' || ext === 'tsx' ? 'jsx' : 'html';
    const nf: FileTab = { id: name, name, content: `// ${name}\n`, lang: lang as FileTab['lang'] };
    setFiles(prev => [...prev, nf]);
    setActiveFileId(name);
  };

  const resetWorkspace = () => {
    if (confirm('Reset workspace to default? This will delete all current files.')) {
      setFiles(TEMPLATES[0].files);
      setActiveFileId('index.html');
      localStorage.removeItem('dl_editor_files');
    }
  };

  const deleteFile = (id: string) => {
    if (files.length <= 1) return;
    setFiles(prev => prev.filter(f => f.id !== id));
    if (activeFileId === id) setActiveFileId(files[0].id === id ? files[1].id : files[0].id);
  };

  const pw = previewSize === 'desktop' ? '100%' : previewSize === 'tablet' ? '768px' : '375px';

  const langColors: Record<string, string> = { html: '#e06c75', css: '#61afef', javascript: '#e5c07b', jsx: '#c678dd' };
  const langIcons: Record<string, string> = { 
    html: 'https://img.icons8.com/color/48/html-5--v1.png', 
    css: 'https://img.icons8.com/color/48/css3.png', 
    javascript: 'https://img.icons8.com/color/48/javascript--v1.png',
    jsx: 'https://img.icons8.com/color/48/react-native.png'
  };

  /* ─── SIDEBAR ─── */
  const Sidebar = (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--surface)' }}>
      <div style={{ padding: 20, borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Code2 size={16} style={{ color: 'var(--accent)' }} />
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--text)', margin: 0 }}>Code Studio</h2>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={buildPreview} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '8px 0', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}><Play size={13}/> Run</button>
          <button onClick={downloadZip} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, padding: '8px 12px', background: 'var(--surface2)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer' }} title="Download ZIP"><FolderDown size={13}/></button>
          <button onClick={resetWorkspace} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, padding: '8px 12px', background: 'var(--surface2)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer' }} title="Reset Workspace"><Trash2 size={13}/></button>
        </div>
      </div>

      {/* File Explorer (NOW AT TOP) */}
      <div style={{ padding: 12, borderBottom: '1px solid var(--border)', maxHeight: '40%', overflow: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, padding: '0 4px' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Files</span>
          <button onClick={addFile} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 2 }}><Plus size={14}/></button>
        </div>
        {files.map(f => (
          <div key={f.id} onClick={() => setActiveFileId(f.id)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 8, cursor: 'pointer', marginBottom: 2, background: activeFileId === f.id ? 'var(--accent-soft)' : 'transparent', color: activeFileId === f.id ? 'var(--accent)' : 'var(--text)' }}>
            <img src={langIcons[f.lang] || 'https://img.icons8.com/color/48/code.png'} alt={f.lang} style={{ width: 14, height: 14, flexShrink: 0 }} />
            <span style={{ flex: 1, fontSize: 13, fontWeight: activeFileId === f.id ? 600 : 400 }}>{f.name}</span>
            {files.length > 1 && <button onClick={(e) => { e.stopPropagation(); deleteFile(f.id); }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', opacity: 0.5, padding: 0 }}><X size={12}/></button>}
          </div>
        ))}
      </div>

      {/* Templates */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
        <button onClick={() => setShowTemplates(!showTemplates)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 11, fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: 1, padding: 0 }}>
          Templates <ChevronDown size={12} style={{ transform: showTemplates ? 'rotate(180deg)' : 'none', transition: '.2s' }}/>
        </button>
        {showTemplates && (
          <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {TEMPLATES.map(t => (
              <button key={t.name} onClick={() => loadTemplate(t)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer', textAlign: 'left', color: 'var(--text)', fontSize: 12, width: '100%' }}>
                <span style={{ fontSize: 16 }}>{t.icon}</span>
                <div><div style={{ fontWeight: 600 }}>{t.name}</div><div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{t.desc}</div></div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* VS Code Extensions / Themes */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
          <button onClick={() => setShowExtensions(!showExtensions)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 10, fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: 1.5, padding: 0 }}>
            Extensions <ChevronDown size={12} style={{ transform: showExtensions ? 'rotate(180deg)' : 'none', transition: '.2s' }}/>
          </button>
        </div>
        {showExtensions && (
          <div style={{ padding: '12px 20px', overflow: 'auto', flex: 1 }}>
            <div style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 700, marginBottom: 16, letterSpacing: 1 }}>INSTALLED THEMES</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {THEMES.map(theme => (
                <div key={theme.id} onClick={() => setCurrentTheme(theme)} 
                  style={{ 
                    display: 'flex', flexDirection: 'column', padding: '14px 16px', 
                    background: currentTheme.id === theme.id ? `${theme.syntax.keyword}15` : 'rgba(255,255,255,0.03)', 
                    border: `1px solid ${currentTheme.id === theme.id ? theme.syntax.keyword : 'rgba(255,255,255,0.1)'}`, 
                    borderRadius: 12, cursor: 'pointer', width: '100%', transition: 'all .2s',
                    position: 'relative'
                  }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <div style={{ width: 24, height: 24, borderRadius: 6, background: theme.bg, border: `1px solid ${theme.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>{theme.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 13, color: currentTheme.id === theme.id ? theme.syntax.keyword : 'var(--text)' }}>{theme.name}</div>
                      <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>{theme.author}</div>
                    </div>
                  </div>
                  
                  {/* Syntax Palette Preview */}
                  <div style={{ display: 'flex', gap: 5, padding: '4px 0' }}>
                    {[theme.syntax.keyword, theme.syntax.string, theme.syntax.fn, theme.syntax.tag, theme.syntax.num].map((c, i) => (
                      <div key={i} style={{ width: 14, height: 14, borderRadius: 4, background: c, border: `1px solid rgba(0,0,0,0.3)` }} />
                    ))}
                  </div>

                  {currentTheme.id === theme.id && (
                    <div style={{ position: 'absolute', top: 0, right: 0, background: theme.syntax.keyword, color: theme.bg, fontSize: 8, fontWeight: 800, padding: '2px 6px', borderBottomLeftRadius: 6, textTransform: 'uppercase' }}>Active</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{ flex: 1 }} />

      {/* Options */}
      <div style={{ padding: 12, borderTop: '1px solid var(--border)' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-muted)', cursor: 'pointer', marginBottom: 6 }}>
          <input type="checkbox" checked={autoRun} onChange={e => setAutoRun(e.target.checked)} style={{ accentColor: 'var(--accent)' }} />
          <Zap size={12}/> Auto-run (400ms)
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-muted)', cursor: 'pointer' }}>
          <input type="checkbox" checked={showConsole} onChange={e => setShowConsole(e.target.checked)} style={{ accentColor: 'var(--accent)' }} />
          <TerminalIcon size={12}/> Show Console
        </label>
      </div>
    </div>
  );

  /* ─── MAIN LAYOUT ─── */
  return (
    <Layout sidebar={Sidebar} noFrame={true}>
      <div style={{ 
        display: 'flex', height: '100%', flexDirection: isFullscreen ? 'column' : 'row', 
        background: currentTheme.bg,
        overflow: 'hidden', 
        borderTop: `1px solid ${currentTheme.syntax.keyword}44`, // Subtle theme-colored top border
        '--syntax-tag': currentTheme.syntax.tag,
        '--syntax-attr': currentTheme.syntax.attr,
        '--syntax-string': currentTheme.syntax.string,
        '--syntax-comment': currentTheme.syntax.comment,
        '--syntax-selector': currentTheme.syntax.selector,
        '--syntax-prop': currentTheme.syntax.prop,
        '--syntax-val': currentTheme.syntax.val,
        '--syntax-keyword': currentTheme.syntax.keyword,
        '--syntax-var': currentTheme.syntax.var,
        '--syntax-num': currentTheme.syntax.num,
        '--syntax-fn': currentTheme.syntax.fn,
        '--syntax-bracket': currentTheme.syntax.bracket,
        '--syntax-operator': currentTheme.syntax.operator,
      } as any}>
        {/* Editor Pane */}
        {!isFullscreen && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRight: `1px solid ${currentTheme.border}`, minWidth: 0 }}>
            {/* File tabs */}
            <div style={{ height: 38, background: currentTheme.activeLine, borderBottom: `1px solid ${currentTheme.border}`, display: 'flex', alignItems: 'center', padding: '0 4px', overflow: 'auto', flexShrink: 0, gap: 1 }}>
              {files.map(f => (
                <button key={f.id} onClick={() => setActiveFileId(f.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', fontSize: 12, fontFamily: 'var(--font-mono)', cursor: 'pointer', border: 'none', borderTop: `2px solid ${activeFileId === f.id ? langColors[f.lang] || currentTheme.syntax.keyword : 'transparent'}`, background: activeFileId === f.id ? currentTheme.bg : 'transparent', color: activeFileId === f.id ? currentTheme.fg : currentTheme.lineNo, whiteSpace: 'nowrap' }}>
                  <img src={langIcons[f.lang] || 'https://img.icons8.com/color/48/code.png'} alt={f.lang} style={{ width: 14, height: 14, flexShrink: 0 }} />
                  {f.name}
                </button>
              ))}
              <div style={{ flex: 1 }} />
              <button onClick={formatCode} title="Format code (Prettier)" style={{ background: 'none', border: 'none', color: currentTheme.lineNo, cursor: 'pointer', padding: '4px 8px', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Zap size={14}/>
                <span style={{ fontSize: 10, fontWeight: 600 }}>Format</span>
              </button>
              <button onClick={copyCode} title="Copy code" style={{ background: 'none', border: 'none', color: copied ? '#4ade80' : currentTheme.lineNo, cursor: 'pointer', padding: '4px 8px' }}>
                {copied ? <Check size={14}/> : <Copy size={14}/>}
              </button>
            </div>

            {/* Code Editor Container */}
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: currentTheme.bg, display: 'flex' }}>

              {/* Editor Workspace */}
              <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                {/* Line Number Gutter (Z-indexed above code) */}

                <textarea
                  ref={editorRef}
                  value={activeFile.content}
                  onChange={e => updateFileContent(e.target.value)}
                  onScroll={handleEditorScroll}
                  onKeyDown={e => {
                    if (e.key === 'Tab') {
                      e.preventDefault();
                      const s = e.currentTarget.selectionStart;
                      const v = activeFile.content;
                      updateFileContent(v.substring(0, s) + '  ' + v.substring(e.currentTarget.selectionEnd));
                      requestAnimationFrame(() => { e.currentTarget.selectionStart = e.currentTarget.selectionEnd = s + 2; });
                    }
                  }}
                  spellCheck={false}
                  autoCapitalize="off"
                  autoComplete="off"
                  autoCorrect="off"
                   style={{ 
                    position: 'absolute', 
                    inset: 0, 
                    width: '100%', 
                    height: '100%', 
                    background: 'transparent', 
                    color: 'transparent', 
                    caretColor: currentTheme.fg, 
                    padding: '12px 16px 12px 64px', // Standardized padding for alignment
                    fontFamily: '"Fira Code", "JetBrains Mono", Consolas, monospace', 
                    fontSize: 13, 
                    lineHeight: '22px', 
                    resize: 'none', 
                    outline: 'none', 
                    border: 'none', 
                    zIndex: 2, 
                    tabSize: 2, 
                    whiteSpace: 'pre-wrap', 
                    wordBreak: 'break-word',
                    overflowX: 'hidden',
                    overflowY: 'auto' 
                  }}
                />
                <pre
                  ref={preRef}
                  aria-hidden="true"
                  style={{ 
                    position: 'absolute', 
                    inset: 0, 
                    width: '100%', 
                    height: '100%', 
                    background: 'transparent', 
                    padding: '12px 16px 12px 64px', // Standardized for alignment
                    fontFamily: '"Fira Code", "JetBrains Mono", Consolas, monospace', 
                    fontSize: 13, 
                    lineHeight: '22px', 
                    margin: 0, 
                    pointerEvents: 'none', 
                    color: currentTheme.fg, 
                    whiteSpace: 'pre-wrap', 
                    wordBreak: 'break-word',
                    overflow: 'hidden', 
                    tabSize: 2,
                    counterReset: 'line', // Start line numbering from 1
                  }}
                >
                  <style>{`
                    .code-line { position: relative; counter-increment: line; }
                    .code-line::before {
                      content: counter(line);
                      position: absolute;
                      left: -50px;
                      width: 40px;
                      text-align: right;
                      color: ${currentTheme.lineNo};
                      font-size: 11px;
                      opacity: 0.5;
                      user-select: none;
                      pointer-events: none;
                    }
                    .syntax-comment { color: ${currentTheme.syntax.comment}; font-style: italic; }
                    .syntax-string { color: ${currentTheme.syntax.string}; }
                    .syntax-tag { color: ${currentTheme.syntax.tag}; }
                    .syntax-attr { color: ${currentTheme.syntax.attr}; }
                    .syntax-selector { color: ${currentTheme.syntax.selector}; }
                    .syntax-prop { color: ${currentTheme.syntax.prop}; }
                    .syntax-val { color: ${currentTheme.syntax.val}; }
                    .syntax-keyword { color: ${currentTheme.syntax.keyword}; }
                    .syntax-var { color: ${currentTheme.syntax.var}; }
                    .syntax-num { color: ${currentTheme.syntax.num}; }
                    .syntax-fn { color: ${currentTheme.syntax.fn}; }
                    .syntax-bracket { color: ${currentTheme.syntax.bracket}; }
                    .syntax-operator { color: ${currentTheme.syntax.operator}; }
                  `}</style>
                  <code dangerouslySetInnerHTML={{ __html: highlight(activeFile.content || ' ', activeFile.lang) }} />
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Preview Pane */}
        <div style={{ flex: isFullscreen ? undefined : 1, display: 'flex', flexDirection: 'column', minWidth: 0, height: isFullscreen ? '100%' : undefined }}>
          {/* Preview Toolbar */}
          <div style={{ height: 38, background: '#16161f', borderBottom: '1px solid #1e1e2e', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Eye size={13} style={{ color: '#6b6b88' }}/>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#e2e2f0' }}>Preview</span>
              {/* Device toggle */}
              <div style={{ display: 'flex', gap: 2, background: '#0d0d14', borderRadius: 6, padding: 2, marginLeft: 8 }}>
                {([['desktop', Laptop], ['tablet', Tablet], ['mobile', Smartphone]] as const).map(([key, Icon]) => (
                  <button key={key} onClick={() => setPreviewSize(key)} style={{ padding: '3px 8px', borderRadius: 4, border: 'none', cursor: 'pointer', background: previewSize === key ? '#2a2a3e' : 'transparent', color: previewSize === key ? '#e2e2f0' : '#4a4a60', display: 'flex', alignItems: 'center' }}>
                    <Icon size={12}/>
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              <button onClick={() => { setConsoleLogs([]); buildPreview(); }} title="Refresh" style={{ background: 'none', border: 'none', color: '#6b6b88', cursor: 'pointer', padding: 4 }}><RotateCcw size={13}/></button>
              <button onClick={() => setIsFullscreen(!isFullscreen)} title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'} style={{ background: 'none', border: 'none', color: '#6b6b88', cursor: 'pointer', padding: 4 }}>
                {isFullscreen ? <Minimize size={13}/> : <Maximize size={13}/>}
              </button>
            </div>
          </div>

          {/* Preview Content */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', background: darkPreview ? '#1a1a24' : '#f0f0f4', overflow: 'auto', position: 'relative' }}>
            <div style={{ width: pw, maxWidth: '100%', height: '100%', transition: 'width .3s', position: 'relative', boxShadow: previewSize !== 'desktop' ? '0 0 40px rgba(0,0,0,.3)' : 'none' }}>
              <iframe
                srcDoc={previewContent}
                title="preview"
                sandbox="allow-scripts allow-modals"
                style={{ width: '100%', height: '100%', border: 'none', background: '#fff' }}
              />
            </div>
          </div>

          {/* Console */}
          {showConsole && (
            <div style={{ height: 140, background: '#0d0d14', borderTop: '1px solid #1e1e2e', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 12px', borderBottom: '1px solid #1a1a28' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <TerminalIcon size={12} style={{ color: '#6b6b88' }}/>
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#9898b0' }}>Console</span>
                  {consoleLogs.length > 0 && <span style={{ fontSize: 9, padding: '1px 6px', background: '#2a2a3e', borderRadius: 8, color: '#6b6b88' }}>{consoleLogs.length}</span>}
                </div>
                <button onClick={() => setConsoleLogs([])} style={{ background: 'none', border: 'none', color: '#4a4a60', cursor: 'pointer', fontSize: 10, fontWeight: 600 }}>Clear</button>
              </div>
              <div style={{ flex: 1, overflow: 'auto', padding: '6px 12px', fontFamily: 'var(--font-mono)', fontSize: 11 }}>
                {consoleLogs.length === 0 && <div style={{ color: '#3a3a50', fontStyle: 'italic', paddingTop: 8 }}>Console output will appear here...</div>}
                {consoleLogs.map((log, i) => (
                  <div key={i} style={{ padding: '3px 0', color: log.type === 'error' ? '#f87171' : log.type === 'warn' ? '#fbbf24' : '#a7a7c0', borderBottom: '1px solid #141420', display: 'flex', gap: 8 }}>
                    <span style={{ color: '#3a3a50', flexShrink: 0, userSelect: 'none' }}>&gt;</span>
                    <span style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{log.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
