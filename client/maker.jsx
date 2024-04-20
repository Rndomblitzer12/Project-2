const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect} = React;
const {createRoot} = require('react-dom/client');

const handleTweet = (e, onTweetAdded) => {
    e.preventDefault();
    helper.hideError();

    const tweetText = e.target.querySelector('#tweetText').value;

    if(!tweetText) {
        helper.handleError('All fiends are required');
        return false;
    }

    helper.sendPost(e.target.action, {tweetText}, onTweetAdded);
    return false;
}

const TweetForm = (props) => {
    return (
        <form id='tweetForm'
            onSubmit={(e) => handleTweet(e, props.triggerReload)}
            name='tweetForm'
            action='/maker'
            method='POST'
            className='tweetForm'
        >
            <label htmlFor='name'>Name: </label>
            <input id='tweetText' type='text' name='name' placeholder='Tweet Name' />
            <input className='makeTweetSubmit' type='submit' value='Make Tweet'/>
        </form>
    );
};

const TweetList = (props) => {
    const [tweets, setTweets] = useState(props.tweets);

    useEffect(() => {
        const loadTweetsFromServer = async () => {
            const response = await fetch('/getTweets');
            const data = await response.json();
            setTweets(data.tweets);
        };
        loadTweetsFromServer();
    }, [props.reloadTweets]);

    if(tweets.length === 0) {
        return (
            <div className='tweetList'>
                <h3 className='emptyTweet'>No Tweets Yet!</h3>
            </div>
        );
    }

    const tweetNodes = tweets.map(tweet => {
        return (
            <div key={tweet.id} className='tweet'>
                <img src='/assets/img/tweetface.jpeg' alt='tweet face' className='tweetFace'/>
                <h3 className='tweetName'>Name: {tweet.tweetText}</h3>
                
            </div>
        );
    });

    return (
        <div className='tweetList'>
            {tweetNodes}
        </div>
    );
};

const App = () => {
    const [reloadTweets, setReloadTweets] = useState(false);

    return (
        <div>
            <div id='makeTweet'>
                <TweetForm triggerReload={() => setReloadTweets(!reloadTweets)}/>
            </div>
            <div id='tweets'>
                <TweetList tweets={[]} reloadTweets={reloadTweets}/>
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render( <App />);
};

window.onload = init;
