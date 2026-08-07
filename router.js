const askAI = require("./ai");
const securityAgent = require("./securityAgent");


async function router(messages) {

    const userText = messages[messages.length - 1].content.toLowerCase();


    const securityWords = [
        "scan",
        "security",
        "port",
        "nmap",
        "nikto",
        "vulnerability",
        "সিকিউরিটি",
        "স্ক্যান",
        "পোর্ট",
        "ওয়েব"
    ];


    const isSecurity = securityWords.some(word =>
        userText.includes(word)
    );


    if (isSecurity) {

        console.log("🛡 Security Agent Activated");

        return await securityAgent(userText);

    }


    return await askAI(messages);

}


module.exports = router;
