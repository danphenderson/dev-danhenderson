#!/usr/bin/env python3
import os

import aws_cdk as cdk

from infrastructure.data import DataStack
from infrastructure.frontend import FrontendStack
from infrastructure.backend import BackendStack


app = cdk.App()
DataStack(app, "DataStack")
FrontendStack(app, "FrontendStack")
BackendStack(app, "BackendStack")

app.synth()
