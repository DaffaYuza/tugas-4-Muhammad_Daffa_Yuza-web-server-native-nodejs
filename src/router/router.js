const postHandler = require("../handler/postHandler")
const commentHandler = require("../handler/commentHandler")
const postCommentHandler = require("../handler/postCommentHandler")

const router = {}
router.init = (req,res) => {
    if(req.url === "/api/post/get"){
        postHandler.getAllPost(req,res)
    } else if(req.url === "/api/comment/get"){
        commentHandler.getAllPost(req,res)
    } else if(req.url === "/api/post-comment/get"){
        postCommentHandler.getAllPost(req, res)
    } else {
        res.end("Not Found Route !")
    }
}
module.exports = router