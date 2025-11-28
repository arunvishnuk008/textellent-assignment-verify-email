const hunterData = $("Hunter").first().json; // Access the main data object from Hunter response
const uProc = $("uProc").first().json;

const webhookData = $("Webhook").first().json.body;

let spamStatus = "no";
if (!uProc.result || hunterData.disposable || hunterData.webmail) { // Hunter uses boolean flags for these
    spamStatus = "yes";
}

// Hunter provides a confidence score from 0-100
let confidenceLevel = "low";
if (hunterData.score >= 80) {
    confidenceLevel = "high";
} else if (hunterData.score >= 50) {
    confidenceLevel = "medium";
}

if (webhookData.emailDomain !== uProc.message.email) {
    spamStatus = "yes";
    confidenceLevel = "high";
}

let resultStatus = "vetting";
// if (hunterData.status === "valid" || hunterData.status === "accept_all") {
//     resultStatus = "passed";
// } else if (hunterData.status === "invalid" || hunterData.status === "unknown") {
//     resultStatus = "failed";
// }

if (spamStatus == "yes" && confidenceLevel == "high") {
    resultStatus = "failed"
} else if (spamStatus == "no" && confidenceLevel === "high") {
    resultStatus = "passed"
} else {
    resultStatus = "vetting"
}

let reasonString = "The email address has been verified.";
if (spamStatus === "yes") {
    reasonString = "The email address is from a general domain like gmail or a disposable email service or it does not exist and rejects mail";
}

return [{
    json: {
        spam: spamStatus,
        confidence: confidenceLevel,
        reason: reasonString,
        result: resultStatus
    }
}];