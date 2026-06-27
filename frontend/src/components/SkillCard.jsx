import React from 'react';

export default function SkillCard({ title, description }) {
  return (
    <div 
      className="bg-black/70 backdrop-blur-md border border-white/20 rounded-2xl p-8 text-white leading-relaxed text-[17px]"
    >
      <h3 className="text-2xl font-bold text-black-300 mb-3">{title}</h3>
      <p>
        {description}
      </p>
    </div>
  );
}