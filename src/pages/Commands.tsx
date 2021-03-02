/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Commands.css";
import Command from "../components/Command";
import { ICommand } from "../types";

const Commands = () => {
    const [commands, setCommands] = useState<ICommand[]>([]);

    const getCommands = async () => {
        const { data } = await axios.get(
            "https://aero-host.eastus.cloudapp.azure.com/commands"
        );

        return data as ICommand[];
    };

    useEffect(() => {
        (async () => {
            setCommands(await getCommands());
        })();
    }, []);

    return (
        <div className="flex flex-row commands">
            <aside className="commands-sidebar">
                <h3>Commands</h3>
                {commands.map((e) => {
                    if (e.hidden || e.testOnly) return null;

                    return (
                        <div key={e.name} className="aside-link">
                            {/* todo: @cursorsdottsx make the cool link things work */}
                            <a data-id={e.name}>
                                {">"}
                                {e.name}
                            </a>
                        </div>
                    );
                })}
            </aside>
            <article className="commands-main">
                <span className="pre-commands">
                    AeroBot has many commands that will make your discord
                    experience much better for mods, admins, or even the average
                    discord user!
                </span>
                {commands.map((c) => {
                    if (c.hidden || c.testOnly) return null;

                    return <Command command={c} key={c.name} />;
                })}
            </article>
        </div>
    );
};

export default Commands;
