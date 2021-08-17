const commentGet = (req, db) => {
    let x = req.x;
    let y = req.y;
    return { result: { x: x, y: y, data: db[x][y] } };
}

export default commentGet;