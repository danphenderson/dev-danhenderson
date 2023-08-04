# [danhenderson.dev](https://www.danhenderson.dev)

## `src`

The web application source code structure: 
```
.
├── Pipfile
├── Pipfile.lock
├── README.md
├── backend
│   ├── Dockerfile
│   ├── Dockerfile.prod
│   ├── app
│   ├── oauth2_google.json
│   ├── public
│   ├── pyproject.toml
│   └── requirements.txt
├── cloudformation
│   ├── cdk.json
│   ├── deploy.py
│   ├── requirements.txt
│   └── stacks/
├── docker-compose.yml
└── frontend
    ├── Dockerfile
    ├── node_modules
    ├── package-lock.json
    ├── package.json
    ├── public
    ├── src
    └── tsconfig.json
```

*backend*: 
http://localhost:8004

OpenAPI (re)docs: http://localhost:8004/docs | http://localhost:8004/redocs

*frontend*:

http://localhost:3000

*cloudformation:




## Useful commands

 * `cdk ls`          list all stacks in the app
 * `cdk synth`       emits the synthesized CloudFormation template
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk docs`        open CDK documentation

E
stacks
njoy!

## Development


dc up --build
 

### `cd backend/`


#### Ref:
https://levelup.gitconnected.com/building-a-website-starter-with-fastapi-92d077092864#e696
https://testdriven.io/courses/tdd-fastapi/
https://fastapi-users.github.io/fastapi-users/10.4/
https://www.gormanalysis.com/blog/many-to-many-relationships-in-fastapi/
https://testdriven.io/blog/docker-best-practices/#use-a-dockerignore-file
https://aws.amazon.com/blogs/containers/deploy-applications-on-amazon-ecs-using-docker-compose/


### `cd frontend/`

UI: http://localhost:3000


#### Ref:
https://raaviblog.com/how-to-connect-your-google-domain-to-aws-s3-hosted-static-website/



