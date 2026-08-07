const askAI = require("./ai");
const runSecurity = require("./securityAgent");

async function router(messages) {

    const userText = messages[messages.length - 1].content.toLowerCase();


    // Security request detect
    const securityWords = [
        "scan",
        "port",
        "nmap",
        "security",
        "vulnerability",
        "সিকিউরিটি",
        "পোর্ট",
        "স্ক্যান"
    ];


    const needSecurity = securityWords.some(word =>
        userText.includes(word)
    );


    if (needSecurity) {

        console.log("🛡 Security tool selected");


        const result = await runSecurity(
            "nmap --version"
        );


        return `
🛡 Security Analysis

${result}

AI Security module ready.
        `;
    }


    // Normal AI
    return await askAI(messages);

}


module.exports = router;
