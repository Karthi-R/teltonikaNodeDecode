const net = require('net');
// const { bufferFromBufferString } = require('./helper');
const Parser = require('teltonika-parser-ex');
const binutils = require('binutils64');
// const { ProtocolParser } = require('complete-teltonika-parser')
const PORT = process.env.PORT || 7070;


const server = net.createServer(function (socket) {
    console.log('client connected')


    socket.on('end', function () {
        console.log('client disconnected')
    })

    var socketOnData = function (data) {
        console.log('on data()')
        const buffer = data;
        let parser = new Parser(buffer);
        if (parser.isImei) {
            const imei = data.toString();

            socket.write(Buffer.alloc(1, 1));
            console.log('Imei (%s) data received..', imei);
        } else {
            console.log('AVL data received..')
            let avl = parser.getAvl();
            console.log(avl['records'][0]['gps']);

            let writer = new binutils.BinaryWriter();
            writer.WriteInt32(avl.number_of_data);
            let response = writer.ByteBuffer;
            socket.write(response);
        }
    };

    socket.on('drain', data => {
        console.log('Vacio', data)
    })

    var socketOnClose = function(error) {
        console.log("Connection closed. IMEI" + ":" + socket.imei + " - " + error);
    };

    var socketOnError = function(error) {
        console.log("Error cocket IMEI. Bąd socket IMEI" + ":" + socket.imei + " - " + error);
    };

    socket.on('data', socketOnData);
    socket.on('error', socketOnError);
    socket.on('close', socketOnClose);
});

server.listen(PORT);
console.log('Listening on port:', PORT)
    