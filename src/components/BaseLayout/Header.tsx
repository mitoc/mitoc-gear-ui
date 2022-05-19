import { Link, useHistory } from "react-router-dom";

import { useCurrentUser, logOut } from "redux/auth";
import { useAppDispatch } from "redux/hooks";
import { PersonLink } from "components/PersonLink";
import styled from "styled-components";
import { useEffect } from "react";

export function Header() {
  const { user } = useCurrentUser();
  const dispatch = useAppDispatch();

  const { listen } = useHistory();

  // Hack to close the menu when the user clicks navigates to a new page
  useEffect(() => {
    return listen(() => {
      const menuToggle = document.querySelector(".navbar-collapse");
      if (menuToggle) {
        menuToggle.classList.remove("show");
      }
    });
  }, [listen]);

  return (
    <StyledNavBar className="navbar navbar-expand-md navbar-dark bg-dark mb-3 ">
      <div className="container">
        <Link to="/" className="navbar-brand">
          MITOC Gear
        </Link>
        {!user && (
          <div className="navbar-nav">
            <Link className="nav-link" to="/login">
              Log in
            </Link>
          </div>
        )}
        {user && (
          <>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#main-navbar"
              aria-controls="main-navbar"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div
              className="collapse navbar-collapse"
              data-toggle="collapse"
              data-target=".navbar-collapse"
              id="main-navbar"
            >
              <div className="navbar-nav me-auto">
                <Link
                  className="nav-link"
                  to="/people"
                  data-toggle="collapse"
                  data-target=".navbar-collapse"
                >
                  People
                </Link>
                <Link className="nav-link" to="/gear">
                  Gear
                </Link>
                <a
                  className="nav-link"
                  href="https://docs.google.com/spreadsheets/d/1CW3j4K4_HmXlDbO1vPRvIW76SI41EYNbaZKKrqmrgTk/edit?hl=en&hl=en#gid=1019012678"
                  target="_blank"
                  rel="noreferrer"
                >
                  Restricted gear
                </a>
              </div>
              <div className="navbar-nav ms-auto">
                <div className="nav-item dropdown">
                  <LinkButton
                    className="nav-link dropdown-toggle me-5"
                    id="navbarDropdownMenuLink"
                    role="list-box"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {user.firstName} {user.lastName[0]}.
                  </LinkButton>
                  <ul
                    className="dropdown-menu"
                    aria-labelledby="navbarDropdownMenuLink"
                  >
                    <li>
                      <PersonLink className="dropdown-item" id={user.id}>
                        My profile
                      </PersonLink>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/change-password">
                        Change password
                      </Link>
                    </li>
                    <li>
                      <a
                        className="dropdown-item"
                        href="http://goo.gl/nPMjmc"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Request desk credit
                      </a>
                    </li>
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={() => dispatch(logOut())}
                      >
                        Log out
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </StyledNavBar>
  );
}

const LinkButton = styled.button`
  background: none;
  border: none;
`;

const StyledNavBar = styled.nav`
  @media (max-width: 767px) {
    .navbar-collapse {
      .dropdown-menu {
        background-color: rgba(
          var(--bs-dark-rgb),
          var(--bs-bg-opacity)
        ) !important;
        padding-top: 0;
      }
      .dropdown-item {
        color: rgba(255, 255, 255, 0.55);
        &:hover {
          background-color: inherit;
          color: rgba(255, 255, 255, 0.75);
        }
      }
    }
  }
`;
