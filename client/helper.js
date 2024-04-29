

  const sendPost = async (url, data, handler) => {
    const response = await fetch(url, {
      method: 'POST',
      
      body: data,
    });
  
    const result = await response.json();
    document.getElementById('tweetMessage').classList.add('hidden');
  
    if(result.redirect) {
      window.location = result.redirect;
    }
  
    if(result.error) {
      handleError(result.error);
    }

    if(handler) {
        handler(result);
    }
  };

  const handleError = (message) => {
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('tweetMessage').classList.remove('hidden');
  };

  const hideError = () => {
    document.getElementById('tweetMessage').classList.remove('hidden');
    
  };

  

  module.exports = {
    handleError,
    sendPost,
    hideError,
  };