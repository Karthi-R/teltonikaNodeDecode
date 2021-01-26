const net = require('net');
const conf = require('./conf.json');
const Parser = require('teltonika-parser-ex');
const binutils = require('binutils64');


const server = net.createServer(function (socket) {
    console.log('client connected')


    socket.on('end', function () {
        console.log('client disconnected')

    })

    socket.on('data', (data) => {
        console.log(data);
        let buffer = data;
        let parser = new Parser(buffer);
        if (parser.isImei) {
            socket.write(Buffer.alloc(1, 1));
        } else {
            let avl = parser.getAvl();

            let writer = new binutils.BinaryWriter();
            writer.WriteInt32(avl.number_of_data);

            let response = writer.ByteBuffer;
            socket.write(response);
        }


    });
    socket.on('drain', data => {
        console.log('Vacio', data)
    })
});

server.listen(conf.port);
console.log('Listening on port:', conf.port)