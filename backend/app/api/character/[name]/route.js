import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const CHARACTERS = [
  'Ethan', 'Harvy', 'Clarence', 'Ryan', 'Nash', 'James', 'Audrey',
  'Elise', 'Maxine', 'Joy', 'Brittney', 'Bella', 'Gwen', 'Alice',
  'Daniela', 'Reign'
];

const getBackground = (character) => {
  const mapping = {
    'Alice': 'Smith Background.png',
    'Harvy': 'Smith Background.png',
    'Audrey': 'Thompson Background.png',
    'James': 'Thompson Background.png',
    'Bella': 'Wright Background.png',
    'Brittney': 'Wright Background.png',
    'Clarence': 'Clarence Background.png',
    'Daniela': 'Jones Background.png',
    'Maxine': 'Jones Background.png',
    'Elise': 'Gomez Background.png',
    'Ryan': 'Gomez Background.png',
    'Ethan': 'Williams Background.png',
    'Reign': 'Williams Background.png',
    'Gwen': 'Washington Background.png',
    'Nash': 'Washington Background.png',
    'Joy': 'Joy Background.png',
  };
  return mapping[character] || 'Background.png';
};

export async function GET(request, { params }) {
  // `params` is a promise in recent Next.js versions
  const { name } = await params;

  if (!name) {
    return NextResponse.json({ error: "Name parameter is required" }, { status: 400 });
  }

  const characterName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

  if (!CHARACTERS.includes(characterName)) {
    return NextResponse.json({ error: `Character '${characterName}' not found` }, { status: 404 });
  }

  // === NEW: Load skills from individual files in character folder ===
  const skillsDir = path.join(process.cwd(), 'public', 'assets', 'txt', characterName);
  let skills = [];

  if (fs.existsSync(skillsDir)) {
    const files = fs.readdirSync(skillsDir)
      .filter(file => file.endsWith('.txt'))
      .sort();

    skills = files.map(file => {
      const content = fs.readFileSync(path.join(skillsDir, file), 'utf-8').trim();
      return content;
    });
  } else {
    // Fallback to old single .txt file
    const txtPath = path.join(process.cwd(), 'public', 'assets', 'txt', `${characterName}.txt`);
    if (fs.existsSync(txtPath)) {
      const bio = fs.readFileSync(txtPath, 'utf-8').trim();
      skills = bio.split('\n\n').filter(s => s.trim() !== '');
    }
  }

  const data = {
    name: characterName,
    skills: skills,                    // New: array of individual skills
    bio: skills.join('\n\n'),          // Keep for backward compatibility
    background: getBackground(characterName),
    image: `${characterName}.png`
  };

  const response = NextResponse.json(data);

  // CORS headers
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  return response;
}