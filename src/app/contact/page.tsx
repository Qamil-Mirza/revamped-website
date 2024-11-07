"use client";
import React, { useRef } from 'react'

import emailjs from '@emailjs/browser';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Page() {
  const form = useRef<HTMLFormElement>(null);
  const serviceId = process.env.NEXT_PUBLIC_EMAIL_SERVICE_ID || ''
  const templateId = process.env.NEXT_PUBLIC_EMAIL_TEMPLATE_ID || ''
  const publicKey = process.env.NEXT_PUBLIC_EMAIL_PUBLIC_KEY || ''

  emailjs.init({
    publicKey: publicKey,
    limitRate: {
      throttle: 10000,
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (form.current) {
      emailjs.sendForm(serviceId, templateId, form.current, {
        publicKey: publicKey
      }).then((result) => {
        toast.success('Message sent successfully');
        console.log(result.text);
      }, (error) => {
        console.log(error.text);
        toast.error('Failed to send message');
      });
    } else {
      console.log('form is null')
    }
  }
  return (
    <div className="p-6 bg-backgroundColor min-h-screen flex items-center justify-center">
  <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
    <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Contact Me</h1>
    <form ref={form} onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <label className="text-gray-700 font-medium">Name</label>
      <input
        type="text"
        name="sender_name"
        placeholder="Enter your name"
        className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        required
      />

      <label className="text-gray-700 font-medium">Email</label>
      <input
        type="email"
        name="sender_email"
        placeholder="Enter your email"
        className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        required
      />

      <label className="text-gray-700 font-medium">Message</label>
      <textarea
        name="message"
        placeholder="Enter your message"
        className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none h-32"
        required
      />

      <input
        type="submit"
        value="Submit"
        className="bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 cursor-pointer"
      />
    </form>

    <hr className="my-6 border-gray-200" />

    <div className="text-center">
      <h1 className="text-gray-700 mb-2">Or</h1>
      <h1 className="text-gray-700">
        Email me at <a href="mailto:qamilmirza@gmail.com" className="text-blue-500 hover:underline">qamilmirza@gmail.com</a>
      </h1>
    </div>
  </div>
  <ToastContainer />
</div>
  )
}

export default Page
