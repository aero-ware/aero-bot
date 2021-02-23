import React from "react";
import "./Navbar.css";

const Navbar = () => {
    return (
        <nav className="top-navbar text-black dark:text-white">
            <a className="aero-font" href="/">
                <span className="aero-red">Aero</span>Bot
            </a>
            <a className="nav-link" href="/commands">
                Commands
            </a>
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
