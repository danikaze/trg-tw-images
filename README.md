# TRG twitter bot

Bot to upload screenshots of retro games using the twitter API

## Environment variables

### App

| envvar                        | Required | Description                                                           |
| ----------------------------- | -------- | --------------------------------------------------------------------- |
| `LANG`                        | ✔        | Language of the tweet text (`es` \| `en`)                             |
| `PRINT_BUILD_CONSTANTS`       |          | When `true`, it will print the webpack build constants                |
| `PATH_LOGS_FOLDER`            |          | Folder to store logs. (`logs` by default)                             |
| `TWITTER_ACCOUNT_NAME`        | tw       | Name of the @twitter account (with or without `@`)                    |
| `TWITTER_API_KEY`             | tw       |                                                                       |
| `TWITTER_API_KEY_SECRET`      | tw       |                                                                       |
| `TWITTER_ACCESS_TOKEN`        | tw       |                                                                       |
| `TWITTER_ACCESS_TOKEN_SECRET` | tw       |                                                                       |
| `BLUESKY_ACCOUNT_NAME`        | bs       | Name of the bsky account as `username.bsky.social` or just `username` |
| `BLUESKY_PASSWORD`            | bs       | Encoded in base64                                                     |
| `PATH_TEMP_FOLDER`            |          |                                                                       |
| `PATH_DATA_FOLDER`            |          |                                                                       |

### MobyGames

| envvar                     | Required | Default | Description                                            |
| -------------------------- | -------- | ------- | ------------------------------------------------------ |
| `MG_API_KEY`               | ✔        |         |
| `MG_GAMES_UPDATES_PER_RUN` |          | `500`   | Number of games to fetch into the database in each run |

## cli parameters

Can be run with the following parameters:

| Parameter        | Default     | Type                                                           | Description                                                                                     |
| ---------------- | ----------- | -------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `--gameSource`   | `mobygames` | [GameSourceType](./src/game-source/types.ts)                   | Source for the games to use                                                                     |
| `--dry`          | `false`     | _flag_                                                         | When `true` it will not send the tweet                                                          |
| `--gameId`       |             | `string` \| `number`                                           | When specified will tweet about that game                                                       |
| `--platforms`    |             | [PlatformType](./src/game-source/base/platform/constants.ts)[] | When specified will not use a random platform. Array (list) specified by a comma separated list |
| `--year`         |             | `number`                                                       | When specified will tweet a game of this year (and override `minYear` and `maxYear`)            |
| `--minYear`      | `1970`      | `number`                                                       | No game before this year will be chosen                                                         |
| `--maxYear`      | `1998`      | `number`                                                       | No game after this year will be chosen                                                          |
| `--skipCleaning` | `false`     | _flag_                                                         | When specified, images used for the tweet won't be deleted                                      |
| `--log.silent`   | `false`     | _flag_                                                         | If `true`, will not log anything                                                                |
| `--log.console`  | `true`      | `boolean`                                                      | When `false`, will not log into the console                                                     |
| `--log.file`     | `true`      | `boolean`                                                      | When `false`, will not log into the logfile                                                     |
| `--log.level`    | `info`      | [LoggerLevel](./src/utils/logger/index.ts)                     | Minimum level of the messages to log                                                            |

**Note 1**: All parameters are specified as `--NAME=VALUE` (not separated by spaces, nor single-dash flags, etc.), except **flags** that are `true` when present and `false` when not (i.e. `--skipCleaning`).

i.e.:

> npm run start -- --year=1992 --platform=dos

**Note 2**: booleans can specified by the following values:

| Value   | Accepted strings              |
| ------- | ----------------------------- |
| `true`  | `"1"` \| `"on"` \| `"true"`   |
| `false` | `"0"` \| `"off"` \| `"false"` |
