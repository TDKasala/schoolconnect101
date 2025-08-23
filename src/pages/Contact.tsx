import { Mail, Phone, MapPin, Building, LifeBuoy } from 'lucide-react';
import type React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/landing/Footer';
import Navbar from '../components/landing/Navbar';

const contactInfo = [
  {
    icon: <Mail className="h-6 w-6 text-brand-blue" />,
    title: 'Par Email',
    content: 'contact@schoolconnect.cd',
    href: 'mailto:contact@schoolconnect.cd',
    cta: 'Envoyer un email',
  },
  {
    icon: <Phone className="h-6 w-6 text-brand-blue" />,
    title: 'Par Téléphone',
    content: '+243 812 345 678',
    href: 'tel:+243812345678',
    cta: 'Appeler maintenant',
  },
  {
    icon: <Building className="h-6 w-6 text-brand-blue" />,
    title: 'Nos Bureaux',
    content: '123 Avenue de la Libération, Gombe, Kinshasa',
    href: 'https://maps.google.com/?q=Kinshasa%2C%20RDC',
    cta: 'Voir sur la carte',
  },
  {
    icon: <LifeBuoy className="h-6 w-6 text-brand-blue" />,
    title: 'Support Technique',
    content: 'Disponible 24/7 pour nos clients',
    href: '/faq',
    cta: 'Consulter la FAQ',
  },
];

export default function Contact() {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get('name') || '');
    const email = String(form.get('email') || '');
    const school = String(form.get('school') || '');
    const subject = String(form.get('subject') || 'Contact SchoolConnect');
    const message = String(form.get('message') || '');

    const body = encodeURIComponent(
      `Nom: ${name}\nEmail: ${email}\nÉcole: ${school}\n\nMessage:\n${message}`
    );
    const mailto = `mailto:contact@schoolconnect.cd?subject=${encodeURIComponent(subject)}&body=${body}`;
    window.location.href = mailto;
  }

  return (
    <div className="bg-white text-gray-800">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="bg-brand-blue-light py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight">
              Contactez-Nous
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-gray-600">
              Une question ? Une demande de démo ? Notre équipe est à votre écoute pour vous accompagner dans votre projet.
            </p>
          </div>
        </section>

        {/* Contact Form and Info Section */}
        <section className="py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16">
              {/* Contact Form */}
              <div className="bg-gray-50 p-8 md:p-12 rounded-2xl shadow-sm">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Envoyez-nous un message</h2>
                <p className="mt-3 text-gray-600">Remplissez le formulaire et nous reviendrons vers vous sous 24h.</p>
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom complet</label>
                      <input id="name" name="name" required className="mt-2 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-brand-blue focus:border-brand-blue py-3 px-4" />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">Adresse Email</label>
                      <input id="email" name="email" type="email" required className="mt-2 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-brand-blue focus:border-brand-blue py-3 px-4" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="school" className="block text-sm font-medium text-gray-700">Nom de l'école (Optionnel)</label>
                    <input id="school" name="school" className="mt-2 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-brand-blue focus:border-brand-blue py-3 px-4" />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Sujet</label>
                    <input id="subject" name="subject" placeholder="Demande de démo, Support, etc." className="mt-2 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-brand-blue focus:border-brand-blue py-3 px-4" />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">Votre Message</label>
                    <textarea id="message" name="message" rows={5} required className="mt-2 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-brand-blue focus:border-brand-blue py-3 px-4"></textarea>
                  </div>
                  <div>
                    <button type="submit" className="w-full inline-flex items-center justify-center rounded-lg bg-brand-blue px-8 py-3 text-base font-semibold text-white shadow-lg hover:bg-brand-blue/90 transform hover:scale-105 transition-transform duration-300">
                      Envoyer le Message
                    </button>
                  </div>
                </form>
              </div>

              {/* Contact Info */}
              <div className="space-y-8">
                {contactInfo.map((item) => (
                  <div key={item.title} className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-brand-blue-light text-brand-blue">
                        {item.icon}
                      </div>
                    </div>
                    <div className="ml-6">
                      <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                      <p className="mt-1 text-gray-600">{item.content}</p>
                      <a href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="mt-2 inline-block text-sm font-semibold text-brand-blue hover:underline">
                        {item.cta} &rarr;
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="bg-gray-100">
            <div className="max-w-7xl mx-auto">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d254620.2751167987!2d15.242924!3d-4.321706!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1a6a4d354b33b2b%3A0x462344e33b6c699d!2sKinshasa%2C%20Democratic%20Republic%20of%20the%20Congo!5e0!3m2!1sen!2sus!4v1623838 Kinshasa, RDC"
                    width="100%"
                    height="450"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Carte de Kinshasa"
                ></iframe>
            </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
