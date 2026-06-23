import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function CharacterPage() {
  const { name } = useParams();
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  
  axios.get(`${apiUrl}/api/character/${name}`)
    .then(res => {
      console.log("✅ Character data received:", res.data);
      setCharacter(res.data);
      setLoading(false);
    })
    .catch(err => {
      console.error("❌ Error fetching character:", err);
      setLoading(false);
    });
}, [name]);

  if (loading) {
    return <div className="text-center text-4xl mt-20 text-white">Loading character...</div>;
  }

  if (!character) {
    return <div className="text-center text-4xl mt-20 text-white">Character not found</div>;
  }

  const bgUrl = `/assets/background/${character.background}`;
  console.log("🖼️ Trying to load background:", bgUrl); // Debug

  return (
    <div 
      className="character-page bg-cover bg-center flex items-start p-8 relative"
      style={{ 
        backgroundImage: `url("${bgUrl}")`,
        backgroundAttachment: 'fixed'
      }}
    >
      <img
        src={`/assets/pics/${character.image}`}
        alt={character.name}
        className="floating-char w-[300px] max-w-[30%] mr-8 z-10"
      />

      <div className="bio-container flex-1 max-w-2xl pt-8 z-10">
        <h2 className="character-title text-5xl font-bold text-white text-center mb-6 drop-shadow-2xl">
          {character.name}
        </h2>
        <h1 className="skills text-4xl text-white text-center mb-6 drop-shadow-2xl">Skills</h1>
        <p 
          className="character-bio text-white text-lg leading-relaxed drop-shadow-md"
          dangerouslySetInnerHTML={{ __html: character.bio.replace(/\n/g, '<br>') }}
        />
      </div>
    </div>
  );
}