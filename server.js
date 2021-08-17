import { Server } from "https://js.sabae.cc/Server.js";

import commentGet from "./api/comment_get.js";
import commentPost from "./api/comment_post.js";

let db = [];

class MyServer extends Server {
    api(path, req) {
        if (path.startsWith("/api/comment/get")) {

            let res = commentGet(req, db);
            return { result: res.result };

        } else if (path.startsWith("/api/comment/post")) {

            let res = commentPost(req, db);
            db = res.db;
            return { status: res.result };

        }
    }
}

new MyServer(8001);