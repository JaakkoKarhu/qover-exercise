Qover exercise
==============

## Stack

Express.js, MongoDB, Mongoose, React, Bootstrap

## Developement

Run

```
npm run start-dev
```

This will fire up servers for React and API.

Don't forget to fire up Mongo as well!

## "To do"

- Tests
- Move mocked data to database, do endpoints accordingly
- Refactor some repititive code

## Notes

### The change in business logic

I added one step more to the flow: "buy the insurance". This was not in the spec, but I found the logic of finishing the process a bit confusing - why should get the price send a confirmation email?

Of course, in real life I would not do this kind of a change without disussing about it first, so consider this more like a suggestion to the flow.

### Visuals

Built the page on top of Bootstrap, grabbed some Qover flavour from your website...

## Acknoledgements

When building the backend relied heavily on this article:

[React Getting Started — The MERN Stack Tutorial!](https://medium.com/@bryantheastronaut/react-getting-started-the-mern-stack-tutorial-feat-es6-de1a2886be50)