const forever = require('forever-monitor');

const child = new forever.Monitor('app.js', {
    max: 3, //max number of retires
    silent: false,
    uid: 'app',
})

child.on('exit', function () {
    console.log('app.js has exited after 3 restarts');
});

child.start();