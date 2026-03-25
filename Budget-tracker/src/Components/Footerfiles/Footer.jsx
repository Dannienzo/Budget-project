import React from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, Facebook, Linkedin, Youtube, Instagram, Twitter } from "lucide-react";

const pages = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/About' },
  { label: 'Pricing', to: '/Pricing' },
  { label: 'Blog', to: '/Blog' },
]

const dashboard = ['Overview', 'Transactions', 'Reports']

const socials = [Facebook, Linkedin, Youtube, Instagram, Twitter]

function Footer() {
  return (
    <footer className="bg-black text-white pt-12 font-sans">
      <div className="max-w-6xl mx-auto px-6">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">

          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <DollarSign size={28} color="#00ffb2" />
              <h5 className="font-bold text-lg tracking-wide">SMART BUDGETING</h5>
            </div>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              Design amazing digital experiences that help you manage your finances and keep your wallet safe.
            </p>
            <div className="flex gap-4 text-white/60">
              {socials.map((Icon, i) => (
                <Icon
                  key={i}
                  size={18}
                  className="hover:text-primary cursor-pointer transition-colors"
                />
              ))}
            </div>
          </div>

          {/* Pages */}
          <div>
            <h6 className="font-semibold text-white mb-4 uppercase tracking-widest text-xs">Pages</h6>
            <ul className="flex flex-col gap-2">
              {pages.map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-white/60 hover:text-primary transition-colors text-sm"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Dashboard */}
          <div>
            <h6 className="font-semibold text-white mb-4 uppercase tracking-widest text-xs">Dashboard</h6>
            <ul className="flex flex-col gap-2">
              {dashboard.map((item) => (
                <li
                  key={item}
                  className="text-white/60 hover:text-primary transition-colors text-sm cursor-pointer"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 py-5 text-center">
          <p className="text-white/40 text-sm">
            &copy; {new Date().getFullYear()} — Project by Ramsey
          </p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;