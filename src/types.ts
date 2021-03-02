export interface ICommand {
    name: string;
    aliases?: string[];
    hidden?: boolean;
    guildOnly?: boolean;
    testOnly?: boolean;
    dmOnly?: boolean;
    guarded?: boolean;
    description: string;
    details?: string;
    usage?: string;
    cooldown?: number;
    permissions?: string[];
}
