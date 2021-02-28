/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import axios from "axios";
import ms from "ms";
import "./Commands.css";

const Commands = () => {
    const [commands, setCommands] = useState<any[]>([]);

    const getCommands = async () => {
        const { data } = await axios.get(
            "http://aero-host.eastus.cloudapp.azure.com:3000/commands"
        );

        return data;
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
                {commands.map((e) => {
                    if (e.hidden || e.testOnly) return null;

                    return (
                        <div key={e.name} id={e.name} className="command-info">
                            <h3>
                                {">"}
                                {e.name}
                            </h3>
                            {e.guildOnly ? <p>Server only</p> : null}
                            {e.dmOnly ? <p>DM only</p> : null}
                            {e.guarded ? <p>Cannot be disabled</p> : null}
                            <p>
                                <b>Description:</b> {e.description}
                            </p>
                            <p>
                                <b>Details:</b> {e.details}
                            </p>
                            <p>
                                <b>Usage:</b>{" "}
                                <code>
                                    {">"}
                                    {e.name} {e.usage}
                                </code>
                            </p>
                            <p>
                                <b>Cooldown:</b>{" "}
                                {e.cooldown
                                    ? ms(e.cooldown * 1000, {
                                          long: true,
                                      })
                                    : "none"}
                            </p>
                        </div>
                    );
                })}
            </article>
        </div>
    );
};

export default Commands;
