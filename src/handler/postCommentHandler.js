const https = require('https');

const postCommentHandler = {};

postCommentHandler.getAllPost = (req, res) => {
    const postsUrl = "https://jsonplaceholder.typicode.com/posts";
    const commentsUrl = "https://jsonplaceholder.typicode.com/comments";

    https.get(postsUrl, (postsResponse) => {
        let postsData = '';

        postsResponse.on('data', (chunk) => {
            postsData += chunk;
        });

        postsResponse.on('end', () => {
            https.get(commentsUrl, (commentsResponse) => {
                let commentsData = '';

                commentsResponse.on('data', (chunk) => {
                    commentsData += chunk;
                });

                commentsResponse.on('end', () => {
                    // Parse data JSON dari URL
                    const posts = JSON.parse(postsData);
                    const comments = JSON.parse(commentsData);

                    // Mengelompokkan komentar berdasarkan postingan
                    const postCommentMap = {};

                    comments.forEach((comment) => {
                        if (!postCommentMap[comment.postId]) {
                            postCommentMap[comment.postId] = [];
                        }
                        postCommentMap[comment.postId].push(comment);
                    });

                    // Menggabungkan komentar dengan postingan
                    const postsWithComments = posts.map((post) => {
                        return {
                            ...post,
                            judulPost: post.title,
                            title: undefined,
                            contentPost: post.body,
                            body: undefined,
                            userId: undefined,
                            comments: (postCommentMap[post.id] || []).slice(1).map((comment) => ({
                                ...comment,
                                namaUser: comment.name,
                                name: undefined,
                                emailUser: comment.email,
                                email: undefined,
                                contentComment: comment.body, 
                                body: undefined,
                                id: undefined
                            })), 
                        };
                    });

                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(postsWithComments, null, 2));
                });
            });
        });
    }).on('error', (error) => {
        console.error(`Error: ${error.message}`);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
    });
}

module.exports = postCommentHandler;
