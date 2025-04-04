"use client";
import React, { useRef, useState } from "react";

import emailjs from "@emailjs/browser";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NavBar } from "@/components/ui/nav-bar";

function Page() {
  const form = useRef<HTMLFormElement>(null);
  const serviceId = process.env.NEXT_PUBLIC_EMAIL_SERVICE_ID || "";
  const templateId = process.env.NEXT_PUBLIC_EMAIL_TEMPLATE_ID || "";
  const publicKey = process.env.NEXT_PUBLIC_EMAIL_PUBLIC_KEY || "";

  // Rate limiter
  const [lastSubmissionTime, setLastSubmissionTime] = useState<number | null>(
    null
  );
  const throttleTime = 30000; // 30 seconds

  emailjs.init(publicKey);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // check if the last submission was within the throttle time
    const now = Date.now();
    if (lastSubmissionTime && now - lastSubmissionTime < throttleTime) {
      toast.error(
        `Please wait ${Math.ceil(
          (throttleTime - (now - lastSubmissionTime)) / 1000
        )} seconds before submitting again`
      );
      return;
    }

    if (form.current) {
      emailjs
        .sendForm(serviceId, templateId, form.current, {
          publicKey: publicKey,
        })
        .then(
          (result) => {
            toast.success("Message sent successfully");
            console.log(result.text);
            setLastSubmissionTime(Date.now());
          },
          (error) => {
            console.log(error.text);
            toast.error("Failed to send message");
          }
        );
    } else {
      console.log("form is null");
    }
  };
  
  return (
    <div className="bg-backgroundColor min-h-screen flex flex-col">
      {/* NavBar at the top */}
      <NavBar />
      
      {/* Main content with proper spacing */}
      <div className="flex-grow flex items-center justify-center p-6">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
            Contact Me
          </h1>
          <form
            ref={form}
            onSubmit={handleSubmit}
            className="flex flex-col space-y-4"
          >
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
              Email me at{" "}
              <a
                href="mailto:qamilmirza@gmail.com"
                className="text-blue-500 hover:underline"
              >
                qamilmirza@gmail.com
              </a>
            </h1>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Page;