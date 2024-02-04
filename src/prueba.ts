import { JsonHandler } from "@tomhuel/jsonhandler"
import path from "path"

let json: { [key: string]: any } = new JsonHandler(path.join(__dirname,"./../data/messageAnswers.json")).getJson()
console.log(json["holarem"])

