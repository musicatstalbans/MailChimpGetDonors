const core = require('@actions/core');
const github = require('@actions/github');
const mailchimp = require('@mailchimp/mailchimp_marketing');
const axios = require('axios');

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

        async function getDonors() {
            let config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: 'https://us3.api.mailchimp.com/3.0/lists/' + mailchimp_list_id + '/segments/' + mailchimp_segment_id + '/members?fields=members.merge_fields',
                headers: {
                    'Authorization': 'Bearer ' + mailchimp_token
                }
            };

            axios.request(config)
                .then((response) => {
                    console.log(JSON.stringify(response.data));
                })
                .catch((error) => {
                    console.log(error);
                });
        }

        getDonors();

    } catch (error) {
        core.setFailed(error.message);
    }
}

// Call the main function to run the action
main();