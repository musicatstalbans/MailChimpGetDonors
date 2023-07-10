const core = require('@actions/core');
const github = require('@actions/github');
const mailchimp = require('@mailchimp/mailchimp_marketing');
const donors = require('./donors');
const { default: retrieveDonors } = require('./donors');


const main = async () => {
    try {
        const mailchimp_list_id = core.getInput('mailchimp-list-id', { required: true });
        const mailchimp_segment_id = core.getInput('mailchimp-segment-id', { required: true });
        const mailchimp_token = core.getInput('mailchimp-token', { required: true });
        const mailchimp_server_prefix = core.getInput('mailchimp-server-prefix', { required: true });

        mailchimp.setConfig({
            apiKey: mailchimp_token,
            server: mailchimp_server_prefix,
        });

        async function callPing() {
            const response = await mailchimp.ping.get();
            console.log(response);
        }

        retrieveDonors(mailchimp_list_id, mailchimp_segment_id, mailchimp_token);

    } catch (error) {
        core.setFailed(error.message);
    }
}

// Call the main function to run the action
main();