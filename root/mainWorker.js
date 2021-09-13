
const { Worker } = require("worker_threads");


let number = 10;

function mainWorker({ fb_run_id, fb_uid, fb_id_token, projectName, email, fb_database_url }) {

    
    const worker = new Worker(`${process.cwd()}/main.js`, { workerData: { fb_run_id, fb_uid, fb_id_token, projectName, email, fb_database_url } });

    worker.once("message", result => {
        console.log(`${number}th Fibonacci No: ${result}`);
    });

    worker.on("error", error => {
        console.log(error);
    });

    worker.on("exit", exitCode => {
        console.log(`It exited with code ${exitCode}`);
    })

    console.log("Execution in main thread");

}

module.exports = { mainWorker }
