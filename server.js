import { Server } from "https://js.sabae.cc/Server.js";

const db = [];

const commentGet = (req) => {
    let x = req.x;
    let y = req.y;
    return { result: { x: x, y: y, data: db[x][y] } };
}

const commentPost = (req) => {
    let x = req.x;
    let y = req.y;

    if(!db[x]){
        db[x] = [];
    }
    if(!db[x][y]) {
        db[x][y] = [];
    }
    db[x][y].push(req.data);
    return { result: "success" };
}

class MyServer extends Server {
    api(path, req) {
        if (path.startsWith("/api/comment/get")) {

            let res = commentGet(req);
            return { result: res.result };

        } else if (path.startsWith("/api/comment/post")) {

            let res = commentPost(req);
            return { status: res.result };

        }
    }
}

new MyServer(8884);