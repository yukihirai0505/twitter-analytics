import React, { Component } from 'react'
import App from '../components/App'
import Link from 'next/link'
import { auth, providerTwitter, configs } from '../config'
import cookies from 'next-cookies'
import Cookies from 'js-cookie'
import {
  embed,
  getBeneficialTweets,
  saveUserToken,
  searchUser
} from '../utils/api'

class Index extends Component {
  static async getInitialProps(ctx) {
    // NOTICE: It is not possible to call non-google APIs using the free Spark plan as explained on the Firebase pricing page:
    // ref: https://stackoverflow.com/questions/43415759/use-firebase-cloud-function-to-send-post-request-to-non-google-server
    const { yabami_auth } = cookies(ctx)
    return {}
  }

  constructor(props) {
    super(props)
    this.state = {
      user: undefined,
      twitterUsers: [],
      tweets: []
    }
  }

  async componentDidMount() {
    auth.onAuthStateChanged(user => {
      this.setState({ user })
    })

    const result = await auth.getRedirectResult().catch(error => {
      console.log('redirect result', error)
    })

    console.log('redirect result', result)
    const user = result.user
    if (user) {
      const res = await saveUserToken(result)
      console.log(res)
      Cookies.set('yabami_auth', res.data.jwt)
      this.setState({ user })
    }
  }

  handleLogin = () => {
    auth.signInWithRedirect(providerTwitter)
  }

  handleSignOut = () => {
    auth
      .signOut()
      .then(result => {
        this.setState({ user: undefined })
      })
      .catch(error => {
        console.log(error)
      })
  }

  searchTwitterUser = async () => {
    const users = await searchUser('takapon_jp')
    if (users) {
      this.setState({ twitterUsers: users.data })
    }
    const tweets = await getBeneficialTweets()
    if (tweets) {
      let newTweets = []
      tweets.data.forEach(async twitter => {
        const url = `https://twitter.com/${twitter.user.screen_name}/statuses/${
          twitter.id_str
        }`
        const embed = await embed(url)
        newTweets.push(embed.data)
        this.setState({ tweets: newTweets })
      })
    }
  }

  render() {
    const { user, twitterUsers, tweets } = this.state
    return (
      <App>
        <h1>{user ? `Login: ${user.displayName}` : 'Not Login'}</h1>
        <ul>
          {twitterUsers.map(twitterUser => (
            <li key={twitterUser.id}>
              <Link
                as={`/p/${twitterUser.id}`}
                href={`/post?id=${twitterUser.name}`}
              >
                <a>{twitterUser.screen_name}</a>
              </Link>
            </li>
          ))}
        </ul>
        {tweets.map((twitter, index) => (
          <div key={index} dangerouslySetInnerHTML={{ __html: twitter }} />
        ))}
        {user && (
          <button onClick={this.searchTwitterUser}>Search Twitter User</button>
        )}
        {user ? (
          <div>
            <button onClick={this.handleSignOut}>Sign Out</button>
          </div>
        ) : (
          <button onClick={this.handleLogin}>Login with Twitter</button>
        )}
        <style jsx global>
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
      </App>
    )
  }
}

export default Index
