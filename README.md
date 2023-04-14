# TRG twitter bot

Bot to upload screenshots of retro games using the twitter API

Can be run with the following parameters:

| Parameter        | Default | Type                                                           | Description                                                                                     |
| ---------------- | ------- | -------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `--dry`          | `false` | _flag_                                                         | When `true` it will not send the tweet                                                          |
| `--gameId`       |         | `string` \| `number`                                           | When specified will tweet about that game                                                       |
| `--platforms`    |         | [PlatformType](./src/game-source/base/platform/constants.ts)[] | When specified will not use a random platform. Array (list) specified by a comma separated list |
| `--year`         |         | `number`                                                       | When specified will tweet a game of this year                                                   |
| `--reset`        | `false` | _flag_                                                         | If `true`, will clear the database                                                              |
| `--skipCleaning` | `false` | _flag_                                                         | When specified, images used for the tweet won't be deleted                                      |
| `--log.silent`   | `false` | _flag_                                                         | If `true`, will not log anything                                                                |
| `--log.console`  | `true`  | `boolean`                                                      | When `false`, will not log into the console                                                     |
| `--log.file`     | `true`  | `boolean`                                                      | When `false`, will not log into the logfile                                                     |
| `--log.level`    | `info`  | [LoggerLevel](./src/utils/logger/index.ts)                     | Minimum level of the messages to log                                                            |

**Note 1**: All parameters are specified as `--NAME=VALUE` (not separated by spaces, nor single-dash flags, etc.), except **flags** that are `true` when present and `false` when not (i.e. `--skipCleaning`).

i.e.:

> npm run start -- --year=1992 --platform=dos

**Note 2**: booleans can specified by the following values:

| Value   | Accepted strings              |
| ------- | ----------------------------- |
| `true`  | `"1"` \| `"on"` \| `"true"`   |
| `false` | `"0"` \| `"off"` \| `"false"` |
