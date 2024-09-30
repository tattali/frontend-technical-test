# Meme feed code review

## Review
### Performance
- Meme query needs to be refactored:
  - An ideal solution would be to update the endpoint results from the server to include the author details of each meme, without the comments as they are not displayed directly.
  - An alternative would be to asynchronously fetch the author details from the server using a Promise.all after receiving the author ID from the meme endpoint. In this case we also need to cache the result to avoid fetching the same author twice.
- Use a pagination system: (infinite scroll or classic pagination) We should not download the full list of memes but only the first page, if the user asks for the second page, display it and continue...

### Error
- Dates must be ISO-8601 compliant and have a trailing Z as they are UTC dates.

## TODO:
- [] Implement infinite scroll on the meme feed
- [] Use a Promise.all on the meme author to try not to retrieve the same author twice
- [] Implement infinite scroll on meme comments after clicking to display them
