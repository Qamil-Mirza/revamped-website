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
import codon from "@/public/codon.jpg"
import expenseDashboard from "@/public/expenseDashboard.png";
import donut from "@/public/donut.png";

import RetroGrid from "@/components/ui/retro-grid";
import { ProjectCard } from "@/components/ui/project-card";
import { NavBar } from "@/components/ui/nav-bar";

// Features to moddify Bento Grid
const projects = [
  {
    id: "receipt-parsing-service",
    title: "Receipt Parsing With Document Understanding Transformer (DONUT)",
    description: "A receipt parsing service that utilizes a Document Understanding Transformer (DONUT) model to extract structured information from receipts. Currently in development.",
    image: donut.src,
    tags: ["Python", "FastAPI", "PyTorch", "Transformers"],
    url: "https://www.loom.com/share/0a5c02a4034c432d917cf992034e8ed1?sid=c6bb09ce-21f1-4d1f-9fc6-f53104597387"
  },
  {
    id: "home-expenses-dashboard",
    title: "Home Expense Dashboard",
    description: "A full-stack web application for tracking home expenses, providing insights and visualizations to manage finances effectively with automated debt reconciliation.", 
    image: expenseDashboard.src,
    tags: ["Supabase", "TypeScript", "React", "FastAPI", "SQLAchemy", "Alembic"],
    url: "https://www.loom.com/share/b313c33112f642398345d875ae5d4c95?sid=c1e59c60-d513-4a6c-a8e0-ffbe3896a575"
  },
  {
    id: "genetic-translator",
    title: "Species-Specific Genetic Code Translator",
    description: "A tool that translates genetic code sequences between different species, accounting for species-specific codon usage and genetic variations.",
    image: codon.src,
    tags: ["Python", "Streamlit", "NCBI"],
    url: "https://alt-codon-tables.streamlit.app/",
  },
  {
    id: "uni-rankings",
    title: "University Rankings Dashboard",
    description: "Interactive dashboard visualizing global university rankings with customizable filters and comparison tools.",
    image: uni.src,
    tags: ["Python", "Streamlit", "Matplotlib"],
    url: "https://world-uni.streamlit.app/",
  },
  {
    id: "tb-detection",
    title: "Tuberculosis Detection",
    description: "AI-powered system for early detection of tuberculosis from chest X-rays using transfer learning techniques.",
    image: tb.src,
    tags: ["Python", "PyTorch", "OpenCV", "Pillow", "Matplotlib"],
    url: "https://github.com/Qamil-Mirza/My-Data-Projects/blob/main/tb-detection/eda.ipynb",
  },
  {
    id: "brain-tumor-classification",
    title: "Brain Tumor Classification",
    description: "Deep learning model that classifies brain tumors from MRI scans with high accuracy for early diagnosis.",
    image: brain.src,
    tags: ["Python", "TensorFlow", "Keras", "Scikit-learn", "OpenCV", "Matplotlib"],
    url: "https://github.com/Qamil-Mirza/My-Data-Projects/blob/main/Tumor-Classification/tumor-classifier.ipynb",
  },
  {
    id: "house-price-prediction",
    title: "House Price Prediction",
    description: "Mathematical model for predicting house prices based on various features using advanced regression techniques.",
    image: descent.src,
    tags: ["Python", "TensorFlow", "Numpy", "Seaborn", "Scikit-learn", "Matplotlib", "Pandas"],
    url: "https://github.com/Qamil-Mirza/My-Data-Projects/blob/main/Linear-Regression/linear-regressor.ipynb",
  },
  {
    id: "embedding-visualization",
    title: "Embedding Visualization",
    description: "Browser-based tool for visualizing and analyzing high-dimensional embeddings from large datasets.",
    image: embed.src,
    tags: ["Python", "Plotly", "Transformers", "PyTorch", "Scikit-learn"],
    url: "https://github.com/Qamil-Mirza/Image-Embedding-Visualization-Analysis",
  },
  {
    id: "annotator-onboarding-quiz",
    title: "Annotator Onboarding Quiz App",
    description: "A web application for onboarding data annotators with quizzes and progress tracking.",
    image: quiz.src,
    tags: ["PostgresSQL", "Express", "React", "Node.js", "AWS EC2", "Docker", "PM2", "TypeScript" ],
    url: "https://github.com/Qamil-Mirza/supa-skill-challenge",
  },
  {
    id: "credit-card-fraud-detection",
    title: "Credit Card Fraud Detection",
    description: "Machine learning model for detecting fraudulent transactions in credit card data using advanced algorithms.",
    image: ccfd.src,
    tags: ["Python", "Scikit-learn", "TensorFlow", "Imblearn", "Keras"],
    url: "https://colab.research.google.com/drive/1yjQEQ4Ern1umHgrTWO3Ymq5L7hPf6Fxu?usp=sharing",
  },
  {
    id: "heart-attack-prediction",
    title: "Heart Attack Prediction",
    description: "Machine learning model for predicting the risk of heart attacks based on various health metrics.",
    image: heart.src,
    tags: ["Python", "Seaborn", "Scikit-learn", "Plotly"],
    url: "https://colab.research.google.com/drive/1FCq4JC-TP8O_u2GO6z2ewDcCt1V45nre?usp=sharing",
  },
  {
    id: "ship-detection",
    title: "Ship Detection With Keras",
    description: "CNN Model for Ship Detection through Satellite Imagery using Keras and TensorFlow.",
    image: ship.src,
    tags: ["Python", "Scikit-learn", "XGBoost", "TensorFlow", "Keras"],
    url: "https://colab.research.google.com/drive/1xOVMT4nRqja3cEFIJ4Kyl0B6oqYq2N2X?usp=sharing",
  },
  {
    id: "neural-style-transfer",
    title: "Neural Style Transfer",
    description: "Fun project to transfer the style of one image to another using neural networks.",
    image: styletrans.src,
    tags: ["Python", "TensorFlow", "OpenCV"],
    url: "https://colab.research.google.com/drive/1QuxVxSKJOwi75QP_z1hHvkulIel6QcOk?usp=sharing",
  },
  {
    id: "sentiment-analysis",
    title: "Sentiment Analysis & Text Generation",
    description: "LSTM RNN for sentiment analysis and text generation",
    image: rnj.src,
    tags: ["Python", "TensorFlow", "Keras"],
    url: "https://colab.research.google.com/drive/1Xp9Z2Kc9LQVdnU4MvXof0k0mGQcWj3GU?usp=sharing",
  },
  {
    id: "flower-species-prediction",
    title: "Flower species prediction with DNN",
    description: "DNN model to predict the species of a flower based on its features.",
    image: flower.src,
    tags: ["Python", "TensorFlow"],
    url: "https://colab.research.google.com/drive/1NWpd6XXbspEeNf4c9NjcDn8gryE_bSXM?usp=sharing",
  },
  {
    id: "catdog-prediction",
    title: "Cat & Dog Prediction with MobileNetV2",
    description: "MobileNetV2 model to predict the species of a cat or dog",
    image: catdog.src,
    tags: ["Python", "TensorFlow", "Matplotlib"],
    url: "https://colab.research.google.com/drive/1BCsibzO6j3xjeMT-n7CVS9TkB6nS4NYL?usp=sharing#scrollTo=5AbwygyurgxD",
  },
  {
    id: "mnist-cnn",
    title: "MNIST Classification with CNN",
    description: "Convolutional Neural Network to classify handwritten digits from the MNIST dataset.",
    image: mnist.src,
    tags: ["Python", "TensorFlow", "Seaborn", "Keras"],
    url: "https://colab.research.google.com/drive/171RQUSCLIUgFjoO9YfIeFlxGCZj59dxF?usp=sharing",
  },
  {
    id: "star-classification",
    title: "Star Classification with CNN",
    description: "Convolutional Neural Network to classify stars based on their features.",
    image: stars.src,
    tags: ["Python", "TensorFlow", "Seaborn", "Lazypredict"],
    url: "https://colab.research.google.com/drive/1-6KVAtNdfAxO_Oo3a2Hq_cXJTpgbp3jm?usp=sharing",
  },
]

function page() {
  return (
    <main className="bg-backgroundColor">
      <NavBar />
      {/* Background Animation */}
      <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden">
        <span className="pointer-events-none z-10 whitespace-pre-wrap bg-gradient-to-b from-[#D3D3D3] via-[#F5F5F5] to-[#FFFFFF] bg-clip-text text-center text-7xl font-bold leading-none tracking-tighter text-transparent">
          PROJECTS
        </span>

        <RetroGrid />
      </div>
      <section className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
      </section>
    </main>
  );
}

export default page;
