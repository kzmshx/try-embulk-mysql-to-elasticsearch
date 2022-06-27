#!/usr/bin/env zx

const baseUrl = "http://localhost:9200"
const indexName = "index-customer"
const indexJsonPath = __dirname + "/index-customer.json"

await $`curl -X PUT -H "Content-Type: application/json" ${baseUrl}/${indexName}?include_type_name=true -d @${indexJsonPath}`
