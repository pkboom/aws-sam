npm init -y

```yaml
# template.yml
Resources:
  . . .
  QuotesScraperFunction:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: quotes-scraper/
      Handler: app.lambdaHandler
      Runtime: nodejs18.x
      Architectures:
        - x86_64
      Events:
        QuotesScraper:
          Type: Api
          Properties:
            Path: /quotes
            Method: get

Output:
  . . .
  QuotesScraperApi:
    Description: "API Gateway endpoint URL for Prod stage for Quotes Scraper function"
    Value: !Sub "https://${ServerlessRestApi}.execute-api.${AWS::Region}.amazonaws.com/Prod/quotes/"
  QuotesScraperFunction:
    Description: "Quotes Scraper Function ARN"
    Value: !GetAtt QuotesScraperFunction.Arn
  QuotesScraperFunctionIamRole:
    Description: "Implicit IAM Role created for Quotes Scraper function"
    Value: !GetAtt QuotesScraperFunctionRole.Arn
```
