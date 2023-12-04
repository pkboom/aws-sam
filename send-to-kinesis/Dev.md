sam local generate-event sqs receive-message --body '{\"asdf\": \"asf\"}' > events/google.json

sam local generate-event sqs receive-message --body google.eml > events/google.json
sam local generate-event sqs receive-message --body whisnantstrategies.eml > events/whisnantstrategies.json

sam build
sam local invoke --event events/google.json

sam build
sam local invoke --event events/whisnantstrategies.json

sam build && sam deploy

sam deploy
node afterDeploy.mjs

sam sync --watch

cd dmarc
sam logs --tail

sam remote invoke --event-file events/google.json
sam remote invoke --event-file events/whisnantstrategies.json

node beforeDelete.mjs
sam delete --no-prompts
