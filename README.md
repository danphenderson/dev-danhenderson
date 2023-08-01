# dev-danhenderson
A React+FastAPI web application powering danhenderson.dev.

To add additional dependencies, for example other CDK libraries, just add
them to your `setup.py` file and rerun the `pip install -r requirements.txt`
command.

## Useful commands

 * `cdk ls`          list all stacks in the app
 * `cdk synth`       emits the synthesized CloudFormation template
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk docs`        open CDK documentation

Enjoy!

## Development
```
├── backend
    ├── app
    ├── ...
└── frontend
    ├── src
    ├── ...
```

dc up --build
 

### `cd backend/`

API: http://localhost1:8004
OpenAPI (re)docs: http://localhost:8004/docs | http://localhost:8004/redocs

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



