import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
    return (
        <nav className="top-navbar text-black dark:text-white">
            <Link className="aero-font" to="/">
                <span className="aero-red">Aero</span>Bot
            </Link>
            <Link className="nav-link" to="/commands">
                Commands
            </Link>
            <a
                href="https://top.gg/bot/787460489427812363/invite"
                className="nav-link"
                target="_blank"
                rel="noopener noreferrer"
            >
                Invite AeroBot
            </a>
            <a
                href="https://discord.gg/Vs4rfsfd4q"
                target="_blank"
                rel="noopener noreferrer"
                className="nav-link"
            >
                Support Server
            </a>
            <div className="right-icons">
                <a
                    href="https://github.com/aero-ware/aero-bot"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nav-link icon-link"
                >
                    <i className="fab fa-github" />
                </a>
                <a
                    href="https://discord.gg/Vs4rfsfd4q"
                    className="nav-link icon-link"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <i className="fab fa-discord" />
                </a>
            </div>
        </nav>
    );
};

export default Navbar;
