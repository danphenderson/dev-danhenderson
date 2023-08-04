#!/usr/bin/env python3
import os

import aws_cdk as cdk

from aws_stack.aws_stack_stack import AwsStackStack


app = cdk.App()
AwsStackStack(app, "AwsStackStack")

app.synth()
