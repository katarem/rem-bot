import * as fs from "node:fs";

export class JsonHandler {
    protected path: string;
    protected file: any;

    constructor(path: string) {
        this.path = path;
        this.file = require(path);
    }

    /**
     * Returns the JSON content to be able to work with it
     * @returns The JSON contents
     */
    public getJson(): Object | Array<any> {
        return this.file;
    }

    /**
     * Push an element in the JSON Array
     * @param element Element to be pushed in the JSON Array
     * @param save Boolean to save or not the JSON File Directly
     */
    public pushElement(element: any, save: boolean = true): void {
        try {
            if (!Array.isArray(this.file)) {
                throw new Error("The JSON File is not a array");
            }
            this.file.push(element);

            this.checkSave(save);
        } catch (error: any) {
            console.error(error.message);
        }
    }

    /**
     * Unshift an element in the JSON Array
     * @param element Element to be unshifted in the JSON Array
     * @param save Boolean to save or not the JSON File Directly
     */
    public unshiftElement(element: any, save: boolean = true): void {
        try {
            if (!Array.isArray(this.file)) {
                throw new Error("The JSON File is not a array");
            }
            this.file.push(element);

            this.checkSave(save);
        } catch (error: any) {
            console.error(error.message);
        }
    }

    /**
     * Drop an element in the JSON Array
     * @param elementIndex Index of the element to delete
     * @param save Boolean to save or not the JSON File Directly
     */
    public dropElement(elementIndex: number, save: boolean = true): void {
        try {
            if (!Array.isArray(this.file)) {
                throw new Error("The JSON File is not a array");
            }

            this.file.splice(elementIndex, 1);

            this.checkSave(save);

        } catch (error: any) {
            console.error(error.message);
        }
    }

    /**
     * Deletes the last element in the JSON Array
     * @param save Boolean to save or not the JSON File Directly
     */
    public popElement(save: boolean = true): void {
        try {
            if (!Array.isArray(this.file)) {
                throw new Error("The JSON File is not a array");
            }

            this.file.splice(this.file.length - 1, 1);

            this.checkSave(save);

        } catch (error: any) {
            console.error(error.message);
        }
    }

    /**
     * Deletes the first element in the JSON Array
     * @param save Boolean to save or not the JSON File Directly
     */
    public shiftElement(save: boolean = true): void {
        try {
            if (!Array.isArray(this.file)) {
                throw new Error("The JSON File is not a array");
            }

            this.file.splice(this.file[0], 1);

            this.checkSave(save);

        } catch (error: any) {
            console.error(error.message);
        }
    }

    /**
     * Set a property in the JSON Object
     * @param propertyName Property Name to Set
     * @param propertyValue Property Value to Set
     * @param save Boolean to save or not the JSON File Directly
     */
    public setProperty(propertyName: string, propertyValue: any, save: boolean = true) {
        if (Array.isArray(this.file)) {
            throw new Error("The JSON File is an array, unable to set properties");
        }

        this.file[propertyName] = propertyValue;
        this.checkSave(save)
    }

    /**
     * Delete a property in the JSON Object
     * @param propertyName Property Name to Delete
     * @param save Boolean to save or not the JSON File Directly
     */
    public dropProperty(propertyName: string, save: boolean = true) {
        if (Array.isArray(this.file)) {
            throw new Error("The JSON File is an array, unable to set properties");
        }

        delete this.file[propertyName];
        this.checkSave(save)
    }

    /**
     * Replaces all the JSON with the JSON Given
     * @param newJson The JS Object to set all the JSON
     * @param save Boolean to save or not the JSON File Directly
     */
    public setJson(newJson: Array<any> | Object = {}, save: boolean = true) {
        this.file = newJson;
        this.checkSave(save);
    }

    /**
     * Defines de JSON Root Element Type
     * @returns Array or Object depending if the JSON is any of those 2
     */
    public JsonType(): "Array" | "Object" {
        if (Array.isArray(this.file)) {
            return "Array"
        }
        return "Object";
    }

    /**
     * Create's a JSON File
     * @param filepath Absolute Path to create the File
     * @param isArray Content start with object or Array
     */
    public static createJson(filepath: string, isArray: boolean = false): JsonHandler {
        let content: string = JSON.stringify({}, null, 4);
        if (isArray) {
            content = JSON.stringify([], null, 4);
        }
        fs.writeFileSync(filepath, content, 'utf-8');
        return new JsonHandler(filepath);
    }

    /**
     * Deletes the JSON File given
     * @param JsonFile JsonFile Object to Delete
     */
    public static deleteJson(JsonFile: JsonHandler) {
        fs.unlink(JsonFile.path, (err) => {
            if (err) {
                console.error(`Error deleting file: ${JsonFile.path}`);
            } else {
                console.log(`File Deleted Succesfully`);
            }
        });
    }

    /**
     * Checks to saves or not the JSON File
     * @param save Boolean to save or not the JSON File Directly
     */
    protected checkSave(save: boolean): void {
        if (save) {
            let success = this.saveFile();

            if (!success) {
                throw new Error("Error saving the new JSON");
            }
        }
    }

    /**
     * Stores the JSON Data in the JSON File
     * @returns Boolean to define if the JSON File was stored succesfully
     */
    protected saveFile(): boolean {
        try {
            let fileStringified = JSON.stringify(this.file, null, 4);
            fs.writeFileSync(this.path, fileStringified, 'utf-8');
            return true;
        } catch (e) {
            return false;
        }
    }
}