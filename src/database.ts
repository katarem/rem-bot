import { OAuth2Guild } from "discord.js";
import { Database } from "sqlite3";
import { config } from "../config/config";
import * as fs from "fs";
class  DatabaseGuild{

    constructor(id: string, name: string){
        this.id = id;
        this.name = name;
    }

    id: string;
    name: string
}

class DatabaseService {

    private db: Database;

    private static instance: DatabaseService;

    private constructor(){
        this.db = new Database(config.DB_PATH, err => console.error(err));
        const databaseExists = fs.existsSync(config.DB_PATH);
        if(!databaseExists) this.initializeDatabase();
        DatabaseService.instance = this;
    }

    private initializeDatabase(){
        const query = 'CREATE TABLE GUILD(id varchar(32),name varchar(50));'
        this.db.run(query);
    }

    static getInstance(): DatabaseService {
        if(!DatabaseService.instance) 
            new DatabaseService();
        return DatabaseService.instance; 
    }

    saveGuild(guild: OAuth2Guild){
        this.db.run(`INSERT INTO GUILD VALUES(?,?);`,[guild.id,guild.name]);
    }

    fetchGuild(guildId: string): Promise<DatabaseGuild[]> {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM GUILD WHERE GUILD.id = ?;';
            this.db.all(query,[guildId], (err, rows) => {
                if(err) { reject(err); }
                resolve(rows as DatabaseGuild[]);
            });
        });
    }

}

export default DatabaseService