import ms from "ms";
import React from "react";
import { ICommand } from "../types";
import "./Command.css";

type PropTypes = {
    command: ICommand;
};

const parseCase = (str: string) =>
    str.charAt(0).toUpperCase() + str.substring(1).toLowerCase();

const parsePermsArray = (perms: string[]) =>
    perms.map((p) => parseCase(p)).join(", ");

const Command = (props: PropTypes) => {
    return (
        <div id={props.command.name} className="command">
            <h3>
                {">"}
                {props.command.name}
            </h3>
            {props.command.guildOnly ? <p>Server only</p> : null}
            {props.command.dmOnly ? <p>DM only</p> : null}
            {props.command.guarded ? <p>Cannot be disabled</p> : null}
            {props.command.permissions?.length !== 0 ? (
                <p>
                    <b>Permissions Required:</b>{" "}
                    {parsePermsArray(props.command.permissions || [])}
                </p>
            ) : null}
            <p>
                <b>Description:</b> {props.command.description}
            </p>
            <p>
                <b>Details:</b> {props.command.details}
            </p>
            <p>
                <b>Usage:</b>{" "}
                <code>
                    {">"}
                    {props.command.name} {props.command.usage}
                </code>
            </p>
            <p>
                <b>Cooldown:</b>{" "}
                {props.command.cooldown
                    ? ms(props.command.cooldown * 1000, {
                          long: true,
                      })
                    : "none"}
            </p>
        </div>
    );
};

export default Command;
