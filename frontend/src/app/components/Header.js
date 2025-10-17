import Link from "next/link";
import "./../globals.css";
import { useAuth } from "../context/AuthContext";

export default function Header() {
    const { logout } = useAuth();
    return (
      <header className="flex items-center justify-between px-6 py-4 bg-gray-800 shadow">
        <h1 className="text-2xl font-bold text-indigo-600">WriterLogger</h1>
        <nav className="flex gap-4 text-sm">
          <Link className="hover:underline" href="/">
            About
          </Link>
          <Link className="hover:underline" href="/">
            Notes
          </Link>
          <Link className="hover:underline" href="/">
            Account
          </Link>
          <button onClick={logout} className="hover:underline" href="/">
            Logout
          </button>
        </nav>
      </header>
    );
}