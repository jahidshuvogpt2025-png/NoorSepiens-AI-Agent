const { exec } = require("child_process");

const VPS_IP = process.env.VPS_IP || "138.252.124.97";


function runCommand(command) {
    return new Promise((resolve) => {

        exec(command, { timeout: 120000 }, (error, stdout, stderr) => {

            if (error) {
                resolve(`ERROR: ${error.message}`);
                return;
            }

            resolve(stdout || stderr);

        });

    });
}



async function securityAgent(request) {

    const text = request.toLowerCase();

    let report = "";

    report += "🛡 Security Analysis Report\n\n";
    report += `🌐 Server: ${VPS_IP}\n\n`;


    // PORT SCAN
    if (
        text.includes("port") ||
        text.includes("scan") ||
        text.includes("nmap")
    ) {

        report += "🔎 Port Scan:\n\n";

        const nmap = await runCommand(
            `nmap -sV ${VPS_IP}`
        );

        report += nmap + "\n\n";
    }



    // FIREWALL
    if (
        text.includes("firewall") ||
        text.includes("ufw")
    ) {

        report += "🔥 Firewall:\n\n";

        const ufw = await runCommand(
            "ufw status"
        );

        report += ufw + "\n\n";
    }



    // SSH SECURITY
    if (
        text.includes("ssh") ||
        text.includes("login")
    ) {

        report += "🔐 SSH Security:\n\n";

        const ssh = await runCommand(
            "grep -E 'PermitRootLogin|PasswordAuthentication' /etc/ssh/sshd_config"
        );

        report += ssh + "\n\n";
    }



    // WEB SCAN
    if (
        text.includes("web") ||
        text.includes("website") ||
        text.includes("nikto")
    ) {

        report += "🌍 Web Security:\n\n";

        const nikto = await runCommand(
            `nikto -h ${VPS_IP}`
        );

        report += nikto + "\n\n";
    }



    // SYSTEM CHECK
    if (
        text.includes("system") ||
        text.includes("server")
    ) {

        report += "⚙️ System:\n\n";

        const system = await runCommand(
            "uptime && free -h && df -h"
        );

        report += system + "\n\n";
    }



    report +=
`
🤖 AI Recommendation:

- Check unnecessary open ports
- Disable unused services
- Keep firewall active
- Use SSH key authentication
- Update packages regularly
`;


    return report;

}


module.exports = securityAgent;
