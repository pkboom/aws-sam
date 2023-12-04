sam init --runtime nodejs18.x --name reverse-lookup

Run docker

sam build && sam local invoke

sam build && sam deploy -g

sam remote invoke
