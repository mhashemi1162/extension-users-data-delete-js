
<div align="center">
    <a href="https://swashapp.io/" target="blank">
        <img src="https://swashapp.io/static/images/logo/swash/s-logo.svg" width="80" alt="Swash Logo" />
    </a>
</div>

<div align="center">
    <b>Swash, reimagining data ownership</b>
</div>

# data sellers script

Swash data sellers script is an application to transform daily data of Swash's data providers into the Redshift. It is developed by Typescript using [TypeORM](https://typeorm.io) framework.

## Environment Variables

The project use .env files to read environment variables.

**PS: DO NOT commit or push other .env profiles or .env files with values**

Current supported environment variables are:

```bash
# Environment
NODE_ENV=                                                     # Required, environment mode (development|production)
SUPPLIER_COMPANY=                                             # Required, data supplier company

# Time Parameters
CONTINUE_LAST_STATE=                                          # Required, continue from the last state that was saved in the database, or start over at START-DATE (true|false)
START_DATE=                                                   # Optional, from date (example: 02-19-2023 00:00:00)
END_DATE=                                                     # Optional, to date (example: 02-20-2023 00:00:00)
INTERVAL_HOURS=                                               # Required, time interval of each data transforming (default: 1)

# MySQL Database
DATABASE_HOST=                                                # Required, Url of the mysql service. Default: 127.0.0.1 
DATABASE_PORT=                                                # Required, Port of the mysql service. Default: 13306
DATABASE_USER=                                                # Required, Username of the mysql service.
DATABASE_PASS=                                                # Required, Password of the mysql service.
DATABASE_NAME=                                                # Required, Database of the mysql service.

# Redshift Database
REDSHIFT_START=                                               # Required, start redshift service or not (true|false)
REDSHIFT_STOP=                                                # Required, stop redshift service or not (true|false)
REDSHIFT_STATUS_FUNCTION_PROFILE=                             # Optional, user's profile name which has access to start and stop the redshift

REDSHIFT_DATABASE_HOST=                                       # Required, Url of the redshift service
REDSHIFT_DATABASE_PORT=                                       # Required, Port of the redshift service. Default: 5439
REDSHIFT_DATABASE_NAME=                                       # Required, Database of the redshift service
REDSHIFT_DATABASE_USER=                                       # Required, Username of the redshift service
REDSHIFT_DATABASE_PASS=                                       # Required, Password of the redshift service
REDSHIFT_SECRET_ARN=                                          # Required, secret ARN of the redshift service
REDSHIFT_CLUSTER_ID=                                          # Required, cluster identifier of the redshift service
REDSHIFT_DATABASE_POOL_TIMEOUT_SEC=                           # Required, pooling the raw data receipt timeout

# AWS Parameters
AWS_REGION=                                                   # Required, aws region
AWS_ACCESS_KEY=                                               # Required, aws access key
AWS_SECRET_KEY=                                               # Required, aws secret key

# S3 Parameters
AWS_SOURCE_BUCKET_NAME=                                       # Required, seller bucket's name
AWS_TMP_BUCKET_NAME=                                          # Required, swash archive bucket's name
SOURCE_BUCKET_POOL_TIMEOUT_SEC=                               # Required, seller bucket's pooling timeout

# Mailgun Parameters
MAILGUN_API_KEY=                                              # Required, mailgun API key
MAILGUN_DOMAIN=                                               # Required, mailgun domain (example: sandbox44e4f6dsds60fdfdsghv92adsds1c0c11d.mailgun.org)
MAILGUN_EMAIL=                                                # Required, mailgun email (example: data_sellers_script@sandbox44e4f6dsds60fdfdsghv92adsds1c0c11d.mailgun.org)
MAILGUN_EMAIL_NAME=                                           # Required, mailgun email name (example: Data sellers Script)
RECIPIENT_EMAILS=                                             # Required, recipient emails (eparated by comma)

```

## How to install dependencies

Installing all the dependencies is just simple as running one of the following commands:

NPM:

```bash
npm install
```

Yarn:

```bash
yarn install
```

## How to start the script

After installing dependencies, running the following command will start the script.

NPM:

```bash
npm run start
```

Yarn:

```bash
yarn run start
```

# Copyright

Copyright © Swashapp.io 2023. All rights reserved.
