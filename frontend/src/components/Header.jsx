import { Link } from "react-router-dom";

const characters = [
  'Ethan', 'Harvy', 'Clarence', 'Ryan', 'Nash', 'James', 'Audrey',
  'Elise', 'Maxine', 'Joy', 'Brittney', 'Bella', 'Gwen', 'Alice',
  'Daniela', 'Reign'
];

export default function Header() {
  return (
    <header className="flex items-center p-4 header-gradient">
      <img 
        src="/assets/pics/EOD.png" 
        alt="Logo" 
        className="w-32 h-auto mr-6"
      />
      <nav className="flex flex-wrap gap-4 flex-grow justify-center">
        <Link to="/" className="nav-link">Home</Link>
        {characters.map((name) => (
          <Link
            key={name}
            to={`/${name.toLowerCase()}`}
            className="nav-link"
          >
            {name}
          </Link>
        ))}
      </nav>
    </header>
  );
}