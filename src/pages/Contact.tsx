import { Mail, Phone, MapPin, ArrowLeft } from 'lucide-react'
import type React from 'react'
import { Link } from 'react-router-dom'

export default function Contact() {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const name = String(form.get('name') || '')
    const email = String(form.get('email') || '')
    const school = String(form.get('school') || '')
    const subject = String(form.get('subject') || 'Contact SchoolConnect')
    const message = String(form.get('message') || '')

    const body = encodeURIComponent(
      `Nom: ${name}\nEmail: ${email}\nÉcole: ${school}\n\nMessage:\n${message}`
    )
    const mailto = `mailto:contact@schoolconnect.cd?subject=${encodeURIComponent(subject)}&body=${body}`
    window.location.href = mailto
  }

  return (
    <main className="pt-20">
      <section className="bg-gradient-to-br from-primary-50 to-white py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="inline-flex items-center gap-2 text-xs bg-primary-50 text-primary-700 px-3 py-1 rounded-full mb-3">Contact</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">Contactez l'équipe SchoolConnect</h1>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">Nous sommes là pour répondre à vos questions et vous accompagner dans la digitalisation de votre école.</p>
          <div className="mt-6">
            <Link to="/" className="inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              <ArrowLeft className="mr-2 h-4 w-4" /> Retour à l’accueil
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Envoyez-nous un message</h2>
              <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700">Nom complet</label>
                  <input name="name" required className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700">Email</label>
                  <input name="email" type="email" required className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700">École</label>
                  <input name="school" className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700">Sujet</label>
                  <input name="subject" placeholder="Demande d'information / Démo / Support" className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-700">Message</label>
                  <textarea name="message" rows={6} required className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                </div>
                <div className="md:col-span-2 flex justify-end">
                  <button type="submit" className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500">Envoyer</button>
                </div>
              </form>
            </div>
          </div>

          <aside>
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Coordonnées</h3>
              <p className="text-sm text-gray-600">Vous pouvez aussi nous joindre directement via nos coordonnées ci-dessous.</p>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <Mail className="h-4 w-4" />
                <a className="hover:text-blue-600" href="mailto:contact@schoolconnect.cd">contact@schoolconnect.cd</a>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <Phone className="h-4 w-4" />
                <a className="hover:text-blue-600" href="tel:+243000000000">+243 000 000 000</a>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <MapPin className="h-4 w-4" />
                <a className="hover:text-blue-600" href="https://maps.google.com/?q=Kinshasa%2C%20RDC" target="_blank" rel="noreferrer">Kinshasa, RDC</a>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  )
}
