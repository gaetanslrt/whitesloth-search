async function getDuckDuckGoResults(query, numResults = 5) {
    const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&kp=-2&kl=wt-wt`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      let results = [];
      
      // Check for Instant Answer
      if (data.AbstractText) {
        results.push(data.AbstractText);
      } else if (data.Answer) {
        results.push(data.Answer);
      }
      
      // Check for Related Topics if we don't have an Instant Answer
      if (results.length === 0 && data.RelatedTopics && data.RelatedTopics.length > 0) {
        data.RelatedTopics.slice(0, numResults).forEach(topic => {
          if (topic.Text) {
            results.push(topic.Text);
          }
        });
      }
      
      // If we still don't have results, use the first few results from the API
      if (results.length === 0 && data.Results && data.Results.length > 0) {
        data.Results.slice(0, numResults).forEach(result => {
          if (result.Text) {
            results.push(result.Text);
          }
        });
      }
      
      // If we still don't have results, return a message
      if (results.length === 0) {
        return "Sorry, looks like our sloth fell asleep at your request. Try something easier 🌿.";
      }
      
      return results.join(' ');
    } catch (error) {
      console.error('Error fetching DuckDuckGo results:', error);
      return 'Sorry, our sloth is sleeping right now. Try again later.';
    }
  }