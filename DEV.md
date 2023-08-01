## TODO:

1. Define developer image for backend.
  - docker-compose.yml uses environment variables from one file?
  - Dockerfile uses `backend/requirements.txt`, declaring python API deps.
  - Add `ping` route, test ping. 10min

2. Define developer image for frontend.

3. Define AWS CDK stack.
  - Use the stack image generator tool.
  - Reaserch VPC and Cloudfront with ECS.

4. Define aws cdk pipeline
  - Add a github action by containerizing the infrastructure python package.
      