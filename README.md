# mangogrep

A command-line utility that "greps" stdin, applying a CouchDB-style Mango "selector" to filter the data, with matching items being passed to stdout.

If we have a a "jsonl" file (one JSON object per line in a text file) (or one array of objects per line):

```js
{"_id":"735030","_rev":"1-a6a5871f06709450a7e3d14fccf4484c","name":"Náousa","latitude":40.62944,"longitude":22.06806,"country":"GR","population":19887,"timezone":"Europe/Athens","_revisions":{"start":1,"ids":["a6a5871f06709450a7e3d14fccf4484c"]}}
{"_id":"735861","_rev":"1-73f30984f6891cdcc0dfdcfe6277233d","name":"Kavála","latitude":40.93959,"longitude":24.40687,"country":"GR","population":54027,"timezone":"Europe/Athens","_revisions":{"start":1,"ids":["73f30984f6891cdcc0dfdcfe6277233d"]}}
{"_id":"694864","_rev":"1-09af55b85cac9974b691abf0f621dec0","name":"Sambir","latitude":49.5183,"longitude":23.19752,"country":"UA","population":35197,"timezone":"Europe/Kiev","_revisions":{"start":1,"ids":["09af55b85cac9974b691abf0f621dec0"]}}
```

We can use `mangogrep` to extract a subset of the data:

```sh
# find documents that contain a 'country' field whose value is 'UA'
$ cat myfile.jsonl | mangogrep --selector '{"country":"UA"}'
{"_id":"694864","_rev":"1-09af55b85cac9974b691abf0f621dec0","name":"Sambir","latitude":49.5183,"longitude":23.19752,"country":"UA","population":35197,"timezone":"Europe/Kiev","_revisions":{"start":1,"ids":["09af55b85cac9974b691abf0f621dec0"]}}
```

## Installation

Requires Node.js & npm

```sh
npm install -g mangogrep
```

## Usage

- `--selector`/`-s` - the Mango Selector to apply to the incoming data e.g. `{"latitude":{"$gt":54.5}}`
- `--where`/`-w` - the SQL 'where' clause to apply to the incoming data e.g. `latitude > 54.5`
- `--debug`/`-d` - output the selector to stderr
- `--help` - output help

If neither `selector` or `where` are supplied, then all incoming data makes it to the output, one object per line.

## Example usage

### JSONL files

JSONL files contain one JSON object per line of output. The [couchsnap](https://www.npmjs.com/package/couchsnap) utiltity creates such files, so `mangogrep` is good for finding slices of data from a single backup snapshot:

```sh
# find a single document id from a single file
cat mydb-snapshot-2022-11-09T16:04:51.041Z.jsonl | mangogrep --where "_id='0021MQOXCM3HNHAF'"
```

or all of your backup snapshots:

```sh
# see the history of single document id from multiple snapshot files
cat mydb-snapshot* | mangogrep --where "_id='0021MQOXCM3HNHAF'"
```

The query can be complex, with lots of ANDs and ORs:

```sh
# find documents with a combination of SQL-like AND/OR clauses
cat mydb-snapshot* | mangogrep --where "(active=true OR email_verified=true) AND email='lydia.gordon@hotmail.com'"
```

Or you can use Mango selectors, which unlocks per-field regular expressions:

```sh
# use a regular expression on the email field to find all documents with hotmail email fields
cat mydb-snapshot* | mangogrep --selector '{"email":{"$regex":"@hotmail"}}'
```

### Couchbackup files

[@cloudant/couchbackup](https://www.npmjs.com/package/@cloudant/couchbackup) stores its backup data in text files containing an array of documents per line, but `mangogrep` will handle this as if they were JSONL files.

```sh
# backup your data
couchbackup --db users > users.txt

# query the backup data set, piping the output to a file
cat users.txt | mangogrep --where "joined>'2022-01-01'" > 2022_users.jsonl
```

## Aggregation

You may combine `mangogrep` with other command-line tools for aggregating answers:

```sh
# count users who joined this year and are active
cat users.txt | mangogrep --where "joined>'2022-01-01' AND active=true" | wc -l
```
