"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Song {
    constructor(title, res) {
        if (title != undefined)
            this.title = title;
        this.res = res;
    }
    getTitle() {
        return this.title;
    }
    getRes() {
        return this.res;
    }
}
exports.default = Song;
//# sourceMappingURL=song.js.map