import React from "react";
import { useEffect } from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./components/Navbar";
import Commands from "./pages/Commands";
import Home from "./pages/Home";

const App: React.FC = () => {
    useEffect(() => {
        document.querySelectorAll("[data-id]").forEach((link) => {
            /* some cool linking stuff, but its broken */

            // @ts-ignore
            const element = document.getElementById(link.dataset.id);

            const y =
                // @ts-ignore
                window.pageYOffset + element.getBoundingClientRect().top + 64;

            link.addEventListener("click", () => {
                window.scrollTo({
                    // @ts-ignore
                    x: 0,
                    y: y,
                    behaviour: "smoot",
                });
            });
        });

        /* @cursorsdottsx's url auth stuff */
        const url = new URL(window.location.href);

        let access = url.searchParams.get("access");
        let refresh = url.searchParams.get("refresh");

        if (access && refresh) {
            access = decodeURIComponent(access);
            refresh = decodeURIComponent(refresh);

            document.cookie = `access=${access};secure;max-age=31536000`;
            document.cookie = `refresh=${refresh};secure;max-age=31536000`;

            window.location.href = "https://www.aero-ware.github.io/aero-bot";
        }
    });

    return (
        <div className="App">
            <Router>
                <Navbar />
                <div className="page">
                    <Switch>
                        <Route path="/commands">
                            <Commands />
                        </Route>
                        <Route path="/">
                            <Home />
                        </Route>
                    </Switch>
                </div>
            </Router>
        </div>
    );
};

export default App;
