#!/usr/bin/env python3
import os

import aws_cdk as cdk

from infrastructure.stack import 


app = cdk.App()
DataStack(app, "DataStack")
FrontendStack(app, "FrontendStack")
BackendStack(app, "BackendStack")

app.synth()
