import { Server } from "./server/sabaeSaver.js";

const db = [];

const commentGet = (req) => {
    let x = req.x;
    let y = req.y;
    if (!x || !y){
        return { result: {}, status: "error" }
    }
    if (db[x] == undefined || db[x][y] == undefined) {
        return { result: {}, status: "error" }
    }
    return { result: { x: x, y: y, data: db[x][y] }, status: "success" };
}

const commentPost = (req) => {
    let x = req.x;
    let y = req.y;
    if (!x || !y){
        return { status: "error" }
    }
    if(!req.data) {
        return { status: "error" }
    }

    if(!db[x]){
        db[x] = [];
    }
    if(!db[x][y]) {
        db[x][y] = [];
    }
    db[x][y].push(req.data);
    return { status: "success" };
}

class MyServer extends Server {
    api(path, req) {
        if (path.startsWith("/api/comment/get")) {

            let res = commentGet(req);
            return { result: res.result, status: res.status };

        } else if (path.startsWith("/api/comment/post")) {

            let res = commentPost(req);
            return { status: res.status };

        }
    }
}

new MyServer(8884);