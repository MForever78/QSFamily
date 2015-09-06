# API Reference

## Login

### Auth user

```
POST /user
```

#### Parameters

Name        | Type      | Description
----        | ----      | ----
username    | string    |
password    | string    | salted password
role        | string    | one of "teacher", "student" and "assistant"

#### Response

```json
{
    "code": 200,
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbiI6IjNVSm1ZbWdidHEyd0N0NTFDM3FadmkzV0xBczhmSXdMQkwzdkcxcUkvc00vL241V291Wk83Z3lEVCtsOGVlU0x3SDlPUDZLTVlIbGowbjhtYTQ3Qzc4OUU5b2NEWU9ubli9U0BdHVHZjJrPSIsImlhdCI6Ma80I0kM0OTU4OH0.xNjdrIWul11mYs3-dcz1lo831fHg8IMW_sgDwT0bLok"
}
```

## News

### Get news list

```
GET /news
```

#### Response

```json
{
    "code": 200,
    "newsList": [
        {
          "id": 4,
          "title": "間演我的來論口華真而一",
          "author": "me",
          "content": "sample content",
          "create_at": "2015-06-10T02:18:35.000Z",
          "update_at": "2015-09-04T06:24:25.000Z"
        },
        {
          "id": 2,
          "title": "人系這家動陽問在人命而",
          "author": "me",
          "content": "sample content",
          "create_at": "2015-06-09T12:09:10.000Z",
          "update_at": null
        }
    ]
}
```

### Get news by id

```
GET /news/:newsid
```

#### Response

```json
{
    "code": 200,
    "news": {
        "author": "foo",
        "content": "<p>bar</p>",
        "create_at": "2015-06-10T02:18:35.000Z",
        "date": "Wed Jun 10 2015 10:18:35 GMT+0800 (CST)",
        "id": 10,
        "title": "title",
        "update_at": "2015-06-10T02:20:35.000Z"
    }
}
```

### Create news

```
POST /news
```

**Require Authorization header**

#### Parameters

Name        | Type      | Description
----        | ----      | ----
title       | string    | 
content     | string    | HTML formated content

#### Response

The same as [Get news by id](#get-news-by-id).

### Delete news

```
DELETE /news/:newsid
```

**Require Authorization header**

#### Response

```json
{
    "code": 200
}
```

### Update news

```
PUT /news/:newsid
```

**Require Authorization header**

#### Response

The same as [Get news by id](#get-news-by-id).
