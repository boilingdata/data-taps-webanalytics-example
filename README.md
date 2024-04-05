# Browser -- Data Tap -- S3

<p align="center">
  <img src="img/web-analytics-architecture.png" title="simple architecture">
</p>

This is an e2e web analytics data collection example.

The Data Tap runs on your AWS Account, whilst BoilingData cloud is used to run analytics over the collected data.

## Prerequisites

First, you need a Data Tap on your AWS Account. You can follow these instructions.
https://github.com/boilingdata/data-taps-template/tree/main/aws_sam_template

**NOTE**: Please start with an S3 Express Bucket as it will speed up analytics phase. For using S3 Express (Directory) Buckets, you need to be in AWS region that supports them.

Export fresh tap token as TAP_TOKEN environment variable and TAP_URL env var as the Tap ingestion URL endpoint.

```shell
export TAP_URL='https://...'
# If you send to your own Data Tap (sharing user is the as your BoilingData username)
export TAP_TOKEN=`bdcli account tap-client-token --disable-spinner | jq -r .bdTapToken`
# If you send to somebody else's Data Tap, replace "boilingSharingUsername"
export TAP_TOKEN=`bdcli account tap-client-token --sharing-user boilingSharingUsername --disable-spinner | jq -r .bdTapToken`
```

## Collecting Data

This repository contains a JS snippet you can put on web pages and it will send analytics data to configured Data Tap. It sends newline JSON events with various types. It collects page load, click, and mouse movement events. Using this data while having the URL where the snippet is being run allows you to for example re-construct the users' activity on the page and visualize the mouse movements. Some companies do this for you as a service too.

The JavaScript is on [src/webclient.js](src/webclient.js). We could put it as-is into the web page but it helps to tree-shake compile it into minified version so that loading it is more efficient. We use [esbuild](https://esbuild.github.io/) for this purpose.

Build the source and open the generated HTML file on your browser and start clicking and moving your mouse. You can check the browser developer console when the JS sends the data to the Data Tap (fetch calls). Please note that this script is very rudimentary.

```shell
yarn install
yarn build
yarn open # or open the generated test.html file manually with your Browser
```

## Checking Data

You can check the uploaded Parquet files in your S3 bucket and download them to your local laptop and get a glimpse into them with e.g. [DuckDB](https://duckdb.org/).

```shell
aws s3 sync s3://YOURBUCKET/datataps/ d/
duckdb -s "SELECT COUNT(*) AS events, eventType FROM parquet_scan('./d/**/*.parquet') GROUP BY eventType;"
┌────────┬───────────┐
│ events │ eventType │
│ int64  │  varchar  │
├────────┼───────────┤
│      1 │ pageleave │
│      4 │ pageload  │
│     92 │ click     │
│      1 │ keydown   │
│   2440 │ mousemove │
└────────┴───────────┘
```

Alternatively you can run the analytics on the cloud side with BoilingData. For example, a one-off SQL query with bdcli.

```shell
bdcli api query  -s "SELECT COUNT(*) AS events, eventType FROM parquet_scan('s3://YOURBUCKET/datataps/') GROUP BY eventType;"

```
