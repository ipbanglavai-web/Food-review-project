import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Contact: React.FC = () => {
  const { settings } = useApp();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  return (
    <div className="bg-neutral-50 min-h-screen py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        <div className="text-center space-y-4 mb-16">
          <span className="text-red-600 font-black tracking-widest uppercase text-xs">Get In Touch</span>
          <h1 className="text-4xl sm:text-5xl font-black text-neutral-900 tracking-tight font-sans">
            Contact Food Review BD
          </h1>
          <p className="text-neutral-500 text-sm max-w-xl mx-auto leading-relaxed">
            Are you a restaurant owner wanting your food reviewed, or a food critic looking to join our moderator panel? Reach out below!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Quick contact details sidebar */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm space-y-6">
              
              <div className="space-y-2">
                <h3 className="font-extrabold text-neutral-900 text-base">Office Headquarters</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">Drop by for coffee and conversation!</p>
              </div>

              <div className="space-y-4 text-xs text-neutral-600">
                <div className="flex items-start gap-2.5">
                  <MapPin size={16} className="text-red-500 mt-0.5 shrink-0" />
                  <span>{settings.contactAddress || "Road 11, Banani Commercial Area, Dhaka - 1213, Bangladesh"}</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <Phone size={14} className="text-red-500 shrink-0" />
                  <span>{settings.contactPhone || "+880 1712-345678"}</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <Mail size={14} className="text-red-500 shrink-0" />
                  <span>{settings.contactEmail || "support@foodreviewbd.com"}</span>
                </div>
              </div>

            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-3xl p-8 border border-neutral-100 shadow-sm">
              
              {submitted ? (
                <div className="py-12 text-center space-y-3">
                  <div className="h-12 w-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto">
                    <Check size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-800">Message sent successfully!</h3>
                  <p className="text-xs text-neutral-400">Our administrative moderators will get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-extrabold text-neutral-500 uppercase tracking-wider mb-1.5">
                        Your Full Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Abrar Hossain"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2.5 bg-neutral-50/70 border border-neutral-200/90 rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 focus:bg-white transition-all shadow-2xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-extrabold text-neutral-500 uppercase tracking-wider mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="abrar@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2.5 bg-neutral-50/70 border border-neutral-200/90 rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 focus:bg-white transition-all shadow-2xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold text-neutral-500 uppercase tracking-wider mb-1.5">
                      Subject Title
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Restaurant Review Sponsorship"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-2.5 bg-neutral-50/70 border border-neutral-200/90 rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 focus:bg-white transition-all shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold text-neutral-500 uppercase tracking-wider mb-1.5">
                      Detailed Message
                    </label>
                    <textarea
                      required
                      placeholder="Type your questions or proposal here..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-2.5 bg-neutral-50/70 border border-neutral-200/90 rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 focus:bg-white transition-all shadow-2xs h-36 resize-y"
                    />
                  </div>

                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer shadow-md shadow-red-200"
                  >
                    <Send size={14} />
                    Send Dispatch
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
