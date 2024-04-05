#!/bin/bash

echo "<html><head><script>" > test.html
cat dist/index.js >> test.html
echo "</script></head><style>body { font-family: Arial, sans-serif;}</style><body><h1>Web Analytics Architecture</h1><p align="left"><img src="img/web-analytics-architecture.png" title="simple architecture" style="width:80%"></p>
<h4>This page includes web analytics JS code example that records clicks and mouse movements and sends them periodically to Data Tap, which stores them as Parquet files on S3.</h4></body></html>" >> test.html