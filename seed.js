const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/realworld-app', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Seed Mongo opened')
    })
    .catch(e => {
        console.log('Seed mongo error', e)
    })
const { User, Article, Profile, Comment } = require('./models')

const makeEverything = async () => {
    await User.deleteMany({});
    await Article.deleteMany({});
    await Profile.deleteMany({});
    await Comment.deleteMany({});

    const user = new User({ token: 'thetoken', email: 'themail', bio: 'nice bio' });
    user.save()
    const newArticle = new Article({
        slug: 'this-is-a-lot',
        title: 'this is a lot',
        description: 'Ever wonder how?',
        body: 'It takes a Jacobian',

    })
    newArticle.tagList.push('random');
    newArticle.author = user;
    newArticle.save()

    const p = new Profile({
        username: 'jake',
        bio: 'i work at statefarm',
    })
    p.save();


    const c = new Comment({
        body: 'it take one to make one',

    })
    c.author = user;
    c.save();
}


makeEverything();