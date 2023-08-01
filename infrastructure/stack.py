from aws_cdk import (
    core,
    aws_lambda as _lambda,
    aws_apigateway as apigw,
    aws_s3 as s3,
    aws_cloudfront as cf,
    aws_cloudfront_origins as origins,
    aws_rds as rds,
    aws_secretsmanager as sm,
)

class WebApp(core.Stack):

    def __init__(self, scope: core.Construct, id: str, **kwargs) -> None:
        super().__init__(scope, id, **kwargs)

        # Define the Lambda function
        backend_lambda = _lambda.Function(
            self, "BackendLambda",
            runtime=_lambda.Runtime.PYTHON_3_8,
            code=_lambda.Code.asset("lambda"),
            handler="handler.main",
        )

        # Define the API Gateway
        api = apigw.LambdaRestApi(
            self, "MyWebAppApi",
            handler=backend_lambda,
            proxy=False,
        )

        # Define the S3 bucket
        bucket = s3.Bucket(
            self, "MyWebAppBucket",
            public_read_access=True,
            website_index_document="index.html",
        )

        # Define the CloudFront distribution
        distribution = cf.Distribution(
            self, "MyWebAppDistribution",
            default_behavior=cf.BehaviorOptions(
                origin=origins.S3Origin(bucket)
            ),
        )

        # Generate a new secret for the RDS instance
        secret = sm.Secret(
            self, "MyWebAppSecret",
            generate_secret_string=sm.SecretStringGenerator(
                secret_string_template='{"username": "admin"}',
                generate_string_key="password",
                exclude_punctuation=True,
            )
        )

        # Define the RDS instance
        db = rds.DatabaseInstance(
            self, "MyWebAppDb",
            engine=rds.DatabaseInstanceEngine.postgres(
                version=rds.PostgresEngineVersion.VER_12_4
            ),
            instance_type=ec2.InstanceType.of(
                ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL
            ),
            vpc=vpc,
            credentials=rds.Credentials.from_secret(secret),
        )