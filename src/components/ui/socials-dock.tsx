import React from 'react';
import { FaLinkedin, FaGithub, FaInstagram, FaFileAlt } from 'react-icons/fa';

function SocialDock() {
  return (
    <div className='flex items-center justify-center w-full p-4 space-x-8 gap-4 mt-2'>
      <a href="https://www.linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer" title="LinkedIn">
        <FaLinkedin size={30} />
      </a>
      <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" title="GitHub">
        <FaGithub size={30} />
      </a>
      <a href="https://www.instagram.com/yourusername" target="_blank" rel="noopener noreferrer" title="Instagram">
        <FaInstagram size={30} />
      </a>
      <a href="/path/to/your-resume.pdf" target="_blank" rel="noopener noreferrer" title="Resume">
        <FaFileAlt size={30} />
      </a>
    </div>
  );
}

export default SocialDock;
