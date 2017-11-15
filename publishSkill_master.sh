rm lambda.zip
cd lambda
npm install
zip -r ../lambda.zip *
cd ..
aws lambda update-function-configuration --function-name AlexaOblic --description "give an oblic strategy" --role arn:aws:iam::398750413546:role/LambdaFullAccess --handler indexSkill.handler --timeout 10 --memory-size 1024 --environment Variables="{ALEXA_APP_ID=amzn1.ask.skill.b6e260ca-3a10-4b38-b4fd-d2c704f9b1ef,EVENT_TABLE=OblicStrategyEvent,SESSION_TABLE=OblicStrategy}" --profile alexa
aws lambda update-function-code --function-name AlexaOblic --zip-file fileb://lambda.zip --profile alexa
ask deploy --target skill
ask deploy --target model
