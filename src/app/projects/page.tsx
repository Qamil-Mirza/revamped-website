import React from "react";

import uni from "@/public/uni.jpg";
import tb from "@/public/tb.jpg";
import brain from "@/public/brain.png";
import descent from "@/public/descent.png";
import embed from "@/public/embed.png";
import quiz from "@/public/quiz.jpg";
import ccfd from "@/public/ccfd.png";
import heart from "@/public/heart.jpg";
import ship from "@/public/ship.jpg";
import styletrans from "@/public/styletrans.jpeg";
import rnj from "@/public/rnj.jpg";
import flower from "@/public/flower.jpg";
import catdog from "@/public/catdog.jpeg";
import mnist from "@/public/mnist.jpg";
import stars from "@/public/stars.png";

import IconCloud from "@/components/ui/icon-cloud";
import WordPullUp from "@/components/ui/word-pull-up";
import RetroGrid from "@/components/ui/retro-grid";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";

// Adjust IconCloud Content here
const slugs = [
  "typescript",
  "javascript",
  "java",
  "react",
  "html5",
  "css3",
  "nodedotjs",
  "express",
  "nextdotjs",
  "amazonaws",
  "postgresql",
  "nginx",
  "vercel",
  "docker",
  "git",
  "github",
  "visualstudiocode",
  "figma",
  "ruby",
  "vuedotjs",
  "go",
  "python",
  "flask",
  "tailwindcss",
  "mui",
  "shadcnui",
  "kubernetes",
  "postman",
  "numpy",
  "streamlit",
  "scikitlearn",
  "pytorch",
  "tensorflow",
  "react",
  "plotly",
  "keras",
  "pandas",
  "opencv",
  "ubuntu",
  "amazonec2",
];

