import Link from "next/link";
import "./nav.css";

export default function Navbar() {
    return (
        <nav className="navbar">
        <Link href="/" className="navbar-link">
            <span className="material-symbols-outlined">home</span>
        </Link>
        <Link href="/stats" className="navbar-link">
            <span className="material-symbols-outlined">query_stats</span>
        </Link>
        <Link href="/settings" className="navbar-link">
            <span className="material-symbols-outlined">settings</span>
        </Link>
        </nav>
    );
}
