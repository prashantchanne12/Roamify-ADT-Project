import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-800 text-neutral-200 py-4 text-center">
      <div className="max-w-7xl mx-auto">
        &copy; {new Date().getFullYear()} Roamify. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;