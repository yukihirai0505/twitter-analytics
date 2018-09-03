import React from 'react'

export default ({twitter}) => {
  const twitterLink = `https://twitter.com/${
    twitter.user.screen_name
  }/statuses/${twitter.id_str}`
  return (
    <blockquote className="twitter-tweet">
      <p className="ja" dir="ltr">
        {twitter.text}{' '}
        <span dangerouslySetInnerHTML={{ __html: twitter.source }} />
      </p>
      — {twitter.user.name} (@
      {twitter.user.screen_name}) <a href={twitterLink}>{twitter.created_at}</a>
      <style jsx>
        {`
          blockquote.twitter-tweet {
            display: inline-block;
            font-family: 'Helvetica Neue', Roboto, 'Segoe UI', Calibri,
              sans-serif;
            font-size: 12px;
            font-weight: bold;
            line-height: 16px;
            border-color: #eee #ddd #bbb;
            border-radius: 5px;
            border-style: solid;
            border-width: 1px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
            margin: 10px 5px;
            padding: 0 16px 16px 16px;
            max-width: 468px;
          }

          blockquote.twitter-tweet p {
            font-size: 16px;
            font-weight: normal;
            line-height: 20px;
          }

          blockquote.twitter-tweet a {
            color: inherit;
            font-weight: normal;
            text-decoration: none;
            outline: 0 none;
          }

          blockquote.twitter-tweet a:hover,
          blockquote.twitter-tweet a:focus {
            text-decoration: underline;
          }
        `}
      </style>
    </blockquote>
  )
}