// Features to moddify Bento Grid
const features = [
  {
    name: "University Rankings Dashboard",
    description: "Developed With Plotly and Streamlit",
    primaryTextColor: "text-primaryText",
    secondaryTextColor: "text-primaryText",
    href: "https://world-uni.streamlit.app/",
    cta: "Learn more",
    className: "col-span-3 lg:col-span-1",
    background: <img src={uni.src} className="absolute inset-0 w-full h-full object-cover opacity-100 brightness-50" />,
  },
  {
    name: "Tuberculosis Detection",
    description: "VGG16 Transfer Learning w/ TensorFlow",
    primaryTextColor: "text-primaryText",
    secondaryTextColor: "text-primaryText",
    href: "https://github.com/Qamil-Mirza/My-Data-Projects/blob/main/tb-detection/eda.ipynb",
    cta: "Learn more",
    className: "col-span-3 lg:col-span-1",
    background: <img src={tb.src} className="absolute inset-0 w-full h-full object-cover opacity-100 brightness-[30%]" />,
  },
  {
    name: "Brain Tumor Classification",
    description: "Developed with TensorFlow and Keras",
    primaryTextColor: "text-primaryText",
    secondaryTextColor: "text-primaryText",
    href: "https://github.com/Qamil-Mirza/My-Data-Projects/blob/main/Tumor-Classification/tumor-classifier.ipynb",
    cta: "Learn more",
    className: "col-span-3 lg:col-span-1",
    background: <img src={brain.src} className="absolute inset-0 w-full h-full object-cover opacity-100 brightness-50" />,
  },
  {
    name: "House Price Prediction",
    description: "Modeling house prices purely with mathematics",
    primaryTextColor: "text-primaryText",
    secondaryTextColor: "text-primaryText",
    href: "https://github.com/Qamil-Mirza/My-Data-Projects/blob/main/Linear-Regression/linear-regressor.ipynb",
    cta: "Learn more",
    className: "col-span-3 lg:col-span-1",
    background: <img src={descent.src} className="absolute inset-0 w-full h-full object-cover opacity-100 brightness-50" />,
  },
  {
    name: "Embedding Visualization",
    description: "Browser tool for analyzing 1M+ embeddings",
    primaryTextColor: "text-primaryText",
    secondaryTextColor: "text-primaryText",
    href: "https://github.com/Qamil-Mirza/Image-Embedding-Visualization-Analysis",
    cta: "Learn more",
    className: "col-span-3 lg:col-span-1",
    background: <img src={embed.src} className="absolute inset-0 w-full h-full object-cover opacity-100 brightness-50" />,
  },
  {
    name: "Annotator Onboarding Quiz App",
    description: "PostgresSQL, Express, React, Node.js, AWS",
    primaryTextColor: "text-primaryText",
    secondaryTextColor: "text-primaryText",
    href: "https://github.com/Qamil-Mirza/supa-skill-challenge",
    cta: "Learn more",
    className: "col-span-3 lg:col-span-1",
    background: <img src={quiz.src} className="absolute inset-0 w-full h-full object-cover opacity-50 brightness-50" />,
  },
  {
    name: "Credit Card Fraud Detection",
    description: "Running SMOTE For Imbalanced Data",
    primaryTextColor: "text-primaryText",
    secondaryTextColor: "text-primaryText",
    href: "https://colab.research.google.com/drive/1yjQEQ4Ern1umHgrTWO3Ymq5L7hPf6Fxu?usp=sharing",
    cta: "Learn more",
    className: "col-span-3 lg:col-span-1",
    background: <img src={ccfd.src} className="absolute inset-0 w-full h-full object-cover opacity-100 brightness-50" />,
  },
  {
    name: "Heart Attack Prediction",
    description: "trained multiple ML models to predict the risk of heart attack",
    primaryTextColor: "text-primaryText",
    secondaryTextColor: "text-primaryText",
    href: "https://colab.research.google.com/drive/1FCq4JC-TP8O_u2GO6z2ewDcCt1V45nre?usp=sharing",
    cta: "Learn more",
    className: "col-span-3 lg:col-span-1",
    background: <img src={heart.src} className="absolute inset-0 w-full h-full object-cover opacity-100 brightness-50" />,
  },
  {
    name: "Ship Detection With Keras",
    description: "CNN Model for Ship Detection through Satellite Imagery",
    primaryTextColor: "text-primaryText",
    secondaryTextColor: "text-primaryText",
    href: "https://colab.research.google.com/drive/1xOVMT4nRqja3cEFIJ4Kyl0B6oqYq2N2X?usp=sharing",
    cta: "Learn more",
    className: "col-span-3 lg:col-span-1",
    background: <img src={ship.src} className="absolute inset-0 w-full h-full object-cover opacity-100 brightness-50" />,
  },
  {
    name: "Neural Style Transfer",
    description: "fun project to transfer the style of one image to another",
    primaryTextColor: "text-primaryText",
    secondaryTextColor: "text-primaryText",
    href: "https://colab.research.google.com/drive/1QuxVxSKJOwi75QP_z1hHvkulIel6QcOk?usp=sharing",
    cta: "Learn more",
    className: "col-span-3 lg:col-span-1",
    background: <img src={styletrans.src} className="absolute inset-0 w-full h-full object-cover opacity-100 brightness-50" />,
  },
  {
    name: "Sentiment Analysis & Text Generation",
    description: "LSTM RNN for sentiment analysis and text generation",
    primaryTextColor: "text-primaryText",
    secondaryTextColor: "text-primaryText",
    href: "https://colab.research.google.com/drive/1Xp9Z2Kc9LQVdnU4MvXof0k0mGQcWj3GU?usp=sharing",
    cta: "Learn more",
    className: "col-span-3 lg:col-span-1",
    background: <img src={rnj.src} className="absolute inset-0 w-full h-full object-cover opacity-100 brightness-50" />,
  },
  {
    name: "Flower species prediction with DNN",
    description: "DNN model to predict the species of a flower",
    primaryTextColor: "text-primaryText",
    secondaryTextColor: "text-primaryText",
    href: "https://colab.research.google.com/drive/1NWpd6XXbspEeNf4c9NjcDn8gryE_bSXM?usp=sharing",
    cta: "Learn more",
    className: "col-span-3 lg:col-span-1",
    background: <img src={flower.src} className="absolute inset-0 w-full h-full object-cover opacity-100 brightness-50" />,
  },
  {
    name: "Cat & Dog Prediction with MobileNetV2",
    description: "MobileNetV2 model to predict the species of a cat or dog",
    primaryTextColor: "text-primaryText",
    secondaryTextColor: "text-primaryText",
    href: "https://colab.research.google.com/drive/1BCsibzO6j3xjeMT-n7CVS9TkB6nS4NYL?usp=sharing#scrollTo=5AbwygyurgxD",
    cta: "Learn more",
    className: "col-span-3 lg:col-span-1",
    background: <img src={catdog.src} className="absolute inset-0 w-full h-full object-cover opacity-100 brightness-50" />,
  },
  {
    name: "Number Classification with CNN",
    description: "CNN model to classify numbers from 0-9",
    primaryTextColor: "text-primaryText",
    secondaryTextColor: "text-primaryText",
    href: "https://colab.research.google.com/drive/171RQUSCLIUgFjoO9YfIeFlxGCZj59dxF?usp=sharing",
    cta: "Learn more",
    className: "col-span-3 lg:col-span-1",
    background: <img src={mnist.src} className="absolute inset-0 w-full h-full object-cover opacity-100 brightness-50" />,
  },
  {
    name: "Star Classification with CNN",
    description: "Used Lazypredict to train multiple models to classify stars",
    primaryTextColor: "text-primaryText",
    secondaryTextColor: "text-primaryText",
    href: "https://colab.research.google.com/drive/1-6KVAtNdfAxO_Oo3a2Hq_cXJTpgbp3jm?usp=sharing",
    cta: "Learn more",
    className: "col-span-3 lg:col-span-1",
    background: <img src={stars.src} className="absolute inset-0 w-full h-full object-cover opacity-100 brightness-50" />,
  },
];

function page() {
  return (
    <main className="bg-backgroundColor">
      <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden">
        <span className="pointer-events-none z-10 whitespace-pre-wrap bg-gradient-to-b from-[#D3D3D3] via-[#F5F5F5] to-[#FFFFFF] bg-clip-text text-center text-7xl font-bold leading-none tracking-tighter text-transparent">
           PROJECTS
        </span>

        <RetroGrid />
      </div>
      <section className="p-6">
        <BentoGrid>
          {features.map((feature, idx) => (
            <BentoCard key={idx} {...feature} />
          ))}
        </BentoGrid>
      </section>
      <section>
        <div className="flex justify-center p-3">
          <WordPullUp
            className="font-bold text-5xl mt-6 text-primaryText"
            words="Tech Toolkit"
          />
        </div>
        <div className="flex w-full h-[78%] items-center justify-center">
          <IconCloud iconSlugs={slugs} />
        </div>
      </section>
    </main>
  );
}

export default page;
