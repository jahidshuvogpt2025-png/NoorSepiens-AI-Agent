const { exec } = require("child_process");

const VPS_IP = "138.252.124.97";

function runCommand(command) {
    return new Promise((resolve) => {
        exec(command, { timeout: 120000 }, (error, stdout, stderr) => {
            if (error) {
                resolve(stderr || error.message);
            } else {
                resolve(stdout);
            }
        });
    });
}


async function securityAgent(request) {

    const text = request.toLowerCase();

    let report = "";

    // Port Scan
    if (
        text.includes("port") ||
        text.includes("scan") ||
        text.includes("security")
    ) {

        const nmap = await runCommand(
            `nmap -sV ${VPS_IP}`
        );

        const ufw = await runCommand(
            "ufw status"
        );

        const ssh = await runCommand(
            "sshd -T | grep -E 'permitrootlogin|passwordauthentication'"
        );


        report = `
🛡 Security Analysis Report

🌐 Server:
${VPS_IP}


🔎 Port Scan:

${nmap}


🔥 Firewall:

${ufw}


🔐 SSH Security:

${ssh}


🤖 AI Recommendation:

- Check unnecessary open ports
- Disable unused services
- Enable firewall
- Use SSH key authentication
`;

    }


    // Web Scan
    else if (
        text.includes("web") ||
        text.includes("website")
    ) {

        const nikto = await runCommand(
            `nikto -h ${VPS_IP}`
        );

        report = `
🛡 Web Security Report

Tool:
Nikto

Result:

${nikto}
`;

    }


    else {

        report = "Security command not recognized.";
    }


    return report;
}


module.exports = securityAgent;
