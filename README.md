# MailChimpGetDonors
Retrieves donors from MailChimp API

Uses MailChimp API to query a specific list and segment of contacts

The segment ID can be found by hovering over the segment name in Audience->Segments page. It will be the segment_id of the URL displayed.

The list ID (aka Audience ID) can be found in the Audience name and defaults section of Audience Settings. 

Any changes require re-bundling and pushing repo


# Bundling

`./node_modules/.bin/esbuild index.js --bundle --outfile=dist/index.js --platform=node`