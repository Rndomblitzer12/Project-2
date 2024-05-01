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
            <label htmlFor='name'>Write a Tweet: </label>
            <input id='tweetText' type='text' name='name' placeholder='Tweet Name' />
            <input className='makeTweetSubmit' type='submit' value='Make Tweet'/>
        </form>
    );
};

const TweetList = (props) => {
    const [tweets, setTweets] = useState(props.tweets);
    const [showDeleteButton, setShowDeleteButton] = useState(false);

    useEffect(() => {
        const loadTweetsFromServer = async () => {
            const response = await fetch('/getTweets'); // Fetch tweets with username
            const data = await response.json();
            setTweets(data.tweetsWithUsername); // Update state with tweets including username
        };
        loadTweetsFromServer();
    }, [props.reloadTweets]);

    const handleDelete = async (tweetId) => {
        // Send a DELETE request to the server to delete the tweet
        const response = await fetch(`/deleteTweet/${tweetId}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            // If deletion is successful, reload tweets
            const updatedTweets = tweets.filter(tweet => tweet._id !== tweetId);
            loadTweetsFromServer();
        } else {
            // Handle error if deletion fails
            console.error('Failed to delete tweet');
        }
    };

    const toggleDeleteButton = () => {
        setShowDeleteButton(!showDeleteButton);
        const adElement = document.querySelector('.border-left');
        const adElement2 = document.querySelector('.border-right');
        adElement.classList.toggle('hidden');
        adElement2.classList.toggle('hidden');
    };

    if(tweets.length === 0) {
        return (
            <div className='tweetList'>
                <h3 className='emptyTweet'>No Tweets Yet!</h3>
            </div>
        );
    }

    const tweetNodes = tweets.map(tweet => {
        return (
            <div key={tweet._id} className='tweet'> {/* Assuming tweet has an _id field */}
                <img src={`/profilePic/${tweet.owner}`} alt='tweet face' className='tweetFace'/>
                <h2 className='tweetName'>User: {tweet.username}</h2> {/* Display username */}
                <h3 className='tweetName'>{tweet.tweetText}</h3>
                {showDeleteButton && <button class="button is-primary" onClick={() => handleDelete(tweet._id)}>Delete</button>}
            </div>
        );
    });

    return (
        <div className='tweetList'>
            <button class="button is-primary" onClick={toggleDeleteButton}>Activate Twitter Prime</button>
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
