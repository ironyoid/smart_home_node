import Link from "next/link";
import Head from "next/head";
import { useState } from "react";

const pages = [
  { title: "Controls", href: "/" },
  { title: "Settings", href: "/settings" },
  { title: "Statistics", href: "/stats" },
];

const Layout = ({ title, children }) => {
  const [currentPage, setCurrentPage] = useState(
    pages.findIndex((page) => page.title === title)
  );
  return (
    <>
      <Head>
        <title>SMH {title}</title>
      </Head>
      <header className="header">
        <nav className="header__nav">
          <ul className="nav__list">
            {pages.map((page, i) => (
              <li
                className="nav__li"
                key={page.title + page.href}
                onClick={() => setCurrentPage(i)}
              >
                <Link href={page.href}>
                  <a
                    className={`nav__link${
                      currentPage === i ? " nav__link--active" : ""
                    }`}
                  >
                    {page.title}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      {children}
    </>
  );
};

export default Layout;
