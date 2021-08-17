const commentPost = (req, db) => {
    let x = req.x;
    let y = req.y;


    if(!db[x]){
        db[x] = [];
    }
    if(!db[x][y]) {
        db[x][y] = [];
    }
    db[x][y].push(req.data);
    return { result: "success", db: db };
}

export default commentPost;