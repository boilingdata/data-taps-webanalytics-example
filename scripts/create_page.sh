#!/bin/bash

echo "<html><head><script>" > test.html

cat dist/index.js >> test.html
echo "</script></head><body><h1>Test</h1><p>This page includes web tracking JS code example.</p></body></html>" >> test.html