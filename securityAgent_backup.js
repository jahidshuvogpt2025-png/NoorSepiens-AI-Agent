const { exec } = require("child_process");

function runSecurityTool(command) {

    return new Promise((resolve, reject) => {

        exec(
            `docker exec kali-lab2 ${command}`,
            {
                timeout: 60000
            },
            (error, stdout, stderr) => {

                if (error) {
                    reject(error.message);
                    return;
                }

                resolve(stdout || stderr);

            }
        );

    });

}


module.exports = runSecurityTool;
