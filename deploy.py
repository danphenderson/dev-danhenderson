#!/usr/bin/env python3
import os

import aws_cdk as cdk

from infrastructure import stack


app = cdk.App()


app.synth()
