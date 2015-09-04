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

### Get news by id

```
GET /:newsid
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
