/* eslint-disable eqeqeq */
import React from "react";
import { useEffect } from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import CookieConsent from "react-cookie-consent";
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
        // code from holy stack overflow, DO NOT TOUCH
        // yes theres == instead of === but dont question it
        const getJsonFromUrl = (url: string) => {
            let question = url.indexOf("?");
            let hash = url.indexOf("#");
            if (hash == -1 && question == -1) return {};
            if (hash == -1) hash = url.length;
            let query =
                question == -1 || hash == question + 1
                    ? url.substring(hash)
                    : url.substring(question + 1, hash);
            let result: any = {};
            query.split("&").forEach((part) => {
                if (!part) return;
                part = part.split("+").join(" ");
                let eq = part.indexOf("=");
                let key = eq > -1 ? part.substr(0, eq) : part;
                let val =
                    eq > -1 ? decodeURIComponent(part.substr(eq + 1)) : "";
                let idx = key.indexOf("[");
                if (idx == -1) result[decodeURIComponent(key)] = val;
                else {
                    let to = key.indexOf("]", idx);
                    let index = decodeURIComponent(key.substring(idx + 1, to));
                    key = decodeURIComponent(key.substring(0, idx));
                    if (!result[key]) result[key] = [];
                    if (!index) result[key].push(val);
                    else result[key][index] = val;
                }
            });
            return result;
        };

        const { access, refresh } = getJsonFromUrl(window.location.href);

        if (access && refresh) {
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
                    <CookieConsent
                        children="This page only uses cookies essential for operation of the website."
                    />
                </div>
            </Router>
        </div>
    );
};

export default App;
