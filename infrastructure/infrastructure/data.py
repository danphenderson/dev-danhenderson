from aws_cdk import (
    # Duration,
    Stack,
    # aws_sqs as sqs,
)
from constructs import Construct

class DataStack(Stack):
    """
    Data plane of danhenderson.dev.
    
    This stack will contain all data related resources, such as databases, queues, etc.
    """
    
    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)