const https = require('https');

const postHandler = {};

postHandler.getAllPost = (req, res) => {
    const url = "https://jsonplaceholder.typicode.com/posts";

    https.get(url, (response) => {
        let data = '';

        // Mengumpulkan data yang diterima dalam potongan"
        response.on('data', (chunk) => {
            data += chunk;
        });

        // Ketika semua data telah diterima
        response.on('end', () => {
            // Mengubah key
            const modifiedData = JSON.parse(data).map((post) => ({
                ...post,
                postId: post.id,
                judulPost: post.title,
                content: post.body,
                // Menghapus key
                id: undefined,
                title: undefined,
                body: undefined
            }));

            // Mengirim data yang telah dimodifikasi sebagai respons ke client
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(modifiedData, null, 2));
        });
    }).on('error', (error) => {
        console.error(`Error: ${error.message}`);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
    });
};

module.exports = postHandler;
