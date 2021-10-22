import { Link } from "react-router-dom";

export function Header() {
  return (
    <nav className="navbar navbar-dark bg-dark navbar-fixed-top mb-4">
      <div className="container">
        <div className="navbar-header pull-left">
          <Link className="navbar-brand" to="/">
            MITOC Gear
          </Link>
        </div>
      </div>
    </nav>
  );
}
