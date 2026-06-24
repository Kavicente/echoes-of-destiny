import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function CharacterPage() {
  const { name } = useParams();
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [skills, setSkills] = useState([]);
  const [allImages, setAllImages] = useState([]);
  const [expandedSkills, setExpandedSkills] = useState({});
  const scrollRef = useRef(null);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    
    axios.get(`${apiUrl}/api/character/${name}`)
      .then(res => {
        console.log("✅ Character data received:", res.data);
        setCharacter(res.data);
        
        const skillList = res.data.bio.split('\n\n').filter(s => s.trim() !== '');
        setSkills(skillList);
        setLoading(false);
      })
      .catch(err => {
        console.error("❌ Error fetching character:", err);
        setLoading(false);
      });
  }, [name]);

  // Load images from BOTH frontend/public AND backend/static
  useEffect(() => {
    if (!character?.name) return;

    const charName = character.name;
    const images = [];

    // Main image - try both locations
    images.push(`/assets/pics/${character.image}`);
    images.push(`/assets/pics/${charName}/${character.image}`);

    const patterns = [" (1)", " (1.1)", " (1.2)", " (2)", " (2.2)", " (3)", " (4)", " (4.1)", " (4.2)", " (4.3)", " (5)"];

    patterns.forEach(pattern => {
      // Try subfolder structure
      images.push(`/assets/pics/${charName}/${charName}${pattern}.png`);
      // Try root pics folder
      images.push(`/assets/pics/${charName}${pattern}.png`);
    });

    setAllImages(images);
  }, [character]);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  const toggleSkill = (title) => {
    setExpandedSkills(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  // Reset expanded skills when character changes
  useEffect(() => {
    setExpandedSkills({});
  }, [name]);

  if (loading) {
    return <div className="text-center text-4xl mt-20 text-white">Loading character...</div>;
  }

  if (!character) {
    return <div className="text-center text-4xl mt-20 text-white">Character not found</div>;
  }

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed relative p-6"
      style={{ backgroundImage: `url("/assets/background/${character.background}")` }}
    >
      <div className="max-w-7xl mx-auto">
        
        {/* Horizontal Small Images with Arrows */}
        <div className="relative mb-10">
          <button 
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 text-white w-10 h-10 rounded-full flex items-center justify-center text-2xl transition-all"
          >
            ←
          </button>

          <div 
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-6 hide-scrollbar scroll-smooth px-12"
          >
            {allImages.slice(1).map((imgSrc, index) => (
              <img
                key={index}
                src={imgSrc}
                alt={`${character.name} variant ${index}`}
                className="small-character-img w-28 h-36 object-contain hover:scale-110 transition-transform cursor-pointer flex-shrink-0"
                onError={(e) => e.target.style.display = 'none'}
              />
            ))}
          </div>

          <button 
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 text-white w-10 h-10 rounded-full flex items-center justify-center text-2xl transition-all"
          >
            →
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* Main Large Image */}
          <div className="flex-shrink-0 main-character-container">
            <img
              src={`/assets/pics/${character.image}`}
              alt={character.name}
              className="main-character-img floating-char drop-shadow-2xl"
            />
          </div>

          {/* Skills Section - Clickable Cards */}
          <div className="flex-1">
            <h1 className="text-6xl font-bold text-white mb-2">{character.name}</h1>
            <h2 className="text-4xl text-cyan-300 mb-12">Skills</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {skills.map((skill, index) => {
                const title = skill.split('\n')[0] || skill.substring(0, 80) + '...';
                return (
                  <div 
                    key={title}
                    className="bg-black/70 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-white/90 leading-relaxed hover:bg-black/80 transition-all cursor-pointer"
                    onClick={() => toggleSkill(title)}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-lg font-medium">{title}</p>
                      <span className="text-cyan-300 text-2xl">
                        {expandedSkills[title] ? '−' : '+'}
                      </span>
                    </div>
                    
                    <p className={`text-white/80 text-[17px] leading-relaxed overflow-hidden transition-all duration-300 ${expandedSkills[title] ? 'max-h-[600px]' : 'max-h-0'}`}>
                      {skill}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}