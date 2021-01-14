export default function getGiphyGifs(text) {
  return fetch(`https://api.giphy.com/v1/gifs/search?api_key=${process.env.REACT_APP_GIPHY_API_KEY}&q=${text}`, {
    "method": "GET",
    "headers": {}
  })
    .then(resp => {
      return resp.json();
    })
    .then(resp => {
      const gifResults = resp.data || [];

      return gifResults.map(gifData => {
        return {
          id: gifData.id,
          thumbnail: `https://media3.giphy.com/media/${gifData.id}/200_s.gif`,
          url: `https://media.giphy.com/media/${gifData.id}/giphy.gif`
        };
      });
    });
};
